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

let publicAuthInstance: ReturnType<typeof NextAuth> | undefined
let fullAuthInstance: ReturnType<typeof NextAuth> | undefined

function getPublicAuthInstance() {
  if (!publicAuthInstance) {
    publicAuthInstance = NextAuth(authConfig)
  }

  return publicAuthInstance
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
  return getPublicAuthInstance().auth(...(args as [any]))
}

export async function signIn(...args: any[]) {
  return getPublicAuthInstance().signIn(...(args as [any]))
}

export async function signOut(...args: any[]) {
  return getPublicAuthInstance().signOut(...(args as [any]))
}

export async function getHandlers() {
  return (await getFullAuthInstance()).handlers
}
