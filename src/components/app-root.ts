import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateController } from '../controllers/state-controller';
import { RouterController } from '../controllers/router-controller';
import { ThemeController } from '../controllers/theme-controller';

// Import page components
import './pages/landing-page';
import './pages/sign-in-page';
import './pages/sign-up-page';
import './pages/forgot-password-page';
import './pages/reset-password-page';
import './pages/confirm-page';
import './pages/onboarding-page';
import './pages/dashboard-page';
import './pages/team-dashboard-page';
import './pages/scopes-page';
import './pages/scope-items-page';
import './pages/data-settings-page';
import './pages/profile-page';
import './pages/team-page';
import './pages/team-members-page';
import './pages/billing-page';
import './pages/documentation-page';
import './pages/not-found-page';

// Import common components
import './common/loading-spinner';
import './common/error-message';

@customElement('app-root')
export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      font-family: var(--sl-font-sans);
      background-color: var(--sl-color-neutral-0);
      color: var(--sl-color-neutral-900);
    }

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      flex-direction: column;
      gap: 1rem;
    }

    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .page-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `;

  private stateController = new StateController(this);
  private routerController = new RouterController(this);
  private themeController = new ThemeController(this);

  render() {
    const { loading, error, isAuthenticated } = this.stateController.state;
    const currentComponent = this.routerController.getCurrentComponent();
    const requiresAuth = this.routerController.requiresAuth();

    // Show loading spinner during initial load
    if (loading && !this.stateController.state.user) {
      return html`
        <div class="loading-container">
          <loading-spinner size="large"></loading-spinner>
          <p>Loading Task Flow...</p>
        </div>
      `;
    }

    // Show global error
    if (error) {
      return html`
        <div class="error-container">
          <error-message 
            .message=${error}
            @retry=${() => this.stateController.clearError()}
          ></error-message>
        </div>
      `;
    }

    // Handle auth redirects
    if (requiresAuth && !isAuthenticated) {
      this.routerController.goToSignIn();
      return html`
        <div class="loading-container">
          <loading-spinner size="large"></loading-spinner>
          <p>Redirecting to sign in...</p>
        </div>
      `;
    }

    if (!requiresAuth && isAuthenticated && this.shouldRedirectToDashboard()) {
      this.routerController.goToDashboard();
      return html`
        <div class="loading-container">
          <loading-spinner size="large"></loading-spinner>
          <p>Redirecting to dashboard...</p>
        </div>
      `;
    }

    return html`
      <div class="app-container">
        <div class="page-container">
          ${this.renderPage(currentComponent)}
        </div>
      </div>
    `;
  }

  private shouldRedirectToDashboard(): boolean {
    const publicRoutes = ['/', '/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password', '/auth/confirm'];
    return publicRoutes.includes(this.routerController.currentRoute);
  }

  private renderPage(component: string) {
    const context = this.routerController.context;
    const state = this.stateController.state;

    switch (component) {
      case 'landing-page':
        return html`<landing-page></landing-page>`;
      
      case 'sign-in-page':
        return html`<sign-in-page .stateController=${this.stateController}></sign-in-page>`;
      
      case 'sign-up-page':
        return html`<sign-up-page .stateController=${this.stateController}></sign-up-page>`;
      
      case 'forgot-password-page':
        return html`<forgot-password-page .stateController=${this.stateController}></forgot-password-page>`;
      
      case 'reset-password-page':
        return html`<reset-password-page .stateController=${this.stateController}></reset-password-page>`;
      
      case 'confirm-page':
        return html`<confirm-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
        ></confirm-page>`;
      
      case 'onboarding-page':
        return html`<onboarding-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
        ></onboarding-page>`;
      
      case 'dashboard-page':
        return html`<dashboard-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
        ></dashboard-page>`;
      
      case 'team-dashboard-page':
        return html`<team-dashboard-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .context=${context}
        ></team-dashboard-page>`;
      
      case 'scopes-page':
        return html`<scopes-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .context=${context}
        ></scopes-page>`;
      
      case 'scope-items-page':
        return html`<scope-items-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .context=${context}
        ></scope-items-page>`;
      
      case 'data-settings-page':
        return html`<data-settings-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .context=${context}
        ></data-settings-page>`;
      
      case 'profile-page':
        return html`<profile-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .context=${context}
        ></profile-page>`;
      
      case 'team-page':
        return html`<team-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .context=${context}
        ></team-page>`;
      
      case 'team-members-page':
        return html`<team-members-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .context=${context}
        ></team-members-page>`;
      
      case 'billing-page':
        return html`<billing-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .context=${context}
        ></billing-page>`;
      
      case 'documentation-page':
        return html`<documentation-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .context=${context}
        ></documentation-page>`;
      
      case 'not-found-page':
      default:
        return html`<not-found-page .routerController=${this.routerController}></not-found-page>`;
    }
  }
}

