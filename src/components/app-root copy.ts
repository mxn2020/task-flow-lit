// src/components/app-root.ts
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

    .debug-info {
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 4px;
      font-size: 12px;
      max-width: 300px;
      z-index: 9999;
      font-family: monospace;
      transition: all 0.3s ease;
    }

    .debug-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      user-select: none;
    }

    .debug-header:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .debug-title {
      font-weight: bold;
      margin: 0;
    }

    .debug-toggle {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .debug-toggle.collapsed {
      transform: rotate(-90deg);
    }

    .debug-content {
      max-height: 200px;
      overflow-y: auto;
      padding: 0.5rem;
      transition: max-height 0.3s ease, padding 0.3s ease;
    }

    .debug-content.collapsed {
      max-height: 0;
      padding: 0 0.5rem;
      overflow: hidden;
    }

    .debug-info pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .debug-info.minimized {
      max-width: 180px;
    }
  `;

  private stateController = new StateController(this);
  private routerController = new RouterController(this);
  private themeController = new ThemeController(this);
  
  @state() private debugLogs: string[] = [];
  @state() private renderCount = 0;
  @state() private debugCollapsed = false;
  private lastAccountSwitchRoute: string = ''; // Track last route for account switching
  private lastAccountsLength = 0; // Track when accounts are loaded
  private pendingAccountSwitch = false; // Track if we need to retry account switching
  private accountSwitchInProgress = false; // Track if account switch is currently happening

  connectedCallback() {
    super.connectedCallback();
    this.addDebugLog('🔌 AppRoot connected');
    this.addDebugLog(`📍 Initial route: ${window.location.pathname}`);
    
    // Add global error handlers for unhandled errors
    this.setupGlobalErrorHandlers();
    
    // Expose recovery methods globally for debugging
    this.exposeRecoveryMethods();
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('[AppRoot] Unhandled promise rejection:', event.reason);
      
      // Check if it's a session/auth related error
      const error = event.reason;
      if (error?.message?.includes('JWT') || 
          error?.message?.includes('session') || 
          error?.message?.includes('unauthorized')) {
        console.log('[AppRoot] Auth error detected in unhandled rejection, triggering recovery...');
        this.handleAuthError();
        event.preventDefault(); // Prevent the error from being logged to console
      }
    });

    // Handle general JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('[AppRoot] Unhandled JavaScript error:', event.error);
      
      // Log to our debug system
      this.addDebugLog(`💥 Error: ${event.error?.message || 'Unknown error'}`);
    });

    // Periodically check for state corruption
    setInterval(() => {
      if (this.stateController.isStateCorrupted()) {
        console.warn('[AppRoot] Periodic state corruption check failed, triggering recovery...');
        this.addDebugLog('⚠️ State corruption detected, recovering...');
        this.handleStateCorruption();
      }
    }, 30000); // Check every 30 seconds
  }

  private async handleAuthError() {
    this.addDebugLog('🔧 Handling auth error...');
    try {
      const recovered = await this.stateController.recoverSession();
      if (!recovered) {
        this.addDebugLog('❌ Session recovery failed, forcing full recovery...');
        await this.stateController.forceFullRecovery();
      }
    } catch (error) {
      console.error('[AppRoot] Error recovery failed:', error);
      this.addDebugLog(`💥 Recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleStateCorruption() {
    this.addDebugLog('🔧 Handling state corruption...');
    try {
      const recovered = await this.stateController.forceFullRecovery();
      if (recovered) {
        this.addDebugLog('✅ State recovery successful');
      } else {
        this.addDebugLog('❌ State recovery failed');
      }
    } catch (error) {
      console.error('[AppRoot] State recovery failed:', error);
      this.addDebugLog(`💥 State recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    console.log(`[AppRoot] ${logMessage}`);
    this.debugLogs = [...this.debugLogs.slice(-15), logMessage]; // Keep last 15 logs
    this.requestUpdate();
  }

  private exposeRecoveryMethods() {
    // Make recovery methods available globally for debugging
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
      refreshTeamDashboard: () => {
        const teamDashboard = document.querySelector('team-dashboard-page') as any;
        if (teamDashboard?.forceRefresh) {
          return teamDashboard.forceRefresh();
        }
        console.warn('Team dashboard not found or does not have forceRefresh method');
        return false;
      },
      diagnose: () => {
        console.log('🔍 TASK FLOW DIAGNOSTICS');
        console.log('=========================');
        console.log('Current URL:', window.location.href);
        console.log('State:', this.stateController.state);
        console.log('Route:', this.routerController.currentRoute);
        console.log('Is State Corrupted:', this.stateController.isStateCorrupted());
        console.log('Local Storage:', {
          theme: localStorage.getItem('task-flow-theme'),
          lastRoute: localStorage.getItem('last-route')
        });
        console.log('Session Storage:', {
          keys: Object.keys(sessionStorage)
        });
        console.log('🔧 To fix issues, try:');
        console.log('- taskFlowRecovery.forceFullRecovery()');
        console.log('- taskFlowRecovery.refreshData()');
        console.log('- taskFlowRecovery.forceReload()');
        console.log('- taskFlowRecovery.goToMainDashboard()');
        return {
          url: window.location.href,
          state: this.stateController.state,
          route: this.routerController.currentRoute,
          isCorrupted: this.stateController.isStateCorrupted()
        };
      }
    };
    
    console.log('[AppRoot] 🛠️ Recovery methods exposed globally as window.taskFlowRecovery');
    console.log('[AppRoot] Available methods:', Object.keys((window as any).taskFlowRecovery));
    console.log('[AppRoot] 🔍 Run taskFlowRecovery.diagnose() to see current state');
  }

  render() {
    this.renderCount++;
    this.addDebugLog(`🎨 Render #${this.renderCount}`);
    
    const { loading, error, isAuthenticated, user, accounts } = this.stateController.state;
    const currentComponent = this.routerController.getCurrentComponent();
    const requiresAuth = this.routerController.requiresAuth();
    const currentRoute = this.routerController.currentRoute;

    this.addDebugLog(`📊 State - loading: ${loading}, error: ${!!error}, auth: ${isAuthenticated}, user: ${!!user}`);
    this.addDebugLog(`🧭 Route - current: ${currentRoute}, component: ${currentComponent}, requiresAuth: ${requiresAuth}`);

    // Track accounts length for better loading logic
    if (accounts.length > 0 && this.lastAccountsLength === 0) {
      this.lastAccountsLength = accounts.length;
      this.pendingAccountSwitch = false; // Reset pending state when accounts are first loaded
    }

    // Check if accounts were just loaded and we need to retry account switching
    if (accounts.length > this.lastAccountsLength && this.pendingAccountSwitch) {
      this.addDebugLog(`📈 Accounts loaded (${accounts.length}), retrying pending account switch...`);
      this.pendingAccountSwitch = false;
      setTimeout(() => {
        this.handleAccountSwitchingForRoute();
      }, 0);
    }
    this.lastAccountsLength = accounts.length;

    // Show loading spinner during initial load
    if (loading && !this.stateController.state.user) {
      this.addDebugLog('⏳ Showing initial loading spinner');
      return html`
        <div class="loading-container">
          <loading-spinner size="large"></loading-spinner>
          <p>Loading Task Flow...</p>
        </div>
        ${this.renderDebugInfo()}
      `;
    }

    // Show global error
    if (error) {
      this.addDebugLog(`❌ Showing global error: ${error}`);
      return html`
        <div class="error-container">
          <error-message 
            .message=${error}
            @retry=${() => this.stateController.clearError()}
          ></error-message>
        </div>
        ${this.renderDebugInfo()}
      `;
    }

    // Handle auth redirects
    if (requiresAuth && !isAuthenticated) {
      this.addDebugLog(`🔐 Auth required but not authenticated - redirecting to sign in`);
      this.addDebugLog(`📍 Current route: ${currentRoute}`);
      
      // Use setTimeout to avoid blocking the current render cycle
      setTimeout(() => {
        this.addDebugLog(`🚀 Executing redirect to sign in`);
        this.routerController.goToSignIn();
      }, 0);
      
      return html`
        <div class="loading-container">
          <loading-spinner size="large"></loading-spinner>
          <p>Redirecting to sign in...</p>
        </div>
        ${this.renderDebugInfo()}
      `;
    }

    if (!requiresAuth && isAuthenticated && this.shouldRedirectToDashboard()) {
      this.addDebugLog(`🏠 Authenticated user on public route - redirecting to dashboard`);
      this.addDebugLog(`📍 Current route: ${currentRoute}`);
      
      // Use setTimeout to avoid blocking the current render cycle
      setTimeout(() => {
        this.addDebugLog(`🚀 Executing redirect to dashboard`);
        this.routerController.goToDashboard();
      }, 0);
      
      return html`
        <div class="loading-container">
          <loading-spinner size="large"></loading-spinner>
          <p>Redirecting to dashboard...</p>
        </div>
        ${this.renderDebugInfo()}
      `;
    }

    // Handle account switching for authenticated users before rendering the page
    if (isAuthenticated && user) {
      const context = this.routerController.context;
      const teamSlug = context.params?.teamSlug;
      
      // Check if we need account switching for the current route
      if (teamSlug && this.needsAccountSwitching(currentComponent)) {
        // If accounts aren't loaded yet AND we've never had accounts, show loading
        // This prevents showing loading when accounts are temporarily empty during revalidation
        const neverHadAccounts = this.lastAccountsLength === 0 && accounts.length === 0;
        const shouldShowAccountLoading = (loading || neverHadAccounts) && !this.pendingAccountSwitch;
        
        if (shouldShowAccountLoading) {
          this.addDebugLog(`⏳ Waiting for accounts to load for team route: ${teamSlug}`);
          this.pendingAccountSwitch = true;
          return html`
            <div class="loading-container">
              <loading-spinner size="large"></loading-spinner>
              <p>Loading team data...</p>
            </div>
            ${this.renderDebugInfo()}
          `;
        }
        
        // Check if this is a new route that needs account switching
        const routeChanged = this.lastAccountSwitchRoute !== currentRoute;
        this.addDebugLog(`🔍 Route changed: ${routeChanged} (last: ${this.lastAccountSwitchRoute}, current: ${currentRoute})`);
        
        if (routeChanged && !this.accountSwitchInProgress) {
          // Check if we need to switch to the correct account
          const currentAccount = this.stateController.state.currentAccount;
          this.addDebugLog(`🔍 Current account: ${currentAccount?.slug || 'none'} (id: ${currentAccount?.id || 'none'})`);
          this.addDebugLog(`🎯 Target team: ${teamSlug}`);
          
          const isCorrectAccount = currentAccount && 
                                 (currentAccount.slug === teamSlug || currentAccount.id === teamSlug);
          
          this.addDebugLog(`✅ Is correct account: ${isCorrectAccount}`);
          
          if (!isCorrectAccount) {
            // Need to switch accounts
            this.lastAccountSwitchRoute = currentRoute;
            this.accountSwitchInProgress = true;
            this.addDebugLog(`🔄 Starting account switch for team: ${teamSlug}`);
            
            // Perform account switching asynchronously
            this.handleAccountSwitchingForRoute().then((success) => {
              this.accountSwitchInProgress = false;
              if (success) {
                this.addDebugLog(`✅ Account switch completed for team: ${teamSlug}`);
              } else {
                this.addDebugLog(`❌ Account switch failed for team: ${teamSlug}`);
              }
              this.requestUpdate(); // Trigger re-render
            }).catch((error) => {
              this.accountSwitchInProgress = false;
              console.error('[AppRoot] Account switching promise error:', error);
              this.addDebugLog(`💥 Account switch promise error: ${error.message}`);
              this.requestUpdate(); // Trigger re-render to show error
            });
            
            // Show loading while account switching is in progress
            this.addDebugLog(`⏳ Account switching in progress for team: ${teamSlug}`);
            return html`
              <div class="loading-container">
                <loading-spinner size="large"></loading-spinner>
                <p>Switching to team ${teamSlug}...</p>
              </div>
              ${this.renderDebugInfo()}
            `;
          } else {
            // Already on correct account, just update the tracking
            this.addDebugLog(`✅ Already on correct account for team: ${teamSlug}`);
            this.lastAccountSwitchRoute = currentRoute;
          }
        } else if (this.accountSwitchInProgress) {
          // Still switching accounts, show loading
          this.addDebugLog(`⏳ Account switching still in progress for team: ${teamSlug}`);
          return html`
            <div class="loading-container">
              <loading-spinner size="large"></loading-spinner>
              <p>Switching to team ${teamSlug}...</p>
            </div>
            ${this.renderDebugInfo()}
          `;
        }
      } else if (!teamSlug && currentComponent === 'dashboard-page') {
        // For personal dashboard, ensure we're on personal account
        if (this.lastAccountSwitchRoute !== currentRoute) {
          this.lastAccountSwitchRoute = currentRoute;
          setTimeout(async () => {
            try {
              await this.stateController.ensureCorrectAccountForRoute();
            } catch (error) {
              console.error('[AppRoot] Error switching to personal account:', error);
            }
          }, 0);
        }
      }
    }

    this.addDebugLog(`✅ Rendering page component: ${currentComponent}`);
    
    return html`
      <div class="app-container">
        <div class="page-container">
          ${this.renderPage(currentComponent)}
        </div>
      </div>
      ${this.renderDebugInfo()}
    `;
  }

  private renderDebugInfo() {
    return html`
      <div class="debug-info ${this.debugCollapsed ? 'minimized' : ''}">
        <div class="debug-header" @click=${this.toggleDebugCollapse}>
          <span class="debug-title">AppRoot Debug</span>
          <button class="debug-toggle ${this.debugCollapsed ? 'collapsed' : ''}" type="button">
            ▼
          </button>
        </div>
        <div class="debug-content ${this.debugCollapsed ? 'collapsed' : ''}">
          <pre>${this.debugLogs.join('\n')}</pre>
        </div>
      </div>
    `;
  }

  private toggleDebugCollapse() {
    this.debugCollapsed = !this.debugCollapsed;
  }

  private needsAccountSwitching(component: string): boolean {
    return component.includes('team-') || 
           component.includes('scopes') || 
           component.includes('scope-items') || 
           component.includes('profile') ||
           component.includes('billing') || 
           component.includes('data-settings') ||
           component.includes('documentation');
  }

  private shouldRedirectToDashboard(): boolean {
    const publicRoutes = ['/', '/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password', '/auth/confirm'];
    const shouldRedirect = publicRoutes.includes(this.routerController.currentRoute);
    this.addDebugLog(`🔍 Should redirect to dashboard: ${shouldRedirect} (current route: ${this.routerController.currentRoute})`);
    return shouldRedirect;
  }

  private renderPage(component: string) {
    const context = this.routerController.context;

    this.addDebugLog(`🔧 Rendering component: ${component}`);

    switch (component) {
      case 'landing-page':
        return html`<landing-page></landing-page>`;
      
      case 'sign-in-page':
        this.addDebugLog(`📋 Rendering sign-in-page with stateController`);
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

  private async handleAccountSwitchingForRoute() {
    const context = this.routerController.context;
    const teamSlug = context.params?.teamSlug;
    const currentComponent = this.routerController.getCurrentComponent();
    
    this.addDebugLog(`🔄 Executing account switch for route: ${this.routerController.currentRoute}`);
    
    // Handle team-related routes
    if (teamSlug && this.needsAccountSwitching(currentComponent)) {
      this.addDebugLog(`🔄 Ensuring correct account for team route: ${teamSlug}`);
      
      try {
        const success = await this.stateController.ensureCorrectAccountForRoute(teamSlug);
        if (!success) {
          this.addDebugLog(`❌ Failed to switch to team account: ${teamSlug}`);
        } else {
          this.addDebugLog(`✅ Successfully ensured correct account for team: ${teamSlug}`);
        }
        return success;
      } catch (error) {
        console.error('[AppRoot] Error switching accounts:', error);
        this.addDebugLog(`💥 Account switch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
      }
    } else if (!teamSlug && currentComponent === 'dashboard-page') {
      // For personal dashboard, ensure we're on personal account
      this.addDebugLog(`🏠 Ensuring personal account for dashboard`);
      try {
        const success = await this.stateController.ensureCorrectAccountForRoute();
        return success !== false; // ensureCorrectAccountForRoute returns boolean or undefined
      } catch (error) {
        console.error('[AppRoot] Error switching to personal account:', error);
        return false;
      }
    }
    
    return true; // No account switching needed
  }
}

