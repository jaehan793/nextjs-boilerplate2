"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { createPost } from "@/lib/posts"

export type PostActionState = {
  error: string | null
}

const initialState: PostActionState = {
  error: null,
}

const MAX_TITLE_LENGTH = 80
const MAX_CONTENT_LENGTH = 2000

function readFormValue(formData: FormData, name: string) {
  const value = formData.get(name)

  if (typeof value !== "string") {
    return ""
  }

  return value.trim()
}

export async function createPostAction(
  previousState: PostActionState = initialState,
  formData: FormData
): Promise<PostActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return { ...previousState, error: "로그인한 사용자만 게시글을 작성할 수 있어요." }
  }

  const title = readFormValue(formData, "title")
  const content = readFormValue(formData, "content")

  if (!title) {
    return { ...previousState, error: "제목을 입력해 주세요." }
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return { ...previousState, error: "제목은 80자 이내로 작성해 주세요." }
  }

  if (!content) {
    return { ...previousState, error: "본문을 입력해 주세요." }
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return { ...previousState, error: "본문은 2000자 이내로 작성해 주세요." }
  }

  const post = await createPost({
    title,
    content,
  })

  revalidatePath("/posts")
  redirect(`/posts/${post.id}`)
}
