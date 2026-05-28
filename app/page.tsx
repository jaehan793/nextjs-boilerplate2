// app/page.tsx
import Link from "next/link"
import { ArrowRight, Coffee } from "lucide-react"

import { auth, signOut } from "@/lib/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await auth()
  const loginHref = `/login?callbackUrl=${encodeURIComponent("/")}`

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,53,15,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,251,247,1)_0%,_rgba(255,255,255,1)_100%)] px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Card className="border-border/70 bg-card/85 shadow-sm backdrop-blur">
          <CardHeader className="space-y-3">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
              <Coffee className="size-3.5" />
              nextjs-boilerplate
            </p>
            <CardTitle className="text-3xl tracking-tight sm:text-4xl">
              카페 같은 게시글 댓글 흐름을 확인해보세요.
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base">
              로그인한 사용자만 댓글을 작성할 수 있고, 작성자는 본인 댓글을 수정하거나 삭제할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Link href="/posts" className={cn(buttonVariants(), "gap-1.5")}>
              게시글 보기
              <ArrowRight className="size-4" />
            </Link>
            {session ? (
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <Button type="submit" variant="outline">
                  Sign out
                </Button>
              </form>
            ) : (
              <Link href={loginHref} className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}>
                Google로 로그인
              </Link>
            )}
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          {session ? `Signed in as ${session.user?.email}` : "로그인하지 않아도 게시글은 열 수 있어요."}
        </p>
      </div>
    </main>
  )
}
