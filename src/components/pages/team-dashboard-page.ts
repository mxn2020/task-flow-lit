// src/components/pages/team-dashboard-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { Scope, ScopeItem } from '../../types';
import { supabase } from '../../services/supabase';

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

    /* Override BasePage stats with custom design */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .custom-stat-card {
      background: linear-gradient(135deg, var(--sl-color-primary-50), var(--sl-color-primary-100));
      border: none;
      border-left: 4px solid var(--sl-color-primary-600);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      box-shadow: var(--sl-shadow-medium);
      transition: box-shadow 0.2s ease;
    }

    .custom-stat-card:hover {
      box-shadow: var(--sl-shadow-large);
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

    .progress-indicator {
      margin-top: 0.5rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
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

    /* Dark theme styles for custom stats */
    :host(.sl-theme-dark) .custom-stat-card {
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
  @state() private stats: DashboardStats = {
    totalScopes: 0,
    totalItems: 0,
    pendingItems: 0,
    completedItems: 0,
    completionRate: 0
  };

  async connectedCallback() {
    super.connectedCallback();
    await this.loadPageData();
  }

  // Simple implementation of BasePage's abstract method
  protected async loadPageData(): Promise<void> {
    await this.withPageLoading(async () => {
      const accountId = this.currentAccount?.id;
      if (!accountId) {
        throw new Error('No team selected. Please select a team.');
      }

      // Load scopes
      const { data: scopes, error: scopesError } = await supabase.getScopes(accountId);
      if (scopesError) {
        throw new Error(`Failed to load scopes: ${scopesError.message}`);
      }

      // Load recent items
      const { data: items, error: itemsError } = await supabase.getScopeItems(accountId);
      if (itemsError) {
        throw new Error(`Failed to load items: ${itemsError.message}`);
      }

      this.scopes = scopes || [];
      this.recentItems = (items || []).slice(0, 10);
      this.calculateStats();

      console.log('[TeamDashboard] Data loaded successfully:', {
        scopesLength: this.scopes.length,
        itemsLength: this.recentItems.length
      });
    });
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
    this.navigateTo(`/app/${this.teamSlug}/scopes/${scope.id}`);
  }

  private goToScopeItem(item: ScopeItem) {
    this.navigateTo(`/app/${this.teamSlug}/scopes/${item.scope_id}`);
  }

  private mapEmojiToHeroicon(emoji: string): string {
    switch (emoji) {
      case '📝': return 'pencil-square';
      case '🎯': return 'target';
      case '✅': return 'check-circle';
      case '☑️': return 'check-square';
      case '📚': return 'book-open';
      case '🔖': return 'bookmark';
      case '📅': return 'calendar';
      case '⏰': return 'clock';
      case '🔄': return 'arrows-right-left';
      case '💡': return 'light-bulb';
      default: return 'pencil-square';
    }
  }

  // Implementation of the abstract method from BasePage
  protected renderPageContent() {
    if (this.isLoading) {
      return this.renderLoading('Loading team dashboard...');
    }

    const teamName = this.currentAccount?.name || 'Team Dashboard';
    
    const dashboardStats = [
      { label: 'Active Scopes', value: this.stats.totalScopes, icon: 'collection' },
      { label: 'Total Items', value: this.stats.totalItems, icon: 'document-text' },
      { label: 'Pending', value: this.stats.pendingItems, icon: 'clock' },
      { label: 'Completion Rate', value: `${this.stats.completionRate}%`, icon: 'check-circle' }
    ];

    return html`
      ${this.renderPageHeader(
        teamName,
        'Overview of your team\'s activity and progress',
        html`
          <sl-button variant="default" @click=${() => this.refreshPageData()}>
            <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
            Refresh
          </sl-button>
        `
      )}

      <div class="page-content">
        <!-- Custom Stats Overview with original design -->
        <div class="stats-grid">
          <div class="custom-stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <div class="stat-value">${this.stats.totalScopes}</div>
                <div class="stat-label">Active Scopes</div>
              </div>
              <div class="stat-icon"><sl-icon name="collection"></sl-icon></div>
            </div>
          </div>
          
          <div class="custom-stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <div class="stat-value">${this.stats.totalItems}</div>
                <div class="stat-label">Total Items</div>
              </div>
              <div class="stat-icon"><sl-icon name="pencil-square"></sl-icon></div>
            </div>
          </div>
          
          <div class="custom-stat-card">
            <div class="stat-content">
              <div class="stat-info">
                <div class="stat-value">${this.stats.pendingItems}</div>
                <div class="stat-label">Pending</div>
              </div>
              <div class="stat-icon"><sl-icon name="clock"></sl-icon></div>
            </div>
          </div>
          
          <div class="custom-stat-card completion-stat">
            <div class="stat-content">
              <div class="stat-info">
                <div class="stat-value">${this.stats.completionRate}%</div>
                <div class="stat-label">Completion Rate</div>
                <sl-progress-bar 
                  value=${this.stats.completionRate} 
                  class="progress-indicator"
                ></sl-progress-bar>
              </div>
              <div class="stat-icon"><sl-icon name="check-circle"></sl-icon></div>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="main-section">
            <!-- Recent Activity -->
            <div class="content-section">
              ${this.renderSectionHeader(
                'Recent Activity',
                undefined,
                html`
                  <sl-button 
                    size="small" 
                    variant="default" 
                    @click=${() => this.navigateTo(`/app/${this.teamSlug}/scopes`)}
                  >
                    <sl-icon slot="prefix" name="arrow-right"></sl-icon>
                    View All
                  </sl-button>
                `
              )}
              
              <div class="content-card">
                ${this.recentItems.length === 0 ? this.renderEmptyState(
                  'inbox',
                  'No recent activity',
                  'Items will appear here as your team creates and updates them.'
                ) : html`
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
              </div>
            </div>
          </div>

          <div class="sidebar-section">
            <!-- Quick Actions -->
            <div class="content-section">
              ${this.renderSectionHeader('Quick Actions')}
              
              <div class="content-card">
                <div class="quick-actions">
                  <div class="action-button" @click=${() => this.navigateTo(`/app/${this.teamSlug}/scopes`)}>
                    <div class="action-icon"><sl-icon name="collection"></sl-icon></div>
                    <div class="action-text">Manage Scopes</div>
                  </div>
                  
                  <div class="action-button" @click=${() => this.navigateTo(`/app/${this.teamSlug}/data-settings`)}>
                    <div class="action-icon"><sl-icon name="cog-6-tooth"></sl-icon></div>
                    <div class="action-text">Data Settings</div>
                  </div>
                  
                  <div class="action-button" @click=${() => this.navigateTo(`/app/${this.teamSlug}/team/members`)}>
                    <div class="action-icon"><sl-icon name="users"></sl-icon></div>
                    <div class="action-text">Team Members</div>
                  </div>
                  
                  <div class="action-button" @click=${() => this.navigateTo(`/app/${this.teamSlug}/billing`)}>
                    <div class="action-icon"><sl-icon name="credit-card"></sl-icon></div>
                    <div class="action-text">Billing</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scopes Overview -->
            <div class="content-section">
              ${this.renderSectionHeader(
                'Your Scopes',
                undefined,
                html`
                  <sl-button 
                    size="small" 
                    variant="default" 
                    @click=${() => this.navigateTo(`/app/${this.teamSlug}/scopes`)}
                  >
                    <sl-icon slot="prefix" name="gear"></sl-icon>
                    Manage
                  </sl-button>
                `
              )}
              
              <div class="content-card">
                ${this.scopes.length === 0 ? this.renderEmptyState(
                  'folder-plus',
                  'No scopes created yet',
                  'Create your first scope to organize your work.',
                  html`
                    <sl-button 
                      variant="primary" 
                      size="small"
                      @click=${() => this.navigateTo(`/app/${this.teamSlug}/scopes`)}
                    >
                      <sl-icon slot="prefix" name="plus"></sl-icon>
                      Create Scope
                    </sl-button>
                  `
                ) : html`
                  <div class="scope-list">
                    ${this.scopes.slice(0, 6).map(scope => html`
                      <div class="scope-item" @click=${() => this.goToScope(scope)}>
                        <div class="scope-icon">
                          ${scope.icon
                            ? html`<sl-icon name="${this.mapEmojiToHeroicon(scope.icon)}"></sl-icon>`
                            : html`<sl-icon name="pencil-square"></sl-icon>`}
                        </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

