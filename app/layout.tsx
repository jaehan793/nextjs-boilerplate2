// app/layout.tsx
import type { Metadata } from "next"
import "@fontsource-variable/inter"
import "./globals.css"

export const metadata: Metadata = {
  title: "Next.js Boilerplate",
  description: "Next.js 16 · Tailwind CSS v4 · shadcn/ui · Auth.js · Prisma · Neon",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
