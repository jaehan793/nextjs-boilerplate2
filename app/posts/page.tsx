import Link from "next/link"
import { ArrowRight, Coffee } from "lucide-react"

import { getPosts } from "@/lib/posts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(146,64,14,0.12),_transparent_32%),linear-gradient(180deg,_rgba(255,248,240,1)_0%,_rgba(255,255,255,1)_100%)] px-4 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
            <Coffee className="size-3.5" />
            게시글 댓글 데모
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              커피잔 옆 메모처럼, 게시글에 댓글을 남겨보세요.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              로그인한 사용자만 댓글을 작성할 수 있고, 작성자는 본인 댓글을 수정하거나 삭제할 수 있습니다.
            </p>
          </div>
        </header>

        <div className="grid gap-4">
          {posts.map((post: (typeof posts)[number]) => (
            <Card key={post.id} className="border-border/70 bg-card/85 shadow-sm backdrop-blur">
              <CardHeader>
                <CardDescription>{new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(post.createdAt)}</CardDescription>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {post.content}
                </p>
                <Link href={`/posts/${post.id}`} className={cn(buttonVariants(), "gap-1.5")}>
                  댓글 보기
                  <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
