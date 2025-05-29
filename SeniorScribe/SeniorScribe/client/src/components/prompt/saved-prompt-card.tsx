import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { MoreHorizontal, Edit, Copy, Download, Trash2, Code, Calendar } from "lucide-react";

interface SavedPromptCardProps {
  prompt: {
    id: number;
    title: string;
    description?: string;
    content: string;
    projectType?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  viewMode?: "grid" | "list";
}

export function SavedPromptCard({ prompt, viewMode = "grid" }: SavedPromptCardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deletePromptMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/prompts/${prompt.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({
        title: "Success",
        description: "Prompt deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete prompt",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    setLocation(`/builder/${prompt.id}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast({
        title: "Copied",
        description: "Prompt copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy prompt",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prompt.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prompt.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
      deletePromptMutation.mutate();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500/10 text-green-500';
      case 'in_progress':
        return 'bg-orange-500/10 text-orange-500';
      case 'draft':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'in_progress':
        return 'In Progress';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  const getProjectTypeColor = (projectType?: string) => {
    const colors = {
      "ecommerce": "bg-purple-500/10 text-purple-500",
      "blog": "bg-green-500/10 text-green-500",
      "portfolio": "bg-blue-500/10 text-blue-500",
      "dashboard": "bg-orange-500/10 text-orange-500",
      "landing": "bg-pink-500/10 text-pink-500",
      "social": "bg-cyan-500/10 text-cyan-500",
    };
    return colors[projectType as keyof typeof colors] || "bg-gray-500/10 text-gray-500";
  };

  const getProjectTypeIcon = (projectType?: string) => {
    const icons = {
      "ecommerce": "🛒",
      "blog": "📝",
      "portfolio": "👤",
      "dashboard": "📊",
      "landing": "🚀",
      "social": "👥",
    };
    return icons[projectType as keyof typeof icons] || "📄";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getProjectTypeLabel = (projectType?: string) => {
    const labels = {
      "ecommerce": "E-commerce",
      "blog": "Blog",
      "portfolio": "Portfolio",
      "dashboard": "Dashboard",
      "landing": "Landing Page",
      "social": "Social Media",
    };
    return labels[projectType as keyof typeof labels] || projectType || "General";
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:border-purple-500/30 transition-all group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-xl">{getProjectTypeIcon(prompt.projectType)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">{prompt.title}</h3>
                {prompt.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{prompt.description}</p>
                )}
                <div className="flex items-center space-x-2 mb-2">
                  {prompt.projectType && (
                    <Badge variant="secondary" className={getProjectTypeColor(prompt.projectType)}>
                      {getProjectTypeLabel(prompt.projectType)}
                    </Badge>
                  )}
                  <Badge variant="secondary" className={getStatusColor(prompt.status)}>
                    {getStatusLabel(prompt.status)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Created {formatDate(prompt.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Code className="w-3 h-3" />
                    <span>{prompt.content.length} characters</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                onClick={handleEdit}
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
              >
                {prompt.status === 'complete' ? 'Use Prompt' : 'Continue'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Content
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:border-purple-500/30 transition-all group">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-lg">{getProjectTypeIcon(prompt.projectType)}</span>
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg truncate">{prompt.title}</CardTitle>
              <p className="text-xs text-muted-foreground">Created {formatDate(prompt.createdAt)}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {prompt.description && (
          <CardDescription className="line-clamp-2">
            {prompt.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Preview */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground font-mono leading-relaxed line-clamp-3">
              {prompt.content || "No content available"}
            </p>
          </div>
          
          {/* Badges and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {prompt.projectType && (
                <Badge variant="secondary" className={getProjectTypeColor(prompt.projectType)}>
                  {getProjectTypeLabel(prompt.projectType)}
                </Badge>
              )}
              <Badge variant="secondary" className={getStatusColor(prompt.status)}>
                {getStatusLabel(prompt.status)}
              </Badge>
            </div>
            <Button 
              onClick={handleEdit}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
            >
              {prompt.status === 'complete' ? 'Use Prompt' : 'Continue'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
