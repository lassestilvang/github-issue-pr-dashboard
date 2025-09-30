import { fetchUserRepositories } from "@/lib/github"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const repositories = await fetchUserRepositories((session as any)?.accessToken)
    return Response.json({ repositories })
  } catch {
    return Response.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}