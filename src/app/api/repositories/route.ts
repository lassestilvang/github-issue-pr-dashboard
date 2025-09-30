import { auth } from "@/lib/auth"
import { fetchUserRepositories } from "@/lib/github"

export async function GET() {
  const session = await auth()

  if (!session || !session.accessToken) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const repositories = await fetchUserRepositories(session.accessToken as string)
    return Response.json({ repositories })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}