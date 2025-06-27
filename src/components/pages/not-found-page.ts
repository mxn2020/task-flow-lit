// src/components/pages/not-found-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { RouterController } from '../../controllers/router-controller';

interface SearchSuggestion {
  title: string;
  url: string;
  description: string;
  keywords: string[];
}

@customElement('not-found-page')
export class NotFoundPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--sl-color-neutral-50) 0%, var(--sl-color-neutral-100) 100%);
    }

    .container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .content {
      text-align: center;
      max-width: 600px;
      width: 100%;
    }

    .error-animation {
      font-size: 8rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--sl-color-primary-600), var(--sl-color-warning-600));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: var(--sl-font-weight-bold);
      line-height: 1;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .error-title {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 1rem;
    }

    .error-message {
      font-size: 1.125rem;
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .error-illustration {
      font-size: 5rem;
      margin-bottom: 2rem;
      opacity: 0.8;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .actions-section {
      margin-bottom: 3rem;
    }

    .primary-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .secondary-actions {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .secondary-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--sl-color-primary-600);
      text-decoration: none;
      font-weight: var(--sl-font-weight-medium);
      transition: all 0.2s;
      padding: 0.5rem 1rem;
      border-radius: var(--sl-border-radius-medium);
    }

    .secondary-link:hover {
      color: var(--sl-color-primary-700);
      background-color: var(--sl-color-primary-50);
      text-decoration: none;
    }

    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }

    .info-card {
      text-align: left;
      border: none;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
    }

    .breadcrumb-card {
      margin-bottom: 2rem;
    }

    .breadcrumb-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .breadcrumb-path {
      font-family: var(--sl-font-mono);
      background: var(--sl-color-neutral-100);
      padding: 0.25rem 0.5rem;
      border-radius: var(--sl-border-radius-small);
      color: var(--sl-color-neutral-800);
    }

    .search-section {
      margin-top: 2rem;
    }

    .search-form {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .search-suggestions {
      display: grid;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--sl-color-neutral-50);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
      cursor: pointer;
    }

    .suggestion-item:hover {
      background: var(--sl-color-primary-50);
      border-color: var(--sl-color-primary-300);
      text-decoration: none;
    }

    .suggestion-content {
      flex: 1;
      text-align: left;
    }

    .suggestion-title {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.25rem;
    }

    .suggestion-description {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .help-section {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--sl-color-neutral-200);
    }

    .help-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      text-align: left;
    }

    .help-item {
      padding: 1rem;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      border: 1px solid var(--sl-color-neutral-200);
    }

    .help-item h4 {
      margin: 0 0 0.5rem 0;
      font-size: var(--sl-font-size-medium);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
    }

    .help-item p {
      margin: 0;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .error-animation {
        font-size: 5rem;
      }

      .error-title {
        font-size: 1.5rem;
      }

      .error-message {
        font-size: 1rem;
      }

      .primary-actions {
        flex-direction: column;
        align-items: center;
      }

      .primary-actions sl-button {
        width: 100%;
        max-width: 280px;
      }

      .secondary-actions {
        flex-direction: column;
        gap: 1rem;
      }

      .search-form {
        flex-direction: column;
      }

      .info-cards {
        grid-template-columns: 1fr;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .error-animation {
      background: linear-gradient(135deg, var(--sl-color-primary-400), var(--sl-color-warning-400));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    :host(.sl-theme-dark) .error-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .error-message {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .info-card {
      background: rgba(0, 0, 0, 0.4);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .breadcrumb-path {
      background: var(--sl-color-neutral-800);
      color: var(--sl-color-neutral-200);
    }

    :host(.sl-theme-dark) .secondary-link {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .secondary-link:hover {
      color: var(--sl-color-primary-300);
      background-color: var(--sl-color-primary-950);
    }

    :host(.sl-theme-dark) .suggestion-item {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .suggestion-item:hover {
      background: var(--sl-color-primary-950);
      border-color: var(--sl-color-primary-700);
    }

    :host(.sl-theme-dark) .suggestion-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .suggestion-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .help-section {
      border-top-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .help-item {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .help-item h4 {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .help-item p {
      color: var(--sl-color-neutral-400);
    }
  `;

  @property({ type: Object }) routerController!: RouterController;
  @state() private searchTerm = '';
  @state() private showSuggestions = false;

  private searchSuggestions: SearchSuggestion[] = [
    {
      title: 'Dashboard',
      url: '/app',
      description: 'View your main dashboard and overview',
      keywords: ['dashboard', 'home', 'overview', 'main']
    },
    {
      title: 'Scopes',
      url: '/app/scopes',
      description: 'Manage your project scopes and tasks',
      keywords: ['scopes', 'projects', 'tasks', 'work']
    },
    {
      title: 'Data Settings',
      url: '/app/data-settings',
      description: 'Configure groups, labels, and categories',
      keywords: ['settings', 'configuration', 'groups', 'labels', 'categories']
    },
    {
      title: 'Billing',
      url: '/app/billing',
      description: 'Manage your subscription and billing',
      keywords: ['billing', 'subscription', 'payment', 'plan']
    },
    {
      title: 'Sign In',
      url: '/auth/sign-in',
      description: 'Access your account',
      keywords: ['sign in', 'login', 'access', 'account']
    },
    {
      title: 'Sign Up',
      url: '/auth/sign-up',
      description: 'Create a new account',
      keywords: ['sign up', 'register', 'create account', 'join']
    }
  ];

  render() {
    const currentPath = this.routerController?.currentRoute || window.location.pathname;
    const isAppRoute = currentPath.startsWith('/app');

    return html`
      <div class="container">
        <div class="content">
          ${this.renderBreadcrumb(currentPath)}
          
          <div class="error-illustration">🔍</div>
          <div class="error-animation">404</div>
          <h1 class="error-title">Oops! Page Not Found</h1>
          <p class="error-message">
            The page you're looking for seems to have wandered off into the digital wilderness. 
            Don't worry though, we'll help you find your way back!
          </p>

          <div class="actions-section">
            <div class="primary-actions">
              <sl-button 
                variant="primary" 
                size="large"
                @click=${this.goHome}
              >
                <sl-icon slot="prefix" name="house"></sl-icon>
                Go Home
              </sl-button>
              
              <sl-button 
                variant="default" 
                size="large"
                @click=${this.goBack}
              >
                <sl-icon slot="prefix" name="arrow-left"></sl-icon>
                Go Back
              </sl-button>
            </div>

            <div class="secondary-actions">
              ${isAppRoute ? html`
                <a href="/app" class="secondary-link">
                  <sl-icon name="speedometer2"></sl-icon>
                  Dashboard
                </a>
                <a href="/app/scopes" class="secondary-link">
                  <sl-icon name="folder"></sl-icon>
                  Scopes
                </a>
                <a href="/app/data-settings" class="secondary-link">
                  <sl-icon name="gear"></sl-icon>
                  Settings
                </a>
              ` : html`
                <a href="/auth/sign-in" class="secondary-link">
                  <sl-icon name="box-arrow-in-right"></sl-icon>
                  Sign In
                </a>
                <a href="/auth/sign-up" class="secondary-link">
                  <sl-icon name="person-plus"></sl-icon>
                  Sign Up
                </a>
                <a href="/" class="secondary-link">
                  <sl-icon name="house"></sl-icon>
                  Homepage
                </a>
              `}
            </div>
          </div>

          ${this.renderSearchSection()}
          ${this.renderHelpSection()}
        </div>
      </div>
    `;
  }

  private renderBreadcrumb(path: string) {
    if (!path || path === '/') return '';

    return html`
      <sl-card class="info-card breadcrumb-card">
        <div class="breadcrumb-content">
          <sl-icon name="info-circle"></sl-icon>
          <strong>You were looking for:</strong>
          <span class="breadcrumb-path">${path}</span>
        </div>
      </sl-card>
    `;
  }

  private renderSearchSection() {
    const filteredSuggestions = this.getFilteredSuggestions();

    return html`
      <sl-card class="info-card search-section">
        <h3>
          <sl-icon name="search"></sl-icon>
          Search for what you need
        </h3>
        
        <div class="search-form">
          <sl-input
            placeholder="Search for pages, features, or help..."
            .value=${this.searchTerm}
            @sl-input=${(e: CustomEvent) => this.handleSearchInput(e)}
            @keydown=${this.handleSearchKeydown}
          >
            <sl-icon slot="prefix" name="search"></sl-icon>
          </sl-input>
          <sl-button 
            variant="primary" 
            @click=${this.handleSearch}
            ?disabled=${!this.searchTerm.trim()}
          >
            Search
          </sl-button>
        </div>

        ${this.showSuggestions && filteredSuggestions.length > 0 ? html`
          <div class="search-suggestions">
            <h4>Suggestions:</h4>
            ${filteredSuggestions.slice(0, 4).map(suggestion => html`
              <div class="suggestion-item" @click=${() => this.navigateToSuggestion(suggestion)}>
                <sl-icon name="arrow-right"></sl-icon>
                <div class="suggestion-content">
                  <div class="suggestion-title">${suggestion.title}</div>
                  <div class="suggestion-description">${suggestion.description}</div>
                </div>
              </div>
            `)}
          </div>
        ` : ''}
      </sl-card>
    `;
  }

  private renderHelpSection() {
    return html`
      <div class="help-section">
        <h3>Need more help?</h3>
        <div class="help-content">
          <div class="help-item">
            <h4>
              <sl-icon name="book"></sl-icon>
              Documentation
            </h4>
            <p>Check our comprehensive guides and tutorials</p>
          </div>
          <div class="help-item">
            <h4>
              <sl-icon name="chat-dots"></sl-icon>
              Support
            </h4>
            <p>Contact our support team for assistance</p>
          </div>
          <div class="help-item">
            <h4>
              <sl-icon name="bug"></sl-icon>
              Report Issue
            </h4>
            <p>Found a broken link? Let us know!</p>
          </div>
        </div>
      </div>
    `;
  }

  private handleSearchInput(event: CustomEvent) {
    this.searchTerm = (event.target as any).value;
    this.showSuggestions = this.searchTerm.trim().length > 0;
  }

  private handleSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }

  private getFilteredSuggestions(): SearchSuggestion[] {
    if (!this.searchTerm.trim()) return [];

    const term = this.searchTerm.toLowerCase();
    return this.searchSuggestions.filter(suggestion => 
      suggestion.title.toLowerCase().includes(term) ||
      suggestion.description.toLowerCase().includes(term) ||
      suggestion.keywords.some(keyword => keyword.toLowerCase().includes(term))
    );
  }

  private handleSearch() {
    const term = this.searchTerm.trim();
    if (!term) return;

    const filteredSuggestions = this.getFilteredSuggestions();
    
    if (filteredSuggestions.length > 0) {
      this.navigateToSuggestion(filteredSuggestions[0]);
    } else {
      this.showSearchNotification(term);
    }
  }

  private navigateToSuggestion(suggestion: SearchSuggestion) {
    if (this.routerController) {
      this.routerController.navigate(suggestion.url);
    } else {
      window.location.href = suggestion.url;
    }
  }

  private goHome() {
    if (this.routerController) {
      const currentPath = this.routerController.currentRoute;
      if (currentPath.startsWith('/app')) {
        this.routerController.goToDashboard();
      } else {
        this.routerController.goHome();
      }
    } else {
      window.location.href = '/';
    }
  }

  private goBack() {
    if (this.routerController) {
      this.routerController.back();
    } else {
      window.history.back();
    }
  }

  private showSearchNotification(searchTerm: string) {
    const notification = Object.assign(document.createElement('sl-alert'), {
      variant: 'neutral',
      closable: true,
      duration: 4000,
      innerHTML: `
        <sl-icon slot="icon" name="info-circle"></sl-icon>
        <strong>No results found for "${searchTerm}".</strong><br>
        Try searching for "dashboard", "scopes", "settings", or "billing".
      `
    });

    document.body.append(notification);
    notification.toast();
  }
}

