import Link from "next/link"

import { signOut, auth } from "@/lib/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export async function GlobalHeader() {
  const session = await auth()
  const signInHref = `/login?callbackUrl=${encodeURIComponent("/")}`

  return (
    <header className="sticky top-0 z-50 h-11 bg-[var(--surface-black)]">
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
              <Button
                type="submit"
                variant="ghost"
                size="xs"
                className="text-[var(--body-on-dark)] hover:bg-white/10"
              >
                Sign out
              </Button>
            </form>
          ) : (
            <Link
              href={signInHref}
              className={cn(
                buttonVariants({ variant: "ghost", size: "xs" }),
                "text-[var(--body-on-dark)] hover:bg-white/10"
              )}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
