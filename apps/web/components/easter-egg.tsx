'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useKonami } from '@/hooks/use-konami'
import { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'

export function EasterEgg() {
  const [showMessage, setShowMessage] = useState(false)

  const handleKonami = useCallback(() => {
    setShowMessage(true)

    // Fire confetti
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })

    setTimeout(() => setShowMessage(false), 4000)
  }, [])

  useKonami(handleKonami)

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-foreground text-background px-8 py-4 rounded-2xl shadow-2xl"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-2xl font-bold">You found the secret!</p>
            <p className="text-center text-sm opacity-70 mt-1">↑↑↓↓←→←→BA</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
