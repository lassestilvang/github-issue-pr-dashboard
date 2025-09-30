import IssueCard from "./IssueCard";
import IssueCardSkeleton from "./IssueCardSkeleton";
import { IssuePR } from "@/lib/github";

interface DashboardProps {
  issues: IssuePR[];
  loading?: boolean;
}

export default function Dashboard({ issues, loading = false }: DashboardProps) {
  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <IssueCardSkeleton key={index} />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No issues or pull requests found. Try adjusting your filters or
            search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue, index) => (
            <IssueCard key={index} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
