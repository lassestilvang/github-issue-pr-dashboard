import { Octokit } from "@octokit/rest";

export interface IssuePR {
  repository: string;
  title: string;
  labels: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  type: 'issue' | 'pull_request';
  html_url: string;
}

export async function fetchUserIssues(token: string, filters?: { status?: string; role?: string; repo?: string; page?: number }): Promise<{ issues: IssuePR[], pagination: { hasNext: boolean, hasPrev: boolean, nextPage?: number, prevPage?: number } }> {
  const octokit = new Octokit({ auth: token });

  const { status, role, repo, page = 1 } = filters || {};

  let filter = 'all';
  if (role === 'created') filter = 'created';
  else if (role === 'assigned') filter = 'assigned';

  let state = 'all';
  if (status === 'open') state = 'open';
  else if (status === 'closed') state = 'closed';

  const response = await octokit.issues.listForAuthenticatedUser({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter: filter as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: state as any,
    per_page: 30,
    page
  });

  let issues = response.data.map(issue => ({
    repository: issue.repository!.name,
    title: issue.title,
    labels: issue.labels.map(label => typeof label === 'string' ? label : (label.name || 'unknown')),
    status: issue.state,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    type: (issue.pull_request ? 'pull_request' : 'issue') as 'issue' | 'pull_request',
    html_url: issue.html_url
  }));

  if (repo && repo !== 'all') {
    issues = issues.filter(issue => issue.repository === repo);
  }

  // Parse Link header for pagination
  const linkHeader = response.headers.link;
  let hasNext = false, hasPrev = false, nextPage, prevPage;

  if (linkHeader) {
    const links = linkHeader.split(',').map(link => link.trim());
    links.forEach(link => {
      const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
      if (match) {
        const url = match[1];
        const rel = match[2];
        const urlObj = new URL(url);
        const pageNum = parseInt(urlObj.searchParams.get('page') || '1');
        if (rel === 'next') {
          hasNext = true;
          nextPage = pageNum;
        } else if (rel === 'prev') {
          hasPrev = true;
          prevPage = pageNum;
        }
      }
    });
  }

  return { issues, pagination: { hasNext, hasPrev, nextPage, prevPage } };
}