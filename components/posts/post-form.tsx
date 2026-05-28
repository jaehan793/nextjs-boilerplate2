"use client"

import { useActionState, useEffect, useRef } from "react"

import {
  createPostAction,
  type PostActionState,
} from "@/app/posts/new/actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const initialState: PostActionState = {
  error: null,
}

type PostFormProps = {
  className?: string
}

export function PostForm({ className }: PostFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, isPending] = useActionState(createPostAction, initialState)

  useEffect(() => {
    if (!state.error) {
      return
    }

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [state.error])

  return (
    <form ref={formRef} action={action} className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <label htmlFor="title" className="text-caption-strong text-[var(--ink)]">
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={80}
          placeholder="한 줄 제목을 적어주세요."
          className="h-11 w-full rounded-[8px] border border-[var(--hairline)] bg-[var(--canvas)] px-4 text-body text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-muted-48)] focus:border-[var(--primary)]"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-caption-strong text-[var(--ink)]">
          본문
        </label>
        <textarea
          id="content"
          name="content"
          maxLength={2000}
          rows={12}
          placeholder="글 내용을 천천히 적어주세요."
          className="min-h-[320px] w-full rounded-[8px] border border-[var(--hairline)] bg-[var(--canvas)] px-4 py-3 text-body leading-[1.47] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-muted-48)] focus:border-[var(--primary)]"
          required
        />
      </div>

      {state.error ? (
        <p className="text-fine-print text-red-600">{state.error}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : "게시글 작성"}
        </Button>
      </div>
    </form>
  )
}
