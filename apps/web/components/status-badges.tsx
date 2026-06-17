'use client'

import { motion } from 'framer-motion'

const USER_ID = '1094094157305356408'
// Discord presence, IntelliJ (coding) and Spotify (listening) live badges.
const TYPES = ['status', 'intellij', 'spotify'] as const

export function StatusBadges() {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 hidden flex-col items-end gap-2 md:flex"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      {TYPES.map((type) => (
        <span key={type} className="relative h-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.statusbadges.me/badge/${type}/${USER_ID}?style=for-the-badge&labelColor=f5f5f5&color=e5e5e5`}
            alt=""
            className="h-6 rounded-md border border-black/5 shadow-sm dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.statusbadges.me/badge/${type}/${USER_ID}?style=for-the-badge&labelColor=0d0d0d&color=1a1a1a`}
            alt=""
            className="hidden h-6 rounded-md border border-white/10 shadow-sm dark:block"
          />
        </span>
      ))}
    </motion.div>
  )
}
