import { fetchUserIssues } from "@/lib/github"

export async function GET(request: Request) {
  // Temporarily bypass authentication for testing
  // const session = await auth()
  // if (!session || !session.accessToken) {
  //   return Response.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  // Mock session for testing
  const session = { accessToken: process.env.GITHUB_CLIENT_SECRET, user: { login: 'testuser' } }

  const url = new URL(request.url)
  const status = url.searchParams.get('status') || undefined
  const role = url.searchParams.get('role') || undefined
  const repo = url.searchParams.get('repo') || undefined
  const type = url.searchParams.get('type') || undefined
  const page = url.searchParams.get('page') || '1'
  const pageSize = url.searchParams.get('pageSize') || '30'

  try {
    const result = await fetchUserIssues(session.accessToken as string, { status, role, repo, type, page: parseInt(page), pageSize: parseInt(pageSize), user: session.user?.login })
    return Response.json(result)
  } catch (error) {
    console.error('Error fetching issues:', error)
    return Response.json({ error: 'Failed to fetch issues' }, { status: 500 })
  }
}