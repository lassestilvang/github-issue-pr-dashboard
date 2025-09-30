import { auth } from "@/lib/auth"
import { fetchUserIssues } from "@/lib/github"

export async function GET(request: Request) {
  const session = await auth()

  if (!session || !session.accessToken) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const status = url.searchParams.get('status') || undefined
  const role = url.searchParams.get('role') || undefined
  const repo = url.searchParams.get('repo') || undefined
  const type = url.searchParams.get('type') || undefined
  const page = url.searchParams.get('page') || '1'

  try {
    const result = await fetchUserIssues(session.accessToken as string, { status, role, repo, type, page: parseInt(page) })
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch issues' }, { status: 500 })
  }
}