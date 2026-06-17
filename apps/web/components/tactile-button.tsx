'use client'

import { motion } from 'framer-motion'
import { cn } from '@workspace/ui/lib/utils'
import type { ReactNode } from 'react'

interface TactileButtonProps {
  children: ReactNode
  variant?: 'dark' | 'light'
  href?: string
  onClick?: () => void
  download?: boolean
  external?: boolean
  className?: string
  ariaLabel?: string
}

/**
 * Buttons replicated 1:1 from the supplied Figma specs.
 *  - dark  → "Accept": fill #201E25→#323137, stroke #4B4951→#313036,
 *            shadows: 0/2/4 #000 10% + 0/0/0 spread 1 #0D0D0D
 *  - light → "Reject": fill #E3E3E3 80%, stroke #FDFDFD→transparent,
 *            shadows: 0/2/4 #000 10% + 0/0/0 spread 1 #000 16%
 */
export function TactileButton({
  children,
  variant = 'dark',
  href,
  onClick,
  download,
  external,
  className,
  ariaLabel,
}: TactileButtonProps) {
  const classes = cn(
    'btn-tactile px-5 py-3 text-sm',
    variant === 'dark' ? 'btn-tactile-dark' : 'btn-tactile-light',
    className,
  )

  const hover = { scale: 1.02 }
  const tap = { scale: 0.98 }

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        download={download}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={classes}
        whileHover={hover}
        whileTap={tap}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
      whileHover={hover}
      whileTap={tap}
    >
      {children}
    </motion.button>
  )
}
