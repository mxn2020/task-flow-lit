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
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .team-selector {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
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

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 1rem;
      margin: 0 0.5rem;
      color: var(--sl-color-neutral-700);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border-radius: var(--sl-border-radius-medium);
      font-weight: var(--sl-font-weight-medium);
    }

    .nav-item:hover {
      background-color: var(--sl-color-neutral-200);
      color: var(--sl-color-neutral-900);
    }

    .nav-item.active {
      background-color: var(--sl-color-primary-600);
      color: var(--sl-color-neutral-0);
    }

    .nav-item-icon {
      font-size: 1.1rem;
    }

    .scope-item {
      padding-left: 1.5rem; /* Indent scope items */
      font-weight: var(--sl-font-weight-normal);
    }
    
    .scope-item .nav-item-icon {
        font-size: 1rem;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--sl-color-neutral-200);
    }

    .user-menu-trigger {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        border-radius: var(--sl-border-radius-medium);
        cursor: pointer;
        transition: background-color 0.2s;
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
    }

    .user-email {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
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
    :host(.sl-theme-dark) .nav-section-title { color: var(--sl-color-neutral-500); }
    :host(.sl-theme-dark) .nav-item { color: var(--sl-color-neutral-300); }
    :host(.sl-theme-dark) .nav-item:hover { background-color: var(--sl-color-neutral-700); color: var(--sl-color-neutral-0); }
    :host(.sl-theme-dark) .nav-item.active { background-color: var(--sl-color-primary-600); color: var(--sl-color-neutral-0); }
    :host(.sl-theme-dark) .user-menu-trigger:hover { background-color: var(--sl-color-neutral-700); }
    :host(.sl-theme-dark) .user-name { color: var(--sl-color-neutral-100); }
    :host(.sl-theme-dark) .user-email { color: var(--sl-color-neutral-400); }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property() currentTeamSlug?: string;

  @state() private scopes: Scope[] = [];
  @state() private scopesLoading = true;
  @state() private showCreateTeamDialog = false;

  connectedCallback() {
    super.connectedCallback();
    this.loadScopes();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('currentTeamSlug') && this.currentTeamSlug) {
      this.loadScopes();
    }
  }

  private async loadScopes() {
    if (!this.currentAccount?.id) return;
    this.scopesLoading = true;
    try {
      const { data, error } = await supabase.getScopes(this.currentAccount.id);
      if (error) throw error;
      this.scopes = data?.filter(s => s.show_in_sidebar) || [];
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

  render() {
    const currentPath = this.routerController.currentRoute ?? '';
    const teamSlug = this.currentTeamSlug;

    if (!teamSlug) return html``; // Don't render if there's no team context

    return html`
      <div class="sidebar-header">
        <sl-select
          class="team-selector"
          placeholder="Select team"
          .value=${this.currentAccount?.slug || ''}
          @sl-change=${this.handleTeamChange}
          ?disabled=${this.accounts.length <= 1}
        >
          ${this.accounts.map(account => html`
            <sl-option value=${account.slug}>
              <sl-icon slot="prefix" name="people-fill"></sl-icon>
              ${account.name}
            </sl-option>
          `)}
        </sl-select>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <a class="nav-item ${this.isActive(`/app/${teamSlug}`, currentPath, true) ? 'active' : ''}" href="/app/${teamSlug}">
            <sl-icon class="nav-item-icon" name="house-door"></sl-icon>
            Dashboard
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Scopes</div>
          <a class="nav-item ${this.isActive(`/app/${teamSlug}/scopes`, currentPath) && !this.isScopeItemRoute(currentPath) ? 'active' : ''}" href="/app/${teamSlug}/scopes">
            <sl-icon class="nav-item-icon" name="collection"></sl-icon>
            All Scopes
          </a>
          ${this.scopesLoading ? html`<skeleton-loader type="text" count="3"></skeleton-loader>` : ''}
          ${this.scopes.map(scope => html`
            <a class="nav-item scope-item ${this.isActive(`/app/${teamSlug}/scopes/${scope.id}`, currentPath) ? 'active' : ''}" href="/app/${teamSlug}/scopes/${scope.id}">
              <span class="nav-item-icon">${scope.icon || '📝'}</span>
              ${scope.name}
            </a>
          `)}
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Manage</div>
          <a class="nav-item ${this.isActive(`/app/${teamSlug}/team/members`, currentPath) ? 'active' : ''}" href="/app/${teamSlug}/team/members">
            <sl-icon class="nav-item-icon" name="people"></sl-icon>
            Team Members
          </a>
          <a class="nav-item ${this.isActive(`/app/${teamSlug}/billing`, currentPath) ? 'active' : ''}" href="/app/${teamSlug}/billing">
            <sl-icon class="nav-item-icon" name="credit-card"></sl-icon>
            Billing
          </a>
           <a class="nav-item ${this.isActive(`/app/${teamSlug}/team`, currentPath, true) ? 'active' : ''}" href="/app/${teamSlug}/team">
            <sl-icon class="nav-item-icon" name="gear"></sl-icon>
            Team Settings
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <sl-dropdown distance="10">
          <div class="user-menu-trigger" slot="trigger">
            <sl-avatar 
                initial=${this.user?.name?.charAt(0) || this.user?.email?.charAt(0)} 
                label="User avatar"
                class="user-avatar"
            ></sl-avatar>
            <div class="user-info">
              <div class="user-name">${this.user?.name || 'User'}</div>
              <div class="user-email">${this.user?.email}</div>
            </div>
            <sl-icon name="three-dots-vertical"></sl-icon>
          </div>

          <sl-menu>
            <sl-menu-item @click=${() => this.routerController.navigate(`/app/${teamSlug}/profile`)}>
              <sl-icon slot="prefix" name="person-circle"></sl-icon>Profile
            </sl-menu-item>
            <sl-menu-item @click=${() => this.themeController.toggleTheme()}>
                <sl-icon slot="prefix" name=${this.themeController.theme === 'dark' ? 'sun' : 'moon-stars'}></sl-icon>
                Switch to ${this.themeController.theme === 'dark' ? 'Light' : 'Dark'} Mode
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
        Create team form will go here.
        <sl-button slot="footer" @click=${() => this.showCreateTeamDialog = false}>Close</sl-button>
      </sl-dialog>
    `;
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
      this.routerController.goToTeam(newTeamSlug);
    }
  }

  private handleCreateTeam() {
    this.showCreateTeamDialog = true;
  }

  private async handleSignOut() {
    await this.stateController.signOut();
    this.routerController.goHome();
  }
}

