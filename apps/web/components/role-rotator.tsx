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
    <span className="relative inline-block whitespace-nowrap align-baseline" aria-label={role}>
      {/* invisible sizer — sets the width AND a real text baseline so it aligns inline */}
      <span aria-hidden className="invisible">{role}</span>

      {/* animated swipe-up overlay (absolute so it never affects layout/baseline) */}
      <span aria-hidden className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span key={role} className="inline-block whitespace-nowrap">
            {letters.map((ch, i) => (
              <motion.span
                key={`${role}-${i}`}
                className="inline-block whitespace-pre"
                initial={{ y: '115%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-115%' }}
                transition={{ duration: 0.42, delay: i * 0.028, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
