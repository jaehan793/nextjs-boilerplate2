# 게시글 댓글 기능 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 로그인한 사용자만 게시글에 댓글을 작성할 수 있고, 작성자는 본인 댓글을 수정/삭제할 수 있으며, 댓글은 최신순으로 표시되는 게시글 댓글 기능을 추가한다.

**Architecture:** 현재 레포에는 게시글 엔티티가 없으므로, 댓글 기능을 검증할 수 있는 최소 `Post` 모델과 게시글 상세 화면을 함께 추가한다. 댓글 데이터는 Prisma로 저장하고, 읽기는 게시글 상세 서버 컴포넌트에서 처리하며, 쓰기는 서버 액션을 통해 수행한다. Auth.js 세션은 기존 `lib/auth.ts`를 재사용하고, 댓글 권한은 서버에서 항상 다시 검사한다.

**Tech Stack:** Next.js 16 App Router · TypeScript strict · Auth.js v5 (`next-auth@beta`) · Prisma · PostgreSQL/Neon · Tailwind CSS v4 · pnpm

---

## File Map

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Add `Post` and `Comment` models plus relations |
| `prisma/seed.mjs` | Seed one sample post so the comment flow has a host page |
| `package.json` | Add a Prisma seed script |
| `lib/posts.ts` | Post read helpers for list/detail pages |
| `lib/comments.ts` | Comment CRUD helpers and ownership checks |
| `app/posts/page.tsx` | Minimal post list page linking to the sample post |
| `app/posts/[postId]/page.tsx` | Post detail page with comment section |
| `app/posts/[postId]/actions.ts` | Server actions for create/update/delete comment |
| `components/comments/comment-section.tsx` | Compose the comment UI on the post detail page |
| `components/comments/comment-form.tsx` | Reusable create/edit form |
| `components/comments/comment-item.tsx` | Single comment card with edit/delete actions |
| `components/comments/comment-list.tsx` | Sorted list rendering and empty state |
| `README.md` | Add a short note about the new demo post/comments flow |

---

### Task 1: Add the post/comment schema and seed data

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/seed.mjs`
- Modify: `package.json`

- [ ] **Step 1: Extend the Prisma schema**

Use this schema shape so comments attach to a real post and ownership is enforced through `userId`:

```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  comments  Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([postId, createdAt])
  @@index([userId])
}
```

Keep the existing Auth.js tables unchanged.

- [ ] **Step 2: Add a seed script that creates one demo post**

Create `prisma/seed.mjs` so the app always has one post to comment on during local development:

```js
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
```

- [ ] **Step 3: Add a Prisma seed script**

Add this to `package.json`:

```json
{
  "prisma": {
    "seed": "node prisma/seed.mjs"
  }
}
```

- [ ] **Step 4: Push the schema and seed once**

Run:

```bash
corepack pnpm prisma db push
corepack pnpm prisma db seed
```

Expected: the schema syncs cleanly and one demo post exists in the database.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/seed.mjs package.json
git commit -m "feat: add post and comment schema"
```

### Task 2: Add post and comment data access helpers

**Files:**
- Create: `lib/posts.ts`
- Create: `lib/comments.ts`

- [ ] **Step 1: Write read helpers for posts**

`lib/posts.ts` should expose a small query surface for listing and loading the sample post:

```ts
import { db } from "@/lib/db"

export async function getPosts() {
  return db.post.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
  })
}

export async function getPostById(postId: string) {
  return db.post.findUnique({
    where: { id: postId },
  })
}
```

- [ ] **Step 2: Write comment helpers with ownership checks**

`lib/comments.ts` should expose create/update/delete helpers that always receive the current user id:

```ts
import { db } from "@/lib/db"

export async function getCommentsByPostId(postId: string) {
  return db.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  })
}
```

Keep write helpers separate so the server actions can enforce:
- logged-in user only
- comment owner only for update/delete
- empty content rejection

- [ ] **Step 3: Verify the helpers compile**

Run:

```bash
corepack pnpm run type-check
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add lib/posts.ts lib/comments.ts
git commit -m "feat: add post and comment data helpers"
```

### Task 3: Build the post detail page and comment UI

**Files:**
- Create: `app/posts/page.tsx`
- Create: `app/posts/[postId]/page.tsx`
- Create: `components/comments/comment-section.tsx`
- Create: `components/comments/comment-list.tsx`
- Create: `components/comments/comment-item.tsx`
- Create: `components/comments/comment-form.tsx`

- [ ] **Step 1: Add a minimal post list page**

`app/posts/page.tsx` should show the demo post and link into the detail page. Keep it simple and clearly labeled as the entry point for the comment demo.

- [ ] **Step 2: Add the post detail page**

`app/posts/[postId]/page.tsx` should:
- load the post by id
- load comments for that post
- render the post content
- render the comment section below the post
- treat missing posts as a not-found case

- [ ] **Step 3: Compose the comment UI**

Build the comment section as three focused pieces:
- `comment-form.tsx` for create/edit input
- `comment-item.tsx` for each individual comment card
- `comment-list.tsx` for newest-first rendering and empty state

Editing should switch the form into “edit mode” for the current comment, while create mode stays available when the user is not editing.

- [ ] **Step 4: Gate the form by session**

Logged-out users should see a login prompt instead of the comment form. Logged-in users should see the form and their own edit/delete controls where applicable.

- [ ] **Step 5: Commit**

```bash
git add app/posts/page.tsx app/posts/[postId]/page.tsx components/comments
git commit -m "feat: add post detail page with comment ui"
```

### Task 4: Implement comment create, update, and delete actions

**Files:**
- Create: `app/posts/[postId]/actions.ts`
- Modify: `app/posts/[postId]/page.tsx`

- [ ] **Step 1: Add server actions for comment CRUD**

Use server actions so each operation can read the current session and reject unauthorized access before touching the database.

```ts
"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function createComment(postId: string, content: string) {}
export async function updateComment(commentId: string, content: string) {}
export async function deleteComment(commentId: string) {}
```

- [ ] **Step 2: Enforce validation and ownership**

Each action should:
- require `auth()`
- trim the content
- reject empty content
- cap the content length to a reasonable limit
- verify the comment belongs to `session.user.id` before update/delete

- [ ] **Step 3: Refresh the post detail page after mutations**

After create/update/delete, revalidate the post detail route so the list re-renders in newest-first order without manual refresh.

- [ ] **Step 4: Add failure states**

Show inline error feedback for:
- not logged in
- empty content
- not the owner
- missing comment/post

- [ ] **Step 5: Commit**

```bash
git add app/posts/[postId]/actions.ts app/posts/[postId]/page.tsx
git commit -m "feat: add comment mutations"
```

### Task 5: Wire navigation and finish verification

**Files:**
- Modify: `app/page.tsx`
- Modify: `README.md`

- [ ] **Step 1: Add a path into the posts demo**

Update the home page so there is an obvious route into the posts and comment experience.

- [ ] **Step 2: Document the new flow**

Add a short README section explaining:
- where the demo post lives
- that only logged-in users can comment
- how to seed the sample post

- [ ] **Step 3: Run the full verification pass**

Run:

```bash
corepack pnpm run type-check
corepack pnpm run build
```

Expected: both commands exit cleanly.

- [ ] **Step 4: Smoke test in the browser**

Run the app locally and verify:
1. `/posts` opens successfully
2. The demo post detail page loads
3. Logged-out users see a login prompt instead of the comment form
4. Logged-in users can create a comment
5. The new comment appears at the top
6. The author can edit and delete their own comment
7. Another logged-in user cannot edit/delete someone else’s comment

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add post comments"
```
