import { fetchUserIssues } from "@/lib/github"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await auth()

  const url = new URL(request.url)
  const status = url.searchParams.get('status') || undefined
  const role = url.searchParams.get('role') || undefined
  const repo = url.searchParams.get('repo') || undefined
  const type = url.searchParams.get('type') || undefined
  const search = url.searchParams.get('search') || undefined
  const page = url.searchParams.get('page') || '1'
  const pageSize = url.searchParams.get('pageSize') || '30'

  try {
    const result = await fetchUserIssues(session?.accessToken, { status, role, repo, type, search, page: parseInt(page), pageSize: parseInt(pageSize), user: session?.user?.login })
    return Response.json(result)
  } catch (error) {
    console.error('Error fetching issues:', error)
    return Response.json({ error: 'Failed to fetch issues' }, { status: 500 })
  }
}