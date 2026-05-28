// app/layout.tsx
import type { Metadata } from "next"
import "@fontsource-variable/inter"
import "./globals.css"

import { GlobalHeader } from "@/components/layout/global-header"

export const metadata: Metadata = {
  title: "Next.js Boilerplate",
  description: "Next.js 16 · Tailwind CSS v4 · shadcn/ui · Auth.js · Prisma · Neon",
}

export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="min-h-screen bg-background antialiased font-sans">
        <GlobalHeader />
        {children}
      </body>
    </html>
  )
}
