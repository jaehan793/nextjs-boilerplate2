"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageSquareText } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
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
  const loginHref = `/login?callbackUrl=${encodeURIComponent(`/posts/${postId}`)}`

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <MessageSquareText className="size-5 text-[var(--muted-foreground)]" />
        <h2 className="text-tagline text-[var(--ink)]">댓글 {comments.length}</h2>
      </div>

      {/* Comment Form Card */}
      <div className="rounded-[18px] border border-[var(--hairline)] bg-[var(--canvas)] p-6">
        <h3 className="text-body-strong text-[var(--ink)] mb-4">한 줄 남기기</h3>
        {isLoggedIn ? (
          <CommentForm
            mode="create"
            postId={postId}
            onSuccess={() => setEditingCommentId(null)}
          />
        ) : (
          <div className="rounded-[18px] border border-dashed border-[var(--hairline)] bg-[var(--canvas-parchment)] p-6 text-center">
            <p className="text-body text-[var(--muted-foreground)] mb-4">
              댓글은 로그인한 사용자만 작성할 수 있어요.
            </p>
            <Link href={loginHref} className={cn(buttonVariants())}>
              Google로 로그인
            </Link>
          </div>
        )}
      </div>

      {/* Comment List */}
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
