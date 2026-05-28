// lib/auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"

const authConfig = {
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/error",
  },
}

let proxyAuthInstance: ReturnType<typeof NextAuth> | undefined
let fullAuthInstance: ReturnType<typeof NextAuth> | undefined

function getProxyAuthInstance() {
  if (!proxyAuthInstance) {
    proxyAuthInstance = NextAuth(authConfig)
  }

  return proxyAuthInstance
}

async function getFullAuthInstance() {
  if (!fullAuthInstance) {
    const { db } = await import("@/lib/db")

    fullAuthInstance = NextAuth({
      adapter: PrismaAdapter(db),
      ...authConfig,
    })
  }

  return fullAuthInstance
}

export async function auth(...args: any[]) {
  return (await getFullAuthInstance()).auth(...(args as [any]))
}

export async function signIn(...args: any[]) {
  return (await getFullAuthInstance()).signIn(...(args as [any]))
}

export async function signOut(...args: any[]) {
  return (await getFullAuthInstance()).signOut(...(args as [any]))
}

export async function getHandlers() {
  return (await getFullAuthInstance()).handlers
}

export async function proxy(...args: any[]) {
  return getProxyAuthInstance().auth(...(args as [any]))
}

const SESSION_COOKIE_NAME_PATTERNS = [
  /^__Secure-authjs\.session-token(?:\.\d+)?=/,
  /^authjs\.session-token(?:\.\d+)?=/,
]

function isSessionCookie(cookie: string) {
  return SESSION_COOKIE_NAME_PATTERNS.some((pattern) => pattern.test(cookie))
}

function makeSessionCookieEphemeral(cookie: string) {
  return cookie
    .replace(/;\s*Expires=[^;]+/i, "")
    .replace(/;\s*Max-Age=\d+/i, "")
}

export function rewriteAuthResponseCookies(response: Response) {
  const getSetCookie = response.headers.getSetCookie?.bind(response.headers)
  const cookies = getSetCookie?.()

  if (!cookies?.length) {
    return response
  }

  const rewrittenCookies = cookies.map((cookie) =>
    isSessionCookie(cookie) ? makeSessionCookieEphemeral(cookie) : cookie
  )

  const nextResponse = new Response(response.body, response)
  nextResponse.headers.delete("set-cookie")

  for (const cookie of rewrittenCookies) {
    nextResponse.headers.append("set-cookie", cookie)
  }

  return nextResponse
}
