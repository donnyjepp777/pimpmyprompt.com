import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";

interface PromptWizardProps {
  initialData?: any;
  onComplete: (data: any) => void;
}

const PROJECT_TYPES = [
  { id: "ecommerce", label: "E-commerce", icon: "🛒", description: "Online store with shopping cart" },
  { id: "blog", label: "Blog", icon: "📝", description: "Content publishing platform" },
  { id: "portfolio", label: "Portfolio", icon: "👤", description: "Personal or professional showcase" },
  { id: "dashboard", label: "Dashboard", icon: "📊", description: "Data visualization and analytics" },
  { id: "landing", label: "Landing Page", icon: "🚀", description: "Marketing or product page" },
  { id: "social", label: "Social Media", icon: "👥", description: "Community and social features" },
];

const FEATURES = [
  "User Authentication & Registration",
  "Payment Processing",
  "Real-time Notifications",
  "File Upload & Management",
  "Search & Filtering",
  "Data Visualization",
  "Email Integration",
  "Social Media Login",
  "Mobile Responsive Design",
  "Dark Mode Support",
  "Multi-language Support",
  "Role-based Access Control",
];

const TECH_STACKS = [
  "React",
  "Vue.js",
  "Angular",
  "Next.js",
  "Svelte",
  "Vanilla JavaScript",
  "Node.js",
  "Express",
  "Python/Django",
  "Python/Flask",
  "PHP/Laravel",
  "Ruby on Rails",
];

export function PromptWizard({ initialData, onComplete }: PromptWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectType: "",
    features: [] as string[],
    techStack: [] as string[],
    customRequirements: "",
    targetAudience: "",
    designStyle: "",
    additionalNotes: "",
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        projectType: initialData.projectType || "",
        features: initialData.features || [],
        techStack: initialData.techStack || [],
        customRequirements: initialData.metadata?.customRequirements || "",
        targetAudience: initialData.metadata?.targetAudience || "",
        designStyle: initialData.metadata?.designStyle || "",
        additionalNotes: initialData.metadata?.additionalNotes || "",
      });
    }
  }, [initialData]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const content = generatePrompt();
    const promptData = {
      title: formData.title,
      description: formData.description,
      content,
      projectType: formData.projectType,
      features: formData.features,
      techStack: formData.techStack,
      status: "complete",
      metadata: {
        customRequirements: formData.customRequirements,
        targetAudience: formData.targetAudience,
        designStyle: formData.designStyle,
        additionalNotes: formData.additionalNotes,
      },
    };
    onComplete(promptData);
  };

  const generatePrompt = () => {
    const selectedProjectType = PROJECT_TYPES.find(p => p.id === formData.projectType);
    
    return `# Web Application Development Request

## 🎯 Project Overview
Create a ${selectedProjectType?.label.toLowerCase() || 'web application'} that ${formData.description || 'meets the specified requirements'}.

## 👥 Target Audience
${formData.targetAudience || 'General users'}

## ⚡ Core Functionality

### Essential Features:
${formData.features.map(feature => `- ${feature}`).join('\n')}

### Additional Requirements:
${formData.customRequirements || 'No additional requirements specified'}

## 🎨 Design Requirements
**Design Style:** ${formData.designStyle || 'Modern and clean'}

## 🔧 Technical Specifications
**Preferred Technologies:** ${formData.techStack.join(', ') || 'Modern web technologies'}

## 📋 Implementation Guidelines
1. **Code Quality:** Write clean, well-commented, and maintainable code
2. **User Experience:** Prioritize intuitive navigation and clear user feedback
3. **Responsive Design:** Ensure the application works seamlessly across all device sizes
4. **Accessibility:** Include proper ARIA labels, keyboard navigation, and high contrast support
5. **Performance:** Optimize for fast loading times and smooth interactions
6. **Security:** Implement proper input validation and security best practices

## 🚀 Development Approach
Please create a fully functional ${selectedProjectType?.label.toLowerCase() || 'web application'} that addresses all the requirements above. Start with the core functionality and ensure it works perfectly before adding additional features.

${formData.additionalNotes ? `## 📝 Additional Notes\n${formData.additionalNotes}` : ''}

Focus on creating an intuitive user interface that matches the specified design requirements while maintaining excellent performance and accessibility standards.`;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.projectType;
      case 2:
        return formData.features.length > 0;
      case 3:
        return formData.techStack.length > 0;
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Modern E-commerce Platform"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Brief Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what you want to build..."
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-base font-medium">What type of web application do you want to build? *</Label>
              <RadioGroup
                value={formData.projectType}
                onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                className="grid grid-cols-2 gap-3 mt-3"
              >
                {PROJECT_TYPES.map((type) => (
                  <Label
                    key={type.id}
                    htmlFor={type.id}
                    className="relative cursor-pointer"
                  >
                    <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                    <div className={`border-2 rounded-lg p-4 text-center hover:bg-muted/50 transition-all ${
                      formData.projectType === type.id 
                        ? 'border-purple-500 bg-purple-500/5' 
                        : 'border-border'
                    }`}>
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <p className="font-medium">{type.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Key Features (Select all that apply) *</Label>
              <p className="text-sm text-muted-foreground mb-4">Choose the features you want in your application</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FEATURES.map((feature) => (
                  <Label
                    key={feature}
                    className="flex items-center space-x-3 p-3 bg-muted/50 border rounded-lg hover:border-purple-500/30 transition-all cursor-pointer"
                  >
                    <Checkbox
                      checked={formData.features.includes(feature)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            features: [...formData.features, feature],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            features: formData.features.filter((f) => f !== feature),
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{feature}</span>
                  </Label>
                ))}
              </div>
              {formData.features.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Selected features:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Technology Stack *</Label>
              <p className="text-sm text-muted-foreground mb-4">Select the technologies you prefer</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TECH_STACKS.map((tech) => (
                  <Label
                    key={tech}
                    className="flex items-center space-x-3 p-3 bg-muted/50 border rounded-lg hover:border-purple-500/30 transition-all cursor-pointer"
                  >
                    <Checkbox
                      checked={formData.techStack.includes(tech)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            techStack: [...formData.techStack, tech],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            techStack: formData.techStack.filter((t) => t !== tech),
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{tech}</span>
                  </Label>
                ))}
              </div>
              {formData.techStack.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Selected technologies:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="customRequirements">Custom Requirements</Label>
              <Textarea
                id="customRequirements"
                value={formData.customRequirements}
                onChange={(e) => setFormData({ ...formData, customRequirements: e.target.value })}
                placeholder="Any specific requirements or features not listed above..."
                className="mt-2"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g., Small business owners, Developers, Students"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="designStyle">Design Style</Label>
              <Input
                id="designStyle"
                value={formData.designStyle}
                onChange={(e) => setFormData({ ...formData, designStyle: e.target.value })}
                placeholder="e.g., Minimalist, Modern, Corporate, Creative"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Any other information that would help generate a better prompt..."
                className="mt-2"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={stepNumber} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-purple-500 text-white' 
                    : isCurrent 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {stepNumber === 1 && "Project Type"}
                  {stepNumber === 2 && "Features"}
                  {stepNumber === 3 && "Technology"}
                  {stepNumber === 4 && "Details"}
                </span>
                {stepNumber < totalSteps && (
                  <div className={`flex-1 h-px ${
                    stepNumber < currentStep ? 'bg-purple-500' : 'bg-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep} of {totalSteps}: {" "}
            {currentStep === 1 && "Project Information"}
            {currentStep === 2 && "Required Features"}
            {currentStep === 3 && "Technology & Requirements"}
            {currentStep === 4 && "Additional Details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
        >
          {currentStep === totalSteps ? "Generate Prompt" : "Continue"}
          {currentStep < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
