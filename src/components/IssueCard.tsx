import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitPullRequest, FileText } from "lucide-react";

interface IssuePR {
  repository: string;
  title: string;
  labels: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  type: 'issue' | 'pull_request';
  html_url: string;
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
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {issue.repository}
          </CardTitle>
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
          <p>Created: {new Date(issue.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}