import IssueCard from "./IssueCard";
import IssueCardSkeleton from "./IssueCardSkeleton";

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

interface DashboardProps {
  issues: IssuePR[];
  loading?: boolean;
}

export default function Dashboard({ issues, loading = false }: DashboardProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <IssueCardSkeleton key={index} />
            ))
          : issues.map((issue, index) => (
              <IssueCard key={index} issue={issue} />
            ))}
      </div>
    </div>
  );
}