"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { IssuePR } from "@/lib/github";

interface ApiResponse {
  issues: IssuePR[];
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    nextPage?: number;
    prevPage?: number;
  };
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [issues, setIssues] = useState<IssuePR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    role: "all",
    repo: "all",
    search: "",
    page: 1,
    type: "all",
    pageSize: 30,
  });
  const [allRepos, setAllRepos] = useState<string[]>([]);
  const [pagination, setPagination] = useState<{
    hasNext: boolean;
    hasPrev: boolean;
    nextPage?: number;
    prevPage?: number;
  }>({ hasNext: false, hasPrev: false });

  // Parse URL params on mount to restore filters
  useEffect(() => {
    const status = searchParams.get("status") || "all";
    const role = searchParams.get("role") || "all";
    const repo = searchParams.get("repo") || "all";
    const type = searchParams.get("type") || "all";
    setFilters((prev) => ({ ...prev, status, role, repo, type }));
  }, [searchParams]);

  // Update URL when filters change (excluding search and page)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.role !== "all") params.set("role", filters.role);
    if (filters.repo !== "all") params.set("repo", filters.repo);
    if (filters.type !== "all") params.set("type", filters.type);

    const query = params.toString();
    const newUrl = query ? `?${query}` : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [filters.status, filters.role, filters.repo, filters.type, router]);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.role !== "all") params.append("role", filters.role);
      if (filters.repo !== "all") params.append("repo", filters.repo);
      if (filters.type !== "all") params.append("type", filters.type);
      params.append("page", filters.page.toString());
      const response = await fetch(`/api/issues?${params}`);
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setIssues(data.issues);
        setPagination(data.pagination);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch issues");
      }
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      setError("Network error occurred while fetching issues");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchRepositories = useCallback(async () => {
    try {
      const response = await fetch("/api/repositories");
      if (response.ok) {
        const data = await response.json();
        setAllRepos(data.repositories);
      } else {
        console.error("Failed to fetch repositories");
      }
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return; // Still loading
    // Temporarily bypass authentication for testing
    // if (!session) {
    //   router.push("/login");
    // } else {
      fetchIssues();
      if (allRepos.length === 0) {
        fetchRepositories();
      }
    // }
  }, [session, status, router, filters, allRepos.length, fetchIssues, fetchRepositories]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) =>
      issue.title.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [issues, filters.search]);

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo(0, 0);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Temporarily bypass authentication for testing
  // if (!session) {
  //   return null; // Will redirect
  // }

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
          {filteredIssues.length > 0 && pagination.hasNext && (
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
