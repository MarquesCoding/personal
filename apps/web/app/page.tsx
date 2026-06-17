'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import {
  Github, Linkedin, Globe, ExternalLink, MapPin, GraduationCap, Mail, Copy, Check,
  ArrowUpRight, Download, Calendar, ChevronRight, ChevronDown,
} from 'lucide-react'
import { Badge } from '@workspace/ui/components/badge'
import { cn } from '@workspace/ui/lib/utils'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { EasterEgg } from '@/components/easter-egg'
import { TactileButton } from '@/components/tactile-button'
import { TopNav } from '@/components/top-nav'
import { RoleRotator } from '@/components/role-rotator'
import { Stickers } from '@/components/stickers'
import { StatusBadges } from '@/components/status-badges'

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

const experience = [
  {
    title: 'Full Stack Software Engineer (E2)',
    company: 'Ocado Technology',
    type: 'Hybrid',
    period: 'Oct 2023 — Present',
    points: [
      'Contribute to full-stack development of a customer-facing web application for the retail industry, working within a team of 48.',
      'Improved front-end accessibility through training-led practices, including responsive layouts and RTL support.',
      'Introduced end-to-end testing to the team’s pipeline using custom Docker containers.',
      'Defined and shared JavaScript front-end standards adopted across multiple teams at Ocado.',
    ],
    technologies: ['AWS', 'Java', 'Spring Boot', 'TypeScript', 'GitLab', 'Jest', 'Cypress', 'Docker'],
  },
  {
    title: 'Full Stack Software Engineer (E1)',
    company: 'Ocado Technology',
    type: 'Hybrid',
    period: 'Aug 2022 — Oct 2023',
    points: [
      'Streamlined build and migration processes, cutting build times by 24%.',
      'Migrated projects from Webpack to Vite, saving ~1m 36s per build on average.',
      'Built and maintained a shared UI component library reused across multiple teams’ applications.',
      'Developed an interactive grid map with ThreeJS, improving user navigation and data visualisation.',
    ],
    technologies: ['AWS', 'Java', 'Spring Boot', 'TypeScript', 'GitLab', 'Jest', 'Cypress'],
  },
  {
    title: 'Full Stack Software Engineer',
    company: 'RCRaceControl',
    type: 'Self-Employed',
    period: 'Aug 2018 — Present',
    points: [
      'Migrated a legacy PHP application to a modern stack (React, Next.js, Postgres).',
      'Built an interactive event-booking platform backed by a custom NestJS API.',
      'Created a bespoke UI component library and supported clients directly.',
    ],
    technologies: ['AWS', 'React', 'Vite', 'Next.js', 'NestJS', 'Postgres', 'Docker'],
  },
]

const projects = [
  {
    title: 'PolarHQ',
    accent: '#3b82f6',
    description: 'Self-hosted, end-to-end encrypted Photos, Drive & Docs suite',
    link: 'https://github.com/MarquesCoding/PolarHQ',
    image: '/polarhq.jpg',
    points: [
      'A privacy-first alternative to cloud suites where the server only ever stores client-side-encrypted ciphertext (libsodium).',
      'Spans a photo library, a versioned file drive, and real-time collaborative docs/sheets, with a native SwiftUI iOS app.',
    ],
    technologies: ['TypeScript', 'Next.js', 'Hono', 'tRPC', 'Drizzle', 'PostgreSQL', 'Redis', 'Swift'],
  },
  {
    title: 'StellarStack',
    accent: '#8b5cf6',
    description: 'Open-source game server management panel',
    link: 'https://github.com/MarquesCoding/StellarStack',
    image: '/stellarstack.jpg',
    points: [
      'Self-hostable panel for managing Minecraft, Terraria, Valheim and more across distributed nodes.',
      'Real-time monitoring, automated backups and granular access control (45+ permission nodes), with a Rust daemon driving Docker.',
    ],
    technologies: ['TypeScript', 'Rust', 'Next.js', 'Hono', 'Prisma', 'PostgreSQL', 'Docker', 'WebSockets'],
  },
  {
    title: 'StellarGit',
    accent: '#ec4899',
    description: 'AI-powered desktop Git client (macOS / Windows / Linux)',
    link: 'https://github.com/MarquesCoding/StellarGit',
    image: '/stellargit.jpg',
    points: [
      'Cross-platform Git client with an interactive commit graph, diffs, blame, stash management and an embedded PTY terminal.',
      'Integrates GitHub / GitLab pull requests and AI-assisted workflows behind a themeable UI (29 themes).',
    ],
    technologies: ['TypeScript', 'Electron', 'React', 'Vite', 'TailwindCSS', 'shadcn/ui', 'Zustand', 'Turborepo'],
  },
]

const EMAIL = 'hello@mscripps.uk'

function Section({
  id, index, title, children,
}: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-28 scroll-mt-28">
      <motion.div className="mb-8 flex items-center gap-3" {...fadeUp}>
        <span className="font-mono text-xs text-muted-foreground">{index}</span>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <span className="h-px flex-1 bg-border" />
      </motion.div>
      {children}
    </section>
  )
}

export default function Page() {
  const [copied, setCopied] = useState(false)

  const { scrollYProgress } = useScroll()
  const progressX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      toast.success('Email copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy email')
    }
  }, [])

  return (
    <>
      <EasterEgg />
      <TopNav />
      <StatusBadges />
      <Stickers />

      {/* scroll progress indicator */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-foreground/80"
        style={{ scaleX: progressX }}
      />

      <div className="relative w-full">
        <main className="mx-auto max-w-2xl px-6 pt-32 pb-24">
          {/* ---------------- Hero ---------------- */}
          <section id="home" className="scroll-mt-28">
            <motion.div
              className="relative mb-6 inline-block"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Marques Scripps"
                className="h-14 w-14 rounded-2xl object-cover shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tight text-balance md:text-5xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Hey, I&apos;m Marques Scripps
            </motion.h1>

            <motion.div
              className="mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <RoleRotator />
            </motion.div>

            <motion.div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground" {...fadeUp}>
              <MapPin className="h-4 w-4" />
              <span>Letchworth, UK</span>
              <span className="mx-1">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Open to work
              </span>
            </motion.div>

            <motion.p
              className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
              {...fadeUp}
            >
              I build production-grade web apps end to end, and ship open-source products on
              the side. I care about testing, performance, and great developer experience.
            </motion.p>

            <motion.div className="mt-8 flex flex-wrap items-center gap-3" {...fadeUp}>
              <TactileButton
                variant="light"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View <span className="text-muted-foreground">— projects</span>
              </TactileButton>
              <TactileButton variant="dark" href={`mailto:${EMAIL}`}>
                Let&apos;s build something together
                <ArrowUpRight className="h-4 w-4" />
              </TactileButton>
            </motion.div>

            {/* scroll hint */}
            <motion.div
              className="mt-16 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}>
                <ChevronDown className="h-4 w-4" />
              </motion.span>
              Scroll to explore
            </motion.div>
          </section>

          {/* ---------------- Work ---------------- */}
          <Section id="work" index="01" title="Work">
            <div className="space-y-12">
              {experience.map((job, i) => (
                <motion.div
                  key={i}
                  variants={staggerParent}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-80px' }}
                >
                  <motion.p
                    variants={staggerItem}
                    className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {job.period}
                  </motion.p>
                  <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <Badge variant="outline" className="rounded-md font-normal">{job.company}</Badge>
                    <span className="text-sm text-muted-foreground">· {job.type}</span>
                  </motion.div>
                  <ul className="mt-3 space-y-1.5">
                    {job.points.map((p, j) => (
                      <motion.li
                        key={j}
                        variants={staggerItem}
                        className="flex gap-2.5 text-sm text-muted-foreground"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-foreground/30" />
                        <span>{p}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.technologies.map((t) => (
                      <motion.span key={t} variants={staggerItem} className="inline-flex">
                        <Badge variant="secondary" className="rounded-md font-normal">{t}</Badge>
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* ---------------- Projects ---------------- */}
          <Section id="projects" index="02" title="Projects">
            <div className="space-y-16">
              {projects.map((p, i) => {
                const flip = i % 2 === 1
                const tilt = [-4, 3.5, -3][i] ?? 0
                return (
                  <motion.div
                    key={i}
                    className="group grid gap-8 md:grid-cols-2 md:items-center md:gap-10"
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                  >
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.title} on GitHub`}
                      className={cn('block px-2 py-4 md:px-4', flip && 'md:order-2')}
                    >
                      <div
                        className="rounded-[10px] bg-white p-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:-translate-y-1.5 dark:bg-neutral-100"
                        style={{ rotate: `${tilt}deg` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={`${p.title} screenshot`}
                          loading="lazy"
                          className="aspect-[16/10] w-full rounded-[4px] object-cover object-top"
                        />
                      </div>
                    </a>

                    <div className={cn(flip && 'md:order-1')}>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.accent }} />
                        <h3 className="text-xl font-bold tracking-tight">{p.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                      <ul className="mt-3 space-y-1.5">
                        {p.points.map((pt, j) => (
                          <li key={j} className="flex gap-2.5 text-sm text-muted-foreground">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-foreground/30" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.technologies.map((t) => (
                          <Badge key={t} variant="secondary" className="rounded-md font-normal">{t}</Badge>
                        ))}
                      </div>
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        <Github className="h-4 w-4" />
                        View on GitHub
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Section>

          {/* ---------------- Education ---------------- */}
          <Section id="education" index="03" title="Education">
            <motion.div className="flex items-start gap-4" {...fadeUp}>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-card">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">University of Suffolk</h3>
                <p className="text-sm text-muted-foreground">BSc Computer Games Technology</p>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Sept 2021</span>
                  <span className="text-muted-foreground/50">·</span>
                  <span>2:2 Honours</span>
                </div>
              </div>
            </motion.div>
          </Section>

          {/* ---------------- Contact ---------------- */}
          <Section id="contact" index="04" title="Get in touch">
            <motion.p className="max-w-xl text-base text-muted-foreground" {...fadeUp}>
              I&apos;m always open to discussing new opportunities, interesting projects, or just
              having a chat about tech. The fastest way to reach me is email.
            </motion.p>

            <motion.div className="mt-6 flex flex-wrap items-center gap-3" {...fadeUp}>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-accent"
                aria-label="Copy email"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Mail className="h-4 w-4" />}
                {EMAIL}
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
              <TactileButton variant="dark" href={`mailto:${EMAIL}`}>
                <Mail className="h-4 w-4" />
                Say hello
              </TactileButton>
              <TactileButton variant="light" href="/cv.pdf" download>
                <Download className="h-4 w-4" />
                Download CV
              </TactileButton>
            </motion.div>

            <motion.a
              href="https://www.cal.eu/marquescoding/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              {...fadeUp}
            >
              <Calendar className="h-4 w-4" />
              Or schedule a 15-minute meeting
            </motion.a>

            <motion.div className="mt-8 flex items-center gap-2" {...fadeUp}>
              {[
                { href: 'https://github.com/marquescoding', label: 'GitHub', icon: Github },
                { href: 'https://linkedin.com/in/marques-scripps-476103141', label: 'LinkedIn', icon: Linkedin },
                { href: 'https://mscripps.uk', label: 'Website', icon: Globe },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </motion.div>
          </Section>
        </main>

        {/* ---------------- Footer ---------------- */}
        <footer className="relative mt-24 overflow-hidden border-t border-border">
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-start justify-between gap-2 px-6 pt-8 text-sm text-muted-foreground md:flex-row md:items-center">
            <p>Marques Scripps © {new Date().getFullYear()}</p>
            <p>Built with Next.js, Tailwind &amp; Motion</p>
          </div>
          <div aria-hidden className="flex justify-center overflow-hidden">
            <span className="translate-y-[14%] select-none text-[23vw] font-bold leading-[0.78] tracking-tighter text-foreground/[0.05]">
              Marques
            </span>
          </div>
        </footer>
      </div>
    </>
  )
}
