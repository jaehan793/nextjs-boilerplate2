import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Coffee } from "lucide-react"

import { auth } from "@/lib/auth"
import { getCommentsByPostId } from "@/lib/comments"
import { getPostById } from "@/lib/posts"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [session, post, comments] = await Promise.all([
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,53,15,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,251,247,1)_0%,_rgba(255,255,255,1)_100%)] px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link href="/posts" className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}>
          <ArrowLeft className="size-4" />
          게시글 목록
        </Link>

        <Card className="border-border/70 bg-card/85 shadow-sm backdrop-blur">
          <CardHeader className="space-y-3 border-b border-border/60 pb-4">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
              <Coffee className="size-3.5" />
              sample post
            </p>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Intl.DateTimeFormat("ko-KR", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(post.createdAt)}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
              {post.content}
            </p>

            <CommentSection
              postId={post.id}
              comments={serializedComments}
              currentUserId={currentUserId}
              isLoggedIn={Boolean(session)}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
