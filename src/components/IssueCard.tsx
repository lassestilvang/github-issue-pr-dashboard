import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitPullRequest, FileText } from "lucide-react";

interface IssuePR {
  owner: string;
  repository: string;
  title: string;
  labels: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  type: 'issue' | 'pull_request';
  html_url: string;
  author: { login: string; html_url: string };
  assignee?: { login: string; html_url: string };
}

interface IssueCardProps {
  issue: IssuePR;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const isPR = issue.type === 'pull_request';

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <a
            href={`https://github.com/${issue.owner}/${issue.repository}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:underline"
          >
            {issue.repository}
          </a>
          <div className="flex items-center gap-2">
            {isPR ? <GitPullRequest className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            <Badge variant={issue.status === 'open' ? 'default' : 'secondary'}>
              {issue.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold hover:underline"
        >
          {issue.title}
        </a>
        <div className="flex flex-wrap gap-1 mt-2">
          {issue.labels.map((label, index) => (
            <Badge key={index} variant="outline">
              {label}
            </Badge>
          ))}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="pr-2 font-medium">Created:</td>
                <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="pr-2 font-medium">Updated:</td>
                <td>{new Date(issue.updatedAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="pr-2 font-medium">Author:</td>
                <td>
                  <a href={issue.author.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{issue.author.login}</a>
                </td>
              </tr>
              {issue.assignee && (
                <tr>
                  <td className="pr-2 font-medium">Assignee:</td>
                  <td>
                    <a href={issue.assignee.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{issue.assignee.login}</a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}