// app/page.tsx
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { auth, signOut } from "@/lib/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await auth()
  const loginHref = `/login?callbackUrl=${encodeURIComponent("/")}`

  return (
    <div className="min-h-screen">
      {/* Global Nav - Apple Style */}
      <nav className="sticky top-0 z-50 h-11 bg-[var(--surface-black)]">
        <div className="mx-auto flex h-full max-w-[980px] items-center justify-between px-4">
          <Link href="/" className="text-fine-print text-[var(--body-on-dark)] hover:text-white/80">
            nextjs-boilerplate
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/posts" className="text-fine-print text-[var(--body-on-dark)] hover:text-white/80">
              Posts
            </Link>
            {session ? (
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <Button type="submit" variant="ghost" size="xs" className="text-[var(--body-on-dark)] hover:bg-white/10">
                  Sign out
                </Button>
              </form>
            ) : (
              <Link href={loginHref} className="text-fine-print text-[var(--body-on-dark)] hover:text-white/80">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Light Tile */}
      <section className="bg-[var(--canvas)] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[980px] px-4 text-center">
          <h1 className="text-hero-display text-[var(--ink)] text-balance">
            게시글에 댓글을 남겨보세요.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lead text-[var(--muted-foreground)]">
            로그인한 사용자만 댓글을 작성할 수 있고, 작성자는 본인 댓글을 수정하거나 삭제할 수 있습니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/posts" className={cn(buttonVariants(), "gap-2")}>
              게시글 보기
              <ArrowRight className="size-4" />
            </Link>
            {session ? (
              <span className="text-caption text-[var(--muted-foreground)]">
                {session.user?.email}로 로그인됨
              </span>
            ) : (
              <Link href={loginHref} className={cn(buttonVariants({ variant: "outline" }))}>
                Google로 로그인
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Section - Dark Tile */}
      <section className="bg-[var(--surface-tile-1)] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[980px] px-4 text-center">
          <h2 className="text-display-lg text-[var(--body-on-dark)]">
            Next.js 16 Boilerplate
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-body text-[var(--body-muted-dark)]">
            Tailwind CSS v4, shadcn/ui, Auth.js, Prisma, Neon 기반의 모던 스타터 템플릿입니다.
          </p>
          <div className="mt-8">
            <Link href="/posts" className={cn(buttonVariants(), "gap-2")}>
              시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid - Parchment Tile */}
      <section className="bg-[var(--canvas-parchment)] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[980px] px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Next.js 16", desc: "App Router, Server Actions, Turbopack" },
              { title: "Tailwind CSS v4", desc: "최신 CSS 기능과 함께하는 스타일링" },
              { title: "shadcn/ui", desc: "아름답고 접근 가능한 컴포넌트" },
              { title: "Auth.js", desc: "안전한 Google OAuth 인증" },
              { title: "Prisma ORM", desc: "타입 안전한 데이터베이스 쿼리" },
              { title: "Neon PostgreSQL", desc: "서버리스 PostgreSQL 데이터베이스" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-[18px] border border-[var(--hairline)] bg-[var(--canvas)] p-6"
              >
                <h3 className="text-body-strong text-[var(--ink)]">{feature.title}</h3>
                <p className="mt-2 text-caption text-[var(--muted-foreground)]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Parchment */}
      <footer className="bg-[var(--canvas-parchment)] py-16">
        <div className="mx-auto max-w-[980px] px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-fine-print text-[var(--ink-muted-48)]">
              Built with Next.js 16, Tailwind CSS v4, and shadcn/ui
            </p>
            <p className="text-fine-print text-[var(--ink-muted-48)]">
              {session ? `Signed in as ${session.user?.email}` : "로그인하지 않아도 게시글은 열 수 있어요."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
