import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  filters: {
    status: string;
    role: string;
    repo: string;
    search: string;
    page: number;
    type: string;
    pageSize: number;
  };
  setFilters: (filters: {
    status: string;
    role: string;
    repo: string;
    search: string;
    page: number;
    type: string;
    pageSize: number;
  }) => void;
  repos: string[];
}

export default function FilterBar({
  filters,
  setFilters,
  repos,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border-b">
      <div className="mt-5">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues/PRs..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value, page: 1 })
            }
            className="pl-8 w-full md:w-[250px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 flex-1">
        <div className="flex flex-col">
          <label className="text-sm font-medium flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Status
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters({ ...filters, status: value, page: 1 })
            }
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
          <label className="text-sm font-medium flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Role
          </label>
          <Select
            value={filters.role}
            onValueChange={(value) =>
              setFilters({ ...filters, role: value, page: 1 })
            }
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
          <label className="text-sm font-medium flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Repository
          </label>
          <Combobox
            options={[
              { value: "all", label: "All" },
              ...repos.map((repo) => ({ value: repo, label: repo })),
            ]}
            value={filters.repo}
            onValueChange={(value) =>
              setFilters({ ...filters, repo: value, page: 1 })
            }
            placeholder="Repository"
            className="w-full md:w-[180px]"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Type
          </label>
          <Select
            value={filters.type}
            onValueChange={(value) =>
              setFilters({ ...filters, type: value, page: 1 })
            }
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
        <div className="flex flex-col">
          <label className="text-sm font-medium flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Page Size
          </label>
          <Select
            value={filters.pageSize.toString()}
            onValueChange={(value) =>
              setFilters({ ...filters, pageSize: parseInt(value), page: 1 })
            }
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Actions
          </label>
          <Button
            variant="outline"
            className="w-full md:w-[180px] px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base"
            onClick={() =>
              setFilters({
                status: "all",
                role: "all",
                repo: "all",
                search: "",
                page: 1,
                type: "all",
                pageSize: 30,
              })
            }
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
