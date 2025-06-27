// src/components/layout/app-sidebar.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { Account, Scope } from '../../types';
import { supabase } from '../../services/supabase';
import '../common/skeleton-loader';

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 16rem;
      background-color: var(--sl-color-neutral-50);
      border-right: 1px solid var(--sl-color-neutral-200);
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .team-selector {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .create-team-btn {
      width: 100%;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: 1.5rem;
    }

    .nav-section-title {
      padding: 0 1rem;
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-600);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      color: var(--sl-color-neutral-700);
      text-decoration: none;
      transition: background-color 0.2s;
      cursor: pointer;
    }

    .nav-item:hover {
      background-color: var(--sl-color-neutral-100);
    }

    .nav-item.active {
      background-color: var(--sl-color-primary-100);
      color: var(--sl-color-primary-700);
      border-right: 3px solid var(--sl-color-primary-600);
    }

    .nav-item-icon {
      margin-right: 0.75rem;
      font-size: 1.25rem;
    }

    .nav-item-text {
      flex: 1;
    }

    .scope-item {
      padding-left: 2.5rem;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--sl-color-neutral-200);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background-color: var(--sl-color-primary-600);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--sl-font-weight-semibold);
      font-size: var(--sl-font-size-small);
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      :host {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      :host(.open) {
        transform: translateX(0);
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background-color: var(--sl-color-neutral-900);
      border-right-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .sidebar-header {
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .nav-section-title {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .nav-item {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .nav-item:hover {
      background-color: var(--sl-color-neutral-800);
    }

    :host(.sl-theme-dark) .nav-item.active {
      background-color: var(--sl-color-primary-900);
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .sidebar-footer {
      border-top-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .user-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .user-email {
      color: var(--sl-color-neutral-400);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property() currentTeamSlug?: string;

  @state() private scopes: Scope[] = [];
  @state() private scopesLoading = false;
  @state() private showCreateTeamDialog = false;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadScopes();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('currentTeamSlug')) {
      this.loadScopes();
    }
  }

  private async loadScopes() {
    if (!this.stateController.state.currentAccount?.id) return;

    try {
      this.scopesLoading = true;
      const { data, error } = await supabase.getScopes(this.stateController.state.currentAccount.id);
      
      if (error) throw error;
      this.scopes = data || [];
    } catch (error) {
      console.error('Failed to load scopes:', error);
    } finally {
      this.scopesLoading = false;
    }
  }

  render() {
    const { user, currentAccount, accounts } = this.stateController.state;
    const currentPath = this.routerController.currentRoute;

    return html`
      <div class="sidebar-header">
        <sl-select 
          class="team-selector"
          placeholder="Select team"
          value=${currentAccount?.slug || ''}
          @sl-change=${this.handleTeamChange}
        >
          ${accounts.map(account => html`
            <sl-option value=${account.slug}>${account.name}</sl-option>
          `)}
        </sl-select>
        
        <sl-button 
          class="create-team-btn"
          variant="default" 
          size="small"
          @click=${this.handleCreateTeam}
        >
          <sl-icon slot="prefix" name="plus"></sl-icon>
          Create Team
        </sl-button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Main</div>
          
          <div 
            class="nav-item ${this.isActive(`/app/${this.currentTeamSlug}`, currentPath) ? 'active' : ''}"
            @click=${() => this.navigate(`/app/${this.currentTeamSlug}`)}
          >
            <span class="nav-item-icon">🏠</span>
            <span class="nav-item-text">Dashboard</span>
          </div>

          <div 
            class="nav-item ${this.isActive(`/app/${this.currentTeamSlug}/scopes`, currentPath) ? 'active' : ''}"
            @click=${() => this.navigate(`/app/${this.currentTeamSlug}/scopes`)}
          >
            <span class="nav-item-icon">📋</span>
            <span class="nav-item-text">All Scopes</span>
          </div>

          <div 
            class="nav-item ${this.isActive(`/app/${this.currentTeamSlug}/data-settings`, currentPath) ? 'active' : ''}"
            @click=${() => this.navigate(`/app/${this.currentTeamSlug}/data-settings`)}
          >
            <span class="nav-item-icon">⚙️</span>
            <span class="nav-item-text">Data Settings</span>
          </div>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Scopes</div>
          
          ${this.scopesLoading ? html`
            <skeleton-loader type="text" count="3"></skeleton-loader>
          ` : ''}

          ${this.scopes.map(scope => html`
            <div 
              class="nav-item scope-item ${this.isActive(`/app/${this.currentTeamSlug}/scopes/${scope.id}`, currentPath) ? 'active' : ''}"
              @click=${() => this.navigate(`/app/${this.currentTeamSlug}/scopes/${scope.id}`)}
            >
              <span class="nav-item-icon">${scope.icon || '📝'}</span>
              <span class="nav-item-text">${scope.name}</span>
            </div>
          `)}
        </div>
      </nav>

      <div class="sidebar-footer">
        <sl-dropdown>
          <div class="user-menu" slot="trigger">
            <div class="user-avatar">
              ${user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div class="user-info">
              <div class="user-name">${user?.name || 'User'}</div>
              <div class="user-email">${user?.email}</div>
            </div>
          </div>

          <sl-menu>
            <sl-menu-item @click=${() => this.navigate(`/app/${this.currentTeamSlug}`)}>
              <sl-icon slot="prefix" name="house"></sl-icon>
              Dashboard
            </sl-menu-item>
            
            <sl-divider></sl-divider>
            
            <sl-menu-item @click=${() => this.navigate(`/app/${this.currentTeamSlug}/profile`)}>
              <sl-icon slot="prefix" name="person"></sl-icon>
              Profile
            </sl-menu-item>
            
            <sl-menu-item @click=${() => this.navigate(`/app/${this.currentTeamSlug}/team`)}>
              <sl-icon slot="prefix" name="people"></sl-icon>
              Team Settings
            </sl-menu-item>
            
            <sl-menu-item @click=${() => this.navigate(`/app/${this.currentTeamSlug}/team/members`)}>
              <sl-icon slot="prefix" name="person-plus"></sl-icon>
              Team Members
            </sl-menu-item>
            
            <sl-menu-item @click=${() => this.navigate(`/app/${this.currentTeamSlug}/billing`)}>
              <sl-icon slot="prefix" name="credit-card"></sl-icon>
              Billing
            </sl-menu-item>
            
            <sl-divider></sl-divider>
            
            <sl-menu-item @click=${() => this.navigate(`/app/${this.currentTeamSlug}/documentation`)}>
              <sl-icon slot="prefix" name="book"></sl-icon>
              Documentation
            </sl-menu-item>
            
            <sl-divider></sl-divider>
            
            <sl-menu-item @click=${this.handleSignOut}>
              <sl-icon slot="prefix" name="box-arrow-right"></sl-icon>
              Sign Out
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </div>

      <!-- Create Team Dialog -->
      <sl-dialog label="Create New Team" ?open=${this.showCreateTeamDialog} @sl-request-close=${() => this.showCreateTeamDialog = false}>
        <team-create-form 
          .stateController=${this.stateController}
          @team-created=${this.handleTeamCreated}
          @cancel=${() => this.showCreateTeamDialog = false}
        ></team-create-form>
      </sl-dialog>
    `;
  }

  private isActive(targetPath: string, currentPath: string): boolean {
    return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
  }

  private navigate(path: string) {
    this.routerController.navigate(path);
  }

  private handleTeamChange(event: CustomEvent) {
    const teamSlug = event.detail.item.value;
    if (teamSlug) {
      this.routerController.goToTeam(teamSlug);
    }
  }

  private handleCreateTeam() {
    this.showCreateTeamDialog = true;
  }

  private handleTeamCreated(event: CustomEvent) {
    const team = event.detail.team;
    this.showCreateTeamDialog = false;
    this.routerController.goToTeam(team.slug);
  }

  private async handleSignOut() {
    await this.stateController.signOut();
    this.routerController.goHome();
  }
}

