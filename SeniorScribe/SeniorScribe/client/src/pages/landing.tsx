import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Zap, Shield, Users } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PromptCraft</h1>
              <p className="text-sm text-muted-foreground">AI Prompt Builder</p>
            </div>
          </div>
          <Button onClick={handleLogin} className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Prompt Engineering
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Craft Perfect Prompts for Your AI Code Editor
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Transform your ideas into comprehensive, detailed prompts that help AI code editors build exactly what you envision. 
          No technical expertise required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleLogin} size="lg" className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
            Start Building Prompts
          </Button>
          <Button variant="outline" size="lg">
            View Templates
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground">
            Professional tools to create comprehensive AI prompts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle>Guided Wizard</CardTitle>
              <CardDescription>
                Step-by-step questionnaire that guides you through creating comprehensive prompts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>
                Pre-built templates for common web applications like e-commerce, blogs, and dashboards
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle>Real-time Preview</CardTitle>
              <CardDescription>
                See your prompt being built in real-time with optimization suggestions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle>User Profiles</CardTitle>
              <CardDescription>
                Save your prompts, track analytics, and manage your prompt library
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-pink-500" />
              </div>
              <CardTitle>Smart Optimization</CardTitle>
              <CardDescription>
                AI-powered suggestions to improve your prompts for better results
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-500" />
              </div>
              <CardTitle>Export & Share</CardTitle>
              <CardDescription>
                Export your prompts in multiple formats and share with your team
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="text-center p-12 bg-gradient-to-r from-purple-500/10 to-purple-700/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Ready to Start Building?</CardTitle>
            <CardDescription className="text-lg mb-8">
              Join thousands of developers who are creating better AI prompts with PromptCraft
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} size="lg" className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
              Get Started for Free
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 PromptCraft. Built for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
}
