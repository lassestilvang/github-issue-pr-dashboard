"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { IssuePR } from "@/lib/github";

interface ApiResponse {
  issues: IssuePR[];
  pagination: { hasNext: boolean; hasPrev: boolean; nextPage?: number; prevPage?: number };
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [issues, setIssues] = useState<IssuePR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ status: 'all', role: 'all', repo: 'all', search: '', page: 1, type: 'all' });
  const [allRepos, setAllRepos] = useState<string[]>([]);
  const [repos, setRepos] = useState<string[]>([]);
  const [pagination, setPagination] = useState<{ hasNext: boolean, hasPrev: boolean, nextPage?: number, prevPage?: number }>({ hasNext: false, hasPrev: false });

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/login");
    } else {
      fetchIssues();
      if (allRepos.length === 0) {
        fetchRepositories();
      }
    }
  }, [session, status, router, filters]);

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.role !== 'all') params.append('role', filters.role);
      if (filters.repo !== 'all') params.append('repo', filters.repo);
      if (filters.type !== 'all') params.append('type', filters.type);
      params.append('page', filters.page.toString());
      const response = await fetch(`/api/issues?${params}`);
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setIssues(data.issues);
        setPagination(data.pagination);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch issues');
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      setError('Network error occurred while fetching issues');
    } finally {
      setLoading(false);
    }
  };

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/repositories');
      if (response.ok) {
        const data = await response.json();
        setAllRepos(data.repositories);
      } else {
        console.error('Failed to fetch repositories');
      }
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    }
  };

  const filteredIssues = useMemo(() => {
    return issues.filter(issue =>
      issue.title.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [issues, filters.search]);

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen">
      <FilterBar filters={filters} setFilters={setFilters} repos={allRepos} />
      {error ? (
        <div className="container mx-auto p-4">
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
            ) : (
       <>
         <Dashboard issues={filteredIssues} loading={loading} />
         {(pagination.hasNext || pagination.hasPrev) && (
         <div className="flex justify-center items-center gap-4 p-4">
           <Button
             variant="outline"
             onClick={() => handlePageChange(pagination.prevPage || 1)}
             disabled={!pagination.hasPrev}
           >
             <ChevronLeft className="h-4 w-4" />
             Previous
           </Button>
           <span className="text-sm text-muted-foreground">
             Page {filters.page}
           </span>
           <Button
             variant="outline"
             onClick={() => handlePageChange(pagination.nextPage || 1)}
             disabled={!pagination.hasNext}
           >
             Next
             <ChevronRight className="h-4 w-4" />
           </Button>
         </div>
         )}
       </>
     )}
    </div>
  );
}
