// src/components/pages/documentation-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext } from '../../types';
import '../layout/app-sidebar';

@customElement('documentation-page')
export class DocumentationPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    .page-layout {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--sl-color-neutral-0);
    }

    .page-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      background-color: var(--sl-color-neutral-50);
    }

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

    .page-content {
      flex: 1;
      display: flex;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .docs-sidebar {
      width: 250px;
      padding: 2rem 0 2rem 2rem;
      border-right: 1px solid var(--sl-color-neutral-200);
    }

    .docs-content {
      flex: 1;
      padding: 2rem;
      max-width: 800px;
    }

    .docs-nav {
      position: sticky;
      top: 2rem;
    }

    .nav-section {
      margin-bottom: 1.5rem;
    }

    .nav-section-title {
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-600);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .nav-item {
      display: block;
      padding: 0.5rem 0;
      color: var(--sl-color-neutral-700);
      text-decoration: none;
      border-radius: var(--sl-border-radius-small);
      transition: color 0.2s;
    }

    .nav-item:hover {
      color: var(--sl-color-primary-600);
    }

    .nav-item.active {
      color: var(--sl-color-primary-600);
      font-weight: var(--sl-font-weight-medium);
    }

    .docs-content h1 {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 1rem 0;
    }

    .docs-content h2 {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 2rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .docs-content h3 {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 1.5rem 0 0.75rem 0;
    }

    .docs-content p {
      line-height: 1.7;
      color: var(--sl-color-neutral-700);
      margin-bottom: 1rem;
    }

    .docs-content ul, .docs-content ol {
      margin-bottom: 1rem;
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
      padding: 0.125rem 0.25rem;
      border-radius: var(--sl-border-radius-small);
      font-family: var(--sl-font-mono);
      font-size: 0.875em;
    }

    .docs-content pre {
      background-color: var(--sl-color-neutral-100);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      margin: 1rem 0;
      overflow-x: auto;
    }

    .docs-content pre code {
      background: none;
      color: var(--sl-color-neutral-900);
      padding: 0;
    }

    .alert-box {
      padding: 1rem;
      border-radius: var(--sl-border-radius-medium);
      margin: 1rem 0;
      border-left: 4px solid;
    }

    .alert-box.info {
      background-color: var(--sl-color-primary-50);
      border-color: var(--sl-color-primary-600);
      color: var(--sl-color-primary-800);
    }

    .alert-box.warning {
      background-color: var(--sl-color-warning-50);
      border-color: var(--sl-color-warning-600);
      color: var(--sl-color-warning-800);
    }

    .alert-box.success {
      background-color: var(--sl-color-success-50);
      border-color: var(--sl-color-success-600);
      color: var(--sl-color-success-800);
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .feature-card {
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      text-align: center;
    }

    .feature-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .feature-title {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.5rem;
    }

    .feature-description {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .breadcrumb a {
      color: var(--sl-color-primary-600);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        flex-direction: column;
        gap: 0;
      }

      .docs-sidebar {
        width: 100%;
        padding: 1rem;
        border-right: none;
        border-bottom: 1px solid var(--sl-color-neutral-200);
        position: static;
      }

      .docs-content {
        padding: 1rem;
      }

      .feature-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .main-content {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .page-header {
      background-color: var(--sl-color-neutral-800);
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .page-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .page-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .docs-sidebar {
      border-right-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .nav-section-title {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .nav-item {
      color: var(--sl-color-neutral-300);
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
    }

    :host(.sl-theme-dark) .docs-content pre {
      background-color: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .docs-content pre code {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .feature-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .feature-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .feature-description {
      color: var(--sl-color-neutral-400);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) context!: RouteContext;

  @state() private currentSection = 'getting-started';

  render() {
    return html`
      <div class="page-layout">
        <app-sidebar 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .currentTeamSlug=${this.context.params.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-content">
            <nav class="docs-sidebar">
              <div class="docs-nav">
                <div class="nav-section">
                  <div class="nav-section-title">Getting Started</div>
                  <a href="#" class="nav-item ${this.currentSection === 'getting-started' ? 'active' : ''}" 
                     @click=${() => this.currentSection = 'getting-started'}>
                    Quick Start Guide
                  </a>
                  <a href="#" class="nav-item ${this.currentSection === 'onboarding' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'onboarding'}>
                    Account Setup
                  </a>
                  <a href="#" class="nav-item ${this.currentSection === 'team-management' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'team-management'}>
                    Team Management
                  </a>
                </div>

                <div class="nav-section">
                  <div class="nav-section-title">Core Features</div>
                  <a href="#" class="nav-item ${this.currentSection === 'scopes' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'scopes'}>
                    Understanding Scopes
                  </a>
                  <a href="#" class="nav-item ${this.currentSection === 'scope-items' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'scope-items'}>
                    Managing Scope Items
                  </a>
                  <a href="#" class="nav-item ${this.currentSection === 'organization' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'organization'}>
                    Data Organization
                  </a>
                </div>

                <div class="nav-section">
                  <div class="nav-section-title">Advanced</div>
                  <a href="#" class="nav-item ${this.currentSection === 'workflows' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'workflows'}>
                    Custom Workflows
                  </a>
                  <a href="#" class="nav-item ${this.currentSection === 'integrations' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'integrations'}>
                    Integrations
                  </a>
                  <a href="#" class="nav-item ${this.currentSection === 'api' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'api'}>
                    API Reference
                  </a>
                </div>

                <div class="nav-section">
                  <div class="nav-section-title">Support</div>
                  <a href="#" class="nav-item ${this.currentSection === 'troubleshooting' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'troubleshooting'}>
                    Troubleshooting
                  </a>
                  <a href="#" class="nav-item ${this.currentSection === 'faq' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'faq'}>
                    FAQ
                  </a>
                  <a href="#" class="nav-item ${this.currentSection === 'contact' ? 'active' : ''}"
                     @click=${() => this.currentSection = 'contact'}>
                    Contact Support
                  </a>
                </div>
              </div>
            </nav>

            <main class="docs-content">
              ${this.renderContent()}
            </main>
          </div>
        </div>
      </div>
    `;
  }

  private renderContent() {
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
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Quick Start Guide</span>
      </div>

      <h1>Quick Start Guide</h1>
      <p>Welcome to Task Flow! This guide will help you get up and running in just a few minutes.</p>

      <div class="alert-box info">
        <strong>New to Task Flow?</strong> Start here to learn the basics and set up your first project.
      </div>

      <h2>What is Task Flow?</h2>
      <p>
        Task Flow is a flexible project management and task organization tool that adapts to your workflow.
        Unlike traditional task managers, Task Flow uses <strong>scopes</strong> to organize different types of work.
      </p>

      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <div class="feature-title">Flexible Scopes</div>
          <div class="feature-description">Organize work with customizable scopes for different project types</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <div class="feature-title">Team Collaboration</div>
          <div class="feature-description">Work together with role-based permissions and real-time updates</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <div class="feature-title">Smart Organization</div>
          <div class="feature-description">Use labels, categories, and types to organize your data</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <div class="feature-title">Fast & Efficient</div>
          <div class="feature-description">Built for speed with keyboard shortcuts and quick actions</div>
        </div>
      </div>

      <h2>Getting Started in 5 Steps</h2>
      <ol>
        <li><strong>Create your account</strong> - Sign up and verify your email</li>
        <li><strong>Set up your team</strong> - Create a team workspace during onboarding</li>
        <li><strong>Choose your plan</strong> - Start with our free plan or upgrade</li>
        <li><strong>Create your first scope</strong> - Set up different types of work organization</li>
        <li><strong>Add scope items</strong> - Start adding tasks, notes, bookmarks, and more</li>
      </ol>

      <div class="alert-box success">
        <strong>Pro Tip:</strong> Start with the built-in scope types (Todo, Notes, Checklists) before creating custom scopes.
      </div>

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
      <ul>
        <li><a href="#" @click=${() => this.currentSection = 'scopes'}>Learn more about scopes</a></li>
        <li><a href="#" @click=${() => this.currentSection = 'team-management'}>Set up your team</a></li>
        <li><a href="#" @click=${() => this.currentSection = 'organization'}>Organize your data</a></li>
      </ul>
    `;
  }

  private renderOnboarding() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Account Setup</span>
      </div>

      <h1>Account Setup</h1>
      <p>Learn how to set up your Task Flow account and configure your workspace for success.</p>

      <h2>Creating Your Account</h2>
      <p>Setting up your Task Flow account is quick and straightforward:</p>
      <ol>
        <li>Visit the sign-up page and enter your email and password</li>
        <li>Check your email for a confirmation link</li>
        <li>Complete the onboarding process by creating your team</li>
        <li>Choose your subscription plan</li>
      </ol>

      <div class="alert-box info">
        <strong>Email Verification Required:</strong> You must verify your email address before you can create teams or access the main application.
      </div>

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

      <h3>Free Plan</h3>
      <ul>
        <li>Perfect for small teams getting started</li>
        <li>2 active projects</li>
        <li>3 team members</li>
        <li>10 documents</li>
        <li>Basic task management</li>
      </ul>

      <h3>Creator Plan ($9/month)</h3>
      <ul>
        <li>For growing teams and projects</li>
        <li>10 active projects</li>
        <li>10 team members</li>
        <li>Unlimited documents</li>
        <li>Advanced features and analytics</li>
      </ul>

      <div class="alert-box warning">
        <strong>Note:</strong> You can upgrade or downgrade your plan at any time from the billing settings.
      </div>
    `;
  }

  private renderTeamManagement() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Team Management</span>
      </div>

      <h1>Team Management</h1>
      <p>Learn how to manage your team members, roles, and permissions effectively.</p>

      <h2>Adding Team Members</h2>
      <p>Invite new members to your team to start collaborating:</p>
      <ol>
        <li>Go to Team Settings > Members</li>
        <li>Click "Invite Member"</li>
        <li>Enter their email address</li>
        <li>Select their role</li>
        <li>Send the invitation</li>
      </ol>

      <h2>Team Roles</h2>
      <p>Task Flow has three main roles with different permission levels:</p>

      <h3>Owner</h3>
      <ul>
        <li>Full access to all team features</li>
        <li>Can manage billing and subscriptions</li>
        <li>Can add/remove team members</li>
        <li>Can delete the team</li>
      </ul>

      <h3>Admin</h3>
      <ul>
        <li>Can manage team settings</li>
        <li>Can invite and remove members</li>
        <li>Can create and manage scopes</li>
        <li>Cannot access billing settings</li>
      </ul>

      <h3>Member</h3>
      <ul>
        <li>Can create and manage scope items</li>
        <li>Can view team data based on permissions</li>
        <li>Cannot manage team settings</li>
        <li>Cannot invite other members</li>
      </ul>

      <div class="alert-box info">
        <strong>Permission Tips:</strong> Start with the Member role for new team members and promote them as needed.
      </div>
    `;
  }

  private renderScopes() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Understanding Scopes</span>
      </div>

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
        <div class="feature-card">
          <div class="feature-icon">✅</div>
          <div class="feature-title">Todo</div>
          <div class="feature-description">Simple task management with completion tracking</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📝</div>
          <div class="feature-title">Notes</div>
          <div class="feature-description">Rich text documentation and information storage</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">☑️</div>
          <div class="feature-title">Checklist</div>
          <div class="feature-description">Multi-item task lists with individual completion</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔖</div>
          <div class="feature-title">Bookmark</div>
          <div class="feature-description">URL management with descriptions and tags</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <div class="feature-title">Resource</div>
          <div class="feature-description">Knowledge base with sources and formats</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🏆</div>
          <div class="feature-title">Milestone</div>
          <div class="feature-description">Project milestones with success criteria</div>
        </div>
      </div>

      <h2>Creating Custom Scopes</h2>
      <p>You can create custom scopes tailored to your specific workflow needs:</p>
      <ol>
        <li>Go to Data Settings > Scopes</li>
        <li>Click "Create Scope"</li>
        <li>Define the scope name and description</li>
        <li>Configure custom fields and validation</li>
        <li>Set display options and icons</li>
      </ol>

      <div class="alert-box success">
        <strong>Best Practice:</strong> Start with built-in scopes and create custom ones only when you have specific needs that aren't met.
      </div>
    `;
  }

  private renderScopeItems() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Managing Scope Items</span>
      </div>

      <h1>Managing Scope Items</h1>
      <p>Learn how to create, organize, and manage items within your scopes.</p>

      <h2>Creating Scope Items</h2>
      <p>Each scope type has different required fields:</p>

      <h3>Todo Items</h3>
      <ul>
        <li><strong>Required:</strong> Title</li>
        <li><strong>Optional:</strong> Notes, priority, due date, tags</li>
      </ul>

      <h3>Notes</h3>
      <ul>
        <li><strong>Required:</strong> Title and content</li>
        <li><strong>Optional:</strong> Tags, categories</li>
      </ul>

      <h3>Checklists</h3>
      <ul>
        <li><strong>Required:</strong> Title and at least one checklist item</li>
        <li><strong>Optional:</strong> Notes, priority, due date</li>
      </ul>

      <h3>Bookmarks</h3>
      <ul>
        <li><strong>Required:</strong> URL</li>
        <li><strong>Optional:</strong> Title, description, tags</li>
      </ul>

      <h2>Item Properties</h2>
      <p>All scope items share some common properties:</p>

      <h3>Status Tracking</h3>
      <ul>
        <li>Not Started</li>
        <li>In Progress</li>
        <li>Blocked</li>
        <li>Review</li>
        <li>Done</li>
      </ul>

      <h3>Priority Levels</h3>
      <ul>
        <li>Low</li>
        <li>Medium</li>
        <li>High</li>
        <li>Critical</li>
        <li>Urgent</li>
      </ul>

      <div class="alert-box info">
        <strong>Pro Tip:</strong> Use priority levels and status tracking to keep your work organized and identify bottlenecks.
      </div>
    `;
  }

  private renderOrganization() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Data Organization</span>
      </div>

      <h1>Data Organization</h1>
      <p>Learn how to organize your data using labels, categories, types, and groups.</p>

      <h2>Organization Tools</h2>
      <p>Task Flow provides several tools to help you organize and categorize your work:</p>

      <h3>Labels</h3>
      <p>Labels are flexible tags that can be applied to any scope item. Use them for:</p>
      <ul>
        <li>Project identification</li>
        <li>Context switching (@home, @office, @computer)</li>
        <li>Status indicators (urgent, review-needed, blocked)</li>
      </ul>

      <h3>Categories</h3>
      <p>Categories provide broader classification for your items:</p>
      <ul>
        <li>Work vs Personal</li>
        <li>Department (Marketing, Engineering, Sales)</li>
        <li>Project phase (Planning, Execution, Review)</li>
      </ul>

      <h3>Types</h3>
      <p>Types allow you to further classify items within a scope:</p>
      <ul>
        <li>Task types (Bug, Feature, Improvement)</li>
        <li>Note types (Meeting Notes, Research, Ideas)</li>
        <li>Resource types (Tutorial, Reference, Tool)</li>
      </ul>

      <h3>Groups</h3>
      <p>Groups help you organize related scope items together:</p>
      <ul>
        <li>Sprint groups for development work</li>
        <li>Project phases</li>
        <li>Team assignments</li>
      </ul>

      <h2>Best Practices</h2>
      <div class="alert-box success">
        <strong>Start Simple:</strong> Begin with a few labels and categories. Add more as your needs grow.
      </div>

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
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Custom Workflows</span>
      </div>

      <h1>Custom Workflows</h1>
      <p>Advanced workflow customization and automation features.</p>

      <div class="alert-box warning">
        <strong>Coming Soon:</strong> Custom workflow features are currently in development and will be available in a future update.
      </div>

      <h2>Planned Features</h2>
      <ul>
        <li>Automated status transitions</li>
        <li>Custom approval workflows</li>
        <li>Integration triggers</li>
        <li>Notification rules</li>
      </ul>
    `;
  }

  private renderIntegrations() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Integrations</span>
      </div>

      <h1>Integrations</h1>
      <p>Connect Task Flow with your favorite tools and services.</p>

      <div class="alert-box info">
        <strong>Coming Soon:</strong> Integration features are planned for future releases.
      </div>

      <h2>Planned Integrations</h2>
      <ul>
        <li>Slack</li>
        <li>GitHub</li>
        <li>Google Calendar</li>
        <li>Zapier</li>
        <li>Microsoft Teams</li>
      </ul>
    `;
  }

  private renderAPI() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>API Reference</span>
      </div>

      <h1>API Reference</h1>
      <p>Programmatic access to Task Flow data and functionality.</p>

      <div class="alert-box warning">
        <strong>In Development:</strong> Our REST API is currently being developed and will be available in a future release.
      </div>

      <h2>Planned API Features</h2>
      <ul>
        <li>RESTful API endpoints</li>
        <li>Authentication via API keys</li>
        <li>Rate limiting</li>
        <li>Webhook support</li>
        <li>GraphQL endpoint</li>
      </ul>
    `;
  }

  private renderTroubleshooting() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Troubleshooting</span>
      </div>

      <h1>Troubleshooting</h1>
      <p>Common issues and solutions to help you get back on track.</p>

      <h2>Common Issues</h2>

      <h3>Can't Sign In</h3>
      <ul>
        <li>Check that your email is verified</li>
        <li>Try resetting your password</li>
        <li>Clear your browser cache and cookies</li>
        <li>Try using an incognito/private browsing window</li>
      </ul>

      <h3>Team Invitation Not Received</h3>
      <ul>
        <li>Check your spam/junk folder</li>
        <li>Ask the team owner to resend the invitation</li>
        <li>Ensure the email address is correct</li>
      </ul>

      <h3>Can't Create Scope Items</h3>
      <ul>
        <li>Ensure all required fields are filled</li>
        <li>Check your team permissions</li>
        <li>Try refreshing the page</li>
      </ul>

      <h3>Performance Issues</h3>
      <ul>
        <li>Clear your browser cache</li>
        <li>Check your internet connection</li>
        <li>Try using a different browser</li>
        <li>Disable browser extensions temporarily</li>
      </ul>

      <div class="alert-box info">
        <strong>Still having issues?</strong> <a href="#" @click=${() => this.currentSection = 'contact'}>Contact our support team</a> for personalized help.
      </div>
    `;
  }

  private renderFAQ() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>FAQ</span>
      </div>

      <h1>Frequently Asked Questions</h1>

      <h2>General</h2>
      <h3>What makes Task Flow different from other task managers?</h3>
      <p>
        Task Flow uses flexible scopes instead of rigid project structures. This allows you to organize different
        types of work (tasks, notes, bookmarks, etc.) in ways that match your actual workflow.
      </p>

      <h3>Can I use Task Flow for personal projects?</h3>
      <p>
        Absolutely! While Task Flow is designed for teams, it works great for personal productivity too.
        You can create a team with just yourself as a member.
      </p>

      <h2>Billing & Plans</h2>
      <h3>Can I change my plan later?</h3>
      <p>
        Yes, you can upgrade or downgrade your plan at any time from the billing settings.
        Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades.
      </p>

      <h3>What happens if I exceed my plan limits?</h3>
      <p>
        You'll receive notifications when approaching limits. For hard limits (like team members),
        you'll need to upgrade to add more. For soft limits (like projects), older items may be archived.
      </p>

      <h2>Data & Security</h2>
      <h3>Is my data secure?</h3>
      <p>
        Yes, we use industry-standard encryption for data in transit and at rest.
        All data is stored securely and backed up regularly.
      </p>

      <h3>Can I export my data?</h3>
      <p>
        Data export features are planned for a future release. You'll be able to export your data
        in standard formats like JSON and CSV.
      </p>
    `;
  }

  private renderContact() {
    return html`
      <div class="breadcrumb">
        <a href="#" @click=${() => this.currentSection = 'getting-started'}>Documentation</a>
        <span>></span>
        <span>Contact Support</span>
      </div>

      <h1>Contact Support</h1>
      <p>Get help from our support team when you need it most.</p>

      <h2>Support Channels</h2>

      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">📧</div>
          <div class="feature-title">Email Support</div>
          <div class="feature-description">
            Send us a detailed message at<br>
            <strong>support@taskflow.com</strong>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <div class="feature-title">Live Chat</div>
          <div class="feature-description">
            Available for Creator and Team plan users<br>
            <strong>Monday-Friday, 9 AM - 5 PM EST</strong>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🐛</div>
          <div class="feature-title">Bug Reports</div>
          <div class="feature-description">
            Report bugs and issues at<br>
            <strong>bugs@taskflow.com</strong>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💡</div>
          <div class="feature-title">Feature Requests</div>
          <div class="feature-description">
            Suggest new features at<br>
            <strong>feedback@taskflow.com</strong>
          </div>
        </div>
      </div>

      <h2>Response Times</h2>
      <ul>
        <li><strong>Free Plan:</strong> 48-72 hours</li>
        <li><strong>Creator Plan:</strong> 24-48 hours</li>
        <li><strong>Team Plan:</strong> 12-24 hours</li>
      </ul>

      <h2>Before Contacting Support</h2>
      <p>To help us help you faster, please:</p>
      <ol>
        <li>Check this documentation for answers</li>
        <li>Try the troubleshooting steps</li>
        <li>Note your browser and operating system</li>
        <li>Include screenshots if relevant</li>
        <li>Describe what you were trying to do when the issue occurred</li>
      </ol>

      <div class="alert-box success">
        <strong>We're here to help!</strong> Don't hesitate to reach out with any questions or issues.
      </div>
    `;
  }
}

