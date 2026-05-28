"use client"

import { useActionState, useEffect, useRef } from "react"

import {
  createCommentAction,
  type CommentActionState,
  updateCommentAction,
} from "@/app/posts/[postId]/actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const initialState: CommentActionState = {
  error: null,
  version: 0,
}

type CommentFormProps = {
  mode: "create" | "edit"
  postId: string
  commentId?: string
  initialContent?: string
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function CommentForm({
  mode,
  postId,
  commentId,
  initialContent = "",
  onSuccess,
  onCancel,
  className,
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const handledVersionRef = useRef(0)
  const [state, action, isPending] = useActionState(
    mode === "create" ? createCommentAction : updateCommentAction,
    initialState
  )

  const isEditMode = mode === "edit"

  useEffect(() => {
    if (state.version === 0 || handledVersionRef.current === state.version) {
      return
    }

    handledVersionRef.current = state.version
    formRef.current?.reset()
    onSuccess?.()
  }, [onSuccess, state.version])

  return (
    <form ref={formRef} action={action} className={cn("space-y-3", className)}>
      <input type="hidden" name="postId" value={postId} />
      {commentId ? <input type="hidden" name="commentId" value={commentId} /> : null}

      <textarea
        name="content"
        defaultValue={initialContent}
        placeholder="따뜻한 한 줄을 남겨주세요."
        className="min-h-28 w-full rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        maxLength={500}
        required
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          로그인한 사용자만 댓글을 작성하고 수정할 수 있어요.
        </p>

        <div className="flex items-center gap-2">
          {isEditMode ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "저장 중..." : isEditMode ? "수정 완료" : "댓글 등록"}
          </Button>
        </div>
      </div>

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
    </form>
  )
}
