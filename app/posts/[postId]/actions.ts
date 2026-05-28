"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { createComment, deleteComment, updateComment } from "@/lib/comments"
import { getPostById } from "@/lib/posts"

export type CommentActionState = {
  error: string | null
  version: number
}

const MAX_COMMENT_LENGTH = 500

const initialState: CommentActionState = {
  error: null,
  version: 0,
}

function successState(previous: CommentActionState): CommentActionState {
  return {
    error: null,
    version: previous.version + 1,
  }
}

function failureState(previous: CommentActionState, error: string): CommentActionState {
  return {
    error,
    version: previous.version,
  }
}

function readFormValue(formData: FormData, name: string) {
  const value = formData.get(name)

  if (typeof value !== "string") {
    return ""
  }

  return value.trim()
}

export async function createCommentAction(
  previousState: CommentActionState = initialState,
  formData: FormData
): Promise<CommentActionState> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return failureState(previousState, "로그인 후 댓글을 남겨주세요.")
  }

  const postId = readFormValue(formData, "postId")
  if (!postId) {
    return failureState(previousState, "게시글을 찾을 수 없습니다.")
  }

  const post = await getPostById(postId)
  if (!post) {
    return failureState(previousState, "게시글을 찾을 수 없습니다.")
  }

  const content = readFormValue(formData, "content")
  if (!content) {
    return failureState(previousState, "댓글 내용을 입력해 주세요.")
  }

  if (content.length > MAX_COMMENT_LENGTH) {
    return failureState(previousState, "댓글은 500자 이내로 작성해 주세요.")
  }

  await createComment({
    postId,
    userId,
    content,
  })

  revalidatePath(`/posts/${postId}`)
  return successState(previousState)
}

export async function updateCommentAction(
  previousState: CommentActionState = initialState,
  formData: FormData
): Promise<CommentActionState> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return failureState(previousState, "로그인 후 댓글을 수정할 수 있습니다.")
  }

  const commentId = readFormValue(formData, "commentId")
  if (!commentId) {
    return failureState(previousState, "댓글을 찾을 수 없습니다.")
  }

  const content = readFormValue(formData, "content")
  if (!content) {
    return failureState(previousState, "댓글 내용을 입력해 주세요.")
  }

  if (content.length > MAX_COMMENT_LENGTH) {
    return failureState(previousState, "댓글은 500자 이내로 작성해 주세요.")
  }

  const result = await updateComment({
    commentId,
    userId,
    content,
  })

  if (!result) {
    return failureState(previousState, "댓글을 찾을 수 없습니다.")
  }

  if ("unauthorized" in result) {
    return failureState(previousState, "본인이 작성한 댓글만 수정할 수 있습니다.")
  }

  revalidatePath(`/posts/${result.postId}`)
  return successState(previousState)
}

export async function deleteCommentAction(
  previousState: CommentActionState = initialState,
  formData: FormData
): Promise<CommentActionState> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return failureState(previousState, "로그인 후 댓글을 삭제할 수 있습니다.")
  }

  const commentId = readFormValue(formData, "commentId")
  if (!commentId) {
    return failureState(previousState, "댓글을 찾을 수 없습니다.")
  }

  const result = await deleteComment({
    commentId,
    userId,
  })

  if (!result) {
    return failureState(previousState, "댓글을 찾을 수 없습니다.")
  }

  if ("unauthorized" in result) {
    return failureState(previousState, "본인이 작성한 댓글만 삭제할 수 있습니다.")
  }

  revalidatePath(`/posts/${result.postId}`)
  return successState(previousState)
}
