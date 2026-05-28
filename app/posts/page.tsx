import Link from "next/link"
import { ArrowRight, ArrowLeft, PencilLine } from "lucide-react"

import { getPosts } from "@/lib/posts"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-[calc(100vh-44px)]">
      {/* Sub Nav - Frosted Glass */}
      <div className="sticky top-11 z-40 border-b border-[var(--hairline)] frosted-glass">
        <div className="mx-auto flex h-[52px] max-w-[980px] items-center justify-between px-4">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}>
            <ArrowLeft className="size-3.5" />
            홈으로
          </Link>
          <h1 className="text-tagline text-[var(--ink)]">게시글</h1>
          <div className="w-[72px]" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-[var(--canvas)] py-16 sm:py-20">
        <div className="mx-auto max-w-[980px] px-4 text-center">
          <h2 className="text-display-lg text-[var(--ink)] text-balance">
            커피잔 옆 메모처럼,
            <br className="sm:hidden" />
            게시글에 댓글을 남겨보세요.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-body text-[var(--muted-foreground)]">
            로그인한 사용자만 댓글을 작성할 수 있고, 작성자는 본인 댓글을 수정하거나 삭제할 수 있습니다.
          </p>
          <div className="mt-6">
            <Link href="/posts/new" className={cn(buttonVariants(), "gap-1.5")}>
              <PencilLine className="size-4" />
              게시글 작성
            </Link>
          </div>
        </div>
      </section>

      {/* Posts Grid - Parchment Tile */}
      <section className="bg-[var(--canvas-parchment)] py-16 sm:py-20">
        <div className="mx-auto max-w-[980px] px-4">
          <div className="grid gap-5">
            {posts.map((post: (typeof posts)[number]) => (
              <article
                key={post.id}
                className="rounded-[18px] border border-[var(--hairline)] bg-[var(--canvas)] p-6 transition-shadow hover:shadow-product"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-3">
                    <p className="text-caption text-[var(--muted-foreground)]">
                      {new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(post.createdAt)}
                    </p>
                    <h3 className="text-body-strong text-[var(--ink)]">{post.title}</h3>
                    <p className="line-clamp-2 text-body text-[var(--muted-foreground)]">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link href={`/posts/${post.id}`} className={cn(buttonVariants(), "gap-1.5")}>
                      댓글 보기
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--canvas-parchment)] py-12 border-t border-[var(--hairline)]">
        <div className="mx-auto max-w-[980px] px-4 text-center">
          <p className="text-fine-print text-[var(--ink-muted-48)]">
            Built with Next.js 16, Tailwind CSS v4, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  )
}
