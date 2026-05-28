import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { auth } from "@/lib/auth"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostForm } from "@/components/posts/post-form"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function NewPostPage() {
  const session = await auth()
  const loginHref = `/login?callbackUrl=${encodeURIComponent("/posts/new")}`

  return (
    <div className="min-h-[calc(100vh-44px)]">
      <div className="sticky top-11 z-40 border-b border-[var(--hairline)] frosted-glass">
        <div className="mx-auto flex h-[52px] max-w-[980px] items-center justify-between px-4">
          <Link href="/posts" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}>
            <ArrowLeft className="size-3.5" />
            게시글 목록
          </Link>
          <h1 className="text-tagline text-[var(--ink)]">게시글 작성</h1>
          <div className="w-[88px]" />
        </div>
      </div>

      <section className="bg-[var(--canvas)] py-16 sm:py-20">
        <div className="mx-auto max-w-[980px] px-4">
          <div className="mx-auto max-w-[680px] text-center">
            <h2 className="text-display-lg text-[var(--ink)] text-balance">
              새로운 이야기를
              <br className="sm:hidden" />
              천천히 적어보세요.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-body text-[var(--muted-foreground)]">
              로그인한 사용자만 게시글을 작성할 수 있습니다. 작성이 끝나면 바로 상세 페이지로 이동합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--canvas-parchment)] py-16 sm:py-20">
        <div className="mx-auto max-w-[980px] px-4">
          <Card className="mx-auto max-w-[680px] rounded-[18px] border border-[var(--hairline)] bg-[var(--canvas)]">
            <CardHeader className="border-b border-[var(--hairline)] pb-6">
              <CardTitle className="text-body-strong text-[var(--ink)]">새 게시글</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {session ? (
                <PostForm />
              ) : (
                <div className="space-y-4 rounded-[18px] border border-dashed border-[var(--hairline)] bg-[var(--canvas-parchment)] p-6 text-center">
                  <p className="text-body text-[var(--muted-foreground)]">
                    게시글은 로그인한 사용자만 작성할 수 있어요.
                  </p>
                  <Link href={loginHref} className={buttonVariants()}>
                    Google로 로그인
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-[var(--hairline)] bg-[var(--canvas-parchment)] py-12">
        <div className="mx-auto max-w-[980px] px-4 text-center">
          <p className="text-fine-print text-[var(--ink-muted-48)]">
            Built with Next.js 16, Tailwind CSS v4, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  )
}
