import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SavedPromptCard } from "@/components/prompt/saved-prompt-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Search, Plus, Filter, Grid, List } from "lucide-react";

export default function MyPrompts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["/api/prompts", searchQuery ? { search: searchQuery } : undefined],
  });

  const statuses = prompts ? [...new Set(prompts.map((p: any) => p.status))] : [];

  const filteredPrompts = prompts?.filter((prompt: any) => {
    const matchesStatus = !statusFilter || prompt.status === statusFilter;
    return matchesStatus;
  }) || [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="My Prompts" subtitle="Manage your saved prompts" />
        
        <div className="flex-1 overflow-auto p-6">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search your prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/builder">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Prompt
                  </Button>
                </Link>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                All Status
              </Button>
              {statuses.map((status: string) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "draft" ? "Draft" : status === "complete" ? "Complete" : "In Progress"}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${filteredPrompts.length} prompt${filteredPrompts.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Prompts Grid */}
          {isLoading ? (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="w-6 h-6" />
                  </div>
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPrompts.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {filteredPrompts.map((prompt: any) => (
                <SavedPromptCard key={prompt.id} prompt={prompt} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">No prompts found</h4>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter ? "Try adjusting your search criteria" : "Start by creating your first prompt"}
              </p>
              <div className="space-x-2">
                {searchQuery || statusFilter ? (
                  <Button onClick={() => { setSearchQuery(""); setStatusFilter(null); }}>
                    Clear Filters
                  </Button>
                ) : null}
                <Link href="/builder">
                  <Button variant={searchQuery || statusFilter ? "outline" : "default"}>
                    Create New Prompt
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
