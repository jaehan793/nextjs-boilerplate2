import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  await db.post.upsert({
    where: { id: "demo-post" },
    update: {},
    create: {
      id: "demo-post",
      title: "첫 번째 게시글",
      content: "이 글에 댓글을 남길 수 있습니다.",
    },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
