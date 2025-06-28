// src/components/app-root.ts
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateController } from '../controllers/state-controller';
import { RouterController } from '../controllers/router-controller';
import { ThemeController } from '../controllers/theme-controller';
import { LoadingController } from '../controllers/loading-controller';

// Import layout components
import './layout/app-layout';

// Import page components
import './pages/landing-page';
import './pages/sign-in-page';
import './pages/sign-up-page';
import './pages/forgot-password-page';
import './pages/reset-password-page';
import './pages/confirm-page';
import './pages/email-confirmation-page';
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

// Import updated page components
import './pages/billing-page';
import './pages/data-settings-page';
import './pages/team-members-page';
import './pages/team-page';

// Import common components
import './common/loading-spinner';
import './common/error-message';
import './common/skeleton-loader';

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

    /* Global loading states */
    .global-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      flex-direction: column;
      gap: 1rem;
      background-color: var(--sl-color-neutral-0);
    }

    .global-loading.public-route {
      background: linear-gradient(135deg, var(--sl-color-primary-50) 0%, var(--sl-color-warning-50) 100%);
    }

    .loading-content {
      text-align: center;
      max-width: 400px;
      padding: 2rem;
    }

    .loading-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
    }

    .loading-subtitle {
      margin: 0;
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-medium);
    }

    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
      background-color: var(--sl-color-neutral-0);
    }

    .error-content {
      text-align: center;
      max-width: 500px;
    }

    /* Skeleton loading for protected routes */
    .skeleton-container {
      min-height: 100vh;
      display: flex;
      background-color: var(--sl-color-neutral-0);
    }

    .skeleton-sidebar {
      width: 280px;
      background: var(--sl-color-neutral-50);
      border-right: 1px solid var(--sl-color-neutral-200);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .skeleton-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .skeleton-header {
      height: 64px;
      background: var(--sl-color-neutral-50);
      border-bottom: 1px solid var(--sl-color-neutral-200);
      padding: 0 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .skeleton-content {
      flex: 1;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .skeleton-card {
      height: 200px;
      background: var(--sl-color-neutral-100);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
    }

    /* Public route loading */
    .public-loading {
      background: linear-gradient(135deg, var(--sl-color-primary-50) 0%, var(--sl-color-warning-50) 100%);
    }

    .public-loading .loading-content {
      background: rgba(255, 255, 255, 0.9);
      border-radius: var(--sl-border-radius-large);
      box-shadow: var(--sl-shadow-large);
    }

    /* Dark theme support */
    :host(.sl-theme-dark) {
      background-color: var(--sl-color-neutral-900);
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .global-loading {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .global-loading.public-route {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .loading-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .loading-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .error-container {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .skeleton-container,
    :host(.sl-theme-dark) .skeleton-sidebar,
    :host(.sl-theme-dark) .skeleton-header {
      background-color: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .skeleton-card {
      background: var(--sl-color-neutral-700);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .public-loading .loading-content {
      background: rgba(0, 0, 0, 0.8);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .skeleton-sidebar {
        display: none;
      }
      
      .skeleton-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  //  controllers
  private stateController = new StateController(this);
  private routerController = new RouterController(this);
  private themeController = new ThemeController(this);
  private loadingController = new LoadingController(this, this.routerController);
  
  @state() private debugLogs: string[] = [];
  @state() private renderCount = 0;

  // State tracking for account switching
  private lastAccountSwitchRoute: string = '';
  private accountSwitchInProgress = false;

  connectedCallback() {
    super.connectedCallback();
    this.addDebugLog('🔌 AppRoot connected');
    this.addDebugLog(`📍 Initial route: ${window.location.pathname}`);
    
    // Connect controllers
    this.stateController.setRouter(this.routerController);
    this.loadingController.setRouter(this.routerController);
    
    // Setup error handling and recovery
    this.setupGlobalErrorHandlers();
    this.exposeRecoveryMethods();
  }

  private setupGlobalErrorHandlers() {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('[AppRoot] Unhandled promise rejection:', event.reason);
      
      const error = event.reason;
      if (error?.message?.includes('JWT') || 
          error?.message?.includes('session') || 
          error?.message?.includes('unauthorized')) {
        console.log('[AppRoot] Auth error detected, triggering recovery...');
        this.handleAuthError();
        event.preventDefault();
      }
    });

    window.addEventListener('error', (event) => {
      console.error('[AppRoot] Unhandled JavaScript error:', event.error);
      this.addDebugLog(`💥 Error: ${event.error?.message || 'Unknown error'}`);
    });
  }

  private async handleAuthError() {
    this.addDebugLog('🔧 Handling auth error...');
    try {
      const recovered = await this.stateController.recoverSession();
      if (!recovered) {
        await this.stateController.forceFullRecovery();
      }
    } catch (error) {
      console.error('[AppRoot] Error recovery failed:', error);
    }
  }

  private exposeRecoveryMethods() {
    (window as any).taskFlowRecovery = {
      forceFullRecovery: () => this.stateController.forceFullRecovery(),
      refreshData: () => this.stateController.refreshData(),
      recoverSession: () => this.stateController.recoverSession(),
      validateSession: () => this.stateController.validateSession(),
      isStateCorrupted: () => this.stateController.isStateCorrupted(),
      getState: () => this.stateController.state,
      clearError: () => this.stateController.clearError(),
      forceReload: () => window.location.reload(),
      goToMainDashboard: () => this.routerController.navigate('/app'),
      diagnose: () => {
        console.log('🔍 TASK FLOW DIAGNOSTICS');
        console.log('=========================');
        console.log('Current URL:', window.location.href);
        console.log('State:', this.stateController.state);
        console.log('Route:', this.routerController.currentRoute);
        console.log('Navigation State:', this.routerController.navigationState);
        console.log('Is Same Team Navigation:', this.routerController.isSameTeamNavigation());
        return {
          url: window.location.href,
          state: this.stateController.state,
          route: this.routerController.currentRoute,
          navigationState: this.routerController.navigationState,
          isSameTeamNavigation: this.routerController.isSameTeamNavigation()
        };
      }
    };
    
    console.log('[AppRoot] 🛠️ Recovery methods exposed globally as window.taskFlowRecovery');
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    console.log(`[AppRoot] ${logMessage}`);
    this.debugLogs = [...this.debugLogs.slice(-10), logMessage];
  }

  render() {
    this.renderCount++;
    this.addDebugLog(`🎨 Render #${this.renderCount}`);
    
    const { loading, error, isAuthenticated, user, accounts } = this.stateController.state;
    const currentComponent = this.routerController.getCurrentComponent();
    const requiresAuth = this.routerController.requiresAuth();
    const currentRoute = this.routerController.currentRoute;
    const navigationState = this.routerController.navigationState;
    const isNavigating = navigationState.isNavigating;
    const isSameTeamNav = this.routerController.isSameTeamNavigation();

    this.addDebugLog(`📊 State - loading: ${loading}, error: ${!!error}, auth: ${isAuthenticated}, user: ${!!user}`);
    this.addDebugLog(`🧭 Route - current: ${currentRoute}, component: ${currentComponent}, requiresAuth: ${requiresAuth}`);
    this.addDebugLog(`🔄 Navigation - isNavigating: ${isNavigating}, type: ${navigationState.type}, sameTeam: ${isSameTeamNav}`);

    // Global error state
    if (error && !loading) {
      this.addDebugLog(`❌ Showing global error: ${error}`);
      return html`
        <div class="error-container">
          <div class="error-content">
            <error-message 
              .message=${error}
              @retry=${() => this.stateController.clearError()}
            ></error-message>
          </div>
        </div>
      `;
    }

    // Initial app loading (before any user state is determined)
    if (loading && !user && navigationState.type === 'initial') {
      const isPublicRoute = !requiresAuth;
      this.addDebugLog('⏳ Showing initial app loading');
      
      return html`
        <div class="global-loading ${isPublicRoute ? 'public-route' : ''}">
          <div class="loading-content">
            <loading-spinner size="large"></loading-spinner>
            <h1 class="loading-title">Task Flow</h1>
            <p class="loading-subtitle">Loading your workspace...</p>
          </div>
        </div>
      `;
    }

    // Auth redirects with appropriate loading states
    if (requiresAuth && !isAuthenticated) {
      this.addDebugLog(`🔐 Auth required but not authenticated - redirecting`);
      setTimeout(() => this.routerController.goToSignIn(), 0);
      
      return this.renderSkeletonLoading('Redirecting to sign in...');
    }

    if (!requiresAuth && isAuthenticated && this.shouldRedirectToDashboard()) {
      this.addDebugLog(`🏠 Authenticated user on public route - redirecting`);
      setTimeout(() => this.routerController.goToDashboard(), 0);
      
      return html`
        <div class="global-loading public-route">
          <div class="loading-content">
            <loading-spinner size="large"></loading-spinner>
            <h1 class="loading-title">Welcome back!</h1>
            <p class="loading-subtitle">Redirecting to your dashboard...</p>
          </div>
        </div>
      `;
    }

    // Handle account switching for team routes - only show loading if it's an account switch type navigation
    if (isAuthenticated && user) {
      const teamSlug = this.routerController.context.params?.teamSlug;
      
      if (teamSlug && this.needsAccountSwitching(currentComponent)) {
        const routeChanged = this.lastAccountSwitchRoute !== currentRoute;
        
        // Only trigger account switching if this is an account-switch type navigation or first time
        if (routeChanged && !this.accountSwitchInProgress && 
            (navigationState.type === 'account-switch' || !this.lastAccountSwitchRoute)) {
          const currentAccount = this.stateController.state.currentAccount;
          const isCorrectAccount = currentAccount && 
                                 (currentAccount.slug === teamSlug || currentAccount.id === teamSlug);
          
          if (!isCorrectAccount) {
            this.lastAccountSwitchRoute = currentRoute;
            this.accountSwitchInProgress = true;
            
            this.handleAccountSwitching(teamSlug).finally(() => {
              this.accountSwitchInProgress = false;
              this.requestUpdate();
            });
            
            return this.renderSkeletonLoading(`Loading ${teamSlug} workspace...`);
          } else {
            this.lastAccountSwitchRoute = currentRoute;
          }
        } else if (this.accountSwitchInProgress) {
          return this.renderSkeletonLoading(`Loading ${teamSlug} workspace...`);
        }
      }
    }

    // Show loading state during navigation for account switches only (not same-team navigation)
    if (requiresAuth && isNavigating && navigationState.type === 'account-switch') {
      return this.renderSkeletonLoading('Loading...');
    }

    // Render main app layout
    this.addDebugLog(`✅ Rendering main app layout`);
    
    return html`
      <div class="app-container">
        ${requiresAuth ? html`
          <app-layout
            .stateController=${this.stateController}
            .routerController=${this.routerController}
            .themeController=${this.themeController}
            .loadingController=${this.loadingController}
          ></app-layout>
        ` : html`
          <!-- Public routes render directly without layout -->
          ${this.renderPublicPage(currentComponent)}
        `}
      </div>
    `;
  }

  private renderSkeletonLoading(message: string) {
    return html`
      <div class="skeleton-container">
        <div class="skeleton-sidebar">
          <skeleton-loader type="title"></skeleton-loader>
          <skeleton-loader type="list" count="6"></skeleton-loader>
        </div>
        <div class="skeleton-main">
          <div class="skeleton-header">
            <skeleton-loader type="circle" width="32px" height="32px"></skeleton-loader>
            <skeleton-loader type="text" width="200px"></skeleton-loader>
          </div>
          <div class="skeleton-content">
            <skeleton-loader type="text" width="300px"></skeleton-loader>
            <skeleton-loader type="title"></skeleton-loader>
            <div class="skeleton-grid">
              ${Array(6).fill(0).map(() => html`
                <div class="skeleton-card"></div>
              `)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderPublicPage(component: string) {
    const context = this.routerController.context;

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
      
      case 'email-confirmation-page':
        return html`<email-confirmation-page 
          .stateController=${this.stateController}
          .email=${context.query.get('email')}
        ></email-confirmation-page>`;
      
      case 'documentation-page':
        return html`<documentation-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></documentation-page>`;
      
      case 'not-found-page':
      default:
        return html`<not-found-page .routerController=${this.routerController}></not-found-page>`;
    }
  }

  private shouldRedirectToDashboard(): boolean {
    const publicRoutes = ['/', '/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password', '/auth/confirm', '/auth/email-confirmation'];
    return publicRoutes.includes(this.routerController.currentRoute);
  }

  private needsAccountSwitching(component: string): boolean {
    return component.includes('team-') || 
           component.includes('scopes') || 
           component.includes('scope-items') || 
           component.includes('profile') ||
           component.includes('billing') || 
           component.includes('data-settings');
  }

  private async handleAccountSwitching(teamSlug: string) {
    this.addDebugLog(`🔄 Handling account switch for team: ${teamSlug}`);
    
    try {
      const success = await this.stateController.ensureCorrectAccountForRoute(teamSlug);
      if (success) {
        this.addDebugLog(`✅ Successfully switched to team: ${teamSlug}`);
      } else {
        this.addDebugLog(`❌ Failed to switch to team: ${teamSlug}`);
      }
      return success;
    } catch (error) {
      console.error('[AppRoot] Account switching error:', error);
      this.addDebugLog(`💥 Account switch error: ${error instanceof Error ? error.message : 'Unknown'}`);
      return false;
    }
  }
}

