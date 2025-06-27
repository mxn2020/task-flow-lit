// src/components/pages/not-found-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { RouterController } from '../../controllers/router-controller';

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
      max-width: 500px;
      width: 100%;
    }

    .error-code {
      font-size: 8rem;
      font-weight: bold;
      color: var(--sl-color-primary-600);
      line-height: 1;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
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
      font-size: 4rem;
      margin-bottom: 2rem;
      opacity: 0.8;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .primary-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .secondary-actions {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .secondary-link {
      color: var(--sl-color-primary-600);
      text-decoration: none;
      font-weight: var(--sl-font-weight-medium);
      transition: color 0.2s;
    }

    .secondary-link:hover {
      color: var(--sl-color-primary-700);
      text-decoration: underline;
    }

    .breadcrumb {
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      margin-bottom: 2rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .search-suggestion {
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin-top: 2rem;
    }

    .search-title {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 1rem;
    }

    .search-input {
      width: 100%;
      margin-bottom: 1rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .error-code {
        font-size: 6rem;
      }

      .error-title {
        font-size: 1.5rem;
      }

      .error-message {
        font-size: 1rem;
      }

      .primary-actions {
        flex-direction: column;
        width: 100%;
      }

      .primary-actions sl-button {
        width: 100%;
      }

      .secondary-actions {
        flex-direction: column;
        gap: 1rem;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .error-code {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .error-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .error-message {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .breadcrumb,
    :host(.sl-theme-dark) .search-suggestion {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .search-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .secondary-link {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .secondary-link:hover {
      color: var(--sl-color-primary-300);
    }
  `;

  @property({ type: Object }) routerController!: RouterController;

  render() {
    const currentPath = this.routerController?.currentRoute || window.location.pathname;
    const isAppRoute = currentPath.startsWith('/app');

    return html`
      <div class="container">
        <div class="content">
          ${this.renderBreadcrumb(currentPath)}
          
          <div class="error-illustration">🔍</div>
          <div class="error-code">404</div>
          <h1 class="error-title">Page Not Found</h1>
          <p class="error-message">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or the URL might be incorrect.
          </p>

          <div class="actions">
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
                <a href="/app" class="secondary-link">Dashboard</a>
                <a href="/app/scopes" class="secondary-link">View Scopes</a>
                <a href="/app/data-settings" class="secondary-link">Settings</a>
              ` : html`
                <a href="/auth/sign-in" class="secondary-link">Sign In</a>
                <a href="/auth/sign-up" class="secondary-link">Sign Up</a>
                <a href="/" class="secondary-link">Homepage</a>
              `}
            </div>
          </div>

          ${this.renderSearchSuggestion()}
        </div>
      </div>
    `;
  }

  private renderBreadcrumb(path: string) {
    const pathSegments = path.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) return '';

    return html`
      <div class="breadcrumb">
        <strong>You were trying to access:</strong> ${path}
      </div>
    `;
  }

  private renderSearchSuggestion() {
    return html`
      <div class="search-suggestion">
        <div class="search-title">Can't find what you're looking for?</div>
        <sl-input 
          class="search-input"
          placeholder="Search for pages, features, or help topics..."
          @keydown=${this.handleSearchKeydown}
        >
          <sl-icon slot="prefix" name="search"></sl-icon>
        </sl-input>
        <sl-button variant="default" size="small" @click=${this.handleSearch}>
          Search
        </sl-button>
      </div>
    `;
  }

  private goHome() {
    if (this.routerController) {
      // Check if user is authenticated by looking at current route patterns
      const currentPath = this.routerController.currentRoute;
      if (currentPath.startsWith('/app')) {
        this.routerController.goToDashboard();
      } else {
        this.routerController.goHome();
      }
    } else {
      // Fallback navigation
      window.location.href = '/';
    }
  }

  private goBack() {
    if (this.routerController) {
      this.routerController.back();
    } else {
      // Fallback navigation
      window.history.back();
    }
  }

  private handleSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }

  private handleSearch() {
    const input = this.shadowRoot?.querySelector('sl-input') as any;
    const searchTerm = input?.value?.trim();
    
    if (!searchTerm) return;

    // In a real app, you'd implement actual search functionality
    // For now, we'll redirect to a search results page or show a message
    
    const searchUrls = {
      'dashboard': '/app',
      'scopes': '/app/scopes',
      'settings': '/app/data-settings',
      'profile': '/app/profile',
      'team': '/app/team',
      'billing': '/app/billing',
      'documentation': '/app/documentation',
      'sign in': '/auth/sign-in',
      'sign up': '/auth/sign-up',
      'login': '/auth/sign-in',
      'register': '/auth/sign-up',
      'home': '/',
    };

    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchedUrl = Object.entries(searchUrls).find(([key]) => 
      key.includes(lowerSearchTerm) || lowerSearchTerm.includes(key)
    )?.[1];

    if (matchedUrl) {
      if (this.routerController) {
        this.routerController.navigate(matchedUrl);
      } else {
        window.location.href = matchedUrl;
      }
    } else {
      // Show a message that no results were found
      this.showSearchNotification(searchTerm);
    }
  }

  private showSearchNotification(searchTerm: string) {
    // Create and show a toast notification
    const notification = Object.assign(document.createElement('sl-alert'), {
      variant: 'neutral',
      closable: true,
      duration: 4000,
      innerHTML: `
        <sl-icon slot="icon" name="info-circle"></sl-icon>
        No results found for "${searchTerm}". Try searching for "dashboard", "scopes", "settings", or "profile".
      `
    });

    document.body.append(notification);
    notification.toast();
  }
}

