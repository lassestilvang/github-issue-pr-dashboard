"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback, useRef, Suspense } from "react";
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

function HomeContent() {
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
  const lastFetchedFilters = useRef<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearchUpdate = useCallback((searchValue: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchValue, page: 1 }));
    }, 300);
  }, []);

  // Parse URL params on mount to restore filters
  useEffect(() => {
    const status = searchParams.get("status") || "all";
    const role = searchParams.get("role") || "all";
    const repo = searchParams.get("repo") || "all";
    const type = searchParams.get("type") || "all";
    const search = searchParams.get("search") || "";
    const pageSize = parseInt(searchParams.get("pageSize") || "30");
    setFilters((prev) => ({ ...prev, status, role, repo, type, search, pageSize }));
  }, [searchParams]);

  // Update URL when filters change (excluding page)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.role !== "all") params.set("role", filters.role);
    if (filters.repo !== "all") params.set("repo", filters.repo);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.search) params.set("search", filters.search);
    if (filters.pageSize !== 30) params.set("pageSize", filters.pageSize.toString());

    const query = params.toString();
    const newUrl = query ? `?${query}` : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [filters.status, filters.role, filters.repo, filters.type, filters.search, filters.pageSize, router]);

  const fetchIssues = useCallback(async () => {
    const currentFiltersKey = JSON.stringify(filters);
    if (lastFetchedFilters.current === currentFiltersKey) {
      return;
    }
    lastFetchedFilters.current = currentFiltersKey;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.role !== "all") params.append("role", filters.role);
      if (filters.repo !== "all") params.append("repo", filters.repo);
      if (filters.type !== "all") params.append("type", filters.type);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page.toString());
      params.append("pageSize", filters.pageSize.toString());
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
    if (!session) {
      router.push("/login");
    } else {
      fetchIssues();
      if (allRepos.length === 0) {
        fetchRepositories();
      }
    }
  }, [session, status, router, filters, allRepos.length, fetchIssues, fetchRepositories]);


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

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen">
      <FilterBar filters={filters} setFilters={setFilters} debouncedSearchUpdate={debouncedSearchUpdate} repos={allRepos} />
      {error ? (
        <div className="container mx-auto p-4">
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          <Dashboard issues={issues} loading={loading} />
          {issues.length > 0 && pagination.hasNext && (
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
