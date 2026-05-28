# Global Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `Home`, `Posts`, and the auth action area persist across every page by moving them into a shared root-level header.

**Architecture:** Add one server-rendered global header in `app/layout.tsx` so the session is read once per request and the authenticated action can be shown consistently everywhere. Keep route-specific subnavs inside the page files that already need them, but remove the duplicated top nav chrome from each page and offset content below the fixed header.

**Tech Stack:** Next.js App Router, Auth.js (`auth`, `signOut`), Tailwind CSS v4, existing `Button` / `buttonVariants` utilities.

---

### Task 1: Build a shared global header

**Files:**
- Create: `components/layout/global-header.tsx`
- Read: `lib/auth.ts`
- Read: `components/ui/button.tsx`

- [ ] **Step 1: Write the shared header component**

```tsx
import Link from "next/link"

import { auth, signOut } from "@/lib/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export async function GlobalHeader() {
  const session = await auth()

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-11 bg-[var(--surface-black)]">
      <div className="mx-auto flex h-full max-w-[980px] items-center justify-between px-4">
        <Link href="/" className="text-fine-print text-[var(--body-on-dark)] hover:text-white/80">
          nextjs-boilerplate
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-fine-print text-[var(--body-on-dark)] hover:text-white/80">
            Home
          </Link>
          <Link href="/posts" className="text-fine-print text-[var(--body-on-dark)] hover:text-white/80">
            Posts
          </Link>
          {session ? (
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
              }}
            >
              <Button type="submit" variant="ghost" size="xs" className="text-[var(--body-on-dark)] hover:bg-white/10">
                Sign out
              </Button>
            </form>
          ) : (
            <Link
              href={`/login?callbackUrl=${encodeURIComponent("/")}`}
              className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "text-[var(--body-on-dark)] hover:bg-white/10")}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Run a type check for the new component**

Run: `corepack pnpm run type-check`
Expected: no new errors about `GlobalHeader`, `auth`, or the inline `signOut` form action.

- [ ] **Step 3: Commit the header component**

```bash
git add components/layout/global-header.tsx
git commit -m "feat: add global header"
```

### Task 2: Mount the header in the root layout

**Files:**
- Modify: `app/layout.tsx:1-24`

- [ ] **Step 1: Add the global header above page content**

```tsx
import type { Metadata } from "next"
import "@fontsource-variable/inter"
import "./globals.css"

import { GlobalHeader } from "@/components/layout/global-header"

export const metadata: Metadata = {
  title: "Next.js Boilerplate",
  description: "Next.js 16 · Tailwind CSS v4 · shadcn/ui · Auth.js · Prisma · Neon",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="min-h-screen bg-background antialiased font-sans">
        <GlobalHeader />
        <main className="pt-11">{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify the layout compiles**

Run: `corepack pnpm run type-check`
Expected: no import or JSX errors from `app/layout.tsx`.

- [ ] **Step 3: Commit the layout wiring**

```bash
git add app/layout.tsx
git commit -m "feat: mount global header"
```

### Task 3: Remove duplicated page-level top nav chrome

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/posts/page.tsx`
- Modify: `app/posts/[postId]/page.tsx`
- Modify: `app/posts/new/page.tsx`

- [ ] **Step 1: Delete each page's local `nav` block**

```tsx
// remove the page-local "Global Nav" block from each page
// the shared header now owns Home / Posts / Sign in / Sign out
```

- [ ] **Step 2: Keep the route-specific subnavs and offset them under the fixed header**

```tsx
// posts pages keep their frosted subnav, but it should remain:
// <div className="sticky top-11 z-40 border-b border-[var(--hairline)] frosted-glass">
```

- [ ] **Step 3: Leave the page content and login CTA behavior intact**

```tsx
// home can keep its hero login CTA
// post detail can keep its comment-area login flow
// new post can keep its login gate and callback URL
```

- [ ] **Step 4: Run the app type check again**

Run: `corepack pnpm run type-check`
Expected: all four routes compile without duplicate nav imports or layout shifts.

- [ ] **Step 5: Commit the page cleanup**

```bash
git add app/page.tsx app/posts/page.tsx app/posts/[postId]/page.tsx app/posts/new/page.tsx
git commit -m "feat: remove duplicated navs"
```

### Task 4: Verify persistent auth and navigation on every page

**Files:**
- Test: `app/page.tsx`
- Test: `app/posts/page.tsx`
- Test: `app/posts/[postId]/page.tsx`
- Test: `app/posts/new/page.tsx`

- [ ] **Step 1: Run a production build**

Run: `corepack pnpm run build`
Expected: Next.js compiles successfully with the shared header included.

- [ ] **Step 2: Manually confirm the header on all main routes**

Run in browser:
- `/`
- `/posts`
- `/posts/<postId>`
- `/posts/new`

Expected:
- `Home` and `Posts` are always visible in the top bar.
- Logged-in state always shows `Sign out`.
- Logged-out state shows `Sign in`.
- The posts subnav still sits below the global header.

- [ ] **Step 3: Verify logout redirect**

Expected:
- Clicking `Sign out` returns to `/`.
- Refreshing any page after login keeps the session state visible until the browser closes or the user signs out.

- [ ] **Step 4: Close out with a final commit if verification required any adjustments**

```bash
git add .
git commit -m "feat: finalize global header"
```
