// src/components/pages/dashboard-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--sl-color-neutral-50);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      margin-bottom: 3rem;
      text-align: center;
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .welcome-subtitle {
      color: var(--sl-color-neutral-600);
      font-size: 1.1rem;
      margin: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: var(--sl-border-radius-large);
      box-shadow: var(--sl-shadow-medium);
      border: 1px solid var(--sl-color-neutral-200);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--sl-shadow-large);
    }

    .card-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .card-description {
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .card-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .stats-section {
      background: linear-gradient(135deg, var(--sl-color-primary-500), var(--sl-color-primary-600));
      color: white;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .stat-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: var(--sl-border-radius-medium);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: var(--sl-font-size-small);
      opacity: 0.9;
    }

    .user-info {
      background: var(--sl-color-success-50);
      border-color: var(--sl-color-success-200);
    }

    .debug-section {
      background: var(--sl-color-neutral-100);
      border-color: var(--sl-color-neutral-300);
      margin-top: 2rem;
    }

    .debug-info {
      background: var(--sl-color-neutral-800);
      color: var(--sl-color-neutral-100);
      padding: 1rem;
      border-radius: var(--sl-border-radius-medium);
      font-family: monospace;
      font-size: 0.875rem;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
    }

    .error-state {
      text-align: center;
      padding: 3rem;
      color: var(--sl-color-danger-600);
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .welcome-title {
        font-size: 2rem;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .welcome-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .welcome-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .card-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .card-description {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .user-info {
      background: var(--sl-color-success-900);
      border-color: var(--sl-color-success-700);
    }

    :host(.sl-theme-dark) .debug-section {
      background: var(--sl-color-neutral-700);
      border-color: var(--sl-color-neutral-600);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;

  @state() private debugLogs: string[] = [];
  @state() private showDebug = true;

  connectedCallback() {
    super.connectedCallback();
    this.addDebugLog('🔌 DashboardPage connected');
    this.addDebugLog(`📍 Current URL: ${window.location.href}`);
    this.addDebugLog(`🔐 Controllers provided - state: ${!!this.stateController}, router: ${!!this.routerController}, theme: ${!!this.themeController}`);
    
    if (this.stateController?.state) {
      const { user, isAuthenticated, loading, accounts, currentAccount } = this.stateController.state;
      this.addDebugLog(`👤 User state - auth: ${isAuthenticated}, loading: ${loading}, user: ${!!user}`);
      this.addDebugLog(`🏢 Account state - accounts: ${accounts?.length || 0}, current: ${!!currentAccount}`);
      if (user) {
        this.addDebugLog(`👤 User details - email: ${user.email}, id: ${user.id?.substring(0, 8)}...`);
        // For Supabase User type, use user_metadata property
        const metadata = (user as any).user_metadata || {};
        this.addDebugLog(`👤 User metadata: ${JSON.stringify(metadata)}`);
      }
      if (currentAccount) {
        this.addDebugLog(`🏢 Current account: ${currentAccount.name} (${currentAccount.account_type})`);
      }
    } else {
      this.addDebugLog('❌ No StateController.state available');
    }

    // Test database directly
    this.testDatabaseConnection();

    // Monitor state changes
    // this.stateController?.addEventListener?.('state-changed', () => {
    //   this.addDebugLog('🔄 State changed - triggering update');
    //   this.requestUpdate();
    // });
  }

  private async testDatabaseConnection() {
    this.addDebugLog('🧪 Testing direct database connection...');
    try {
      // Import Supabase service
      const { supabase } = await import('../../services/supabase');
      
      // Test current user
      const user = await supabase.getUser();
      this.addDebugLog(`👤 Direct user query: ${user ? `${user.email} (${user.id})` : 'null'}`);
      
      // Test direct table queries
      const client = supabase.supabaseClient;
      
      // Check if tables exist and what data is there
      this.addDebugLog('🔍 Testing table access...');
      
      // Test accounts table
      const { data: accountsData, error: accountsError } = await client
        .from('accounts')
        .select('*')
        .limit(5);
      this.addDebugLog(`📊 accounts table: ${accountsData?.length || 0} rows, error: ${accountsError?.message || 'none'}`);
      
      // Test user_accounts view/table
      const { data: userAccountsData, error: userAccountsError } = await client
        .from('user_accounts')
        .select('*')
        .limit(5);
      this.addDebugLog(`📊 user_accounts: ${userAccountsData?.length || 0} rows, error: ${userAccountsError?.message || 'none'}`);
      
      // Test user_account_workspace view/table
      const { data: workspaceData, error: workspaceError } = await client
        .from('user_account_workspace')
        .select('*')
        .limit(5);
      this.addDebugLog(`📊 user_account_workspace: ${workspaceData?.length || 0} rows, error: ${workspaceError?.message || 'none'}`);
      
    } catch (error) {
      this.addDebugLog(`❌ Database test error: ${error}`);
    }
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    console.log(`[DashboardPage] ${logMessage}`);
    this.debugLogs = [...this.debugLogs.slice(-15), logMessage]; // Keep last 15 logs
    this.requestUpdate();
  }

  render() {
    if (!this.stateController) {
      this.addDebugLog('❌ No StateController provided');
      return html`
        <div class="container">
          <div class="error-state">
            <h1>Configuration Error</h1>
            <p>StateController not provided to dashboard</p>
          </div>
        </div>
      `;
    }

    const { user, isAuthenticated, loading, error, accounts, currentAccount } = this.stateController.state;

    this.addDebugLog(`🎨 Rendering - loading: ${loading}, auth: ${isAuthenticated}, user: ${!!user}, error: ${!!error}`);

    if (loading && !user) {
      this.addDebugLog('⏳ Showing loading state');
      return html`
        <div class="container">
          <div class="loading-state">
            <loading-spinner size="large" text="Loading your dashboard..."></loading-spinner>
          </div>
          ${this.renderDebugSection()}
        </div>
      `;
    }

    if (error) {
      this.addDebugLog(`❌ Error state: ${error}`);
      return html`
        <div class="container">
          <div class="error-state">
            <h1>Error Loading Dashboard</h1>
            <p>${error}</p>
            <sl-button @click=${this.handleRetry}>Retry</sl-button>
          </div>
          ${this.renderDebugSection()}
        </div>
      `;
    }

    if (!isAuthenticated || !user) {
      this.addDebugLog('🔐 Not authenticated, showing auth message');
      return html`
        <div class="container">
          <div class="error-state">
            <h1>Authentication Required</h1>
            <p>Please sign in to access your dashboard.</p>
            <sl-button variant="primary" @click=${() => this.routerController.goToSignIn()}>
              Sign In
            </sl-button>
          </div>
          ${this.renderDebugSection()}
        </div>
      `;
    }

    this.addDebugLog('✅ Rendering authenticated dashboard');

    // Cast user to any to access Supabase-specific properties
    const supabaseUser = user as any;
    const userName = supabaseUser.user_metadata?.name || user.email?.split('@')[0] || 'there';
    const teamAccounts = accounts?.filter(acc => acc.account_type === 'team') || [];

    return html`
      <div class="container">
        <div class="header">
          <h1 class="welcome-title">Welcome back, ${userName}! 👋</h1>
          <p class="welcome-subtitle">Here's your Task Flow dashboard</p>
        </div>

        <div class="dashboard-grid">
          <!-- User Info Card -->
          <div class="card user-info">
            <div class="card-icon">👤</div>
            <h2 class="card-title">Your Account</h2>
            <div class="card-description">
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Member since:</strong> ${new Date(supabaseUser.created_at || Date.now()).toLocaleDateString()}</p>
              <p><strong>Email confirmed:</strong> ${supabaseUser.email_confirmed_at ? '✅ Yes' : '❌ No'}</p>
            </div>
            <div class="card-actions">
              <sl-button variant="default" size="small" @click=${this.goToProfile}>
                Edit Profile
              </sl-button>
            </div>
          </div>

          <!-- Stats Card -->
          <div class="card stats-section">
            <div class="card-icon">📊</div>
            <h2 class="card-title">Your Stats</h2>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">${teamAccounts.length}</div>
                <div class="stat-label">Teams</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">0</div>
                <div class="stat-label">Projects</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">0</div>
                <div class="stat-label">Tasks</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">0</div>
                <div class="stat-label">Completed</div>
              </div>
            </div>
          </div>

          <!-- Teams Card -->
          <div class="card">
            <div class="card-icon">🏢</div>
            <h2 class="card-title">Your Teams</h2>
            <div class="card-description">
              ${teamAccounts.length === 0 ? html`
                <p>You haven't created any teams yet. Teams help you organize and collaborate on projects.</p>
              ` : html`
                <p>You're part of ${teamAccounts.length} team${teamAccounts.length !== 1 ? 's' : ''}:</p>
                <ul>
                  ${teamAccounts.map(team => {
                    this.addDebugLog(`🏢 Team data: ${JSON.stringify(team)}`);
                    // Use the actual slug from the database, or fall back to ID
                    const teamSlug = team.slug || team.id;
                    this.addDebugLog(`🏢 Using team slug/id: "${teamSlug}"`);
                    
                    return html`
                      <li>
                        <strong>${team.name}</strong> 
                        <sl-button variant="text" size="small" @click=${() => this.goToTeam(teamSlug)}>
                          Open →
                        </sl-button>
                      </li>
                    `;
                  })}
                </ul>
              `}
            </div>
            <div class="card-actions">
              <sl-button variant="primary" size="small" @click=${this.createTeam}>
                ${teamAccounts.length === 0 ? 'Create Your First Team' : 'Create New Team'}
              </sl-button>
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="card">
            <div class="card-icon">🚀</div>
            <h2 class="card-title">Quick Actions</h2>
            <div class="card-description">
              <p>Common tasks and shortcuts to get things done faster.</p>
            </div>
            <div class="card-actions">
              <sl-button variant="default" size="small" @click=${this.viewDocumentation}>
                📚 Documentation
              </sl-button>
              <sl-button variant="default" size="small" @click=${this.contactSupport}>
                💬 Support
              </sl-button>
              <sl-button variant="default" size="small" @click=${this.handleSignOut}>
                🚪 Sign Out
              </sl-button>
            </div>
          </div>

          <!-- System Status Card -->
          <div class="card">
            <div class="card-icon">⚡</div>
            <h2 class="card-title">System Status</h2>
            <div class="card-description">
              <p><strong>App Version:</strong> 1.0.0</p>
              <p><strong>Last Updated:</strong> Just now</p>
              <p><strong>Status:</strong> <span style="color: var(--sl-color-success-600);">All systems operational</span></p>
            </div>
            <div class="card-actions">
              <sl-button variant="text" size="small" @click=${() => this.showDebug = !this.showDebug}>
                ${this.showDebug ? '🔍 Hide Debug' : '🐛 Show Debug'}
              </sl-button>
            </div>
          </div>
        </div>

        ${this.showDebug ? this.renderDebugSection() : ''}
      </div>
    `;
  }

  private renderDebugSection() {
    const state = this.stateController?.state || {};
    
    return html`
      <div class="card debug-section">
        <div class="card-icon">🐛</div>
        <h2 class="card-title">Debug Information</h2>
        <div class="card-description">
          <h3>Component Logs:</h3>
          <div class="debug-info">${this.debugLogs.join('\n')}</div>
          
          <h3>Current State:</h3>
          <div class="debug-info">${JSON.stringify({
            loading: state.loading,
            isAuthenticated: state.isAuthenticated,
            hasUser: !!state.user,
            userEmail: state.user?.email,
            accountsCount: state.accounts?.length || 0,
            currentAccount: state.currentAccount?.name || 'none',
            error: state.error
          }, null, 2)}</div>
        </div>
      </div>
    `;
  }

  private handleRetry() {
    this.addDebugLog('🔄 Retry requested');
    window.location.reload();
  }

  private async handleSignOut() {
    this.addDebugLog('🚪 Sign out requested');
    try {
      await this.stateController.signOut();
      this.addDebugLog('✅ Sign out successful');
      this.routerController.goToSignIn();
    } catch (error) {
      this.addDebugLog(`❌ Sign out error: ${error}`);
    }
  }

  private createTeam() {
    this.addDebugLog('🏢 Create team clicked');
    // For now, just show an alert - you can implement a modal later
    alert('Team creation feature coming soon! This will open a modal to create a new team.');
  }

  private goToTeam(teamSlug: string) {
    this.addDebugLog(`🏢 Navigate to team: "${teamSlug}" (length: ${teamSlug.length})`);
    
    if (!teamSlug || teamSlug.trim() === '') {
      this.addDebugLog('❌ Empty team slug, cannot navigate');
      alert('Error: Team slug is missing. Please try refreshing the page.');
      return;
    }
    
    this.addDebugLog(`🚀 Navigating to team: ${teamSlug}`);
    this.routerController.goToTeam(teamSlug);
  }

  private goToProfile() {
    this.addDebugLog('👤 Go to profile clicked');
    alert('Profile page coming soon!');
  }

  private viewDocumentation() {
    this.addDebugLog('📚 View documentation clicked');
    window.open('https://docs.example.com', '_blank');
  }

  private contactSupport() {
    this.addDebugLog('💬 Contact support clicked');
    alert('Support contact: support@taskflow.example.com');
  }
}

