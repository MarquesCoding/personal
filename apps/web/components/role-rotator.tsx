'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ROLES = [
  'Frontend Software Engineer',
  'Gamer',
  'Hobbyist',
  'UX Designer',
]

const HOLD_MS = 2600

export function RoleRotator() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % ROLES.length), HOLD_MS)
    return () => clearInterval(id)
  }, [])

  const role = ROLES[index]!
  const letters = role.split('')

  return (
    <span
      className="relative block h-[1.15em] overflow-hidden whitespace-nowrap text-3xl font-bold tracking-tight text-foreground/65 sm:text-4xl md:text-5xl"
      aria-label={role}
    >
      <AnimatePresence mode="wait">
        <motion.span key={role} className="inline-flex" aria-hidden>
          {letters.map((ch, i) => (
            <motion.span
              key={`${role}-${i}`}
              className="inline-block whitespace-pre"
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-110%' }}
              transition={{ duration: 0.42, delay: i * 0.028, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
