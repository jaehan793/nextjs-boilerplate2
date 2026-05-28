// app/(auth)/login/page.tsx
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { signIn } from "@/lib/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[]
  }>
}

function getCallbackUrl(value: string | string[] | undefined) {
  const callbackUrl = Array.isArray(value) ? value[0] : value

  if (!callbackUrl || !callbackUrl.startsWith("/")) {
    return "/"
  }

  return callbackUrl
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams
  const redirectTo = getCallbackUrl(callbackUrl)

  return (
    <div className="min-h-screen">
      {/* Global Nav - Apple Style */}
      <nav className="sticky top-0 z-50 h-11 bg-[var(--surface-black)]">
        <div className="mx-auto flex h-full max-w-[980px] items-center justify-between px-4">
          <Link href="/" className="text-fine-print text-[var(--body-on-dark)] hover:text-white/80">
            nextjs-boilerplate
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/posts" className="text-fine-print text-[var(--body-on-dark)] hover:text-white/80">
              Posts
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Content */}
      <section className="flex min-h-[calc(100vh-44px)] items-center justify-center bg-[var(--canvas-parchment)] px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-[18px] border border-[var(--hairline)] bg-[var(--canvas)] p-8">
            <div className="mb-8 text-center">
              <h1 className="text-display-lg text-[var(--ink)]">Sign in</h1>
              <p className="mt-2 text-body text-[var(--muted-foreground)]">
                계정에 로그인하세요
              </p>
            </div>
            <form
              action={async () => {
                "use server"
                await signIn("google", { redirectTo })
              }}
            >
              <Button type="submit" className="w-full">
                Continue with Google
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-[var(--muted-foreground)]")}>
                <ArrowLeft className="size-3.5" />
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
