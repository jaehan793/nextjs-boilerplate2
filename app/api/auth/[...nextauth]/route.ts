// app/api/auth/[...nextauth]/route.ts
import { getHandlers, rewriteAuthResponseCookies } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(...args: Parameters<Awaited<ReturnType<typeof getHandlers>>["GET"]>) {
  return rewriteAuthResponseCookies(await (await getHandlers()).GET(...args))
}

export async function POST(...args: Parameters<Awaited<ReturnType<typeof getHandlers>>["POST"]>) {
  return rewriteAuthResponseCookies(await (await getHandlers()).POST(...args))
}
