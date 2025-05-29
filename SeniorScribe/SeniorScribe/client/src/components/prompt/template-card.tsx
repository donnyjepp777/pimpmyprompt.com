import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { TrendingUp, Eye } from "lucide-react";

interface TemplateCardProps {
  template: {
    id: number;
    name: string;
    description: string;
    category: string;
    content: string;
    tags: string[];
    usageCount: number;
  };
  viewMode?: "grid" | "list";
}

export function TemplateCard({ template, viewMode = "grid" }: TemplateCardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useTemplateMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/templates/${template.id}/use`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      // Navigate to prompt builder with template data
      setLocation(`/builder?template=${template.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to use template",
        variant: "destructive",
      });
    },
  });

  const handleUseTemplate = () => {
    useTemplateMutation.mutate();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "E-commerce": "bg-purple-500/10 text-purple-500",
      "Blog": "bg-green-500/10 text-green-500",
      "Portfolio": "bg-blue-500/10 text-blue-500",
      "Dashboard": "bg-orange-500/10 text-orange-500",
      "Landing": "bg-pink-500/10 text-pink-500",
      "Social": "bg-cyan-500/10 text-cyan-500",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500/10 text-gray-500";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      "E-commerce": "🛒",
      "Blog": "📝",
      "Portfolio": "👤",
      "Dashboard": "📊",
      "Landing": "🚀",
      "Social": "👥",
    };
    return icons[category as keyof typeof icons] || "📄";
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:border-purple-500/30 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-xl">{getCategoryIcon(template.category)}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>Used {template.usageCount} times</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleUseTemplate}
                disabled={useTemplateMutation.isPending}
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
              >
                {useTemplateMutation.isPending ? "Using..." : "Use Template"}
              </Button>
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-xl">{getCategoryIcon(template.category)}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{template.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Usage Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>Used {template.usageCount} times</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleUseTemplate}
              disabled={useTemplateMutation.isPending}
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
            >
              {useTemplateMutation.isPending ? "Using..." : "Use Template"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
