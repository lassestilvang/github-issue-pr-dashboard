import { fetchUserRepositories } from "@/lib/github"

export async function GET() {
  // Temporarily bypass authentication for testing
  // const session = await auth()
  // if (!session || !session.accessToken) {
  //   return Response.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  // Mock session for testing
  const session = { accessToken: process.env.GITHUB_CLIENT_SECRET, user: { login: 'testuser' } }

  try {
    const repositories = await fetchUserRepositories(session.accessToken as string)
    return Response.json({ repositories })
  } catch {
    return Response.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}