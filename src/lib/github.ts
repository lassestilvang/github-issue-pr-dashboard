import { Octokit } from "@octokit/rest";

interface GitHubIssue {
  title?: string;
  labels?: (string | { name?: string })[];
  state?: string;
  created_at?: string;
  updated_at?: string;
  pull_request?: unknown;
  html_url?: string;
  repository?: { name?: string };
  repository_url?: string;
  user?: { login?: string; html_url?: string };
  assignees?: { login?: string; html_url?: string }[];
}

export interface IssuePR {
  owner: string;
  repository: string;
  title: string;
  labels: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  type: "issue" | "pull_request";
  html_url: string;
  author: { login: string; html_url: string };
  assignee?: { login: string; html_url: string };
}

export async function fetchUserRepositories(token: string | undefined): Promise<string[]> {
  // Mock data for testing
  if (!token || token === process.env.GITHUB_CLIENT_SECRET) {
    return [
      "github-issue-pr-dashboard",
      "react-app",
      "node-api",
      "vue-dashboard",
      "angular-admin",
      "express-server",
      "python-ml",
      "go-microservice",
      "rust-cli",
      "typescript-lib",
    ];
  }

  const octokit = new Octokit({ auth: token });

  const response = await octokit.repos.listForAuthenticatedUser({
    per_page: 100, // Fetch up to 100 repos
    sort: "updated",
    direction: "desc",
  });

  return response.data.map((repo) => repo.name);
}

export async function fetchUserIssues(
  token: string | undefined,
  filters?: {
    status?: string;
    role?: string;
    repo?: string;
    page?: number;
    pageSize?: number;
    type?: string;
    user?: string;
    search?: string;
  }
): Promise<{
  issues: IssuePR[];
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    nextPage?: number;
    prevPage?: number;
  };
}> {
  const octokit = new Octokit({ auth: token });

  const {
    status,
    role,
    repo,
    page = 1,
    pageSize = 30,
    type,
    search,
  } = filters || {};

  let login = "";
  const isMock = !token || token === process.env.GITHUB_CLIENT_SECRET;

  // Mock data for testing
  if (isMock) {
    login = "test";
    const mockIssues: IssuePR[] = [
      {
        owner: "test",
        repository: "github-issue-pr-dashboard",
        title: "Add search functionality to repository dropdown",
        labels: ["enhancement", "frontend"],
        status: "open",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
        type: "issue",
        html_url: "https://github.com/test/repo/issues/1",
        author: { login: "johndoe", html_url: "https://github.com/johndoe" },
        assignee: { login: "janedoe", html_url: "https://github.com/janedoe" },
      },
      {
        owner: "test",
        repository: "react-app",
        title: "Fix responsive layout on mobile devices",
        labels: ["bug", "mobile"],
        status: "open",
        createdAt: "2024-01-14T09:30:00Z",
        updatedAt: "2024-01-14T09:30:00Z",
        type: "issue",
        html_url: "https://github.com/test/repo/issues/2",
        author: { login: "alice", html_url: "https://github.com/alice" },
      },
      {
        owner: "test",
        repository: "node-api",
        title: "Implement authentication middleware",
        labels: ["feature", "backend"],
        status: "closed",
        createdAt: "2024-01-13T14:20:00Z",
        updatedAt: "2024-01-13T16:45:00Z",
        type: "pull_request",
        html_url: "https://github.com/test/repo/pull/3",
        author: { login: "bob", html_url: "https://github.com/bob" },
        assignee: { login: "charlie", html_url: "https://github.com/charlie" },
      },
      {
        owner: "test",
        repository: "vue-dashboard",
        title: "Update chart library to latest version",
        labels: ["maintenance", "dependencies"],
        status: "open",
        createdAt: "2024-01-12T11:15:00Z",
        updatedAt: "2024-01-12T11:15:00Z",
        type: "issue",
        html_url: "https://github.com/test/repo/issues/4",
        author: { login: "diana", html_url: "https://github.com/diana" },
      },
    ];

    // Apply filters
    let filteredIssues = mockIssues;
    if (repo && repo !== "all") {
      filteredIssues = filteredIssues.filter(
        (issue) => issue.repository === repo
      );
    }
    if (status && status !== "all") {
      filteredIssues = filteredIssues.filter(
        (issue) => issue.status === status
      );
    }
    if (type && type !== "all") {
      filteredIssues = filteredIssues.filter((issue) => issue.type === type);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredIssues = filteredIssues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchLower) ||
          issue.labels.some((label) =>
            label.toLowerCase().includes(searchLower)
          ) ||
          issue.repository.toLowerCase().includes(searchLower)
      );
    }

    // Simple pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedIssues = filteredIssues.slice(startIndex, endIndex);

    return {
      issues: paginatedIssues,
      pagination: {
        hasNext: endIndex < filteredIssues.length,
        hasPrev: page > 1,
        nextPage: endIndex < filteredIssues.length ? page + 1 : undefined,
        prevPage: page > 1 ? page - 1 : undefined,
      },
    };
  }

  // Real API
  const userResponse = await octokit.users.getAuthenticated();
  login = userResponse.data.login;

  let response;

  if (search || (repo && repo !== "all")) {
    // Use search API
    let q = "";
    if (search) {
      q += `${search} in:title,body,comments `;
    }
    if (role === "created") {
      q += "author:@me ";
    } else if (role === "assigned") {
      q += "assignee:@me ";
    }
    if (type === "pull_request") {
      q += "is:pr ";
    } else if (type === "issue") {
      q += "is:issue ";
    }
    if (status === "open") {
      q += "is:open ";
    } else if (status === "closed") {
      q += "is:closed ";
    }
    if (!repo || repo === "all") {
      q += `user:${login} `;
    } else {
      q += `repo:${login}/${repo} `;
    }
    response = await octokit.search.issuesAndPullRequests({
      q: q.trim(),
      per_page: pageSize,
      page,
    });
  } else {
    // Use list API for no repo filter
    let filter = "all";
    if (role === "created") filter = "created";
    else if (role === "assigned") filter = "assigned";

    let state = "all";
    if (status === "open") state = "open";
    else if (status === "closed") state = "closed";

    response = await octokit.issues.listForAuthenticatedUser({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter: filter as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state: state as any,
      per_page: pageSize,
      page,
    });
  }

  const data: GitHubIssue[] =
    search || (repo && repo !== "all")
      ? (response.data as { items: GitHubIssue[] }).items
      : (response.data as GitHubIssue[]);

  let issues = data.map((issue: GitHubIssue) => {
    let owner = login;
    if (issue.repository_url) {
      const parts = issue.repository_url.split('/');
      owner = parts[parts.length - 2];
    }
    const repoName =
      repo && repo !== "all"
        ? repo
        : issue.repository?.name ||
          (issue.repository_url
            ? issue.repository_url.split("/").pop()
            : "unknown") || "unknown";
    return {
      owner,
      repository: repoName,
      title: issue.title || "No title",
      labels: (issue.labels || []).map((label: string | { name?: string }) =>
        typeof label === "string" ? label : label.name || "unknown"
      ),
      status: issue.state || "unknown",
      createdAt: issue.created_at || "",
      updatedAt: issue.updated_at || "",
      type: (issue.pull_request ? "pull_request" : "issue") as
        | "issue"
        | "pull_request",
      html_url: issue.html_url || "",
      author: {
        login: issue.user?.login || "unknown",
        html_url: issue.user?.html_url || "",
      },
      assignee: issue.assignees && issue.assignees.length > 0 ? {
        login: issue.assignees[0].login || "unknown",
        html_url: issue.assignees[0].html_url || "",
      } : undefined,
    };
  });

  if (type && type !== "all") {
    issues = issues.filter((issue: IssuePR) => issue.type === type);
  }

  // Parse Link header for pagination
  const linkHeader = response.headers.link;
  let hasNext = false,
    hasPrev = false,
    nextPage,
    prevPage;

  if (linkHeader) {
    const links = linkHeader.split(",").map((link) => link.trim());
    links.forEach((link) => {
      const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
      if (match) {
        const url = match[1];
        const rel = match[2];
        const urlObj = new URL(url);
        const pageNum = parseInt(urlObj.searchParams.get("page") || "1");
        if (rel === "next") {
          hasNext = true;
          nextPage = pageNum;
        } else if (rel === "prev") {
          hasPrev = true;
          prevPage = pageNum;
        }
      }
    });
  }

  return { issues, pagination: { hasNext, hasPrev, nextPage, prevPage } };
}
