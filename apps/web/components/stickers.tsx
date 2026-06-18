'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState, type CSSProperties } from 'react'

interface StickerDef {
  slug: string
  light: string // colour on the light background
  dark: string // colour in dark mode (near-black icons go light so they stay visible)
  label: string
}

// Simple Icons monochrome logos — a random subset shows each load.
const POOL: StickerDef[] = [
  { slug: 'github', light: '181717', dark: 'FFFFFF', label: 'GitHub' },
  { slug: 'typescript', light: '3178C6', dark: '3178C6', label: 'TypeScript' },
  { slug: 'nextdotjs', light: '000000', dark: 'FFFFFF', label: 'Next.js' },
  { slug: 'nodedotjs', light: '5FA04E', dark: '5FA04E', label: 'Node.js' },
  { slug: 'rust', light: '000000', dark: 'FFFFFF', label: 'Rust' },
  { slug: 'figma', light: 'F24E1E', dark: 'F24E1E', label: 'Figma' },
  { slug: 'tailwindcss', light: '06B6D4', dark: '06B6D4', label: 'Tailwind CSS' },
  { slug: 'docker', light: '2496ED', dark: '2496ED', label: 'Docker' },
  { slug: 'redis', light: 'FF4438', dark: 'FF4438', label: 'Redis' },
  { slug: 'vite', light: '646CFF', dark: '7C84FF', label: 'Vite' },
  { slug: 'prisma', light: '2D3748', dark: 'FFFFFF', label: 'Prisma' },
  { slug: 'jest', light: 'C21325', dark: 'E63950', label: 'Jest' },
  { slug: 'greensock', light: '88CE02', dark: '88CE02', label: 'GSAP' },
  { slug: 'nestjs', light: 'E0234E', dark: 'E0234E', label: 'NestJS' },
  { slug: 'vercel', light: '000000', dark: 'FFFFFF', label: 'Vercel' },
  { slug: 'gitlab', light: 'FC6D26', dark: 'FC6D26', label: 'GitLab' },
  { slug: 'cypress', light: '69D3A7', dark: '69D3A7', label: 'Cypress' },
  { slug: 'python', light: '3776AB', dark: '5A9FD4', label: 'Python' },
  { slug: 'spring', light: '6DB33F', dark: '6DB33F', label: 'Spring' },
]

const SHOW_COUNT = 12
const COL_WIDTH = 672 // max-w-2xl
const SIZE = 54
const MIN_GUTTER = 150
const Y_LO = 0.07
const Y_HI = 0.93

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

interface Placed extends StickerDef {
  side: 'left' | 'right'
  xFrac: number
  yFrac: number
  rotate: number
  dir: number
  delay: number
}

/** Choose the random set + scattered layout ONCE (no pixel maths → resize-safe). */
function generate(): Placed[] {
  const chosen = shuffle(POOL).slice(0, SHOW_COUNT)
  const half = Math.ceil(SHOW_COUNT / 2)
  const out: Placed[] = []
  chosen.forEach((s, i) => {
    const side: 'left' | 'right' = i < half ? 'left' : 'right'
    let xFrac = rand(0.05, 0.95)
    let yFrac = rand(Y_LO, Y_HI)
    for (let t = 0; t < 60; t++) {
      const clash = out.some(
        (o) => o.side === side && Math.hypot((o.xFrac - xFrac) * 0.35, o.yFrac - yFrac) < 0.13,
      )
      if (!clash) break
      xFrac = rand(0.05, 0.95)
      yFrac = rand(Y_LO, Y_HI)
    }
    out.push({
      ...s,
      side,
      xFrac,
      yFrac,
      rotate: rand(-14, 14),
      dir: rand(0, 360),
      delay: rand(0.1, 1.4),
    })
  })
  return out
}

function pixelX(p: Placed, vw: number, gutter: number): number {
  const [lo, hi] =
    p.side === 'left' ? [16, gutter - SIZE - 12] : [vw - gutter + 12, vw - SIZE - 16]
  return lo + p.xFrac * (hi - lo)
}

function pixelY(p: Placed, vh: number): number {
  return Math.min(Math.max(p.yFrac * vh, 70), vh - 70)
}

function Sticker({ def, x, y }: { def: Placed; x: number; y: number }) {
  const { resolvedTheme } = useTheme()
  const [dragging, setDragging] = useState(false)

  // safety: never leave the page-scroll lock on if a sticker unmounts mid-drag
  useEffect(() => () => document.documentElement.classList.remove('sticker-dragging'), [])
  const url = `https://cdn.simpleicons.org/${def.slug}/${resolvedTheme === 'dark' ? def.dark : def.light}`
  const style = {
    top: y,
    left: x,
    '--sticker-width': `${SIZE}px`,
    '--sticker-rotate': `${def.rotate}deg`,
    '--peel-direction': `${def.dir}deg`,
  } as CSSProperties

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        setDragging(true)
        document.documentElement.classList.add('sticker-dragging')
      }}
      onDragEnd={() => {
        setDragging(false)
        document.documentElement.classList.remove('sticker-dragging')
      }}
      className={`sticker-peel pointer-events-auto ${dragging ? 'is-dragging' : ''}`}
      style={style}
      whileDrag={{ scale: 1.1, zIndex: 60 }}
    >
      {/* entrance: peel/fold down onto the page (inner wrapper so it never fights the drag) */}
      <motion.div
        style={{ transformPerspective: 500, transformOrigin: 'bottom center' }}
        initial={{ opacity: 0, rotateX: -88, y: -6, scale: 0.96 }}
        animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        transition={{ delay: def.delay, type: 'spring', stiffness: 220, damping: 17 }}
      >
        <div className="sticker-container">
          <div className="sticker-main">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="sticker-image" src={url} alt={def.label} title={def.label} draggable={false} />
            </div>
          </div>
          <div className="flap">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="flap-image" src={url} alt="" draggable={false} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Stickers() {
  const [placed, setPlaced] = useState<Placed[]>([])
  const [dims, setDims] = useState({ vw: 0, vh: 0, gutter: 0 })

  useEffect(() => {
    setPlaced(generate())
    const measure = () => {
      const vw = window.innerWidth
      setDims({ vw, vh: window.innerHeight, gutter: (vw - Math.min(COL_WIDTH, vw)) / 2 })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  if (placed.length === 0 || dims.gutter < MIN_GUTTER) return null

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          {/* white die-cut border tracing the icon silhouette */}
          <filter id="sticker-cut" x="-60%" y="-60%" width="220%" height="220%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="spread" />
            <feFlood floodColor="#ffffff" result="white" />
            <feComposite in="white" in2="spread" operator="in" result="border" />
            <feMerge>
              <feMergeNode in="border" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* grey sticker back for the peel */}
          <filter id="sticker-back" x="-60%" y="-60%" width="220%" height="220%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="spread" />
            <feFlood floodColor="rgb(214,214,214)" result="flood" />
            <feComposite in="flood" in2="spread" operator="in" />
          </filter>
          <filter id="sticker-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="black" floodOpacity="0.28" />
          </filter>
          <filter id="sticker-shadow-lg" x="-70%" y="-70%" width="240%" height="240%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="black" floodOpacity="0.4" />
          </filter>
        </defs>
      </svg>

      <div className="pointer-events-none fixed inset-0 z-40 hidden md:block">
        {placed.map((s) => (
          <Sticker key={s.slug} def={s} x={pixelX(s, dims.vw, dims.gutter)} y={pixelY(s, dims.vh)} />
        ))}
      </div>
    </>
  )
}
