// lib/auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"

let authInstance: ReturnType<typeof NextAuth> | undefined

async function getAuthInstance() {
  if (!authInstance) {
    const { db } = await import("@/lib/db")

    authInstance = NextAuth({
      adapter: PrismaAdapter(db),
      providers: [Google],
      pages: {
        signIn: "/login",
        error: "/error",
      },
    })
  }

  return authInstance
}

export async function auth(...args: any[]) {
  return (await getAuthInstance()).auth(...(args as [any]))
}

export async function signIn(...args: any[]) {
  return (await getAuthInstance()).signIn(...(args as [any]))
}

export async function signOut(...args: any[]) {
  return (await getAuthInstance()).signOut(...(args as [any]))
}

export async function getHandlers() {
  return (await getAuthInstance()).handlers
}
