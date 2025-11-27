'use client'

import { motion } from 'framer-motion'
import { Sun, Moon, Volume2, VolumeX, Download } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Tooltip, TooltipTrigger, TooltipContent } from '@workspace/ui/components/tooltip'

interface HeaderProps {
  mounted: boolean
  soundEnabled: boolean
  onSoundToggle: () => void
  onThemeToggle: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function Header({ mounted, soundEnabled, onSoundToggle, onThemeToggle }: HeaderProps) {
  const { resolvedTheme } = useTheme()

  return (
    <>
      {/* Desktop: Vertical control bar on the right */}
      <motion.div
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex-col items-center gap-4 p-3 rounded-xl bg-secondary/50 backdrop-blur-sm border border-black/5 dark:border-white/10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Theme Toggle */}
        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={onThemeToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-black" />
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
            </TooltipContent>
          </Tooltip>
        )}

        <div className="w-6 h-px bg-border" />

        {/* Sound Toggle */}
        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={onSoundToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle sound"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 dark:text-white text-black" />
                ) : (
                  <VolumeX className="w-5 h-5 dark:text-white text-black" />
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              {soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Download CV */}
        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.a
                href="/cv.pdf"
                download
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Download CV"
              >
                <Download className="w-5 h-5 dark:text-white text-black" />
              </motion.a>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              Download CV
            </TooltipContent>
          </Tooltip>
        )}
      </motion.div>

      {/* Mobile: Horizontal control bar at the bottom */}
      <motion.div
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[101] flex items-center gap-4 px-4 py-3 rounded-xl bg-secondary/50 backdrop-blur-sm border border-black/5 dark:border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Theme Toggle */}
        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={onThemeToggle}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-black" />
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
            </TooltipContent>
          </Tooltip>
        )}

        <div className="h-6 w-px bg-border" />

        {/* Sound Toggle */}
        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={onSoundToggle}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle sound"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 dark:text-white text-black" />
                ) : (
                  <VolumeX className="w-5 h-5 dark:text-white text-black" />
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Download CV */}
        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.a
                href="/cv.pdf"
                download
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="Download CV"
              >
                <Download className="w-5 h-5 dark:text-white text-black" />
              </motion.a>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              Download CV
            </TooltipContent>
          </Tooltip>
        )}
      </motion.div>
    </>
  )
}
