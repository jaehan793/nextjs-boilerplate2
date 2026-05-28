import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { auth } from "@/lib/auth"
import { getCommentsByPostId } from "@/lib/comments"
import { getPostById } from "@/lib/posts"
import { buttonVariants } from "@/components/ui/button"
import { CommentSection } from "@/components/comments/comment-section"
import type { CommentViewModel } from "@/components/comments/comment-item"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    postId: string
  }>
}

export default async function PostDetailPage({ params }: PageProps) {
  const { postId } = await params
  const [session, post, comments]: [
    Awaited<ReturnType<typeof auth>>,
    Awaited<ReturnType<typeof getPostById>>,
    Awaited<ReturnType<typeof getCommentsByPostId>>,
  ] = await Promise.all([
    auth(),
    getPostById(postId),
    getCommentsByPostId(postId),
  ])

  if (!post) {
    notFound()
  }

  const serializedComments: CommentViewModel[] = comments.map((comment) => ({
    id: comment.id,
    postId: comment.postId,
    userId: comment.userId,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    user: {
      id: comment.user.id,
      name: comment.user.name,
      email: comment.user.email,
      image: comment.user.image,
    },
  }))

  const currentUserId = session?.user?.id ?? null

  return (
    <div className="min-h-[calc(100vh-44px)]">
      {/* Sub Nav - Frosted Glass */}
      <div className="sticky top-11 z-40 border-b border-[var(--hairline)] frosted-glass">
        <div className="mx-auto flex h-[52px] max-w-[980px] items-center justify-between px-4">
          <Link href="/posts" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}>
            <ArrowLeft className="size-3.5" />
            게시글 목록
          </Link>
          <span className="text-tagline text-[var(--ink)]">게시글</span>
          <div className="w-[88px]" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Post Content - Light Tile */}
      <section className="bg-[var(--canvas)] py-16 sm:py-20">
        <div className="mx-auto max-w-[980px] px-4">
          <article className="mx-auto max-w-[680px]">
            <header className="mb-8 border-b border-[var(--hairline)] pb-8">
              <p className="text-caption text-[var(--muted-foreground)]">
                {new Intl.DateTimeFormat("ko-KR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(post.createdAt)}
              </p>
              <h1 className="mt-4 text-display-lg text-[var(--ink)]">{post.title}</h1>
            </header>
            <div className="text-body leading-[1.47] text-[var(--ink)]">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          </article>
        </div>
      </section>

      {/* Comments Section - Parchment Tile */}
      <section className="bg-[var(--canvas-parchment)] py-16 sm:py-20">
        <div className="mx-auto max-w-[980px] px-4">
          <div className="mx-auto max-w-[680px]">
            <CommentSection
              postId={post.id}
              comments={serializedComments}
              currentUserId={currentUserId}
              isLoggedIn={Boolean(session)}
            />
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
