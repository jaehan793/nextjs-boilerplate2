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
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        아직 댓글이 없어요. 가장 먼저 따뜻한 한 줄을 남겨보세요.
      </div>
    )
  }

  return (
    <div className="space-y-3">
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
