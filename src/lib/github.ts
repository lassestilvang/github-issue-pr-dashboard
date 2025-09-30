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

export async function fetchUserRepositories(token: string): Promise<string[]> {
  // Mock data for testing
  if (process.env.NODE_ENV === 'development' && !token.startsWith('ghp_')) {
    return [
      'github-issue-pr-dashboard',
      'react-app',
      'node-api',
      'vue-dashboard',
      'angular-admin',
      'express-server',
      'python-ml',
      'go-microservice',
      'rust-cli',
      'typescript-lib'
    ];
  }

  const octokit = new Octokit({ auth: token });

  const response = await octokit.repos.listForAuthenticatedUser({
    per_page: 100, // Fetch up to 100 repos
    sort: 'updated',
    direction: 'desc'
  });

  return response.data.map(repo => repo.name);
}


export async function fetchUserIssues(token: string, filters?: { status?: string; role?: string; repo?: string; page?: number; type?: string; user?: string }): Promise<{ issues: IssuePR[], pagination: { hasNext: boolean, hasPrev: boolean, nextPage?: number, prevPage?: number } }> {
  const octokit = new Octokit({ auth: token });

  const { status, role, repo, page = 1, type, user } = filters || {};

  // Mock data for testing
  if (process.env.NODE_ENV === 'development' && !token.startsWith('ghp_')) {
    const mockIssues: IssuePR[] = [
      {
        repository: 'github-issue-pr-dashboard',
        title: 'Add search functionality to repository dropdown',
        labels: ['enhancement', 'frontend'],
        status: 'open',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        type: 'issue',
        html_url: 'https://github.com/test/repo/issues/1'
      },
      {
        repository: 'react-app',
        title: 'Fix responsive layout on mobile devices',
        labels: ['bug', 'mobile'],
        status: 'open',
        createdAt: '2024-01-14T09:30:00Z',
        updatedAt: '2024-01-14T09:30:00Z',
        type: 'issue',
        html_url: 'https://github.com/test/repo/issues/2'
      },
      {
        repository: 'node-api',
        title: 'Implement authentication middleware',
        labels: ['feature', 'backend'],
        status: 'closed',
        createdAt: '2024-01-13T14:20:00Z',
        updatedAt: '2024-01-13T16:45:00Z',
        type: 'pull_request',
        html_url: 'https://github.com/test/repo/pull/3'
      },
      {
        repository: 'vue-dashboard',
        title: 'Update chart library to latest version',
        labels: ['maintenance', 'dependencies'],
        status: 'open',
        createdAt: '2024-01-12T11:15:00Z',
        updatedAt: '2024-01-12T11:15:00Z',
        type: 'issue',
        html_url: 'https://github.com/test/repo/issues/4'
      }
    ];

    // Apply filters
    let filteredIssues = mockIssues;
    if (repo && repo !== 'all') {
      filteredIssues = filteredIssues.filter(issue => issue.repository === repo);
    }
    if (status && status !== 'all') {
      filteredIssues = filteredIssues.filter(issue => issue.status === status);
    }
    if (type && type !== 'all') {
      filteredIssues = filteredIssues.filter(issue => issue.type === type);
    }

    // Simple pagination
    const pageSize = 30;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedIssues = filteredIssues.slice(startIndex, endIndex);

    return {
      issues: paginatedIssues,
      pagination: {
        hasNext: endIndex < filteredIssues.length,
        hasPrev: page > 1,
        nextPage: endIndex < filteredIssues.length ? page + 1 : undefined,
        prevPage: page > 1 ? page - 1 : undefined
      }
    };
  }

  let response;

  if (repo && repo !== 'all') {
    // Get user login
    const userResponse = await octokit.users.getAuthenticated();
    const login = userResponse.data.login;
    // Use search API for repo filtering
    let q = `repo:${login}/${repo} `;
    if (role === 'created') {
      q += 'author:@me ';
    } else if (role === 'assigned') {
      q += 'assignee:@me ';
    }
    if (type === 'pull_request') {
      q += 'is:pr ';
    } else if (type === 'issue') {
      q += 'is:issue ';
    }
    if (status === 'open') {
      q += 'is:open ';
    } else if (status === 'closed') {
      q += 'is:closed ';
    }
    response = await octokit.search.issuesAndPullRequests({
      q: q.trim(),
      per_page: 30,
      page
    });
  } else {
    // Use list API for no repo filter
    let filter = 'all';
    if (role === 'created') filter = 'created';
    else if (role === 'assigned') filter = 'assigned';

    let state = 'all';
    if (status === 'open') state = 'open';
    else if (status === 'closed') state = 'closed';

    response = await octokit.issues.listForAuthenticatedUser({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter: filter as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state: state as any,
      per_page: 30,
      page
    });
  }

  const data = repo && repo !== 'all' ? (response.data as any).items : response.data;

  let issues = data.map((issue: any) => ({
    repository: repo && repo !== 'all' ? repo : (issue.repository?.name || 'unknown'),
    title: issue.title || 'No title',
    labels: (issue.labels || []).map((label: any) => typeof label === 'string' ? label : (label.name || 'unknown')),
    status: issue.state || 'unknown',
    createdAt: issue.created_at || '',
    updatedAt: issue.updated_at || '',
    type: (issue.pull_request ? 'pull_request' : 'issue') as 'issue' | 'pull_request',
    html_url: issue.html_url || ''
  }));

  if (type && type !== 'all') {
    issues = issues.filter((issue: any) => issue.type === type);
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