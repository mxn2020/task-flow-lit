// src/components/pages/team-dashboard-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { Scope, ScopeItem } from '../../types';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';
import '../common/skeleton-loader';
import '../common/error-message';

interface DashboardStats {
  totalScopes: number;
  totalItems: number;
  pendingItems: number;
  completedItems: number;
  completionRate: number;
}

@customElement('team-dashboard-page')
export class TeamDashboardPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Team Dashboard specific styles */
    .page-title {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
      max-width: 1400px;
    }

    .main-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .sidebar-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      border: none;
      background: linear-gradient(135deg, var(--sl-color-primary-50), var(--sl-color-primary-100));
      border-left: 4px solid var(--sl-color-primary-600);
    }

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-700);
      margin: 0 0 0.25rem 0;
      line-height: 1;
    }

    .stat-label {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-medium);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.7;
      margin-left: 1rem;
    }

    .completion-stat {
      background: linear-gradient(135deg, var(--sl-color-success-50), var(--sl-color-success-100));
      border-left-color: var(--sl-color-success-600);
    }

    .completion-stat .stat-value {
      color: var(--sl-color-success-700);
    }

    .content-card {
      border: none;
      box-shadow: var(--sl-shadow-medium);
      transition: box-shadow 0.2s ease;
    }

    .content-card:hover {
      box-shadow: var(--sl-shadow-large);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .recent-items-list {
      display: grid;
      gap: 0.75rem;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--sl-color-neutral-50);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .item-row:hover {
      background: var(--sl-color-neutral-100);
      border-color: var(--sl-color-primary-300);
      transform: translateY(-1px);
      box-shadow: var(--sl-shadow-small);
    }

    .item-status {
      flex-shrink: 0;
    }

    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-title {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.25rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-meta {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .scope-list {
      display: grid;
      gap: 0.75rem;
    }

    .scope-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--sl-color-neutral-50);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .scope-item:hover {
      background: var(--sl-color-neutral-100);
      border-color: var(--sl-color-primary-300);
      transform: translateY(-1px);
    }

    .scope-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .scope-info {
      flex: 1;
      min-width: 0;
    }

    .scope-name {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.25rem 0;
    }

    .scope-count {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 1rem;
      background: var(--sl-color-neutral-50);
      border: 2px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      color: inherit;
    }

    .action-button:hover {
      background: var(--sl-color-primary-50);
      border-color: var(--sl-color-primary-300);
      transform: translateY(-2px);
      box-shadow: var(--sl-shadow-medium);
    }

    .action-icon {
      font-size: 2rem;
    }

    .action-text {
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-700);
      text-align: center;
      line-height: 1.4;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--sl-color-neutral-600);
    }

    .empty-state sl-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: var(--sl-color-neutral-400);
    }

    .progress-indicator {
      margin-top: 0.5rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .stat-icon {
        font-size: 2rem;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }

      .item-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .page-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .page-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .stat-card {
      background: linear-gradient(135deg, var(--sl-color-primary-900), var(--sl-color-primary-800));
    }

    :host(.sl-theme-dark) .completion-stat {
      background: linear-gradient(135deg, var(--sl-color-success-900), var(--sl-color-success-800));
    }

    :host(.sl-theme-dark) .stat-value {
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .completion-stat .stat-value {
      color: var(--sl-color-success-300);
    }

    :host(.sl-theme-dark) .stat-label {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .card-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .item-row,
    :host(.sl-theme-dark) .scope-item,
    :host(.sl-theme-dark) .action-button {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .item-row:hover,
    :host(.sl-theme-dark) .scope-item:hover {
      background: var(--sl-color-neutral-700);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .action-button:hover {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .item-title,
    :host(.sl-theme-dark) .scope-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .item-meta,
    :host(.sl-theme-dark) .scope-count {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .action-text {
      color: var(--sl-color-neutral-300);
    }
  `;

  @state() private scopes: Scope[] = [];
  @state() private recentItems: ScopeItem[] = [];
  @state() private loading = true;
  @state() private error = '';
  @state() private stats: DashboardStats = {
    totalScopes: 0,
    totalItems: 0,
    pendingItems: 0,
    completedItems: 0,
    completionRate: 0
  };

  private loadInProgress = false;

  async connectedCallback() {
    super.connectedCallback();
    await this.waitForCorrectAccount();
    this.loadDashboardData();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('context')) {
      const oldContext = changedProperties.get('context');
      const newContext = this.context;
      
      const oldTeamSlug = oldContext?.params?.teamSlug;
      const newTeamSlug = newContext?.params?.teamSlug;
      
      if (oldTeamSlug !== newTeamSlug) {
        console.log('[TeamDashboard] Team slug changed, reloading data:', { from: oldTeamSlug, to: newTeamSlug });
        setTimeout(() => {
          this.loadDashboardData();
        }, 50);
      }
    }
  }

  private async waitForCorrectAccount(maxWaitTime = 5000): Promise<void> {
    const teamSlug = this.context?.params?.teamSlug;
    if (!teamSlug) return;

    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const checkAccount = () => {
        const currentAccount = this.stateController.state.currentAccount;
        const isCorrectAccount = currentAccount && 
          (currentAccount.slug === teamSlug || currentAccount.id === teamSlug);
        
        if (isCorrectAccount) {
          console.log('[TeamDashboard] Correct account found:', currentAccount);
          resolve();
          return;
        }

        const elapsed = Date.now() - startTime;
        if (elapsed >= maxWaitTime) {
          console.warn('[TeamDashboard] Timeout waiting for correct account');
          resolve();
          return;
        }

        setTimeout(checkAccount, 100);
      };

      checkAccount();
    });
  }

  private async loadDashboardData(): Promise<void> {
    if (this.loadInProgress) {
      console.log('[TeamDashboard] Data load already in progress, skipping...');
      return;
    }

    const accountId = this.currentAccount?.id;
    const teamSlug = this.context?.params?.teamSlug;
    
    console.log('[TeamDashboard] Loading dashboard data for:', { accountId, teamSlug });
    
    if (!accountId) {
      this.loading = false;
      this.loadInProgress = false;
      this.error = 'No account selected. Please select a team.';
      return;
    }

    const currentAccount = this.currentAccount;
    if (teamSlug && currentAccount && 
        currentAccount.slug !== teamSlug && currentAccount.id !== teamSlug) {
      this.loading = true;
      this.loadInProgress = false;
      this.error = '';
      return;
    }

    try {
      this.loadInProgress = true;
      this.loading = true;
      this.error = '';

      const timeoutId = setTimeout(() => {
        console.error('[TeamDashboard] Data load timeout');
        this.error = 'Data loading timed out. Please try refreshing the page.';
        this.loading = false;
        this.loadInProgress = false;
      }, 15000);

      // Load scopes
      const { data: scopes, error: scopesError } = await supabase.getScopes(accountId);
      if (scopesError) {
        if (scopesError.message?.includes('JWT') || 
            scopesError.message?.includes('session') || 
            scopesError.message?.includes('unauthorized')) {
          const recovered = await this.stateController.recoverSession();
          if (recovered) {
            clearTimeout(timeoutId);
            this.loadInProgress = false;
            return this.loadDashboardData();
          }
        }
        throw scopesError;
      }
      this.scopes = scopes || [];

      // Load recent items
      const { data: items, error: itemsError } = await supabase.getScopeItems(accountId);
      if (itemsError) {
        if (itemsError.message?.includes('JWT') || 
            itemsError.message?.includes('session') || 
            itemsError.message?.includes('unauthorized')) {
          const recovered = await this.stateController.recoverSession();
          if (recovered) {
            clearTimeout(timeoutId);
            this.loadInProgress = false;
            return this.loadDashboardData();
          }
        }
        throw itemsError;
      }
      this.recentItems = (items || []).slice(0, 10);

      // Calculate stats
      this.calculateStats();

      clearTimeout(timeoutId);
      
      console.log('[TeamDashboard] Data loaded successfully:', {
        scopesCount: this.scopes.length,
        itemsCount: this.recentItems.length
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      this.error = error instanceof Error ? error.message : 'Failed to load data';
    } finally {
      this.loading = false;
      this.loadInProgress = false;
    }
  }

  private calculateStats(): void {
    const totalItems = this.recentItems.length;
    const completedItems = this.recentItems.filter(item => item.completed).length;
    const pendingItems = totalItems - completedItems;
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    this.stats = {
      totalScopes: this.scopes.length,
      totalItems,
      pendingItems,
      completedItems,
      completionRate
    };
  }

  async forceRefresh(): Promise<void> {
    console.log('[TeamDashboard] Force refresh requested');
    this.loadInProgress = false;
    this.loading = true;
    this.error = '';
    
    try {
      await this.stateController.refreshData();
      await this.loadDashboardData();
    } catch (error) {
      console.error('[TeamDashboard] Force refresh failed:', error);
      this.error = 'Failed to refresh data. Please reload the page.';
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="page-layout">
          <app-sidebar 
            .stateController=${this.stateController}
            .routerController=${this.routerController}
            .themeController=${this.themeController}
            .currentTeamSlug=${this.teamSlug}
          ></app-sidebar>
          <div class="main-content">
            <div class="page-content">
              <skeleton-loader type="title"></skeleton-loader>
              <skeleton-loader type="card" count="3"></skeleton-loader>
            </div>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="page-layout">
          <app-sidebar 
            .stateController=${this.stateController}
            .routerController=${this.routerController}
            .themeController=${this.themeController}
            .currentTeamSlug=${this.teamSlug}
          ></app-sidebar>
          <div class="main-content">
            <div class="page-content">
              <error-message 
                .message=${this.error}
                .showRecovery=${true}
                @retry=${this.loadDashboardData}
              ></error-message>
            </div>
          </div>
        </div>
      `;
    }

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
            <h1 class="page-title">${this.currentAccount?.name || 'Team Dashboard'}</h1>
            <p class="page-subtitle">Overview of your team's activity and progress</p>
          </div>

          <div class="page-content">
            <!-- Stats Overview -->
            <div class="stats-grid">
              <sl-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-info">
                    <div class="stat-value">${this.stats.totalScopes}</div>
                    <div class="stat-label">Active Scopes</div>
                  </div>
                  <div class="stat-icon">🎯</div>
                </div>
              </sl-card>
              
              <sl-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-info">
                    <div class="stat-value">${this.stats.totalItems}</div>
                    <div class="stat-label">Total Items</div>
                  </div>
                  <div class="stat-icon">📝</div>
                </div>
              </sl-card>
              
              <sl-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-info">
                    <div class="stat-value">${this.stats.pendingItems}</div>
                    <div class="stat-label">Pending</div>
                  </div>
                  <div class="stat-icon">⏳</div>
                </div>
              </sl-card>
              
              <sl-card class="stat-card completion-stat">
                <div class="stat-content">
                  <div class="stat-info">
                    <div class="stat-value">${this.stats.completionRate}%</div>
                    <div class="stat-label">Completion Rate</div>
                    <sl-progress-bar 
                      value=${this.stats.completionRate} 
                      class="progress-indicator"
                    ></sl-progress-bar>
                  </div>
                  <div class="stat-icon">✅</div>
                </div>
              </sl-card>
            </div>

            <div class="dashboard-grid">
              <div class="main-section">
                <!-- Recent Activity -->
                <sl-card class="content-card">
                  <div class="card-header">
                    <h2 class="card-title">
                      <sl-icon name="clock-history"></sl-icon>
                      Recent Activity
                    </h2>
                    <sl-button 
                      size="small" 
                      variant="default" 
                      @click=${() => this.routerController.navigate(`/app/${this.teamSlug}/scopes`)}
                    >
                      <sl-icon slot="prefix" name="arrow-right"></sl-icon>
                      View All
                    </sl-button>
                  </div>
                  
                  ${this.recentItems.length === 0 ? html`
                    <div class="empty-state">
                      <sl-icon name="inbox"></sl-icon>
                      <h3>No recent activity</h3>
                      <p>Items will appear here as your team creates and updates them.</p>
                    </div>
                  ` : html`
                    <div class="recent-items-list">
                      ${this.recentItems.slice(0, 8).map(item => html`
                        <div class="item-row" @click=${() => this.goToScopeItem(item)}>
                          <sl-badge 
                            variant=${this.getStatusVariant(item.status)} 
                            class="item-status"
                          >
                            ${item.status.replace('_', ' ')}
                          </sl-badge>
                          <div class="item-info">
                            <h4 class="item-title">${item.title}</h4>
                            <div class="item-meta">
                              <span>
                                <sl-icon name="calendar"></sl-icon>
                                ${new Date(item.created_at).toLocaleDateString()}
                              </span>
                              ${item.priority_level ? html`
                                <span>
                                  <sl-icon name="flag"></sl-icon>
                                  ${item.priority_level} priority
                                </span>
                              ` : ''}
                            </div>
                          </div>
                          <sl-icon name="chevron-right"></sl-icon>
                        </div>
                      `)}
                    </div>
                  `}
                </sl-card>
              </div>

              <div class="sidebar-section">
                <!-- Quick Actions -->
                <sl-card class="content-card">
                  <div class="card-header">
                    <h2 class="card-title">
                      <sl-icon name="lightning"></sl-icon>
                      Quick Actions
                    </h2>
                  </div>
                  
                  <div class="quick-actions">
                    <div class="action-button" @click=${() => this.routerController.navigate(`/app/${this.teamSlug}/scopes`)}>
                      <div class="action-icon">📋</div>
                      <div class="action-text">Manage Scopes</div>
                    </div>
                    
                    <div class="action-button" @click=${() => this.routerController.navigate(`/app/${this.teamSlug}/data-settings`)}>
                      <div class="action-icon">⚙️</div>
                      <div class="action-text">Data Settings</div>
                    </div>
                    
                    <div class="action-button" @click=${() => this.routerController.navigate(`/app/${this.teamSlug}/team/members`)}>
                      <div class="action-icon">👥</div>
                      <div class="action-text">Team Members</div>
                    </div>
                    
                    <div class="action-button" @click=${() => this.routerController.navigate(`/app/${this.teamSlug}/billing`)}>
                      <div class="action-icon">💳</div>
                      <div class="action-text">Billing</div>
                    </div>
                  </div>
                </sl-card>

                <!-- Scopes Overview -->
                <sl-card class="content-card">
                  <div class="card-header">
                    <h2 class="card-title">
                      <sl-icon name="collection"></sl-icon>
                      Your Scopes
                    </h2>
                    <sl-button 
                      size="small" 
                      variant="default" 
                      @click=${() => this.routerController.navigate(`/app/${this.teamSlug}/scopes`)}
                    >
                      <sl-icon slot="prefix" name="gear"></sl-icon>
                      Manage
                    </sl-button>
                  </div>
                  
                  ${this.scopes.length === 0 ? html`
                    <div class="empty-state">
                      <sl-icon name="folder-plus"></sl-icon>
                      <h3>No scopes created yet</h3>
                      <p>Create your first scope to organize your work.</p>
                      <sl-button 
                        variant="primary" 
                        size="small"
                        @click=${() => this.routerController.navigate(`/app/${this.teamSlug}/scopes`)}
                      >
                        <sl-icon slot="prefix" name="plus"></sl-icon>
                        Create Scope
                      </sl-button>
                    </div>
                  ` : html`
                    <div class="scope-list">
                      ${this.scopes.slice(0, 6).map(scope => html`
                        <div class="scope-item" @click=${() => this.goToScope(scope)}>
                          <div class="scope-icon">${scope.icon || '📝'}</div>
                          <div class="scope-info">
                            <h4 class="scope-name">${scope.name}</h4>
                            <p class="scope-count">
                              ${this.getItemCountForScope(scope.id)} items
                            </p>
                          </div>
                          <sl-icon name="chevron-right"></sl-icon>
                        </div>
                      `)}
                    </div>
                  `}
                </sl-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getStatusVariant(status: string): string {
    switch (status) {
      case 'done': return 'success';
      case 'in_progress': return 'warning';
      case 'not_started': return 'neutral';
      default: return 'neutral';
    }
  }

  private getItemCountForScope(scopeId: string): number {
    return this.recentItems.filter(item => item.scope_id === scopeId).length;
  }

  private goToScope(scope: Scope) {
    this.routerController.goToScopeItems(this.teamSlug!, scope.id);
  }

  private goToScopeItem(item: ScopeItem) {
    this.routerController.goToScopeItems(this.teamSlug!, item.scope_id);
  }
}

