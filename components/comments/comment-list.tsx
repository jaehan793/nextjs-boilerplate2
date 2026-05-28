"use client"

import { CommentItem, type CommentViewModel } from "@/components/comments/comment-item"

type CommentListProps = {
  postId: string
  comments: CommentViewModel[]
  currentUserId: string | null
  editingCommentId: string | null
  onStartEdit: (commentId: string) => void
  onStopEdit: () => void
}

export function CommentList({
  postId,
  comments,
  currentUserId,
  editingCommentId,
  onStartEdit,
  onStopEdit,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-[18px] border border-dashed border-[var(--hairline)] bg-[var(--canvas)] px-6 py-10 text-center">
        <p className="text-body text-[var(--muted-foreground)]">
          아직 댓글이 없어요. 가장 먼저 따뜻한 한 줄을 남겨보세요.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserId={currentUserId}
          isEditing={editingCommentId === comment.id}
          onStartEdit={() => onStartEdit(comment.id)}
          onStopEdit={onStopEdit}
        />
      ))}
    </div>
  )
}
