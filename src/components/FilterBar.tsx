import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterBarProps {
  filters: { status: string; role: string; repo: string; search: string; page: number };
  setFilters: (filters: { status: string; role: string; repo: string; search: string; page: number }) => void;
  repos: string[];
}

export default function FilterBar({ filters, setFilters, repos }: FilterBarProps) {
  return (
    <div className="flex gap-4 items-center p-4 border-b">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search issues/PRs..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-8 w-[250px]"
        />
      </div>
      <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="created">Author</SelectItem>
          <SelectItem value="assignee">Assignee</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.repo} onValueChange={(value) => setFilters({ ...filters, repo: value })}>
        <SelectTrigger className="w-[180px]">
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
  );
}