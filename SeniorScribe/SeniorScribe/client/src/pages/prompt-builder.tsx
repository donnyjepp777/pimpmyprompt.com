import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PromptWizard } from "@/components/prompt/prompt-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Copy, Download, Save, Eye } from "lucide-react";

export default function PromptBuilder() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Load existing prompt if editing
  const { data: prompt, isLoading } = useQuery({
    queryKey: ["/api/prompts", id],
    enabled: !!id,
  });

  // Save prompt mutation
  const savePromptMutation = useMutation({
    mutationFn: async (promptData: any) => {
      if (id) {
        return await apiRequest("PUT", `/api/prompts/${id}`, promptData);
      } else {
        return await apiRequest("POST", "/api/prompts", promptData);
      }
    },
    onSuccess: (response) => {
      const data = response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({
        title: "Success",
        description: id ? "Prompt updated successfully" : "Prompt saved successfully",
      });
      if (!id) {
        setLocation(`/builder/${data.id}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save prompt",
        variant: "destructive",
      });
    },
  });

  const handleWizardComplete = (promptData: any) => {
    setGeneratedPrompt(promptData.content);
    savePromptMutation.mutate(promptData);
  };

  const handleSavePrompt = () => {
    if (!generatedPrompt) {
      toast({
        title: "Error",
        description: "No prompt content to save",
        variant: "destructive",
      });
      return;
    }

    savePromptMutation.mutate({
      title: "Custom Prompt",
      content: generatedPrompt,
      status: "complete",
    });
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    
    try {
      await navigator.clipboard.writeText(generatedPrompt);
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

  const handleDownloadPrompt = () => {
    if (!generatedPrompt) return;

    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header title="Prompt Builder" subtitle="Create comprehensive AI prompts" />
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-96 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-96 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={id ? "Edit Prompt" : "Prompt Builder"} 
          subtitle={id ? "Modify your existing prompt" : "Create comprehensive AI prompts"} 
        />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Wizard Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Prompt Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <PromptWizard 
                  initialData={prompt}
                  onComplete={handleWizardComplete}
                />
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Generated Prompt</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPrompt}
                      disabled={!generatedPrompt}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadPrompt}
                      disabled={!generatedPrompt}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSavePrompt}
                      disabled={!generatedPrompt || savePromptMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {generatedPrompt ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Ready to Use</Badge>
                      <Badge variant="outline">{generatedPrompt.length} characters</Badge>
                    </div>
                    <Textarea
                      value={generatedPrompt}
                      onChange={(e) => setGeneratedPrompt(e.target.value)}
                      className="min-h-96 font-mono text-sm"
                      placeholder="Your generated prompt will appear here..."
                    />
                  </div>
                ) : (
                  <div className="min-h-96 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">No preview yet</h4>
                      <p className="text-muted-foreground">Complete the wizard to generate your prompt</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
