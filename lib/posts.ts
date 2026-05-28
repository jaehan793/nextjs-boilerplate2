import { db } from "@/lib/db"

export async function getPosts() {
  return db.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function getPostById(postId: string) {
  return db.post.findUnique({
    where: { id: postId },
  })
}

export async function createPost({
  title,
  content,
}: {
  title: string
  content: string
}) {
  return db.post.create({
    data: {
      title,
      content,
    },
  })
}
