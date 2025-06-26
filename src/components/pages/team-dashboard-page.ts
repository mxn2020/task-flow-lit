import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext, Scope, ScopeItem } from '../../types';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';

@customElement('team-dashboard-page')
export class TeamDashboardPage extends LitElement {
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
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    .page-content {
      flex: 1;
      padding: 2rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
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
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-small);
      border: 1px solid var(--sl-color-neutral-200);
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-600);
      margin: 0 0 0.25rem 0;
    }

    .stat-label {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0;
    }

    .content-card {
      background: white;
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-small);
      border: 1px solid var(--sl-color-neutral-200);
      overflow: hidden;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      display: flex;
      justify-content: between;
      align-items: center;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0;
      flex: 1;
    }

    .card-content {
      padding: 1.5rem;
    }

    .recent-items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: var(--sl-border-radius-small);
      transition: background-color 0.2s;
      cursor: pointer;
    }

    .item-row:hover {
      background-color: var(--sl-color-neutral-50);
    }

    .item-status-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .item-status-dot.not_started {
      background-color: var(--sl-color-neutral-400);
    }

    .item-status-dot.in_progress {
      background-color: var(--sl-color-warning-500);
    }

    .item-status-dot.done {
      background-color: var(--sl-color-success-500);
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
    }

    .scope-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .scope-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--sl-border-radius-small);
      transition: background-color 0.2s;
      cursor: pointer;
    }

    .scope-item:hover {
      background-color: var(--sl-color-neutral-50);
    }

    .scope-icon {
      font-size: 1.25rem;
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
      gap: 0.75rem;
    }

    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: inherit;
    }

    .action-button:hover {
      box-shadow: var(--sl-shadow-medium);
      border-color: var(--sl-color-primary-300);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-text {
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-700);
      text-align: center;
    }

    .empty-state {
      text-align: center;
      padding: 2rem 1rem;
      color: var(--sl-color-neutral-600);
    }

    .empty-state-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        padding: 1rem;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }

      .quick-actions {
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

    :host(.sl-theme-dark) .stat-card,
    :host(.sl-theme-dark) .content-card,
    :host(.sl-theme-dark) .action-button {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .card-header {
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .card-title {
      color: var(--sl-color-neutral-100);
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

    :host(.sl-theme-dark) .item-row:hover,
    :host(.sl-theme-dark) .scope-item:hover {
      background-color: var(--sl-color-neutral-700);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) context!: RouteContext;

  @state() private scopes: Scope[] = [];
  @state() private recentItems: ScopeItem[] = [];
  @state() private loading = true;
  @state() private error = '';

  async connectedCallback() {
    super.connectedCallback();
    await this.loadDashboardData();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('context')) {
      this.loadDashboardData();
    }
  }

  private async loadDashboardData() {
    const accountId = this.stateController.state.currentAccount?.id;
    if (!accountId) return;

    try {
      this.loading = true;
      this.error = '';

      // Load scopes
      const { data: scopes, error: scopesError } = await supabase.getScopes(accountId);
      if (scopesError) throw scopesError;
      this.scopes = scopes || [];

      // Load recent items
      const { data: items, error: itemsError } = await supabase.getScopeItems(accountId);
      if (itemsError) throw itemsError;
      this.recentItems = (items || []).slice(0, 10); // Show last 10 items

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      this.error = error instanceof Error ? error.message : 'Failed to load data';
    } finally {
      this.loading = false;
    }
  }

  render() {
    const currentAccount = this.stateController.state.currentAccount;
    
    if (this.loading) {
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
            .currentTeamSlug=${this.context.params.teamSlug}
          ></app-sidebar>
          <div class="main-content">
            <div class="page-content">
              <error-message 
                .message=${this.error}
                @retry=${this.loadDashboardData}
              ></error-message>
            </div>
          </div>
        </div>
      `;
    }

    const completedItems = this.recentItems.filter(item => item.completed).length;
    const pendingItems = this.recentItems.filter(item => !item.completed).length;

    return html`
      <div class="page-layout">
        <app-sidebar 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .currentTeamSlug=${this.context.params.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">${currentAccount?.name || 'Team Dashboard'}</h1>
            <p class="page-subtitle">Overview of your team's activity and progress</p>
          </div>

          <div class="page-content">
            <div class="dashboard-grid">
              <div class="main-section">
                <!-- Stats Overview -->
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value">${this.scopes.length}</div>
                    <div class="stat-label">Active Scopes</div>
                  </div>
                  
                  <div class="stat-card">
                    <div class="stat-value">${this.recentItems.length}</div>
                    <div class="stat-label">Total Items</div>
                  </div>
                  
                  <div class="stat-card">
                    <div class="stat-value">${pendingItems}</div>
                    <div class="stat-label">Pending</div>
                  </div>
                  
                  <div class="stat-card">
                    <div class="stat-value">${completedItems}</div>
                    <div class="stat-label">Completed</div>
                  </div>
                </div>

                <!-- Recent Activity -->
                <div class="content-card">
                  <div class="card-header">
                    <h2 class="card-title">Recent Activity</h2>
                    <sl-button size="small" variant="default" href="/app/${this.context.params.teamSlug}/scopes">
                      View All
                    </sl-button>
                  </div>
                  <div class="card-content">
                    ${this.recentItems.length === 0 ? html`
                      <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <p>No recent activity</p>
                      </div>
                    ` : html`
                      <div class="recent-items-list">
                        ${this.recentItems.slice(0, 8).map(item => html`
                          <div class="item-row" @click=${() => this.goToScopeItem(item)}>
                            <div class="item-status-dot ${item.status}"></div>
                            <div class="item-info">
                              <h4 class="item-title">${item.title}</h4>
                              <p class="item-meta">
                                ${new Date(item.created_at).toLocaleDateString()}
                                ${item.priority_level ? ` • ${item.priority_level} priority` : ''}
                              </p>
                            </div>
                          </div>
                        `)}
                      </div>
                    `}
                  </div>
                </div>
              </div>

              <div class="sidebar-section">
                <!-- Quick Actions -->
                <div class="content-card">
                  <div class="card-header">
                    <h2 class="card-title">Quick Actions</h2>
                  </div>
                  <div class="card-content">
                    <div class="quick-actions">
                      <div class="action-button" @click=${() => this.routerController.navigate(`/app/${this.context.params.teamSlug}/scopes`)}>
                        <div class="action-icon">📋</div>
                        <div class="action-text">Manage Scopes</div>
                      </div>
                      
                      <div class="action-button" @click=${() => this.routerController.navigate(`/app/${this.context.params.teamSlug}/data-settings`)}>
                        <div class="action-icon">⚙️</div>
                        <div class="action-text">Data Settings</div>
                      </div>
                      
                      <div class="action-button" @click=${() => this.routerController.navigate(`/app/${this.context.params.teamSlug}/team/members`)}>
                        <div class="action-icon">👥</div>
                        <div class="action-text">Team Members</div>
                      </div>
                      
                      <div class="action-button" @click=${() => this.routerController.navigate(`/app/${this.context.params.teamSlug}/billing`)}>
                        <div class="action-icon">💳</div>
                        <div class="action-text">Billing</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Scopes Overview -->
                <div class="content-card">
                  <div class="card-header">
                    <h2 class="card-title">Your Scopes</h2>
                    <sl-button size="small" variant="default" href="/app/${this.context.params.teamSlug}/scopes">
                      Manage
                    </sl-button>
                  </div>
                  <div class="card-content">
                    ${this.scopes.length === 0 ? html`
                      <div class="empty-state">
                        <div class="empty-state-icon">🎯</div>
                        <p>No scopes created yet</p>
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
                          </div>
                        `)}
                      </div>
                    `}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getItemCountForScope(scopeId: string): number {
    return this.recentItems.filter(item => item.scope_id === scopeId).length;
  }

  private goToScope(scope: Scope) {
    this.routerController.goToScopeItems(this.context.params.teamSlug, scope.id);
  }

  private goToScopeItem(item: ScopeItem) {
    this.routerController.goToScopeItems(this.context.params.teamSlug, item.scope_id);
  }
}

