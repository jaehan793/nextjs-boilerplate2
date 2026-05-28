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
    <div>
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
