// src/components/layout/app-header.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';

interface Breadcrumb {
  label: string;
  href?: string;
  icon?: string;
}

@customElement('app-header')
export class AppHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      background-color: var(--sl-color-neutral-0);
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 1.5rem;
      gap: 1rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      min-width: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .sidebar-toggle {
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
      min-width: 44px;
      min-height: 44px;
      border-radius: 50%;
      transition: background 0.2s;
      z-index: 20;
    }

    .sidebar-toggle:active, .sidebar-toggle:focus {
      background: var(--sl-color-primary-50);
      outline: none;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .breadcrumb-item.current {
      color: var(--sl-color-neutral-900);
      font-weight: var(--sl-font-weight-medium);
    }

    .breadcrumb-link {
      color: inherit;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: var(--sl-color-primary-600);
    }

    .breadcrumb-separator {
      color: var(--sl-color-neutral-400);
      margin: 0 0.5rem;
      font-size: 0.75rem;
    }

    .breadcrumb-icon {
      font-size: 1rem;
      margin-right: 0.25rem;
    }

    .team-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background-color: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      border: 1px solid var(--sl-color-neutral-200);
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-700);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      min-width: 36px;
      min-height: 36px;
      max-width: 36px;
      max-height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      object-fit: cover;
      aspect-ratio: 1 / 1;
      /* Prevent stretching by forcing a square box and removing margin */
      margin: 0;
      box-sizing: border-box;
      overflow: hidden;
    }

    .user-menu .user-avatar,
    sl-avatar.user-avatar {
      width: 36px !important;
      height: 36px !important;
      min-width: 36px !important;
      min-height: 36px !important;
      max-width: 36px !important;
      max-height: 36px !important;
      border-radius: 50% !important;
      aspect-ratio: 1 / 1 !important;
      object-fit: cover !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }

    .team-avatar {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--sl-color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: var(--sl-font-weight-bold);
      font-size: 0.75rem;
      min-width: 20px;
      min-height: 20px;
      max-width: 20px;
      max-height: 20px;
      aspect-ratio: 1 / 1;
    }

    .notification-button {
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: var(--sl-color-danger-600);
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      font-size: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--sl-font-weight-bold);
    }

    .search-container {
      position: relative;
      width: 300px;
      max-width: 100%;
    }

    .search-input {
      width: 100%;
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--sl-color-neutral-0);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-medium);
      z-index: 50;
      margin-top: 0.25rem;
      max-height: 300px;
      overflow-y: auto;
    }

    .search-result {
      padding: 0.75rem;
      border-bottom: 1px solid var(--sl-color-neutral-100);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .search-result:hover {
      background-color: var(--sl-color-neutral-50);
    }

    .search-result:last-child {
      border-bottom: none;
    }

    .search-result-title {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.25rem;
    }

    .search-result-type {
      font-size: var(--sl-font-size-x-small);
      color: var(--sl-color-neutral-600);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Mobile responsive */
    @media (max-width: 1024px) {
      .header-container {
        height: auto;
        min-height: 56px;
        flex-direction: row;
        padding: 0 0.5rem;
        gap: 0.5rem;
      }
      .sidebar-toggle {
        display: flex;
      }
      .header-left {
        flex: 1;
        min-width: 0;
      }
      .header-right {
        gap: 0.5rem;
      }
    }
    @media (max-width: 600px) {
      .header-container {
        flex-direction: row;
        align-items: center;
        height: 56px;
        min-height: 56px;
        padding: 0 0.5rem;
      }
      .header-left, .header-right {
        width: auto;
        justify-content: flex-start;
      }
      .user-avatar,
      .user-menu .user-avatar,
      sl-avatar.user-avatar {
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        min-height: 32px !important;
        max-width: 32px !important;
        max-height: 32px !important;
      }
      .sidebar-toggle {
        display: flex !important;
      }
    }

    @media (max-width: 768px) {
      .header-container {
        padding: 0 1rem;
      }

      .search-container {
        display: none;
      }

      .team-info {
        display: none;
      }

      .breadcrumbs {
        font-size: var(--sl-font-size-x-small);
      }
    }

    @media (max-width: 640px) {
      .breadcrumb-item:not(.current):not(:last-child) {
        display: none;
      }
    }

    /* Dark theme */
    :host(.sl-theme-dark) {
      background-color: var(--sl-color-neutral-900);
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .breadcrumb-item {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .breadcrumb-item.current {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .breadcrumb-link:hover {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .breadcrumb-separator {
      color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .team-info {
      background-color: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .search-results {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .search-result {
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .search-result:hover {
      background-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .search-result-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .search-result-type {
      color: var(--sl-color-neutral-400);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property() currentTeamSlug?: string;
  @property({ type: Boolean }) showSidebarToggle = false;

  @state() private searchQuery = '';
  @state() private searchResults: any[] = [];
  @state() private showSearchResults = false;
  @state() private notificationCount = 0;
  @state() private currentTheme: string = 'light';
  @state() private currentResolvedTheme: string = 'light';

  private get currentAccount() {
    return this.stateController.state.currentAccount;
  }

  private get user() {
    return this.stateController.state.user;
  }

  private get breadcrumbs(): Breadcrumb[] {
    const path = this.routerController.currentRoute;
    const params = this.routerController.params;
    const breadcrumbs: Breadcrumb[] = [];

    // Always start with Dashboard for authenticated routes
    if (this.currentTeamSlug) {
      breadcrumbs.push({
        label: 'Dashboard',
        href: `/app/${this.currentTeamSlug}`,
        icon: 'house-door'
      });

      // Add team-specific breadcrumbs
      if (path.includes('/scopes')) {
        if (params.scopeId) {
          breadcrumbs.push({
            label: 'Scopes',
            href: `/app/${this.currentTeamSlug}/scopes`,
            icon: 'collection'
          });
          breadcrumbs.push({
            label: 'Scope Items',
            icon: 'list-bullet'
          });
        } else {
          breadcrumbs.push({
            label: 'Scopes',
            icon: 'collection'
          });
        }
      } else if (path.includes('/team/members')) {
        breadcrumbs.push({
          label: 'Team',
          href: `/app/${this.currentTeamSlug}/team`,
          icon: 'people'
        });
        breadcrumbs.push({
          label: 'Members',
          icon: 'person-plus'
        });
      } else if (path.includes('/team')) {
        breadcrumbs.push({
          label: 'Team Settings',
          icon: 'gear'
        });
      } else if (path.includes('/billing')) {
        breadcrumbs.push({
          label: 'Billing',
          icon: 'credit-card'
        });
      } else if (path.includes('/profile')) {
        breadcrumbs.push({
          label: 'Profile',
          icon: 'person-circle'
        });
      } else if (path.includes('/data-settings')) {
        breadcrumbs.push({
          label: 'Data Settings',
          icon: 'database'
        });
      }
    } else if (path === '/app') {
      breadcrumbs.push({
        label: 'Personal Dashboard',
        icon: 'house-door'
      });
    } else if (path === '/onboarding') {
      breadcrumbs.push({
        label: 'Getting Started',
        icon: 'rocket-takeoff'
      });
    }

    return breadcrumbs;
  }

  private handleSidebarToggle() {
    this.dispatchEvent(new CustomEvent('sidebar-toggle', {
      bubbles: true,
      composed: true
    }));
  }

  private handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;

    if (this.searchQuery.length > 2) {
      this.performSearch();
    } else {
      this.showSearchResults = false;
    }
  }

  private async performSearch() {
    // Simulate search - replace with actual search implementation
    await new Promise(resolve => setTimeout(resolve, 200));

    this.searchResults = [
      {
        title: 'Project Alpha Tasks',
        type: 'scope',
        href: `/app/${this.currentTeamSlug}/scopes/1`
      },
      {
        title: 'Team Meeting Notes',
        type: 'document',
        href: `/app/${this.currentTeamSlug}/docs/1`
      },
      {
        title: 'Profile Settings',
        type: 'page',
        href: `/app/${this.currentTeamSlug}/profile`
      }
    ].filter(item =>
      item.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.showSearchResults = this.searchResults.length > 0;
  }

  private handleSearchResultClick(result: any) {
    this.routerController.navigate(result.href);
    this.showSearchResults = false;
    this.searchQuery = '';
  }

  private handleSearchBlur() {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
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

  connectedCallback() {
    super.connectedCallback();
    // Sync theme state
    this.syncThemeState();
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
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

  render() {
    const userName = this.stateController.userDisplayName;
    const userInitials = this.stateController.userInitials;

    return html`
      <div class="header-container">
        ${this.showSidebarToggle ? html`
          <button class="sidebar-toggle" @click=${this.handleSidebarToggle} aria-label="Open menu">
            <sl-icon name="list"></sl-icon>
          </button>
        ` : ''}
        <div class="header-left">
          ${this.currentAccount && this.currentTeamSlug ? html`
            <div class="team-info">
              <div class="team-avatar">
                ${this.currentAccount.name?.charAt(0) || 'T'}
              </div>
              <span>${this.currentAccount.name}</span>
            </div>
          ` : ''}

          <nav class="breadcrumbs" aria-label="Breadcrumb">
            ${this.breadcrumbs.map((crumb, index) => html`
              ${index > 0 ? html`
                <sl-icon name="chevron-right" class="breadcrumb-separator"></sl-icon>
              ` : ''}
              <div class="breadcrumb-item ${index === this.breadcrumbs.length - 1 ? 'current' : ''}">
                ${crumb.icon ? html`
                  <sl-icon class="breadcrumb-icon" name="${crumb.icon}"></sl-icon>
                ` : ''}
                ${crumb.href && index < this.breadcrumbs.length - 1 ? html`
                  <a href="${crumb.href}" class="breadcrumb-link">${crumb.label}</a>
                ` : html`
                  <span>${crumb.label}</span>
                `}
              </div>
            `)}
          </nav>
        </div>
        <div class="header-right">
          <!-- Global Search -->
          <div class="search-container">
            <sl-input
              placeholder="Search..."
              size="small"
              class="search-input"
              .value=${this.searchQuery}
              @sl-input=${this.handleSearch}
              @sl-blur=${this.handleSearchBlur}
            >
              <sl-icon slot="prefix" name="search"></sl-icon>
            </sl-input>
            ${this.showSearchResults ? html`
<div class="search-results">
                ${this.searchResults.map(result => html`
                  <div 
                    class="search-result"
                    @click=${() => this.handleSearchResultClick(result)}
                  >
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-type">${result.type}</div>
                  </div>
                `)}
              </div>
            ` : ''}
          </div>
          <!-- Notifications -->
          <sl-icon-button 
            name="bell"
            label="Notifications"
            class="notification-button"
          >
            ${this.notificationCount > 0 ? html`
              <div class="notification-badge">${this.notificationCount}</div>
            ` : ''}
          </sl-icon-button>
          <!-- Theme Toggle -->
          <sl-icon-button 
            name=${this.currentResolvedTheme === 'dark' ? 'sun' : 'moon'}
            label="Toggle theme"
            @click=${() => this.handleThemeToggle()}
          ></sl-icon-button>
          <!-- User Menu -->
          <sl-dropdown distance="10">
            <div class="user-menu" slot="trigger">
              <sl-avatar 
                initial=${userInitials} 
                label="User avatar"
                class="user-avatar"
              ></sl-avatar>
            </div>
            <sl-menu>
              ${this.currentTeamSlug ? html`
                <sl-menu-item @click=${() => this.routerController.navigate(`/app/${this.currentTeamSlug}/profile`)}>
                  <sl-icon slot="prefix" name="person-circle"></sl-icon>
                  Profile
                </sl-menu-item>
              ` : ''}
              <sl-menu-item @click=${() => this.routerController.navigate('/app')}>
                <sl-icon slot="prefix" name="house-door"></sl-icon>
                Personal Dashboard
              </sl-menu-item>
              <sl-divider></sl-divider>
              <sl-menu-item @click=${this.handleSignOut}>
                <sl-icon slot="prefix" name="box-arrow-right"></sl-icon>
                Sign Out
              </sl-menu-item>
            </sl-menu>
          </sl-dropdown>
        </div>
      </div>
    `;
  }
}
