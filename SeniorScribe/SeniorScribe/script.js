// Global State Management
class AppState {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'landing';
        this.savedPrompts = this.loadFromStorage('savedPrompts') || [];
        this.wizardData = {
            currentStep: 1,
            totalSteps: 4,
            formData: {
                title: '',
                description: '',
                projectType: '',
                features: [],
                techStack: [],
                customRequirements: '',
                targetAudience: '',
                designStyle: '',
                additionalNotes: ''
            }
        };
        this.templates = this.getDefaultTemplates();
    }

    // Local Storage Management
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return null;
        }
    }

    // Default Templates
    getDefaultTemplates() {
        return [
            {
                id: 1,
                name: 'E-commerce Platform',
                description: 'Complete online store with shopping cart, payments, and user accounts',
                category: 'E-commerce',
                icon: '🛒',
                features: ['User Authentication & Registration', 'Payment Processing', 'Shopping Cart', 'Product Catalog', 'Order Management'],
                techStack: ['React', 'Node.js', 'Express', 'Payment Gateway'],
                usageCount: 142
            },
            {
                id: 2,
                name: 'Blog & Content Platform',
                description: 'Modern blog with CMS, comments, and content management',
                category: 'Blog',
                icon: '📝',
                features: ['Content Management', 'User Comments', 'Search & Filtering', 'SEO Optimization', 'Social Sharing'],
                techStack: ['React', 'Next.js', 'Headless CMS', 'Database'],
                usageCount: 98
            },
            {
                id: 3,
                name: 'Portfolio Website',
                description: 'Professional portfolio showcase with project galleries',
                category: 'Portfolio',
                icon: '👤',
                features: ['Project Gallery', 'Contact Form', 'About Section', 'Resume Download', 'Responsive Design'],
                techStack: ['React', 'CSS Grid', 'Animation Library', 'Contact API'],
                usageCount: 76
            },
            {
                id: 4,
                name: 'Analytics Dashboard',
                description: 'Data visualization dashboard with charts and real-time updates',
                category: 'Dashboard',
                icon: '📊',
                features: ['Data Visualization', 'Real-time Updates', 'User Permissions', 'Export Data', 'Custom Reports'],
                techStack: ['React', 'Chart.js', 'WebSockets', 'Database', 'API Integration'],
                usageCount: 134
            },
            {
                id: 5,
                name: 'Landing Page',
                description: 'High-converting landing page with lead capture',
                category: 'Landing',
                icon: '🚀',
                features: ['Lead Capture', 'Email Integration', 'A/B Testing', 'Analytics', 'Mobile Responsive'],
                techStack: ['HTML', 'CSS', 'JavaScript', 'Email Service', 'Analytics'],
                usageCount: 89
            },
            {
                id: 6,
                name: 'Social Platform',
                description: 'Social networking platform with user interactions',
                category: 'Social',
                icon: '👥',
                features: ['User Profiles', 'Social Feed', 'Messaging', 'Notifications', 'Content Sharing'],
                techStack: ['React', 'Node.js', 'WebSockets', 'Database', 'Real-time'],
                usageCount: 67
            }
        ];
    }
}

// Initialize app state
const appState = new AppState();

// Project Types Configuration
const PROJECT_TYPES = [
    { id: 'ecommerce', label: 'E-commerce', icon: '🛒', description: 'Online store with shopping cart' },
    { id: 'blog', label: 'Blog', icon: '📝', description: 'Content publishing platform' },
    { id: 'portfolio', label: 'Portfolio', icon: '👤', description: 'Personal or professional showcase' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Data visualization and analytics' },
    { id: 'landing', label: 'Landing Page', icon: '🚀', description: 'Marketing or product page' },
    { id: 'social', label: 'Social Media', icon: '👥', description: 'Community and social features' }
];

const FEATURES = [
    'User Authentication & Registration',
    'Payment Processing',
    'Real-time Notifications',
    'File Upload & Management',
    'Search & Filtering',
    'Data Visualization',
    'Email Integration',
    'Social Media Login',
    'Mobile Responsive Design',
    'Dark Mode Support',
    'Multi-language Support',
    'Role-based Access Control',
    'Shopping Cart',
    'Product Catalog',
    'Order Management',
    'Content Management',
    'User Comments',
    'SEO Optimization',
    'Social Sharing',
    'Contact Forms',
    'Analytics & Tracking',
    'Custom Reports',
    'Export Data',
    'A/B Testing',
    'Lead Capture'
];

const TECH_STACKS = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'Vanilla JavaScript',
    'Node.js', 'Express', 'Python/Django', 'Python/Flask', 'PHP/Laravel',
    'Ruby on Rails', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase',
    'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Chart.js', 'D3.js',
    'WebSockets', 'REST API', 'GraphQL', 'AWS', 'Vercel', 'Netlify'
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Check if user is already authenticated
    const savedUser = appState.loadFromStorage('currentUser');
    if (savedUser) {
        appState.currentUser = savedUser;
        showDashboard();
    } else {
        showLanding();
    }
    
    // Load initial data
    loadRecentPrompts();
    loadSavedPrompts();
    loadTemplates();
});

// Navigation Functions
function showLanding() {
    hideAllPages();
    document.getElementById('landing-page').classList.remove('hidden');
    appState.currentPage = 'landing';
}

function showDashboard() {
    if (!appState.currentUser) {
        showAuthModal();
        return;
    }
    hideAllPages();
    document.getElementById('dashboard-page').classList.remove('hidden');
    appState.currentPage = 'dashboard';
    updateNavigation();
    loadRecentPrompts();
}

function showPromptBuilder() {
    if (!appState.currentUser) {
        showAuthModal();
        return;
    }
    hideAllPages();
    document.getElementById('prompt-builder-page').classList.remove('hidden');
    appState.currentPage = 'prompt-builder';
    initializeWizard();
}

function showMyPrompts() {
    if (!appState.currentUser) {
        showAuthModal();
        return;
    }
    hideAllPages();
    document.getElementById('my-prompts-page').classList.remove('hidden');
    appState.currentPage = 'my-prompts';
    updateNavigation();
    loadSavedPrompts();
}

function showTemplates() {
    if (!appState.currentUser) {
        showAuthModal();
        return;
    }
    hideAllPages();
    document.getElementById('templates-page').classList.remove('hidden');
    appState.currentPage = 'templates';
    updateNavigation();
    loadTemplates();
}

function showSettings() {
    if (!appState.currentUser) {
        showAuthModal();
        return;
    }
    // Settings functionality can be implemented here
    showToast('Settings page coming soon!', 'info');
}

function hideAllPages() {
    const pages = ['landing-page', 'dashboard-page', 'prompt-builder-page', 'my-prompts-page', 'templates-page'];
    pages.forEach(pageId => {
        document.getElementById(pageId).classList.add('hidden');
    });
}

function updateNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const currentPageMap = {
        'dashboard': 0,
        'prompt-builder': 1,
        'my-prompts': 2,
        'templates': 3,
        'settings': 4
    };
    
    const activeIndex = currentPageMap[appState.currentPage];
    if (activeIndex !== undefined && navItems[activeIndex]) {
        navItems[activeIndex].classList.add('active');
    }
}

function goBack() {
    const previousPage = sessionStorage.getItem('previousPage') || 'dashboard';
    if (previousPage === 'dashboard') {
        showDashboard();
    } else if (previousPage === 'my-prompts') {
        showMyPrompts();
    } else if (previousPage === 'templates') {
        showTemplates();
    } else {
        showDashboard();
    }
}

// Authentication
function showAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function authenticateUser() {
    const userName = document.getElementById('user-name').value.trim();
    if (!userName) {
        showToast('Please enter your name', 'error');
        return;
    }
    
    appState.currentUser = {
        name: userName,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    
    appState.saveToStorage('currentUser', appState.currentUser);
    hideAuthModal();
    showDashboard();
    showToast(`Welcome, ${userName}!`, 'success');
}

function startPromptBuilder() {
    if (!appState.currentUser) {
        showAuthModal();
    } else {
        sessionStorage.setItem('previousPage', appState.currentPage);
        showPromptBuilder();
    }
}

// Wizard Functions
function initializeWizard() {
    appState.wizardData.currentStep = 1;
    appState.wizardData.formData = {
        title: '',
        description: '',
        projectType: '',
        features: [],
        techStack: [],
        customRequirements: '',
        targetAudience: '',
        designStyle: '',
        additionalNotes: ''
    };
    
    updateWizardStep();
    updateProgress();
    clearPromptPreview();
}

function updateWizardStep() {
    const currentStep = appState.wizardData.currentStep;
    const wizardContent = document.getElementById('wizard-content');
    
    wizardContent.innerHTML = generateStepHTML(currentStep);
    
    // Update step indicator
    document.getElementById('current-step').textContent = currentStep;
    document.getElementById('total-steps').textContent = appState.wizardData.totalSteps;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentStep === 1;
    nextBtn.textContent = currentStep === appState.wizardData.totalSteps ? 'Generate Prompt' : 'Next';
    
    // Reinitialize Lucide icons for new content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Restore form data
    restoreFormData();
}

function generateStepHTML(step) {
    switch (step) {
        case 1:
            return generateStep1HTML();
        case 2:
            return generateStep2HTML();
        case 3:
            return generateStep3HTML();
        case 4:
            return generateStep4HTML();
        default:
            return '<p>Invalid step</p>';
    }
}

function generateStep1HTML() {
    return `
        <div class="form-group">
            <label class="form-label">Project Title *</label>
            <input type="text" id="project-title" class="form-input" 
                   placeholder="e.g., Modern E-commerce Platform" 
                   value="${appState.wizardData.formData.title}">
        </div>
        
        <div class="form-group">
            <label class="form-label">Brief Description</label>
            <textarea id="project-description" class="form-textarea" 
                      placeholder="Describe what you want to build...">${appState.wizardData.formData.description}</textarea>
        </div>
        
        <div class="form-group">
            <label class="form-label">What type of web application do you want to build? *</label>
            <div class="project-type-grid">
                ${PROJECT_TYPES.map(type => `
                    <div class="project-type-option ${appState.wizardData.formData.projectType === type.id ? 'selected' : ''}" 
                         onclick="selectProjectType('${type.id}')">
                        <div class="project-type-icon">${type.icon}</div>
                        <h4>${type.label}</h4>
                        <p>${type.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateStep2HTML() {
    return `
        <div class="form-group">
            <label class="form-label">Key Features (Select all that apply) *</label>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem;">
                Choose the features you want in your application
            </p>
            <div class="features-grid">
                ${FEATURES.map(feature => `
                    <div class="feature-option ${appState.wizardData.formData.features.includes(feature) ? 'selected' : ''}" 
                         onclick="toggleFeature('${feature}')">
                        <div class="checkbox ${appState.wizardData.formData.features.includes(feature) ? 'checked' : ''}"></div>
                        <span>${feature}</span>
                    </div>
                `).join('')}
            </div>
            ${appState.wizardData.formData.features.length > 0 ? `
                <div class="selected-items">
                    <p>Selected features:</p>
                    <div class="selected-badges">
                        ${appState.wizardData.formData.features.map(feature => `
                            <span class="badge badge-primary">${feature}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function generateStep3HTML() {
    return `
        <div class="form-group">
            <label class="form-label">Technology Stack *</label>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem;">
                Select the technologies you prefer
            </p>
            <div class="tech-grid">
                ${TECH_STACKS.map(tech => `
                    <div class="tech-option ${appState.wizardData.formData.techStack.includes(tech) ? 'selected' : ''}" 
                         onclick="toggleTech('${tech}')">
                        <div class="checkbox ${appState.wizardData.formData.techStack.includes(tech) ? 'checked' : ''}"></div>
                        <span>${tech}</span>
                    </div>
                `).join('')}
            </div>
            ${appState.wizardData.formData.techStack.length > 0 ? `
                <div class="selected-items">
                    <p>Selected technologies:</p>
                    <div class="selected-badges">
                        ${appState.wizardData.formData.techStack.map(tech => `
                            <span class="badge badge-primary">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
        
        <div class="form-group">
            <label class="form-label">Custom Requirements</label>
            <textarea id="custom-requirements" class="form-textarea" 
                      placeholder="Any specific requirements or features not listed above...">${appState.wizardData.formData.customRequirements}</textarea>
        </div>
    `;
}

function generateStep4HTML() {
    return `
        <div class="form-group">
            <label class="form-label">Target Audience</label>
            <input type="text" id="target-audience" class="form-input" 
                   placeholder="e.g., Small business owners, Developers, Students"
                   value="${appState.wizardData.formData.targetAudience}">
        </div>
        
        <div class="form-group">
            <label class="form-label">Design Style</label>
            <input type="text" id="design-style" class="form-input" 
                   placeholder="e.g., Minimalist, Modern, Corporate, Creative"
                   value="${appState.wizardData.formData.designStyle}">
        </div>
        
        <div class="form-group">
            <label class="form-label">Additional Notes</label>
            <textarea id="additional-notes" class="form-textarea" 
                      placeholder="Any other information that would help generate a better prompt...">${appState.wizardData.formData.additionalNotes}</textarea>
        </div>
    `;
}

function restoreFormData() {
    // Restore form values based on current step
    const currentStep = appState.wizardData.currentStep;
    
    if (currentStep === 1) {
        const titleInput = document.getElementById('project-title');
        const descInput = document.getElementById('project-description');
        if (titleInput) titleInput.value = appState.wizardData.formData.title;
        if (descInput) descInput.value = appState.wizardData.formData.description;
    } else if (currentStep === 3) {
        const reqInput = document.getElementById('custom-requirements');
        if (reqInput) reqInput.value = appState.wizardData.formData.customRequirements;
    } else if (currentStep === 4) {
        const audienceInput = document.getElementById('target-audience');
        const styleInput = document.getElementById('design-style');
        const notesInput = document.getElementById('additional-notes');
        if (audienceInput) audienceInput.value = appState.wizardData.formData.targetAudience;
        if (styleInput) styleInput.value = appState.wizardData.formData.designStyle;
        if (notesInput) notesInput.value = appState.wizardData.formData.additionalNotes;
    }
}

function saveCurrentStepData() {
    const currentStep = appState.wizardData.currentStep;
    
    if (currentStep === 1) {
        const title = document.getElementById('project-title')?.value || '';
        const description = document.getElementById('project-description')?.value || '';
        appState.wizardData.formData.title = title;
        appState.wizardData.formData.description = description;
    } else if (currentStep === 3) {
        const requirements = document.getElementById('custom-requirements')?.value || '';
        appState.wizardData.formData.customRequirements = requirements;
    } else if (currentStep === 4) {
        const audience = document.getElementById('target-audience')?.value || '';
        const style = document.getElementById('design-style')?.value || '';
        const notes = document.getElementById('additional-notes')?.value || '';
        appState.wizardData.formData.targetAudience = audience;
        appState.wizardData.formData.designStyle = style;
        appState.wizardData.formData.additionalNotes = notes;
    }
}

function selectProjectType(typeId) {
    appState.wizardData.formData.projectType = typeId;
    updateWizardStep(); // Refresh to show selection
}

function toggleFeature(feature) {
    const features = appState.wizardData.formData.features;
    const index = features.indexOf(feature);
    if (index > -1) {
        features.splice(index, 1);
    } else {
        features.push(feature);
    }
    updateWizardStep(); // Refresh to show selection
}

function toggleTech(tech) {
    const techStack = appState.wizardData.formData.techStack;
    const index = techStack.indexOf(tech);
    if (index > -1) {
        techStack.splice(index, 1);
    } else {
        techStack.push(tech);
    }
    updateWizardStep(); // Refresh to show selection
}

function nextStep() {
    saveCurrentStepData();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    if (appState.wizardData.currentStep < appState.wizardData.totalSteps) {
        appState.wizardData.currentStep++;
        updateWizardStep();
        updateProgress();
    } else {
        generatePrompt();
    }
}

function previousStep() {
    saveCurrentStepData();
    
    if (appState.wizardData.currentStep > 1) {
        appState.wizardData.currentStep--;
        updateWizardStep();
        updateProgress();
    }
}

function validateCurrentStep() {
    const currentStep = appState.wizardData.currentStep;
    const formData = appState.wizardData.formData;
    
    switch (currentStep) {
        case 1:
            if (!formData.title.trim()) {
                showToast('Please enter a project title', 'error');
                return false;
            }
            if (!formData.projectType) {
                showToast('Please select a project type', 'error');
                return false;
            }
            break;
        case 2:
            if (formData.features.length === 0) {
                showToast('Please select at least one feature', 'error');
                return false;
            }
            break;
        case 3:
            if (formData.techStack.length === 0) {
                showToast('Please select at least one technology', 'error');
                return false;
            }
            break;
        case 4:
            // Optional step, no validation required
            break;
    }
    
    return true;
}

function updateProgress() {
    const progress = (appState.wizardData.currentStep / appState.wizardData.totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function generatePrompt() {
    const formData = appState.wizardData.formData;
    const selectedProjectType = PROJECT_TYPES.find(p => p.id === formData.projectType);
    
    const prompt = `# Web Application Development Request

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

    showPromptPreview(prompt);
    enablePromptActions();
    showToast('Prompt generated successfully!', 'success');
}

function showPromptPreview(prompt) {
    const previewElement = document.getElementById('prompt-preview');
    previewElement.innerHTML = `<pre style="white-space: pre-wrap; word-break: break-word;">${prompt}</pre>`;
    appState.generatedPrompt = prompt;
}

function clearPromptPreview() {
    const previewElement = document.getElementById('prompt-preview');
    previewElement.innerHTML = `
        <div class="preview-placeholder">
            <i data-lucide="eye"></i>
            <h3>No preview yet</h3>
            <p>Complete the wizard to generate your prompt</p>
        </div>
    `;
    appState.generatedPrompt = null;
    disablePromptActions();
}

function enablePromptActions() {
    document.getElementById('copy-btn').disabled = false;
    document.getElementById('download-btn').disabled = false;
    document.getElementById('save-btn').disabled = false;
}

function disablePromptActions() {
    document.getElementById('copy-btn').disabled = true;
    document.getElementById('download-btn').disabled = true;
    document.getElementById('save-btn').disabled = false; // Keep save enabled for drafts
}

function copyPrompt() {
    if (!appState.generatedPrompt) {
        showToast('No prompt to copy', 'error');
        return;
    }
    
    navigator.clipboard.writeText(appState.generatedPrompt).then(() => {
        showToast('Prompt copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy prompt', 'error');
    });
}

function downloadPrompt() {
    if (!appState.generatedPrompt) {
        showToast('No prompt to download', 'error');
        return;
    }
    
    const blob = new Blob([appState.generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appState.wizardData.formData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'prompt'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Prompt downloaded!', 'success');
}

function savePrompt() {
    if (!appState.currentUser) {
        showToast('Please log in to save prompts', 'error');
        return;
    }
    
    saveCurrentStepData();
    
    const promptData = {
        id: Date.now().toString(),
        userId: appState.currentUser.id,
        title: appState.wizardData.formData.title || 'Untitled Prompt',
        description: appState.wizardData.formData.description,
        content: appState.generatedPrompt || '',
        projectType: appState.wizardData.formData.projectType,
        features: appState.wizardData.formData.features,
        techStack: appState.wizardData.formData.techStack,
        status: appState.generatedPrompt ? 'complete' : 'draft',
        metadata: {
            customRequirements: appState.wizardData.formData.customRequirements,
            targetAudience: appState.wizardData.formData.targetAudience,
            designStyle: appState.wizardData.formData.designStyle,
            additionalNotes: appState.wizardData.formData.additionalNotes
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    appState.savedPrompts.push(promptData);
    appState.saveToStorage('savedPrompts', appState.savedPrompts);
    
    showToast('Prompt saved successfully!', 'success');
}

// Data Loading Functions
function loadRecentPrompts() {
    const recentPromptsContainer = document.getElementById('recent-prompts');
    if (!recentPromptsContainer) return;
    
    const recentPrompts = appState.savedPrompts
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);
    
    if (recentPrompts.length === 0) {
        recentPromptsContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="plus"></i>
                <h3>No prompts yet</h3>
                <p>Start by creating your first prompt</p>
                <button class="btn btn-primary" onclick="showPromptBuilder()">Create New Prompt</button>
            </div>
        `;
    } else {
        recentPromptsContainer.innerHTML = recentPrompts.map(prompt => generatePromptCardHTML(prompt)).join('');
    }
    
    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function loadSavedPrompts() {
    const savedPromptsContainer = document.getElementById('saved-prompts');
    if (!savedPromptsContainer) return;
    
    const filteredPrompts = filterPromptsBySearch(appState.savedPrompts);
    
    if (filteredPrompts.length === 0) {
        savedPromptsContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="folder"></i>
                <h3>No prompts found</h3>
                <p>Start by creating your first prompt or adjust your search</p>
                <button class="btn btn-primary" onclick="showPromptBuilder()">Create New Prompt</button>
            </div>
        `;
    } else {
        savedPromptsContainer.innerHTML = filteredPrompts.map(prompt => generatePromptCardHTML(prompt)).join('');
    }
    
    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function loadTemplates() {
    const templatesContainer = document.getElementById('templates-grid');
    if (!templatesContainer) return;
    
    const filteredTemplates = filterTemplatesBySearch(appState.templates);
    
    if (filteredTemplates.length === 0) {
        templatesContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="layout-template"></i>
                <h3>No templates found</h3>
                <p>Adjust your search to find templates</p>
            </div>
        `;
    } else {
        templatesContainer.innerHTML = filteredTemplates.map(template => generateTemplateCardHTML(template)).join('');
    }
    
    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function generatePromptCardHTML(prompt) {
    const projectType = PROJECT_TYPES.find(p => p.id === prompt.projectType);
    const statusColors = {
        'complete': 'badge-success',
        'draft': 'badge-secondary',
        'in_progress': 'badge-warning'
    };
    
    return `
        <div class="prompt-card">
            <div class="card-header">
                <div style="display: flex; align-items: center;">
                    <div class="card-icon">${projectType?.icon || '📄'}</div>
                    <div>
                        <h3 class="card-title">${prompt.title}</h3>
                        <p class="card-subtitle">${formatDate(prompt.createdAt)}</p>
                    </div>
                </div>
            </div>
            
            ${prompt.description ? `<p class="card-description">${prompt.description}</p>` : ''}
            
            ${prompt.content ? `
                <div class="card-content">${prompt.content.substring(0, 200)}${prompt.content.length > 200 ? '...' : ''}</div>
            ` : ''}
            
            <div class="card-footer">
                <div class="card-badges">
                    ${projectType ? `<span class="badge badge-primary">${projectType.label}</span>` : ''}
                    <span class="badge ${statusColors[prompt.status] || 'badge-secondary'}">${formatStatus(prompt.status)}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-ghost btn-sm" onclick="editPrompt('${prompt.id}')">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="deletePrompt('${prompt.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateTemplateCardHTML(template) {
    return `
        <div class="template-card">
            <div class="card-header">
                <div style="display: flex; align-items: center;">
                    <div class="card-icon">${template.icon}</div>
                    <div>
                        <h3 class="card-title">${template.name}</h3>
                        <p class="card-subtitle">${template.category}</p>
                    </div>
                </div>
            </div>
            
            <p class="card-description">${template.description}</p>
            
            <div class="card-footer">
                <div class="card-badges">
                    <span class="badge badge-secondary">Used ${template.usageCount} times</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-sm" onclick="useTemplate(${template.id})">
                        Use Template
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Template Functions
function useTemplate(templateId) {
    const template = appState.templates.find(t => t.id === templateId);
    if (!template) {
        showToast('Template not found', 'error');
        return;
    }
    
    // Pre-fill wizard with template data
    appState.wizardData.formData = {
        title: template.name,
        description: template.description,
        projectType: template.category.toLowerCase(),
        features: [...template.features],
        techStack: [...template.techStack],
        customRequirements: '',
        targetAudience: '',
        designStyle: '',
        additionalNotes: `Based on template: ${template.name}`
    };
    
    template.usageCount++;
    sessionStorage.setItem('previousPage', 'templates');
    showPromptBuilder();
    showToast(`Template "${template.name}" loaded!`, 'success');
}

// Prompt Management
function editPrompt(promptId) {
    const prompt = appState.savedPrompts.find(p => p.id === promptId);
    if (!prompt) {
        showToast('Prompt not found', 'error');
        return;
    }
    
    // Load prompt data into wizard
    appState.wizardData.formData = {
        title: prompt.title,
        description: prompt.description || '',
        projectType: prompt.projectType || '',
        features: [...(prompt.features || [])],
        techStack: [...(prompt.techStack || [])],
        customRequirements: prompt.metadata?.customRequirements || '',
        targetAudience: prompt.metadata?.targetAudience || '',
        designStyle: prompt.metadata?.designStyle || '',
        additionalNotes: prompt.metadata?.additionalNotes || ''
    };
    
    appState.editingPromptId = promptId;
    sessionStorage.setItem('previousPage', appState.currentPage);
    showPromptBuilder();
    
    if (prompt.content) {
        showPromptPreview(prompt.content);
        enablePromptActions();
    }
    
    showToast('Prompt loaded for editing', 'success');
}

function deletePrompt(promptId) {
    if (!confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
        return;
    }
    
    appState.savedPrompts = appState.savedPrompts.filter(p => p.id !== promptId);
    appState.saveToStorage('savedPrompts', appState.savedPrompts);
    
    // Refresh the current view
    if (appState.currentPage === 'dashboard') {
        loadRecentPrompts();
    } else if (appState.currentPage === 'my-prompts') {
        loadSavedPrompts();
    }
    
    showToast('Prompt deleted successfully', 'success');
}

// Search and Filter Functions
function filterPrompts() {
    loadSavedPrompts();
}

function filterTemplates() {
    loadTemplates();
}

function filterPromptsBySearch(prompts) {
    const searchInput = document.getElementById('prompts-search');
    if (!searchInput) return prompts;
    
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return prompts;
    
    return prompts.filter(prompt => 
        prompt.title.toLowerCase().includes(query) ||
        (prompt.description && prompt.description.toLowerCase().includes(query)) ||
        (prompt.content && prompt.content.toLowerCase().includes(query))
    );
}

function filterTemplatesBySearch(templates) {
    const searchInput = document.getElementById('templates-search');
    if (!searchInput) return templates;
    
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return templates;
    
    return templates.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
    );
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
}

function formatStatus(status) {
    const statusMap = {
        'complete': 'Complete',
        'draft': 'Draft',
        'in_progress': 'In Progress'
    };
    return statusMap[status] || status;
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1rem 1.5rem;
        color: var(--text-color);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: var(--shadow-lg);
    `;
    
    // Color based on type
    if (type === 'success') {
        toast.style.borderColor = 'var(--success-color)';
        toast.style.background = 'rgba(16, 185, 129, 0.1)';
    } else if (type === 'error') {
        toast.style.borderColor = 'var(--danger-color)';
        toast.style.background = 'rgba(239, 68, 68, 0.1)';
    } else if (type === 'warning') {
        toast.style.borderColor = 'var(--warning-color)';
        toast.style.background = 'rgba(245, 158, 11, 0.1)';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Error Handling
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    showToast('An unexpected error occurred', 'error');
});

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add debounced search handlers
document.addEventListener('DOMContentLoaded', function() {
    const searchInputs = ['prompts-search', 'templates-search'];
    searchInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', debounce(() => {
                if (inputId === 'prompts-search') {
                    filterPrompts();
                } else if (inputId === 'templates-search') {
                    filterTemplates();
                }
            }, 300));
        }
    });
});