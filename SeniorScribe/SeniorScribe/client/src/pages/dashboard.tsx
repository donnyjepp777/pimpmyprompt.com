import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { SavedPromptCard } from "@/components/prompt/saved-prompt-card";
import { Link } from "wouter";
import { Plus, LayoutTemplate, Upload, History, ArrowRight, Edit, ChartBar, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: prompts, isLoading: promptsLoading } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["/api/activity"],
  });

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const recentPrompts = prompts?.slice(0, 3) || [];
  const popularTemplates = templates?.slice(0, 3) || [];
  const recentActivity = activity?.slice(0, 3) || [];

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <Plus className="w-4 h-4 text-purple-500" />;
      case 'modified':
        return <Edit className="w-4 h-4 text-purple-500" />;
      case 'deleted':
        return <History className="w-4 h-4 text-red-500" />;
      default:
        return <History className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" subtitle="Create comprehensive prompts for your AI code editor" />
        
        <div className="flex-1 overflow-auto p-6">
          {/* Quick Actions */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/builder">
                <Card className="cursor-pointer hover:border-purple-500/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <Plus className="w-6 h-6 text-purple-500" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">New Prompt</h3>
                    <p className="text-sm text-muted-foreground">Start building a new AI prompt from scratch</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/templates">
                <Card className="cursor-pointer hover:border-purple-500/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                        <LayoutTemplate className="w-6 h-6 text-green-500" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Use LayoutTemplate</h3>
                    <p className="text-sm text-muted-foreground">Choose from pre-built prompt templates</p>
                  </CardContent>
                </Card>
              </Link>

              <Card className="cursor-pointer hover:border-purple-500/30 transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      <Upload className="w-6 h-6 text-orange-500" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Import Project</h3>
                  <p className="text-sm text-muted-foreground">Upload reference files for context</p>
                </CardContent>
              </Card>

              <Link href="/prompts">
                <Card className="cursor-pointer hover:border-purple-500/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <History className="w-6 h-6 text-blue-500" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Recent Prompts</h3>
                    <p className="text-sm text-muted-foreground">Continue working on previous prompts</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Prompts */}
            <div className="xl:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Your Recent Prompts</h3>
                <Link href="/prompts">
                  <Button variant="ghost" className="text-purple-500 hover:text-purple-600">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promptsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2 mb-4" />
                        <Skeleton className="h-20 w-full mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : recentPrompts.length > 0 ? (
                  recentPrompts.map((prompt: any) => (
                    <SavedPromptCard key={prompt.id} prompt={prompt} />
                  ))
                ) : (
                  <Card className="col-span-full">
                    <CardContent className="p-12 text-center">
                      <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">No prompts yet</h4>
                      <p className="text-muted-foreground mb-4">Start by creating your first prompt</p>
                      <Link href="/builder">
                        <Button>Create New Prompt</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-3/4 mb-1" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity: any) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                            {getActivityIcon(activity.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </CardContent>
              </Card>

              {/* Popular Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  {templatesLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <Skeleton className="h-4 w-3/4 mb-1" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : popularTemplates.length > 0 ? (
                    <div className="space-y-3">
                      {popularTemplates.map((template: any) => (
                        <div key={template.id} className="p-3 bg-muted/50 border rounded-lg hover:border-purple-500/30 transition-all cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{template.name}</p>
                              <p className="text-xs text-muted-foreground">Used {template.usageCount} times</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No templates available</p>
                  )}
                </CardContent>
              </Card>

              {/* Your Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                      ))}
                    </div>
                  ) : stats ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Prompts Created</span>
                        <span className="text-lg font-semibold">{stats.promptsCreated}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Templates Used</span>
                        <span className="text-lg font-semibold">{stats.templatesUsed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Completion</span>
                        <span className="text-lg font-semibold text-green-500">{stats.averageCompletionTime}min</span>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
