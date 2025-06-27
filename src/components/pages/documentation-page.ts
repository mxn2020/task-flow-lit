// src/components/pages/documentation-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import '../layout/app-sidebar';

interface DocSection {
  id: string;
  title: string;
  category: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@customElement('documentation-page')
export class DocumentationPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Documentation-specific styles */
    .page-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    .docs-layout {
      display: flex;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .docs-sidebar {
      width: 280px;
      flex-shrink: 0;
    }

    .docs-content {
      flex: 1;
      max-width: 800px;
    }

    .docs-nav {
      position: sticky;
      top: 2rem;
      background: var(--sl-color-neutral-0);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      padding: 1.5rem;
      box-shadow: var(--sl-shadow-small);
    }

    .nav-section {
      margin-bottom: 1.5rem;
    }

    .nav-section:last-child {
      margin-bottom: 0;
    }

    .nav-section-title {
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-600);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .nav-item {
      display: block;
      padding: 0.5rem 0.75rem;
      color: var(--sl-color-neutral-700);
      text-decoration: none;
      border-radius: var(--sl-border-radius-medium);
      transition: all 0.2s;
      cursor: pointer;
      font-size: var(--sl-font-size-small);
    }

    .nav-item:hover {
      background-color: var(--sl-color-primary-50);
      color: var(--sl-color-primary-700);
    }

    .nav-item.active {
      background-color: var(--sl-color-primary-100);
      color: var(--sl-color-primary-700);
      font-weight: var(--sl-font-weight-medium);
    }

    .docs-content h1 {
      font-size: 2.25rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 1.5rem 0;
      line-height: 1.2;
    }

    .docs-content h2 {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 2.5rem 0 1rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--sl-color-neutral-200);
    }

    .docs-content h3 {
      font-size: 1.375rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 2rem 0 0.75rem 0;
    }

    .docs-content p {
      line-height: 1.7;
      color: var(--sl-color-neutral-700);
      margin-bottom: 1.25rem;
      font-size: var(--sl-font-size-medium);
    }

    .docs-content ul, .docs-content ol {
      margin-bottom: 1.25rem;
      padding-left: 1.5rem;
    }

    .docs-content li {
      line-height: 1.6;
      color: var(--sl-color-neutral-700);
      margin-bottom: 0.5rem;
    }

    .docs-content code {
      background-color: var(--sl-color-neutral-100);
      color: var(--sl-color-danger-600);
      padding: 0.125rem 0.375rem;
      border-radius: var(--sl-border-radius-small);
      font-family: var(--sl-font-mono);
      font-size: 0.875em;
      border: 1px solid var(--sl-color-neutral-200);
    }

    .docs-content pre {
      background-color: var(--sl-color-neutral-100);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.25rem;
      margin: 1.5rem 0;
      overflow-x: auto;
      font-family: var(--sl-font-mono);
    }

    .docs-content pre code {
      background: none;
      color: var(--sl-color-neutral-900);
      padding: 0;
      border: none;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .feature-card {
      border: none;
      box-shadow: var(--sl-shadow-small);
      transition: all 0.2s ease;
    }

    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--sl-shadow-medium);
    }

    .feature-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 1rem;
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
      width: 4rem;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--sl-color-primary-100), var(--sl-color-warning-100));
      border-radius: var(--sl-border-radius-circle);
    }

    .feature-title {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
    }

    .feature-description {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      line-height: 1.5;
      margin: 0;
    }

    .breadcrumb {
      margin-bottom: 1.5rem;
    }

    .steps-list {
      counter-reset: step-counter;
      list-style: none;
      padding: 0;
      margin: 1.5rem 0;
    }

    .steps-list li {
      counter-increment: step-counter;
      display: flex;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      border-left: 4px solid var(--sl-color-primary-600);
    }

    .steps-list li::before {
      content: counter(step-counter);
      background: var(--sl-color-primary-600);
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--sl-font-weight-semibold);
      margin-right: 1rem;
      flex-shrink: 0;
    }

    .section-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .section-link {
      display: block;
      padding: 1rem;
      background: var(--sl-color-primary-50);
      border: 1px solid var(--sl-color-primary-200);
      border-radius: var(--sl-border-radius-medium);
      color: var(--sl-color-primary-700);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }

    .section-link:hover {
      background: var(--sl-color-primary-100);
      border-color: var(--sl-color-primary-300);
      transform: translateY(-1px);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .contact-card {
      text-align: center;
      border: none;
      box-shadow: var(--sl-shadow-small);
    }

    .contact-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .contact-title {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      margin: 0 0 0.5rem 0;
    }

    .contact-info {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      line-height: 1.5;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .docs-layout {
        flex-direction: column;
        gap: 1rem;
      }

      .docs-sidebar {
        width: 100%;
        order: 2;
      }

      .docs-nav {
        position: static;
      }

      .docs-content {
        order: 1;
      }

      .docs-content h1 {
        font-size: 1.875rem;
      }

      .docs-content h2 {
        font-size: 1.5rem;
      }

      .feature-grid {
        grid-template-columns: 1fr;
      }

      .section-links {
        grid-template-columns: 1fr;
      }

      .steps-list li {
        flex-direction: column;
        text-align: center;
      }

      .steps-list li::before {
        margin-right: 0;
        margin-bottom: 0.5rem;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .page-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .page-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .docs-nav {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .nav-section-title {
      color: var(--sl-color-neutral-400);
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .nav-item {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .nav-item:hover {
      background-color: var(--sl-color-primary-900);
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .nav-item.active {
      background-color: var(--sl-color-primary-800);
      color: var(--sl-color-primary-200);
    }

    :host(.sl-theme-dark) .docs-content h1,
    :host(.sl-theme-dark) .docs-content h2,
    :host(.sl-theme-dark) .docs-content h3 {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .docs-content h2 {
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .docs-content p,
    :host(.sl-theme-dark) .docs-content li {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .docs-content code {
      background-color: var(--sl-color-neutral-800);
      color: var(--sl-color-danger-400);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .docs-content pre {
      background-color: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .docs-content pre code {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .feature-title,
    :host(.sl-theme-dark) .contact-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .feature-description,
    :host(.sl-theme-dark) .contact-info {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .steps-list li {
      background: var(--sl-color-neutral-800);
      border-left-color: var(--sl-color-primary-500);
    }

    :host(.sl-theme-dark) .section-link {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-700);
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .section-link:hover {
      background: var(--sl-color-primary-800);
      border-color: var(--sl-color-primary-600);
    }
  `;

  @state() private currentSection = 'getting-started';

  private docSections: DocSection[] = [
    { id: 'getting-started', title: 'Quick Start Guide', category: 'Getting Started' },
    { id: 'onboarding', title: 'Account Setup', category: 'Getting Started' },
    { id: 'team-management', title: 'Team Management', category: 'Getting Started' },
    { id: 'scopes', title: 'Understanding Scopes', category: 'Core Features' },
    { id: 'scope-items', title: 'Managing Scope Items', category: 'Core Features' },
    { id: 'organization', title: 'Data Organization', category: 'Core Features' },
    { id: 'workflows', title: 'Custom Workflows', category: 'Advanced' },
    { id: 'integrations', title: 'Integrations', category: 'Advanced' },
    { id: 'api', title: 'API Reference', category: 'Advanced' },
    { id: 'troubleshooting', title: 'Troubleshooting', category: 'Support' },
    { id: 'faq', title: 'FAQ', category: 'Support' },
    { id: 'contact', title: 'Contact Support', category: 'Support' }
  ];

  private features: Feature[] = [
    { icon: '🎯', title: 'Flexible Scopes', description: 'Organize work with customizable scopes for different project types' },
    { icon: '👥', title: 'Team Collaboration', description: 'Work together with role-based permissions and real-time updates' },
    { icon: '📊', title: 'Smart Organization', description: 'Use labels, categories, and types to organize your data' },
    { icon: '⚡', title: 'Fast & Efficient', description: 'Built for speed with keyboard shortcuts and quick actions' }
  ];

  render() {
    return html`
      <div class="page-layout">
        <app-sidebar 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .currentTeamSlug=${this.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">Documentation</h1>
            <p class="page-subtitle">Learn how to get the most out of Task Flow</p>
          </div>

          <div class="page-content">
            <div class="docs-layout">
              ${this.renderSidebar()}
              ${this.renderContent()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderSidebar() {
    const categories = [...new Set(this.docSections.map(section => section.category))];

    return html`
      <aside class="docs-sidebar">
        <nav class="docs-nav">
          ${categories.map(category => html`
            <div class="nav-section">
              <div class="nav-section-title">${category}</div>
              ${this.docSections
                .filter(section => section.category === category)
                .map(section => html`
                  <a 
                    class="nav-item ${this.currentSection === section.id ? 'active' : ''}"
                    @click=${() => this.currentSection = section.id}
                  >
                    ${section.title}
                  </a>
                `)}
            </div>
          `)}
        </nav>
      </aside>
    `;
  }

  private renderContent() {
    return html`
      <main class="docs-content">
        ${this.renderCurrentSection()}
      </main>
    `;
  }

  private renderCurrentSection() {
    switch (this.currentSection) {
      case 'getting-started':
        return this.renderGettingStarted();
      case 'onboarding':
        return this.renderOnboarding();
      case 'team-management':
        return this.renderTeamManagement();
      case 'scopes':
        return this.renderScopes();
      case 'scope-items':
        return this.renderScopeItems();
      case 'organization':
        return this.renderOrganization();
      case 'workflows':
        return this.renderWorkflows();
      case 'integrations':
        return this.renderIntegrations();
      case 'api':
        return this.renderAPI();
      case 'troubleshooting':
        return this.renderTroubleshooting();
      case 'faq':
        return this.renderFAQ();
      case 'contact':
        return this.renderContact();
      default:
        return this.renderGettingStarted();
    }
  }

  private renderGettingStarted() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Quick Start Guide</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Quick Start Guide</h1>
      <p>Welcome to Task Flow! This guide will help you get up and running in just a few minutes.</p>

      <sl-alert variant="primary" open>
        <sl-icon slot="icon" name="info-circle"></sl-icon>
        <strong>New to Task Flow?</strong> Start here to learn the basics and set up your first project.
      </sl-alert>

      <h2>What is Task Flow?</h2>
      <p>
        Task Flow is a flexible project management and task organization tool that adapts to your workflow.
        Unlike traditional task managers, Task Flow uses <strong>scopes</strong> to organize different types of work.
      </p>

      <div class="feature-grid">
        ${this.features.map(feature => html`
          <sl-card class="feature-card">
            <div class="feature-header">
              <div class="feature-icon">${feature.icon}</div>
              <h3 class="feature-title">${feature.title}</h3>
            </div>
            <p class="feature-description">${feature.description}</p>
          </sl-card>
        `)}
      </div>

      <h2>Getting Started in 5 Steps</h2>
      <ol class="steps-list">
        <li><strong>Create your account</strong> - Sign up and verify your email</li>
        <li><strong>Set up your team</strong> - Create a team workspace during onboarding</li>
        <li><strong>Choose your plan</strong> - Start with our free plan or upgrade</li>
        <li><strong>Create your first scope</strong> - Set up different types of work organization</li>
        <li><strong>Add scope items</strong> - Start adding tasks, notes, bookmarks, and more</li>
      </ol>

      <sl-alert variant="success" open>
        <sl-icon slot="icon" name="lightbulb"></sl-icon>
        <strong>Pro Tip:</strong> Start with the built-in scope types (Todo, Notes, Checklists) before creating custom scopes.
      </sl-alert>

      <h2>Core Concepts</h2>
      <h3>Scopes</h3>
      <p>
        Scopes are the foundation of Task Flow. They define how different types of work are organized and what fields are available.
        Examples include:
      </p>
      <ul>
        <li><strong>Todo</strong> - Simple task management with titles and completion status</li>
        <li><strong>Notes</strong> - Rich text documentation with titles and content</li>
        <li><strong>Checklists</strong> - Multi-item task lists with individual completion tracking</li>
        <li><strong>Bookmarks</strong> - URL management with descriptions and tags</li>
        <li><strong>Resources</strong> - Knowledge base items with sources and formats</li>
      </ul>

      <h3>Scope Items</h3>
      <p>
        Scope items are the individual pieces of work within a scope. Each item adapts its form based on the scope type,
        ensuring you have the right fields for the right type of work.
      </p>

      <h2>Next Steps</h2>
      <p>Now that you understand the basics, here's what to explore next:</p>
      
      <div class="section-links">
        <a class="section-link" @click=${() => this.currentSection = 'scopes'}>
          <strong>Learn more about scopes</strong><br>
          Understand the foundation of Task Flow
        </a>
        <a class="section-link" @click=${() => this.currentSection = 'team-management'}>
          <strong>Set up your team</strong><br>
          Invite members and manage permissions
        </a>
        <a class="section-link" @click=${() => this.currentSection = 'organization'}>
          <strong>Organize your data</strong><br>
          Use labels, categories, and groups
        </a>
      </div>
    `;
  }

  private renderOnboarding() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Account Setup</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Account Setup</h1>
      <p>Learn how to set up your Task Flow account and configure your workspace for success.</p>

      <h2>Creating Your Account</h2>
      <p>Setting up your Task Flow account is quick and straightforward:</p>
      <ol class="steps-list">
        <li>Visit the sign-up page and enter your email and password</li>
        <li>Check your email for a confirmation link</li>
        <li>Complete the onboarding process by creating your team</li>
        <li>Choose your subscription plan</li>
      </ol>

      <sl-alert variant="primary" open>
        <sl-icon slot="icon" name="envelope"></sl-icon>
        <strong>Email Verification Required:</strong> You must verify your email address before you can create teams or access the main application.
      </sl-alert>

      <h2>Team Creation</h2>
      <p>
        During onboarding, you'll create your first team. This serves as your main workspace where you and your
        collaborators will organize projects and tasks.
      </p>

      <h3>Choosing a Team Name</h3>
      <ul>
        <li>Pick a name that represents your organization or project</li>
        <li>Keep it short and memorable</li>
        <li>You can change it later in team settings</li>
      </ul>

      <h2>Plan Selection</h2>
      <p>Task Flow offers several plans to fit different needs:</p>

      <sl-details summary="Free Plan" open>
        <ul>
          <li>Perfect for small teams getting started</li>
          <li>2 active projects</li>
          <li>3 team members</li>
          <li>10 documents</li>
          <li>Basic task management</li>
        </ul>
      </sl-details>

      <sl-details summary="Creator Plan ($9/month)">
        <ul>
          <li>For growing teams and projects</li>
          <li>10 active projects</li>
          <li>10 team members</li>
          <li>Unlimited documents</li>
          <li>Advanced features and analytics</li>
        </ul>
      </sl-details>

      <sl-alert variant="warning" open>
        <sl-icon slot="icon" name="info-circle"></sl-icon>
        <strong>Note:</strong> You can upgrade or downgrade your plan at any time from the billing settings.
      </sl-alert>
    `;
  }

  private renderTeamManagement() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Team Management</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Team Management</h1>
      <p>Learn how to manage your team members, roles, and permissions effectively.</p>

      <h2>Adding Team Members</h2>
      <p>Invite new members to your team to start collaborating:</p>
      <ol class="steps-list">
        <li>Go to Team Settings > Members</li>
        <li>Click "Invite Member"</li>
        <li>Enter their email address</li>
        <li>Select their role</li>
        <li>Send the invitation</li>
      </ol>

      <h2>Team Roles</h2>
      <p>Task Flow has three main roles with different permission levels:</p>

      <sl-details summary="Owner" open>
        <ul>
          <li>Full access to all team features</li>
          <li>Can manage billing and subscriptions</li>
          <li>Can add/remove team members</li>
          <li>Can delete the team</li>
        </ul>
      </sl-details>

      <sl-details summary="Admin">
        <ul>
          <li>Can manage team settings</li>
          <li>Can invite and remove members</li>
          <li>Can create and manage scopes</li>
          <li>Cannot access billing settings</li>
        </ul>
      </sl-details>

      <sl-details summary="Member">
        <ul>
          <li>Can create and manage scope items</li>
          <li>Can view team data based on permissions</li>
          <li>Cannot manage team settings</li>
          <li>Cannot invite other members</li>
        </ul>
      </sl-details>

      <sl-alert variant="success" open>
        <sl-icon slot="icon" name="shield-check"></sl-icon>
        <strong>Permission Tips:</strong> Start with the Member role for new team members and promote them as needed.
      </sl-alert>
    `;
  }

  private renderScopes() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Understanding Scopes</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Understanding Scopes</h1>
      <p>Scopes are the foundation of Task Flow's flexible organization system.</p>

      <h2>What are Scopes?</h2>
      <p>
        A scope defines a specific type of work or content organization. Each scope has its own set of fields,
        validation rules, and display options that make it perfect for different kinds of tasks.
      </p>

      <h2>Built-in Scope Types</h2>
      <p>Task Flow comes with several pre-configured scope types:</p>

      <div class="feature-grid">
        ${[
          { icon: '✅', title: 'Todo', description: 'Simple task management with completion tracking' },
          { icon: '📝', title: 'Notes', description: 'Rich text documentation and information storage' },
          { icon: '☑️', title: 'Checklist', description: 'Multi-item task lists with individual completion' },
          { icon: '🔖', title: 'Bookmark', description: 'URL management with descriptions and tags' },
          { icon: '📚', title: 'Resource', description: 'Knowledge base with sources and formats' },
          { icon: '🏆', title: 'Milestone', description: 'Project milestones with success criteria' }
        ].map(scope => html`
          <sl-card class="feature-card">
            <div class="feature-header">
              <div class="feature-icon">${scope.icon}</div>
              <h3 class="feature-title">${scope.title}</h3>
            </div>
            <p class="feature-description">${scope.description}</p>
          </sl-card>
        `)}
      </div>

      <h2>Creating Custom Scopes</h2>
      <p>You can create custom scopes tailored to your specific workflow needs:</p>
      <ol class="steps-list">
        <li>Go to Data Settings > Scopes</li>
        <li>Click "Create Scope"</li>
        <li>Define the scope name and description</li>
        <li>Configure custom fields and validation</li>
        <li>Set display options and icons</li>
      </ol>

      <sl-alert variant="success" open>
        <sl-icon slot="icon" name="lightbulb"></sl-icon>
        <strong>Best Practice:</strong> Start with built-in scopes and create custom ones only when you have specific needs that aren't met.
      </sl-alert>
    `;
  }

  private renderScopeItems() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Managing Scope Items</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Managing Scope Items</h1>
      <p>Learn how to create, organize, and manage items within your scopes.</p>

      <h2>Creating Scope Items</h2>
      <p>Each scope type has different required fields:</p>

      <sl-details summary="Todo Items" open>
        <ul>
          <li><strong>Required:</strong> Title</li>
          <li><strong>Optional:</strong> Notes, priority, due date, tags</li>
        </ul>
      </sl-details>

      <sl-details summary="Notes">
        <ul>
          <li><strong>Required:</strong> Title and content</li>
          <li><strong>Optional:</strong> Tags, categories</li>
        </ul>
      </sl-details>

      <sl-details summary="Checklists">
        <ul>
          <li><strong>Required:</strong> Title and at least one checklist item</li>
          <li><strong>Optional:</strong> Notes, priority, due date</li>
        </ul>
      </sl-details>

      <sl-details summary="Bookmarks">
        <ul>
          <li><strong>Required:</strong> URL</li>
          <li><strong>Optional:</strong> Title, description, tags</li>
        </ul>
      </sl-details>

      <h2>Item Properties</h2>
      <p>All scope items share some common properties:</p>

      <h3>Status Tracking</h3>
      <div class="section-links">
        ${['Not Started', 'In Progress', 'Blocked', 'Review', 'Done'].map(status => html`
          <sl-badge variant=${status === 'Done' ? 'success' : status === 'Blocked' ? 'danger' : status === 'In Progress' ? 'warning' : 'neutral'}>
            ${status}
          </sl-badge>
        `)}
      </div>

      <h3>Priority Levels</h3>
      <div class="section-links">
        ${['Low', 'Medium', 'High', 'Critical', 'Urgent'].map(priority => html`
          <sl-badge variant=${priority === 'Critical' || priority === 'Urgent' ? 'danger' : priority === 'High' ? 'warning' : 'neutral'}>
            ${priority}
          </sl-badge>
        `)}
      </div>

      <sl-alert variant="primary" open>
        <sl-icon slot="icon" name="lightbulb"></sl-icon>
        <strong>Pro Tip:</strong> Use priority levels and status tracking to keep your work organized and identify bottlenecks.
      </sl-alert>
    `;
  }

  private renderOrganization() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Data Organization</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Data Organization</h1>
      <p>Learn how to organize your data using labels, categories, types, and groups.</p>

      <h2>Organization Tools</h2>
      <p>Task Flow provides several tools to help you organize and categorize your work:</p>

      <sl-details summary="Labels" open>
        <p>Labels are flexible tags that can be applied to any scope item. Use them for:</p>
        <ul>
          <li>Project identification</li>
          <li>Context switching (@home, @office, @computer)</li>
          <li>Status indicators (urgent, review-needed, blocked)</li>
        </ul>
      </sl-details>

      <sl-details summary="Categories">
        <p>Categories provide broader classification for your items:</p>
        <ul>
          <li>Work vs Personal</li>
          <li>Department (Marketing, Engineering, Sales)</li>
          <li>Project phase (Planning, Execution, Review)</li>
        </ul>
      </sl-details>

      <sl-details summary="Types">
        <p>Types allow you to further classify items within a scope:</p>
        <ul>
          <li>Task types (Bug, Feature, Improvement)</li>
          <li>Note types (Meeting Notes, Research, Ideas)</li>
          <li>Resource types (Tutorial, Reference, Tool)</li>
        </ul>
      </sl-details>

      <sl-details summary="Groups">
        <p>Groups help you organize related scope items together:</p>
        <ul>
          <li>Sprint groups for development work</li>
          <li>Project phases</li>
          <li>Team assignments</li>
        </ul>
      </sl-details>

      <h2>Best Practices</h2>
      <sl-alert variant="success" open>
        <sl-icon slot="icon" name="star"></sl-icon>
        <strong>Start Simple:</strong> Begin with a few labels and categories. Add more as your needs grow.
      </sl-alert>

      <ul>
        <li>Use consistent naming conventions</li>
        <li>Create a team style guide for labels and categories</li>
        <li>Review and clean up unused organization tools regularly</li>
        <li>Train team members on your organization system</li>
      </ul>
    `;
  }

  private renderWorkflows() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Custom Workflows</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Custom Workflows</h1>
      <p>Advanced workflow customization and automation features.</p>

      <sl-alert variant="warning" open>
        <sl-icon slot="icon" name="clock"></sl-icon>
        <strong>Coming Soon:</strong> Custom workflow features are currently in development and will be available in a future update.
      </sl-alert>

      <h2>Planned Features</h2>
      <div class="feature-grid">
        ${[
          { icon: '🔄', title: 'Automated Status Transitions', description: 'Automatically move items through status workflows' },
          { icon: '✅', title: 'Custom Approval Workflows', description: 'Create multi-step approval processes' },
          { icon: '🔗', title: 'Integration Triggers', description: 'Connect workflows with external tools' },
          { icon: '🔔', title: 'Notification Rules', description: 'Automated notifications based on events' }
        ].map(feature => html`
          <sl-card class="feature-card">
            <div class="feature-header">
              <div class="feature-icon">${feature.icon}</div>
              <h3 class="feature-title">${feature.title}</h3>
            </div>
            <p class="feature-description">${feature.description}</p>
          </sl-card>
        `)}
      </div>
    `;
  }

  private renderIntegrations() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Integrations</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Integrations</h1>
      <p>Connect Task Flow with your favorite tools and services.</p>

      <sl-alert variant="primary" open>
        <sl-icon slot="icon" name="info-circle"></sl-icon>
        <strong>Coming Soon:</strong> Integration features are planned for future releases.
      </sl-alert>

      <h2>Planned Integrations</h2>
      <div class="feature-grid">
        ${[
          { icon: '💬', title: 'Slack', description: 'Get notifications and create items from Slack' },
          { icon: '🐙', title: 'GitHub', description: 'Sync issues and pull requests' },
          { icon: '📅', title: 'Google Calendar', description: 'Sync due dates and deadlines' },
          { icon: '⚡', title: 'Zapier', description: 'Connect with thousands of other apps' },
          { icon: '👥', title: 'Microsoft Teams', description: 'Collaborate directly from Teams' },
          { icon: '🔗', title: 'Webhooks', description: 'Custom integrations via API' }
        ].map(integration => html`
          <sl-card class="feature-card">
            <div class="feature-header">
              <div class="feature-icon">${integration.icon}</div>
              <h3 class="feature-title">${integration.title}</h3>
            </div>
            <p class="feature-description">${integration.description}</p>
          </sl-card>
        `)}
      </div>
    `;
  }

  private renderAPI() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>API Reference</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>API Reference</h1>
      <p>Programmatic access to Task Flow data and functionality.</p>

      <sl-alert variant="warning" open>
        <sl-icon slot="icon" name="code-slash"></sl-icon>
        <strong>In Development:</strong> Our REST API is currently being developed and will be available in a future release.
      </sl-alert>

      <h2>Planned API Features</h2>
      <ul>
        <li><strong>RESTful API endpoints</strong> - Standard HTTP methods for all operations</li>
        <li><strong>Authentication via API keys</strong> - Secure access with token-based auth</li>
        <li><strong>Rate limiting</strong> - Fair usage policies to ensure stability</li>
        <li><strong>Webhook support</strong> - Real-time notifications for events</li>
        <li><strong>GraphQL endpoint</strong> - Flexible queries for complex data needs</li>
      </ul>

      <h2>Example Usage</h2>
      <p>Here's what the API will look like when it's ready:</p>
      
      <pre><code>// Get all scope items
GET /api/v1/teams/:teamId/scopes/:scopeId/items

// Create a new scope item
POST /api/v1/teams/:teamId/scopes/:scopeId/items
{
  "title": "New Task",
  "status": "not_started",
  "priority": "medium"
}</code></pre>
    `;
  }

  private renderTroubleshooting() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Troubleshooting</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Troubleshooting</h1>
      <p>Common issues and solutions to help you get back on track.</p>

      <h2>Common Issues</h2>

      <sl-details summary="Can't Sign In" open>
        <ul>
          <li>Check that your email is verified</li>
          <li>Try resetting your password</li>
          <li>Clear your browser cache and cookies</li>
          <li>Try using an incognito/private browsing window</li>
        </ul>
      </sl-details>

      <sl-details summary="Team Invitation Not Received">
        <ul>
          <li>Check your spam/junk folder</li>
          <li>Ask the team owner to resend the invitation</li>
          <li>Ensure the email address is correct</li>
        </ul>
      </sl-details>

      <sl-details summary="Can't Create Scope Items">
        <ul>
          <li>Ensure all required fields are filled</li>
          <li>Check your team permissions</li>
          <li>Try refreshing the page</li>
        </ul>
      </sl-details>

      <sl-details summary="Performance Issues">
        <ul>
          <li>Clear your browser cache</li>
          <li>Check your internet connection</li>
          <li>Try using a different browser</li>
          <li>Disable browser extensions temporarily</li>
        </ul>
      </sl-details>

      <sl-alert variant="primary" open>
        <sl-icon slot="icon" name="question-circle"></sl-icon>
        <strong>Still having issues?</strong> <a href="#" @click=${() => this.currentSection = 'contact'}>Contact our support team</a> for personalized help.
      </sl-alert>
    `;
  }

  private renderFAQ() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>FAQ</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Frequently Asked Questions</h1>

      <h2>General</h2>
      <sl-details summary="What makes Task Flow different from other task managers?" open>
        <p>
          Task Flow uses flexible scopes instead of rigid project structures. This allows you to organize different
          types of work (tasks, notes, bookmarks, etc.) in ways that match your actual workflow.
        </p>
      </sl-details>

      <sl-details summary="Can I use Task Flow for personal projects?">
        <p>
          Absolutely! While Task Flow is designed for teams, it works great for personal productivity too.
          You can create a team with just yourself as a member.
        </p>
      </sl-details>

      <h2>Billing & Plans</h2>
      <sl-details summary="Can I change my plan later?">
        <p>
          Yes, you can upgrade or downgrade your plan at any time from the billing settings.
          Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades.
        </p>
      </sl-details>

      <sl-details summary="What happens if I exceed my plan limits?">
        <p>
          You'll receive notifications when approaching limits. For hard limits (like team members),
          you'll need to upgrade to add more. For soft limits (like projects), older items may be archived.
        </p>
      </sl-details>

      <h2>Data & Security</h2>
      <sl-details summary="Is my data secure?">
        <p>
          Yes, we use industry-standard encryption for data in transit and at rest.
          All data is stored securely and backed up regularly.
        </p>
      </sl-details>

      <sl-details summary="Can I export my data?">
        <p>
          Data export features are planned for a future release. You'll be able to export your data
          in standard formats like JSON and CSV.
        </p>
      </sl-details>
    `;
  }

  private renderContact() {
    return html`
      <sl-breadcrumb class="breadcrumb">
        <sl-breadcrumb-item @click=${() => this.currentSection = 'getting-started'}>Documentation</sl-breadcrumb-item>
        <sl-breadcrumb-item>Contact Support</sl-breadcrumb-item>
      </sl-breadcrumb>

      <h1>Contact Support</h1>
      <p>Get help from our support team when you need it most.</p>

      <h2>Support Channels</h2>

      <div class="contact-grid">
        <sl-card class="contact-card">
          <div class="contact-icon">📧</div>
          <h3 class="contact-title">Email Support</h3>
          <div class="contact-info">
            Send us a detailed message at<br>
            <strong>support@taskflow.com</strong>
          </div>
        </sl-card>

        <sl-card class="contact-card">
          <div class="contact-icon">💬</div>
          <h3 class="contact-title">Live Chat</h3>
          <div class="contact-info">
            Available for Creator and Team plan users<br>
            <strong>Monday-Friday, 9 AM - 5 PM EST</strong>
          </div>
        </sl-card>

        <sl-card class="contact-card">
          <div class="contact-icon">🐛</div>
          <h3 class="contact-title">Bug Reports</h3>
          <div class="contact-info">
            Report bugs and issues at<br>
            <strong>bugs@taskflow.com</strong>
          </div>
        </sl-card>

        <sl-card class="contact-card">
          <div class="contact-icon">💡</div>
          <h3 class="contact-title">Feature Requests</h3>
          <div class="contact-info">
            Suggest new features at<br>
            <strong>feedback@taskflow.com</strong>
          </div>
        </sl-card>
      </div>

      <h2>Response Times</h2>
      <div class="section-links">
        <sl-badge variant="neutral" size="large">Free Plan: 48-72 hours</sl-badge>
        <sl-badge variant="primary" size="large">Creator Plan: 24-48 hours</sl-badge>
        <sl-badge variant="success" size="large">Team Plan: 12-24 hours</sl-badge>
      </div>

      <h2>Before Contacting Support</h2>
      <p>To help us help you faster, please:</p>
      <ol class="steps-list">
        <li>Check this documentation for answers</li>
        <li>Try the troubleshooting steps</li>
        <li>Note your browser and operating system</li>
        <li>Include screenshots if relevant</li>
        <li>Describe what you were trying to do when the issue occurred</li>
      </ol>

      <sl-alert variant="success" open>
        <sl-icon slot="icon" name="heart"></sl-icon>
        <strong>We're here to help!</strong> Don't hesitate to reach out with any questions or issues.
      </sl-alert>
    `;
  }
}

