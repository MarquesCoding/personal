'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@workspace/ui/lib/utils'
import contributions from '@/data/contributions.json'

type Day = { date: string; count: number | null }

const LEVELS = [
  'bg-foreground/[0.07]',
  'bg-foreground/25',
  'bg-foreground/45',
  'bg-foreground/70',
  'bg-foreground',
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const cell = {
  hidden: { opacity: 0, scale: 0.3 },
  show: (wave: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: wave * 0.014, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const monthOf = (day: Day) => Number(day.date.slice(5, 7)) - 1

const describe = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

export function ContributionGraph() {
  const scroller = useRef<HTMLDivElement>(null)
  const isStill = useReducedMotion()
  const days: Day[] = contributions.days
  const weeks: Day[][] = []

  for (let at = 0; at < days.length; at += 7) weeks.push(days.slice(at, at + 7))

  const busy = days
    .map((day) => day.count ?? 0)
    .filter((count) => count > 0)
    .sort((a, b) => a - b)
  const cut = (share: number) => busy[Math.floor((busy.length - 1) * share)] ?? 1
  const steps = [cut(0.25), cut(0.5), cut(0.75)]
  const levelOf = (count: number) =>
    count === 0 ? 0 : count <= steps[0]! ? 1 : count <= steps[1]! ? 2 : count <= steps[2]! ? 3 : 4
  const columns = { gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }

  useEffect(() => {
    const element = scroller.current
    if (element) element.scrollLeft = element.scrollWidth
  }, [])

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {contributions.total.toLocaleString('en-GB')}
        </span>{' '}
        commits in the last year
      </p>

      <div ref={scroller} className="overflow-x-auto pb-2">
        <div className="min-w-[560px]">
          <div className="mb-1 grid gap-[3px] text-[10px] text-muted-foreground" style={columns}>
            {weeks.map((week, index) => {
              const month = monthOf(week[0]!)
              const previous = weeks[index - 1]?.[0]
              const isNewMonth = !previous || monthOf(previous) !== month
              const isCrowded =
                index === 0 && weeks.slice(1, 3).some((later) => monthOf(later[0]!) !== month)
              return (
                <span key={week[0]!.date} className="relative h-3">
                  {isNewMonth && !isCrowded && index < weeks.length - 2 ? (
                    <span className="absolute left-0 whitespace-nowrap">{MONTHS[month]}</span>
                  ) : null}
                </span>
              )
            })}
          </div>

          <motion.div
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
            style={columns}
            initial={isStill ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {days.map((day, index) =>
              day.count === null ? (
                <span key={day.date} className="aspect-square" />
              ) : (
                <motion.span
                  key={day.date}
                  variants={cell}
                  custom={Math.floor(index / 7) + (index % 7) * 0.6}
                  title={`${day.count} ${day.count === 1 ? 'commit' : 'commits'} on ${describe(day.date)}`}
                  className={cn('aspect-square rounded-[3px]', LEVELS[levelOf(day.count)])}
                />
              ),
            )}
          </motion.div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
        <span>Less</span>
        {LEVELS.map((level) => (
          <span key={level} className={cn('h-[11px] w-[11px] rounded-[3px]', level)} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
