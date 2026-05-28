// app/api/auth/[...nextauth]/route.ts
import { getHandlers } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(...args: Parameters<Awaited<ReturnType<typeof getHandlers>>["GET"]>) {
  return (await getHandlers()).GET(...args)
}

export async function POST(...args: Parameters<Awaited<ReturnType<typeof getHandlers>>["POST"]>) {
  return (await getHandlers()).POST(...args)
}
