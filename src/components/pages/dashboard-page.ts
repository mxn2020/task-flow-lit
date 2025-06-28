// src/components/pages/dashboard-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';

@customElement('dashboard-page')
export class UpdatedDashboardPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Dashboard-specific styles */
    .welcome-section {
      background: linear-gradient(135deg, var(--sl-color-primary-500), var(--sl-color-primary-600));
      color: white;
      text-align: center;
      border-radius: var(--sl-border-radius-large);
      padding: 3rem 2rem;
      margin-bottom: 2rem;
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: var(--sl-font-weight-bold);
      margin: 0 0 0.5rem 0;
    }

    .welcome-subtitle {
      font-size: 1.1rem;
      margin: 0;
      opacity: 0.9;
    }

    .dashboard-stats {
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin-top: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1.5rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      margin-bottom: 0.25rem;
      display: block;
    }

    .stat-label {
      font-size: var(--sl-font-size-small);
      opacity: 0.9;
    }

    .user-info-card {
      background: var(--sl-color-success-50);
      border-color: var(--sl-color-success-200);
    }

    .team-card {
      border-left: 4px solid var(--sl-color-primary-600);
    }

    .team-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .team-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      border: 1px solid var(--sl-color-neutral-200);
      transition: all 0.2s ease;
    }

    .team-item:hover {
      background: var(--sl-color-neutral-100);
      border-color: var(--sl-color-primary-300);
      transform: translateX(4px);
    }

    .team-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .team-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--sl-color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: var(--sl-font-weight-bold);
      font-size: 0.875rem;
    }

    .team-name {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
    }

    .debug-card {
      background: var(--sl-color-neutral-100);
      border-color: var(--sl-color-neutral-300);
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

    .system-status {
      display: grid;
      gap: 0.75rem;
    }

    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-label {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-700);
    }

    .status-value {
      color: var(--sl-color-success-600);
      font-weight: var(--sl-font-weight-medium);
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .welcome-title {
        font-size: 2rem;
      }

      .dashboard-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .team-item {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .user-info-card {
      background: var(--sl-color-success-900);
      border-color: var(--sl-color-success-700);
    }

    :host(.sl-theme-dark) .team-item {
      background: var(--sl-color-neutral-700);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .team-item:hover {
      background: var(--sl-color-neutral-600);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .team-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .debug-card {
      background: var(--sl-color-neutral-700);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .status-label {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .status-value {
      color: var(--sl-color-success-400);
    }
  `;

  @state() private debugLogs: string[] = [];
  @state() private showDebug = true;

  async connectedCallback() {
    super.connectedCallback();
    this.addDebugLog('🔌 UpdatedDashboardPage connected');
    this.addDebugLog(`📍 Current URL: ${window.location.href}`);
    this.addDebugLog(`🔧 Router type: ${this.routerController.constructor.name}`);
    
    if (this.stateController?.state) {
      const { user, isAuthenticated, loading, accounts, currentAccount } = this.stateController.state;
      this.addDebugLog(`👤 User state - auth: ${isAuthenticated}, loading: ${loading}, user: ${!!user}`);
      this.addDebugLog(`🏢 Account state - accounts: ${accounts?.length || 0}, current: ${!!currentAccount}`);
      if (user) {
        this.addDebugLog(`👤 User details - email: ${user.email}, id: ${user.id?.substring(0, 8)}...`);
        const metadata = (user as any).user_metadata || {};
        this.addDebugLog(`👤 User metadata: ${JSON.stringify(metadata)}`);
      }
      if (currentAccount) {
        this.addDebugLog(`🏢 Current account: ${currentAccount.name} (${currentAccount.account_type})`);
      }
    } else {
      this.addDebugLog('❌ No StateController.state available');
    }

    await this.loadPageData();
  }

  protected async loadPageData(): Promise<void> {
    await this.withPageLoading(async () => {
      // Test database connection
      await this.testDatabaseConnection();
      
      // Simulate loading dashboard data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.addDebugLog('✅ Dashboard data loaded successfully');
    });
  }

  private async testDatabaseConnection() {
    this.addDebugLog('🧪 Testing database connection...');
    try {
      // Import Supabase service
      const { supabase } = await import('../../services/supabase');
      
      // Test current user
      const user = await supabase.getUser();
      this.addDebugLog(`👤 Direct user query: ${user ? `${user.email} (${user.id})` : 'null'}`);
      
      // Test direct table queries
      const client = supabase.supabaseClient;
      
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
      
      return true;
    } catch (error) {
      this.addDebugLog(`❌ Database test error: ${error}`);
      throw error;
    }
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    console.log(`[UpdatedDashboardPage] ${logMessage}`);
    this.debugLogs = [...this.debugLogs.slice(-15), logMessage];
    this.requestUpdate();
  }

  protected renderPageContent() {
    if (this.pageError) {
      return this.renderError(this.pageError, () => this.refreshPageData());
    }

    if (!this.stateController) {
      return html`
        <div class="page-content">
          ${this.renderError('StateController not provided to dashboard', () => window.location.reload())}
        </div>
      `;
    }

    const { user, isAuthenticated, accounts } = this.stateController.state;
    
    if (this.isLoading) {
      return this.renderLoading('Loading your dashboard...');
    }

    if (!isAuthenticated || !user) {
      return html`
        <div class="page-content">
          ${this.renderError(
            'Authentication required to access dashboard',
            () => this.routerController.goToSignIn()
          )}
        </div>
      `;
    }

    // Cast user to any to access Supabase-specific properties
    const supabaseUser = user as any;
    const userName = supabaseUser.user_metadata?.name || user.email?.split('@')[0] || 'there';
    const teamAccounts = accounts?.filter(acc => acc.account_type === 'team') || [];
    
    const dashboardStats = [
      { label: 'Teams', value: teamAccounts.length, icon: 'users' },
      { label: 'Projects', value: 0, icon: 'collection' },
      { label: 'Tasks', value: 0, icon: 'list-bullet' },
      { label: 'Completed', value: 0, icon: 'check-circle' }
    ];

    return html`
      <div class="page-content">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <h1 class="welcome-title">Welcome back, ${userName}! 👋</h1>
          <p class="welcome-subtitle">Here's your Task Flow dashboard</p>
          
          ${this.renderStats(dashboardStats)}
        </div>

        <div class="content-grid cols-2">
          <!-- User Info Card -->
          <div class="content-section">
            ${this.renderSectionHeader('Your Account')}
            
            <div class="content-card user-info-card">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <sl-avatar 
                  initial=${userName.charAt(0).toUpperCase()}
                  size="large"
                ></sl-avatar>
                <div>
                  <h3 style="margin: 0; color: var(--sl-color-success-700);">${userName}</h3>
                  <p style="margin: 0.25rem 0 0; color: var(--sl-color-success-600);">${user.email}</p>
                </div>
              </div>
              
              <div style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
                <div class="status-item">
                  <span class="status-label">Member since:</span>
                  <span class="status-value">${new Date(supabaseUser.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Email confirmed:</span>
                  <span class="status-value">${supabaseUser.email_confirmed_at ? '✅ Yes' : '❌ No'}</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Account type:</span>
                  <span class="status-value">Personal</span>
                </div>
              </div>

              <sl-button variant="default" size="small" @click=${this.goToProfile}>
                <sl-icon slot="prefix" name="person-circle"></sl-icon>
                Edit Profile
              </sl-button>
            </div>
          </div>

          <!-- Teams Card -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'Your Teams',
              undefined,
              html`
                <sl-button variant="primary" size="small" @click=${this.createTeam}>
                  <sl-icon slot="prefix" name="plus"></sl-icon>
                  Create Team
                </sl-button>
              `
            )}
            
            <div class="content-card team-card">
              ${teamAccounts.length === 0 ? this.renderEmptyState(
                'people',
                'No teams yet',
                'Teams help you organize and collaborate on projects with others.',
                html`
                  <sl-button variant="primary" @click=${this.createTeam}>
                    <sl-icon slot="prefix" name="plus"></sl-icon>
                    Create Your First Team
                  </sl-button>
                `
              ) : html`
                <div class="team-list">
                  ${teamAccounts.map(team => {
                    this.addDebugLog(`🏢 Team data: ${JSON.stringify(team)}`);
                    const teamSlug = team.slug || team.id;
                    this.addDebugLog(`🏢 Using team slug/id: "${teamSlug}"`);
                    
                    return html`
                      <div class="team-item">
                        <div class="team-info">
                          <div class="team-avatar">${team.name?.charAt(0) || 'T'}</div>
                          <span class="team-name">${team.name}</span>
                        </div>
                        <sl-button 
                          variant="default" 
                          size="small" 
                          @click=${() => this.goToTeam(teamSlug)}
                        >
                          <sl-icon slot="prefix" name="arrow-right"></sl-icon>
                          Open
                        </sl-button>
                      </div>
                    `;
                  })}
                </div>
              `}
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="content-section">
            ${this.renderSectionHeader('Quick Actions')}
            
            <div class="content-card">
              <p style="margin-bottom: 1.5rem; color: var(--sl-color-neutral-600);">
                Common tasks and shortcuts to get things done faster.
              </p>
              
              <div style="display: grid; gap: 0.75rem;">
                <sl-button variant="default" size="small" @click=${this.viewDocumentation}>
                  <sl-icon slot="prefix" name="book"></sl-icon>
                  View Documentation
                </sl-button>
                <sl-button variant="default" size="small" @click=${this.contactSupport}>
                  <sl-icon slot="prefix" name="chat-dots"></sl-icon>
                  Contact Support
                </sl-button>
                <sl-button variant="default" size="small" @click=${() => this.themeController.toggleTheme()}>
                  <sl-icon slot="prefix" name=${this.themeController.theme === 'dark' ? 'sun' : 'moon-stars'}></sl-icon>
                  Switch to ${this.themeController.theme === 'dark' ? 'Light' : 'Dark'} Mode
                </sl-button>
                <sl-button variant="default" size="small" @click=${this.handleSignOut}>
                  <sl-icon slot="prefix" name="box-arrow-right"></sl-icon>
                  Sign Out
                </sl-button>
              </div>
            </div>
          </div>

          <!-- System Status Card -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'System Status',
              undefined,
              html`
                <sl-button 
                  variant="text" 
                  size="small" 
                  @click=${() => this.showDebug = !this.showDebug}
                >
                  <sl-icon slot="prefix" name=${this.showDebug ? 'eye-slash' : 'eye'}></sl-icon>
                  ${this.showDebug ? 'Hide' : 'Show'} Debug
                </sl-button>
              `
            )}
            
            <div class="content-card">
              <div class="system-status">
                <div class="status-item">
                  <span class="status-label">App Version:</span>
                  <span class="status-value">1.0.0</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Last Updated:</span>
                  <span class="status-value">Just now</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Router:</span>
                  <span class="status-value"> ✅</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Status:</span>
                  <span class="status-value">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        ${this.showDebug ? this.renderDebugSection() : ''}
      </div>
    `;
  }

  renderStats(stats: Array<{ label: string; value: number; icon: string }>) {
    return html`
      <div class="dashboard-stats">
        ${stats.map(stat => html`
          <div class="stat-item">
            <sl-icon name="${stat.icon}" style="font-size:2rem;margin-bottom:0.5rem;"></sl-icon>
            <span class="stat-value">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
          </div>
        `)}
      </div>
    `;
  }

  private renderDebugSection() {
    const state = this.stateController?.state || {};
    
    return html`
      <div class="content-section">
        ${this.renderSectionHeader('Debug Information')}
        
        <div class="content-card debug-card">
          <h4 style="margin-top: 0;">Component Logs:</h4>
          <div class="debug-info">${this.debugLogs.join('\n')}</div>
          
          <h4>Current State:</h4>
          <div class="debug-info">${JSON.stringify({
            loading: state.loading,
            isAuthenticated: state.isAuthenticated,
            hasUser: !!state.user,
            userEmail: state.user?.email,
            accountsCount: state.accounts?.length || 0,
            currentAccount: state.currentAccount?.name || 'none',
            error: state.error,
            pageLoading: this.pageLoading,
            pageError: this.pageError,
            routerType: this.routerController.constructor.name,
            navigationState: this.routerController.navigationState
          }, null, 2)}</div>
        </div>
      </div>
    `;
  }

  private async handleSignOut() {
    this.addDebugLog('🚪 Sign out requested');
    
    await this.withPageLoading(async () => {
      const result = await this.stateController.signOut();
      if (!result?.error) {
        this.addDebugLog('✅ Sign out successful');
        this.routerController.goToSignIn();
      } else {
        this.addDebugLog(`❌ Sign out error: ${result.error}`);
        throw new Error(result.error);
      }
    });
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
    this.navigateTo(`/app/${teamSlug}`);
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

