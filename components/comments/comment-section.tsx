"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageSquareText } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommentForm } from "@/components/comments/comment-form"
import { CommentList } from "@/components/comments/comment-list"
import type { CommentViewModel } from "@/components/comments/comment-item"
import { cn } from "@/lib/utils"

type CommentSectionProps = {
  postId: string
  comments: CommentViewModel[]
  currentUserId: string | null
  isLoggedIn: boolean
}

export function CommentSection({
  postId,
  comments,
  currentUserId,
  isLoggedIn,
}: CommentSectionProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquareText className="size-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">댓글 {comments.length}</h2>
      </div>

      <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur">
        <CardHeader className="pb-0">
          <CardTitle className="text-base">한 줄 남기기</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoggedIn ? (
            <CommentForm
              mode="create"
              postId={postId}
              onSuccess={() => setEditingCommentId(null)}
            />
          ) : (
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-border bg-muted/30 p-5">
              <p className="text-sm text-muted-foreground">
                댓글은 로그인한 사용자만 작성할 수 있어요.
              </p>
              <Link href="/login" className={cn(buttonVariants(), "gap-1.5")}>
                Google로 로그인
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <CommentList
        postId={postId}
        comments={comments}
        currentUserId={currentUserId}
        editingCommentId={editingCommentId}
        onStartEdit={setEditingCommentId}
        onStopEdit={() => setEditingCommentId(null)}
      />
    </section>
  )
}
