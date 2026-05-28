import type { Prisma } from "@prisma/client"

import { db } from "@/lib/db"

const commentUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} as const

export type CommentWithUser = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: typeof commentUserSelect
    }
  }
}>

export async function getCommentsByPostId(postId: string): Promise<CommentWithUser[]> {
  return db.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: commentUserSelect,
      },
    },
  })
}

export async function createComment({
  postId,
  userId,
  content,
}: {
  postId: string
  userId: string
  content: string
}) {
  return db.comment.create({
    data: {
      postId,
      userId,
      content,
    },
    include: {
      user: {
        select: commentUserSelect,
      },
    },
  })
}

export async function updateComment({
  commentId,
  userId,
  content,
}: {
  commentId: string
  userId: string
  content: string
}) {
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      postId: true,
      userId: true,
    },
  })

  if (!comment) {
    return null
  }

  if (comment.userId !== userId) {
    return { unauthorized: true as const, postId: comment.postId }
  }

  const updatedComment = await db.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      user: {
        select: commentUserSelect,
      },
    },
  })

  return { comment: updatedComment, postId: comment.postId }
}

export async function deleteComment({
  commentId,
  userId,
}: {
  commentId: string
  userId: string
}) {
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      postId: true,
      userId: true,
    },
  })

  if (!comment) {
    return null
  }

  if (comment.userId !== userId) {
    return { unauthorized: true as const, postId: comment.postId }
  }

  await db.comment.delete({
    where: { id: commentId },
  })

  return { postId: comment.postId }
}
