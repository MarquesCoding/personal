'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Github, Gitlab, ExternalLink, MapPin, Briefcase, GraduationCap, Mail, Copy, Check } from 'lucide-react'
import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { useTheme } from 'next-themes'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Header } from '@/components/header'
import { LoadingScreen } from '@/components/loading-screen'
import { EasterEgg } from '@/components/easter-egg'
import { CharReveal } from '@/components/text-reveal'
import { useSound } from '@/hooks/use-sound'
import { KeyboardsPage } from '@/components/keyboards-page'
import { toast } from 'sonner'

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const experience = [
  {
    title: "Software Engineer E2",
    company: "Ocado Technology",
    type: "Hybrid",
    period: "Oct 2023 - Present",
    points: [
      "Improved frontend accessibility using knowledge from training, such as making it responsive",
      "Worked actively with a team of 48 members, producing an in-house application for our robotic warehouse operatives",
      "Responsible for introduction to end-to-end testing in our environment using custom Docker containers during our pipeline processes",
      "Contribute to the full-stack development of a web application intended for the retail industry",
      "Discovered and shared JavaScript frontend standards across the team and other teams at Ocado"
    ],
    technologies: ["AWS", "Java", "Springboot", "JavaScript", "TypeScript", "Gitlab", "Jest", "Cypress", "Docker"]
  },
  {
    title: "Software Engineer E1",
    company: "Ocado Technology",
    type: "Hybrid",
    period: "Aug 2022 - Oct 2023",
    points: [
      "Streamlined processes for faster and more efficient project migrations",
      "Setup and maintained a shared UI library that was used to share components between multiple applications across different teams",
      "Collaborated with cross-functional teams to achieve project goals in a timely manner",
      "Migrated projects from Webpack to Vite, saving 1m 36s seconds per build",
      "Developed an interactive grid map with ThreeJS, improving user navigation and data visualisation",
      "Implemented Cypress into our testing workflows, enhancing testing efficiency and coverage"
    ],
    technologies: ["AWS", "Java", "Springboot", "JavaScript", "TypeScript", "Gitlab", "Jest", "Cypress"]
  },
  {
    title: "Full-Stack Software Engineer",
    company: "RCRaceControl",
    type: "Self Employed",
    period: "Aug 2018 - Present",
    points: [
      "Migrated legacy PHP application over to modern technologies such as React, NextJS & Postgres",
      "Created a custom UI component library dedicated for this project",
      "Built an interactive event booking platform using a custom-built API using NestJS",
      "Regularly interfaced with clients to provide technological solutions and support"
    ],
    technologies: ["AWS", "React", "Vite", "Docker", "NestJS", "Postgres", "Gitlab"]
  }
]

const projects = [
  {
    title: "MultiTwitch",
    description: "An multistream viewer client",
    tech: "React",
    link: "https://gitlab.com/MarquesCoding/multitwitch",
    icon: Gitlab,
    points: [
      "Created an interactive multistream viewer client for the streaming platform, Twitch",
      "This was built in a day as a small project that my friends wanted. It provides an easy to use interface and quick stream API fetching"
    ],
    technologies: ["React", "Vite", "TailwindCSS", "Vercel", "AWS", "Gitlab"]
  },
  {
    title: "StellarStack",
    description: "Open-source game server management panel",
    tech: "React",
    link: "https://github.com/StellarStackOSS/StellarStack",
    icon: Github,
    points: [
      "Contributed to a modern, open-source game server hosting panel with multi-server management capabilities",
      "Participated in building real-time features using WebSocket-powered console, statistics, and notifications",
      "Worked with a comprehensive REST API and granular permission system with 45+ permission nodes"
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Rust", "Docker", "TailwindCSS", "WebSockets", "Turborepo"]
  }
]

const skills = {
  languages: ["Java", "JavaScript", "TypeScript", "Python"],
  technologies: ["React", "AWS", "NestJS", "ThreeJS", "PostgreSQL", "TailwindCSS", "Docker"]
}

const EMAIL = "hello@mscripps.uk"

export default function Page() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, playClick, playSuccess } = useSound()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Parallax transforms for sections
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50])
  const experienceY = useTransform(scrollYProgress, [0.1, 0.5], [50, -30])
  const projectsY = useTransform(scrollYProgress, [0.3, 0.7], [50, -30])
  const skillsY = useTransform(scrollYProgress, [0.5, 0.9], [50, -30])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    playClick()
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      setTheme(newTheme)
    })

    await transition.ready

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-out',
        pseudoElement: '::view-transition-new(root)',
      }
    )
  }, [resolvedTheme, setTheme, playClick])

  const handleSoundToggle = useCallback(() => {
    setSoundEnabled(!soundEnabled)
  }, [soundEnabled, setSoundEnabled])

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      playSuccess()
      toast.success('Email copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy email')
    }
  }, [playSuccess])

  return (
    <>
      <LoadingScreen />
      <EasterEgg />

      <div ref={containerRef} className="w-full max-w-4xl min-h-screen py-20 px-6 relative">
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-foreground origin-left z-50"
          style={{ scaleX }}
        />

        {/* Tabs Navigation and Content */}
        <Tabs defaultValue="home" className="w-full">
          <motion.div
            className="mb-12 -mx-6 px-6 border-b border-border"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TabsList className="bg-transparent border-b-0 w-full justify-start h-auto p-0 rounded-none">
              <TabsTrigger
                value="home"
                className="bg-transparent border-b-2 border-transparent text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 py-3 mr-8 font-serif text-lg font-light italic transition-colors"
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="keyboards"
                className="bg-transparent border-b-2 border-transparent text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 py-3 mr-8 font-serif text-lg font-light italic transition-colors"
              >
                Keyboards
              </TabsTrigger>
            </TabsList>
          </motion.div>
          <TabsContent value="home" className="space-y-12">
            <Header
              mounted={mounted}
              soundEnabled={soundEnabled}
              onSoundToggle={handleSoundToggle}
              onThemeToggle={handleThemeToggle}
            />
              {/* Hero Section */}
        <motion.section
          className="mb-32 pt-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          style={{ y: heroY }}
        >
          <motion.div
            className="flex items-center gap-6 mb-6"
            variants={fadeInUp}
          >
<motion.img
              src="/logo.jpg"
              alt="Marques"
              className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover shadow-lg"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-muted-foreground tracking-widest uppercase text-sm">
                  Frontend Software Engineer
                </p>
                <motion.span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-gradient-to-r from-green-500/20 to-green-400/10 text-green-600 dark:text-green-400 text-xs font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Available
                </motion.span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-light italic tracking-tight">
                <CharReveal delay={0.3}>Marques</CharReveal>
              </h1>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 text-muted-foreground mb-4"
            variants={fadeInUp}
          >
            <MapPin className="w-4 h-4" />
            <span>United Kingdom</span>
            <span className="mx-2">·</span>
            <Briefcase className="w-4 h-4" />
            <span>Ocado Technology</span>
          </motion.div>

          {/* Status Badges */}
          <motion.div
            className="flex flex-wrap items-center gap-2 mb-8"
            variants={fadeInUp}
          >
            {/* Discord Status */}
            <span className="relative h-6">
              <img
                src="https://api.statusbadges.me/badge/status/1094094157305356408?style=for-the-badge&labelColor=f5f5f5&color=e5e5e5"
                alt="Discord Status"
                className="h-6 rounded border border-black/5 dark:hidden"
              />
              <img
                src="https://api.statusbadges.me/badge/status/1094094157305356408?style=for-the-badge&labelColor=0d0d0d&color=1a1a1a"
                alt="Discord Status"
                className="h-6 rounded border border-white/10 hidden dark:block"
              />
            </span>
            {/* IntelliJ */}
            <span className="relative h-6">
              <img
                src="https://api.statusbadges.me/badge/intellij/1094094157305356408?style=for-the-badge&labelColor=f5f5f5&color=e5e5e5"
                alt="IntelliJ Activity"
                className="h-6 rounded border border-black/5 dark:hidden"
              />
              <img
                src="https://api.statusbadges.me/badge/intellij/1094094157305356408?style=for-the-badge&labelColor=0d0d0d&color=1a1a1a"
                alt="IntelliJ Activity"
                className="h-6 rounded border border-white/10 hidden dark:block"
              />
            </span>
            {/* Spotify */}
            <span className="relative h-6">
              <img
                src="https://api.statusbadges.me/badge/spotify/1094094157305356408?style=for-the-badge&labelColor=f5f5f5&color=e5e5e5"
                alt="Spotify"
                className="h-6 rounded border border-black/5 dark:hidden"
              />
              <img
                src="https://api.statusbadges.me/badge/spotify/1094094157305356408?style=for-the-badge&labelColor=0d0d0d&color=1a1a1a"
                alt="Spotify"
                className="h-6 rounded border border-white/10 hidden dark:block"
              />
            </span>
          </motion.div>

          <motion.p
            className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8"
            variants={fadeInUp}
          >
            Building elegant solutions for complex problems. Passionate about frontend architecture,
            developer experience, and creating seamless user interfaces.
          </motion.p>

          {/* Email */}
          <motion.div
            className="flex items-center gap-3"
            variants={fadeInUp}
          >
<motion.button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Copy email"
            >
              <div className="relative w-5 h-5">
                <motion.div
                  initial={false}
                  animate={{
                    scale: copied ? 0 : 1,
                    opacity: copied ? 0 : 1,
                    rotate: copied ? -90 : 0
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Mail className="w-5 h-5" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{
                    scale: copied ? 1 : 0,
                    opacity: copied ? 1 : 0,
                    rotate: copied ? 0 : 90
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Check className="w-5 h-5 text-green-500" />
                </motion.div>
              </div>
              <span className="text-sm">{EMAIL}</span>
              <Copy className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          className="mb-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{ y: experienceY }}
        >
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light italic mb-16"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Experience
          </motion.h2>

          <div className="space-y-16">
            {experience.map((job, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium">{job.title}</h3>
                    <p className="text-muted-foreground">
                      {job.company} <span className="text-sm">· {job.type}</span>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 md:mt-0">{job.period}</p>
                </div>

                <ul className="space-y-2 mb-4 text-muted-foreground">
                  {job.points.map((point, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                    >
                      <span className="text-muted-foreground/50 mt-1.5">—</span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {job.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          className="mb-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{ y: projectsY }}
        >
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light italic mb-16"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Projects
          </motion.h2>

          <div className="space-y-12">
            {projects.map((project, index) => (
<motion.a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={playClick}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-medium group-hover:underline underline-offset-4 transition-all">
                        {project.title}
                      </h3>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                  <project.icon className="w-5 h-5 text-muted-foreground" />
                </div>

                <ul className="space-y-2 mb-4 text-muted-foreground">
                  {project.points.map((point, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-muted-foreground/50 mt-1.5">—</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          className="mb-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{ y: skillsY }}
        >
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light italic mb-16"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Skills
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((skill, index) => (
<motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Badge variant="outline" className="text-base px-4 py-2 font-normal cursor-default">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {skills.technologies.map((skill, index) => (
<motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Badge variant="outline" className="text-base px-4 py-2 font-normal cursor-default">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Education Section */}
        <motion.section
          className="mb-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light italic mb-16"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Education
          </motion.h2>

          <motion.div
            className="flex items-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-secondary/60">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium">University of Suffolk</h3>
              <p className="text-muted-foreground">Bachelor of Science in Computer Games Technology</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>Sept 2021</span>
                <span className="text-muted-foreground/50">·</span>
                <span>2:2 Achieved</span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light italic mb-16"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Get in touch
          </motion.h2>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-muted-foreground max-w-xl">
              I'm always open to discussing new opportunities, interesting projects, or just having a chat about tech.
            </p>

<motion.a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-foreground to-foreground/90 text-background font-medium hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playClick}
            >
              <Mail className="w-5 h-5" />
              Say hello
            </motion.a>
          </motion.div>
        </motion.section>

              {/* Footer */}
              <motion.footer
                className="pt-12 border-t border-border"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Marques Scripps © {new Date().getFullYear()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Built with Next.js, TailwindCSS & Motion
                  </p>
                </div>
              </motion.footer>
            </TabsContent>

            <TabsContent value="keyboards">
              <Header
                mounted={mounted}
                soundEnabled={soundEnabled}
                onSoundToggle={handleSoundToggle}
                onThemeToggle={handleThemeToggle}
              />
              <KeyboardsPage />
            </TabsContent>
          </Tabs>
      </div>
    </>
  )
}
