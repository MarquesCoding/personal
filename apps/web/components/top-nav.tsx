'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

function useActiveSection() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.5, 1] },
    )
    ;['home', ...LINKS.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
  return active
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [squish, setSquish] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <span className="h-7 w-[54px]" />
  const dark = resolvedTheme === 'dark'
  const toggle = () => {
    setSquish(true)
    setTheme(dark ? 'light' : 'dark')
    window.setTimeout(() => setSquish(false), 180)
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Toggle theme"
      onClick={toggle}
      className="btn-tactile btn-tactile-dark relative h-7 w-[54px] rounded-full"
    >
      {/* thumb — white tactile style; squishes top-to-bottom as it slides */}
      <motion.span
        initial={false}
        animate={{ x: dark ? 28 : 4, scaleY: squish ? 0.72 : 1, scaleX: squish ? 1.06 : 1 }}
        transition={{
          x: { type: 'spring', stiffness: 520, damping: 34 },
          scaleY: { duration: 0.16, ease: 'easeOut' },
          scaleX: { duration: 0.16, ease: 'easeOut' },
        }}
        className="btn-tactile-light absolute left-0 top-[3px] grid h-[22px] w-[22px] place-items-center rounded-full border border-transparent"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? 'moon' : 'sun'}
            initial={{ opacity: 0, rotate: -40, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 40, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            className="grid place-items-center text-neutral-800"
          >
            {dark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  )
}

export function TopNav() {
  const active = useActiveSection()

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <motion.header
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="flex items-center gap-1 rounded-full border border-border bg-card/80 p-1.5 pl-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md">
        <button
          onClick={() => go('home')}
          className="mr-1 flex items-center"
          aria-label="Home"
        >
          <span className="block h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Marques Scripps"
              className="h-full w-full object-cover object-top"
            />
          </span>
        </button>
        <motion.div
          className="hidden items-center gap-0.5 sm:flex"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
        >
          {LINKS.map((l) => (
            <motion.button
              key={l.id}
              onClick={() => go(l.id)}
              variants={{
                hidden: { opacity: 0, y: -8, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'relative rounded-full px-3 py-1.5 text-sm transition-colors',
                active === l.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {active === l.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-foreground/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{l.label}</span>
            </motion.button>
          ))}
        </motion.div>
        <div className="mx-1 h-5 w-px bg-border" />
        <ThemeToggle />
      </nav>
    </motion.header>
  )
}
