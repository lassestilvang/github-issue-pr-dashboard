import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface FilterBarProps {
  filters: {
    status: string;
    role: string;
    repo: string;
    search: string;
    page: number;
    type: string;
  };
  setFilters: (filters: {
    status: string;
    role: string;
    repo: string;
    search: string;
    page: number;
    type: string;
  }) => void;
  repos: string[];
}

export default function FilterBar({
  filters,
  setFilters,
  repos,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border-b md:flex-row md:items-center md:gap-4">
      <div className="relative mt-4.5">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search issues/PRs..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="pl-8 w-full md:w-[250px]"
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value, page: 1 })}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Role</label>
          <Select
            value={filters.role}
            onValueChange={(value) => setFilters({ ...filters, role: value, page: 1 })}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="created">Author</SelectItem>
              <SelectItem value="assignee">Assignee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Repository</label>
          <Select
            value={filters.repo}
            onValueChange={(value) => setFilters({ ...filters, repo: value, page: 1 })}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Repository" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {repos.map((repo) => (
                <SelectItem key={repo} value={repo}>
                  {repo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value, page: 1 })}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="issue">Issues</SelectItem>
              <SelectItem value="pull_request">Pull Requests</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-2 md:mt-4.5">
        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              status: "all",
              role: "all",
              repo: "all",
              search: "",
              page: 1,
              type: "all",
            })
          }
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
