import { Geist, Geist_Mono } from "next/font/google"
import { Metadata } from "next"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { CursorProvider, Cursor } from "@workspace/ui/components/animate-ui/components/animate/cursor"
import { Toaster } from "@workspace/ui/components/sonner"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Marques Scripps | Software Engineer",
  description: "Software Engineer at Ocado Technology. Building elegant solutions for complex problems. Passionate about frontend architecture, developer experience, and creating seamless user interfaces.",
  keywords: ["Software Engineer", "Frontend Developer", "React", "TypeScript", "Ocado", "Web Development"],
  authors: [{ name: "Marques Scripps" }],
  creator: "Marques Scripps",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://mscripps.uk",
    title: "Marques Scripps | Software Engineer",
    description: "Software Engineer at Ocado Technology. Building elegant solutions for complex problems.",
    siteName: "Marques Scripps",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Marques Scripps - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marques Scripps | Software Engineer",
    description: "Software Engineer at Ocado Technology. Building elegant solutions for complex problems.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <CursorProvider global>
            <Cursor />
            <div className="w-full flex items-center justify-center h-full">
              {children}
            </div>
            <Toaster position="bottom-center" />
          </CursorProvider>
        </Providers>
      </body>
    </html>
  )
}
