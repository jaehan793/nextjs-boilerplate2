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
