import { fetchUserRepositories } from "@/lib/github"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()

  try {
    const repositories = await fetchUserRepositories(session?.accessToken)
    return Response.json({ repositories })
  } catch {
    return Response.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}