// src/components/pages/team-dashboard-page.ts - Using BasePage
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { LoadingController } from '../../controllers/loading-controller';
import { Scope, ScopeItem } from '../../types';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';
import '../common/skeleton-loader';
import '../common/error-message';

@customElement('team-dashboard-page')
export class TeamDashboardPage extends BasePage {
  // Use the new loading controller
  private loadingController = new LoadingController(this);

  @state() private scopes: Scope[] = [];
  @state() private recentItems: ScopeItem[] = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.loadDashboardData();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('context')) {
      const oldContext = changedProperties.get('context');
      const newContext = this.context;

      const oldTeamSlug = oldContext?.params?.teamSlug;
      const newTeamSlug = newContext?.params?.teamSlug;

      if (oldTeamSlug !== newTeamSlug) {
        this.loadDashboardData();
      }
    }
  }

  private async loadDashboardData() {
    if (!this.currentAccount?.id) {
      return;
    }

    // Use the loading controller for cleaner error handling
    const scopesData = await this.loadingController.withLoading('scopes', async () => {
      const { data, error } = await supabase.getScopes(this.currentAccount!.id);
      if (error) throw error;
      return data || [];
    });

    const itemsData = await this.loadingController.withLoading('items', async () => {
      const { data, error } = await supabase.getScopeItems(this.currentAccount!.id);
      if (error) throw error;
      return data || [];
    });

    if (scopesData) this.scopes = scopesData;
    if (itemsData) this.recentItems = itemsData.slice(0, 10);
  }

  render() {
    // Check for loading states
    if (this.loadingController.isLoading('scopes') || this.loadingController.isLoading('items')) {
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

    // Check for error states
    const error = this.loadingController.getError('scopes') || this.loadingController.getError('items');
    if (error) {
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
                .message=${error}
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
          .currentTeamSlug=${this.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">${this.currentAccount?.name || 'Team Dashboard'}</h1>
            <p class="page-subtitle">Overview of your team's activity and progress</p>
          </div>

          <div class="page-content">
            <!-- Your existing dashboard content -->
            ${this.renderDashboardContent(completedItems, pendingItems)}
          </div>
        </div>
      </div>
    `;
  }

  private renderDashboardContent(completedItems: number, pendingItems: number) {
    // Move your existing dashboard HTML here
    return html`
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
    `;
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

