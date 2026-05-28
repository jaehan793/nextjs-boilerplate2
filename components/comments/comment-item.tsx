"use client"

import { useActionState, useEffect, useRef } from "react"
import { PencilLine, Trash2 } from "lucide-react"

import {
  deleteCommentAction,
  type CommentActionState,
} from "@/app/posts/[postId]/actions"
import { Button } from "@/components/ui/button"
import { CommentForm } from "@/components/comments/comment-form"
import { cn } from "@/lib/utils"

const initialState: CommentActionState = {
  error: null,
  version: 0,
}

export type CommentViewModel = {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

type CommentItemProps = {
  comment: CommentViewModel
  postId: string
  currentUserId: string | null
  isEditing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
}

function formatAuthor(comment: CommentViewModel) {
  return comment.user.name?.trim() || comment.user.email?.split("@")[0] || "익명"
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function CommentItem({
  comment,
  postId,
  currentUserId,
  isEditing,
  onStartEdit,
  onStopEdit,
}: CommentItemProps) {
  const canEdit = currentUserId === comment.userId
  const handledDeleteVersionRef = useRef(0)
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteCommentAction,
    initialState
  )

  useEffect(() => {
    if (
      deleteState.version === 0 ||
      handledDeleteVersionRef.current === deleteState.version
    ) {
      return
    }

    handledDeleteVersionRef.current = deleteState.version
    if (deleteState.version > 0) {
      onStopEdit()
    }
  }, [deleteState.version, onStopEdit])

  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-background/80 p-4 shadow-sm backdrop-blur",
        isEditing && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-sm">{formatAuthor(comment)}</p>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
            {comment.updatedAt !== comment.createdAt ? (
              <span className="text-xs text-muted-foreground">(수정됨)</span>
            ) : null}
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/90">
            {comment.content}
          </p>
        </div>

        {canEdit && !isEditing ? (
          <div className="flex shrink-0 items-center gap-1">
            <Button type="button" size="icon-sm" variant="ghost" onClick={onStartEdit}>
              <PencilLine className="size-4" />
            </Button>
            <form action={deleteAction}>
              <input type="hidden" name="postId" value={postId} />
              <input type="hidden" name="commentId" value={comment.id} />
              <Button
                type="submit"
                size="icon-sm"
                variant="ghost"
                disabled={deletePending}
                onClick={(event) => {
                  if (!window.confirm("이 댓글을 삭제할까요?")) {
                    event.preventDefault()
                  }
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </form>
          </div>
        ) : null}
      </div>

      {isEditing ? (
        <div className="mt-4">
          <CommentForm
            key={comment.id}
            mode="edit"
            postId={postId}
            commentId={comment.id}
            initialContent={comment.content}
            onSuccess={onStopEdit}
            onCancel={onStopEdit}
          />
        </div>
      ) : null}

      {deleteState.error ? (
        <p className="mt-3 text-sm text-destructive">{deleteState.error}</p>
      ) : null}
    </article>
  )
}
