// src/components/layout/app-sidebar.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { Scope } from '../../types';
import { supabase } from '../../services/supabase';
import '../common/skeleton-loader';

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 16rem;
      background-color: var(--sl-color-neutral-50);
      border-right: 1px solid var(--sl-color-neutral-200);
      flex-shrink: 0;
      overflow: hidden;
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      flex-shrink: 0;
    }

    .team-selector {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-section {
      margin-bottom: 1rem;
    }

    .nav-section-title {
      padding: 0 1rem 0.5rem;
      font-size: var(--sl-font-size-x-small);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-500);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    .nav-item, .user-menu-trigger, .create-team-button, .collapse-button {
      min-height: 44px;
      font-size: 1rem;
      touch-action: manipulation;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 1rem;
      margin: 0 0.5rem;
      color: var(--sl-color-neutral-700);
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border-radius: var(--sl-border-radius-medium);
      font-weight: var(--sl-font-weight-medium);
      position: relative;
      overflow: hidden;
      border: none;
      background: transparent;
      width: calc(100% - 1rem);
      text-align: left;
      font-family: inherit;
      height: 44px;
    }

    .nav-item:hover {
      background-color: var(--sl-color-neutral-200);
      color: var(--sl-color-neutral-900);
      transform: translateX(2px);
    }

    .nav-item.active {
      background-color: var(--sl-color-primary-600);
      color: var(--sl-color-neutral-0);
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: var(--sl-color-primary-400);
    }

    .nav-item-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .nav-item-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nav-item-badge {
      flex-shrink: 0;
    }

    .scope-item {
      padding-left: 1.5rem;
      font-weight: var(--sl-font-weight-normal);
    }
    
    .scope-item .nav-item-icon {
      font-size: 1rem;
    }

    .scope-loading {
      padding: 0 1rem;
    }

    .scope-empty {
      padding: 1rem;
      text-align: center;
      color: var(--sl-color-neutral-500);
      font-size: var(--sl-font-size-small);
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--sl-color-neutral-200);
      flex-shrink: 0;
    }

    .user-menu-trigger {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: var(--sl-border-radius-medium);
      cursor: pointer;
      transition: background-color 0.2s ease;
      width: 100%;
      background: transparent;
      border: none;
      text-align: left;
      font-family: inherit;
      height: 44px;
    }

    .user-menu-trigger:hover {
      background-color: var(--sl-color-neutral-100);
    }

    .user-avatar {
      flex-shrink: 0;
    }

    .user-info {
      flex: 1;
      min-width: 0;
      text-align: left;
    }

    .user-name {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      font-size: var(--sl-font-size-small);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-email {
      font-size: var(--sl-font-size-x-small);
      color: var(--sl-color-neutral-600);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .collapse-button {
      display: none;
      background: none;
      border: none;
      font-size: 2rem;
      color: var(--sl-color-primary-700);
      cursor: pointer;
      align-items: center;
      justify-content: center;
      height: 44px;
      width: 44px;
      z-index: 20;
      position: absolute;
      top: 1rem;
      right: 1rem;
      transition: background 0.2s;
    }

    .collapse-button:active, .collapse-button:focus {
      background: var(--sl-color-primary-50);
      outline: none;
    }

    /* Scrollbar styling */
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: var(--sl-color-neutral-300);
      border-radius: 2px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: var(--sl-color-neutral-400);
    }

    /* Team creation dialog trigger */
    .create-team-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: transparent;
      border: 1px dashed var(--sl-color-neutral-300);
      border-radius: var(--sl-border-radius-medium);
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      height: 44px;
    }

    .create-team-button:hover {
      border-color: var(--sl-color-primary-400);
      color: var(--sl-color-primary-600);
      background-color: var(--sl-color-primary-50);
    }

    /* Mobile responsive */
    @media (max-width: 1024px) {
      .collapse-button {
        display: flex;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background-color: var(--sl-color-neutral-800);
      border-right-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .sidebar-header,
    :host(.sl-theme-dark) .sidebar-footer {
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .nav-section-title {
      color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .nav-item {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .nav-item:hover {
      background-color: var(--sl-color-neutral-700);
      color: var(--sl-color-neutral-0);
    }

    :host(.sl-theme-dark) .nav-item.active {
      background-color: var(--sl-color-primary-600);
      color: var(--sl-color-neutral-0);
    }

    :host(.sl-theme-dark) .user-menu-trigger:hover {
      background-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .user-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .user-email {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .create-team-button {
      border-color: var(--sl-color-neutral-600);
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .create-team-button:hover {
      border-color: var(--sl-color-primary-500);
      color: var(--sl-color-primary-400);
      background-color: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .scope-empty {
      color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .sidebar-nav::-webkit-scrollbar-thumb {
      background: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: var(--sl-color-neutral-500);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property() currentTeamSlug?: string;

  @state() private scopes: Scope[] = [];
  @state() private scopesLoading = true;
  @state() private showCreateTeamDialog = false;
  @state() private currentTheme: string = 'light';
  @state() private currentResolvedTheme: string = 'light';

  connectedCallback() {
    super.connectedCallback();
    this.loadScopes();
    
    // Sync theme state
    this.syncThemeState();
    
    // Listen for route changes to update active states
    this.routerController.addEventListener?.('route-changed', () => {
      this.requestUpdate();
    });
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('currentTeamSlug') && this.currentTeamSlug) {
      this.loadScopes();
    }
    
    // Sync theme state when theme controller changes
    if (changedProperties.has('themeController')) {
      this.syncThemeState();
    }
  }

  private syncThemeState() {
    if (this.themeController) {
      this.currentTheme = this.themeController.theme;
      this.currentResolvedTheme = this.themeController.resolvedTheme;
    }
  }

  private async loadScopes() {
    if (!this.currentAccount?.id) return;
    
    this.scopesLoading = true;
    try {
      const { data, error } = await supabase.getScopes(this.currentAccount.id);
      if (error) throw error;
      
      // Map scopes and add mock item_count if it doesn't exist
      this.scopes = (data || [])
        .filter(s => s.show_in_sidebar)
        .map(scope => ({
          ...scope,
          // Use existing item_count if it exists, otherwise default to 0
          item_count: 'item_count' in scope ? scope.item_count : 0
        }));
    } catch (error) {
      console.error('Failed to load sidebar scopes:', error);
      this.scopes = [];
    } finally {
      this.scopesLoading = false;
    }
  }

  private get currentAccount() {
    return this.stateController.state.currentAccount;
  }
  
  private get accounts() {
    return this.stateController.state.accounts;
  }

  private get user() {
    return this.stateController.state.user;
  }

  private isActive(targetPath: string, currentPath: string, exact = false): boolean {
    if (exact) {
      return currentPath === targetPath;
    }
    return currentPath.startsWith(targetPath);
  }
  
  private isScopeItemRoute(path: string): boolean {
    return /^\/app\/[^\/]+\/scopes\/[^\/]+/.test(path);
  }

  private handleTeamChange(e: CustomEvent) {
    const newTeamSlug = (e.target as any).value;
    if (newTeamSlug && newTeamSlug !== this.currentTeamSlug) {
      console.log(`[Sidebar] Team changed to: ${newTeamSlug}`);
      this.routerController.goToTeam(newTeamSlug);
    }
  }

  // Use data-href for navigation to ensure router intercepts it
  private handleNavigation(path: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    console.log(`[Sidebar] Navigating to: ${path}`);
    this.routerController.navigate(path);
  }

  private handleCreateTeam() {
    this.showCreateTeamDialog = true;
  }

  private handleCloseSidebar() {
    this.dispatchEvent(new CustomEvent('sidebar-close', {
      bubbles: true,
      composed: true
    }));
  }

  private async handleSignOut() {
    await this.stateController.signOut();
    this.routerController.goHome();
  }

  private handleThemeToggle() {
    this.themeController.toggleTheme();
    // Sync state after theme change
    this.syncThemeState();
  }

  render() {
    const currentPath = this.routerController.currentRoute ?? '';
    const teamSlug = this.currentTeamSlug;

    if (!teamSlug) return html``; // Don't render if there's no team context

    return html`
      <div class="sidebar-header">
        <sl-button
          class="collapse-button"
          variant="text"
          size="small"
          @click=${this.handleCloseSidebar}
        >
          <sl-icon name="x-lg"></sl-icon>
        </sl-button>

        <sl-select
          class="team-selector"
          placeholder="Select team"
          .value=${this.currentAccount?.slug || ''}
          @sl-change=${this.handleTeamChange}
          ?disabled=${this.accounts.length <= 1}
        >
          ${this.accounts.map(account => html`
            <sl-option value=${account.slug}>
              <sl-icon slot="prefix" name=${account.account_type === 'personal' ? 'person' : 'people-fill'}></sl-icon>
              ${account.name}
              ${account.account_type === 'personal' ? html`
                <sl-badge slot="suffix" variant="neutral" size="small">Personal</sl-badge>
              ` : ''}
            </sl-option>
          `)}
        </sl-select>

        <button class="create-team-button" @click=${this.handleCreateTeam}>
          <sl-icon name="plus"></sl-icon>
          Create Team
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <button 
            class="nav-item ${this.isActive(`/app/${teamSlug}`, currentPath, true) ? 'active' : ''}" 
            @click=${(e: Event) => this.handleNavigation(`/app/${teamSlug}`, e)}
            data-href="/app/${teamSlug}"
          >
            <sl-icon class="nav-item-icon" name="house-door"></sl-icon>
            <span class="nav-item-text">Dashboard</span>
          </button>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Scopes</div>
          <button 
            class="nav-item ${this.isActive(`/app/${teamSlug}/scopes`, currentPath) && !this.isScopeItemRoute(currentPath) ? 'active' : ''}" 
            @click=${(e: Event) => this.handleNavigation(`/app/${teamSlug}/scopes`, e)}
            data-href="/app/${teamSlug}/scopes"
          >
            <sl-icon class="nav-item-icon" name="collection"></sl-icon>
            <span class="nav-item-text">All Scopes</span>
            ${this.scopes.length > 0 ? html`
              <sl-badge class="nav-item-badge" variant="neutral" size="small" pill>
                ${this.scopes.length}
              </sl-badge>
            ` : ''}
          </button>
          
          ${this.scopesLoading ? html`
            <div class="scope-loading">
              <skeleton-loader type="text" count="3"></skeleton-loader>
            </div>
          ` : this.scopes.length > 0 ? this.scopes.map(scope => html`
            <button 
              class="nav-item scope-item ${this.isActive(`/app/${teamSlug}/scopes/${scope.id}`, currentPath) ? 'active' : ''}" 
              @click=${(e: Event) => this.handleNavigation(`/app/${teamSlug}/scopes/${scope.id}`, e)}
              @mouseenter=${() => this.routerController.prefetchRoute(`/app/${teamSlug}/scopes/${scope.id}`)}
              data-href="/app/${teamSlug}/scopes/${scope.id}"
            >
              <span class="nav-item-icon">${scope.icon || '📝'}</span>
              <span class="nav-item-text">${scope.name}</span>
              ${'item_count' in scope && (scope.item_count !== undefined) && (scope.item_count !== null) && Number(scope.item_count) > 0 ? html`
                <sl-badge class="nav-item-badge" variant="neutral" size="small" pill>
                  ${scope.item_count}
                </sl-badge>
              ` : ''}
            </button>
          `) : html`
            <div class="scope-empty">
              <sl-icon name="inbox" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></sl-icon>
              <div>No scopes yet</div>
              <div style="font-size: 0.75rem; margin-top: 0.25rem;">Create your first scope to get started</div>
            </div>
          `}
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Manage</div>
          <button 
            class="nav-item ${this.isActive(`/app/${teamSlug}/team/members`, currentPath) ? 'active' : ''}" 
            @click=${(e: Event) => this.handleNavigation(`/app/${teamSlug}/team/members`, e)}
            data-href="/app/${teamSlug}/team/members"
          >
            <sl-icon class="nav-item-icon" name="people"></sl-icon>
            <span class="nav-item-text">Team Members</span>
          </button>
          
          <button 
            class="nav-item ${this.isActive(`/app/${teamSlug}/billing`, currentPath) ? 'active' : ''}" 
            @click=${(e: Event) => this.handleNavigation(`/app/${teamSlug}/billing`, e)}
            data-href="/app/${teamSlug}/billing"
          >
            <sl-icon class="nav-item-icon" name="credit-card"></sl-icon>
            <span class="nav-item-text">Billing</span>
          </button>
          
          <button 
            class="nav-item ${this.isActive(`/app/${teamSlug}/team`, currentPath, true) ? 'active' : ''}" 
            @click=${(e: Event) => this.handleNavigation(`/app/${teamSlug}/team`, e)}
            data-href="/app/${teamSlug}/team"
          >
            <sl-icon class="nav-item-icon" name="gear"></sl-icon>
            <span class="nav-item-text">Team Settings</span>
          </button>
        </div>
      </nav>

      <div class="sidebar-footer">
        <sl-dropdown distance="10" placement="top-start">
          <button class="user-menu-trigger" slot="trigger">
            <sl-avatar 
              initial=${this.user?.name?.charAt(0) || this.user?.email?.charAt(0)} 
              label="User avatar"
              class="user-avatar"
              size="small"
            ></sl-avatar>
            <div class="user-info">
              <div class="user-name">${this.user?.name || 'User'}</div>
              <div class="user-email">${this.user?.email}</div>
            </div>
            <sl-icon name="three-dots-vertical"></sl-icon>
          </button>

          <sl-menu>
            <sl-menu-item @click=${() => this.routerController.navigate(`/app/${teamSlug}/profile`)}>
              <sl-icon slot="prefix" name="person-circle"></sl-icon>Profile
            </sl-menu-item>
            <sl-menu-item @click=${() => this.handleThemeToggle()}>
              <sl-icon slot="prefix" name=${this.currentResolvedTheme === 'dark' ? 'sun' : 'moon-stars'}></sl-icon>
              Switch to ${this.currentResolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
            </sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item @click=${this.handleCreateTeam}>
              <sl-icon slot="prefix" name="plus-circle"></sl-icon>Create New Team
            </sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item @click=${this.handleSignOut}>
              <sl-icon slot="prefix" name="box-arrow-right"></sl-icon>Sign Out
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </div>

      <sl-dialog label="Create New Team" ?open=${this.showCreateTeamDialog} @sl-request-close=${() => this.showCreateTeamDialog = false}>
        <p>Team creation form will be implemented here.</p>
        <sl-button slot="footer" variant="default" @click=${() => this.showCreateTeamDialog = false}>Cancel</sl-button>
        <sl-button slot="footer" variant="primary">Create Team</sl-button>
      </sl-dialog>
    `;
  }
}

