// src/components/layout/app-layout.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { LoadingController } from '../../controllers/loading-controller';
import '../common/skeleton-loader';
import './app-header';
import './app-sidebar';

@customElement('app-layout')
export class AppLayout extends LitElement {
  static styles = css`
    :host {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background-color: var(--sl-color-neutral-0);
    }

    .layout-container {
      display: flex;
      width: 100%;
      height: 100%;
    }

    .sidebar-container {
      flex-shrink: 0;
      z-index: 10;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
      will-change: transform;
      background: var(--sl-color-neutral-50);
      height: 100vh;
      box-shadow: 2px 0 8px rgba(0,0,0,0.04);
      overflow-y: auto;
    }

    .sidebar-container.mobile-open {
      transform: translateX(0);
      box-shadow: 2px 0 16px rgba(0,0,0,0.10);
    }

    .main-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0; /* Prevents flex item from growing beyond container */
      overflow: hidden;
    }

    .header-container {
      flex-shrink: 0;
      z-index: 5;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      height: 64px;
      min-height: 64px;
      display: flex;
      align-items: center;
      background: var(--sl-color-neutral-0);
      /* Ensure header content is spaced and icons/avatars are not clipped */
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      box-sizing: border-box;
      gap: 0.5rem;
      /* Prevent overflow for Shoelace icons/avatars */
      overflow: visible;
    }

    /* Ensure avatars in header are perfectly circular and sized */
    .header-container .user-avatar,
    .header-container .team-avatar {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      max-width: 40px;
      max-height: 40px;
      aspect-ratio: 1/1;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      box-shadow: 0 0 0 2px var(--sl-color-neutral-100);
    }

    /* Shoelace icon sizing in header */
    .header-container sl-icon {
      font-size: 1.5rem;
      width: 1.5em;
      height: 1.5em;
      vertical-align: middle;
      color: var(--sl-color-neutral-700);
    }

    .content-container {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .page-content {
      height: 100%;
      overflow-y: auto;
      scroll-behavior: smooth;
    }

    /* Loading and transition states */
    .content-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--sl-color-neutral-0);
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-transition {
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .page-transition.transitioning {
      opacity: 0.7;
      transform: translateY(4px);
    }

    /* Skeleton layout for protected routes */
    .skeleton-layout {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .skeleton-header {
      height: 64px;
      background: var(--sl-color-neutral-100);
      border-bottom: 1px solid var(--sl-color-neutral-200);
      display: flex;
      align-items: center;
      padding: 0 2rem;
      gap: 1rem;
    }

    .skeleton-content {
      flex: 1;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .skeleton-breadcrumbs {
      height: 20px;
      width: 300px;
      background: var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-small);
    }

    .skeleton-title {
      height: 32px;
      width: 200px;
      background: var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-small);
    }

    .skeleton-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .skeleton-card {
      height: 200px;
      background: var(--sl-color-neutral-100);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .skeleton-card-title {
      height: 20px;
      background: var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-small);
    }

    .skeleton-card-content {
      flex: 1;
      background: var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-small);
      opacity: 0.7;
    }

    /* Mobile responsive */
    @media (max-width: 1024px) {
      .sidebar-container {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 80vw;
        max-width: 320px;
        min-width: 220px;
        transform: translateX(-100%);
        box-shadow: none;
      }

      .sidebar-container.mobile-open {
        transform: translateX(0);
        box-shadow: 2px 0 16px rgba(0,0,0,0.10);
      }

      .mobile-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 25;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1), visibility 0.3s cubic-bezier(0.4,0,0.2,1);
        pointer-events: none;
      }

      .mobile-backdrop.visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      body, html, :host {
        overflow-x: hidden !important;
      }
    }

    /* Dark theme */
    :host(.sl-theme-dark) {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .header-container {
      background: var(--sl-color-neutral-900);
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .content-loading {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .skeleton-header {
      background: var(--sl-color-neutral-800);
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .skeleton-breadcrumbs,
    :host(.sl-theme-dark) .skeleton-title,
    :host(.sl-theme-dark) .skeleton-card-title,
    :host(.sl-theme-dark) .skeleton-card-content {
      background: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .skeleton-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .header-container sl-icon {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .header-container .user-avatar,
    :host(.sl-theme-dark) .header-container .team-avatar {
      box-shadow: 0 0 0 2px var(--sl-color-neutral-800);
    }

    /* Print styles */
    @media print {
      .sidebar-container {
        display: none;
      }
      
      .header-container {
        display: none;
      }
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) loadingController!: LoadingController;

  @state() private sidebarOpen = false;
  @state() private isTransitioning = false;

  connectedCallback() {
    super.connectedCallback();
    
    // Listen for route changes to handle transitions
    const originalUpdateRoute = this.routerController.updateRoute;
    this.routerController.updateRoute = (...args) => {
      this.handleRouteTransition();
      return originalUpdateRoute.apply(this.routerController, args);
    };
  }

  private handleRouteTransition() {
    this.isTransitioning = true;
    this.requestUpdate();
    
    // Reset transition state after a short delay
    setTimeout(() => {
      this.isTransitioning = false;
      this.requestUpdate();
    }, 200);
  }

  private toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  private closeSidebar() {
    this.sidebarOpen = false;
  }

  private get currentTeamSlug() {
    return this.routerController.context.params.teamSlug;
  }

  private get requiresAuth() {
    return this.routerController.requiresAuth();
  }

  private get isNavigating() {
    return this.routerController.navigationState.isNavigating;
  }

  private renderSkeletonLoading() {
    return html`
      <div class="skeleton-layout">
        <div class="skeleton-header">
          <skeleton-loader type="circle" width="32px" height="32px"></skeleton-loader>
          <skeleton-loader type="text" width="150px"></skeleton-loader>
        </div>
        <div class="skeleton-content">
          <skeleton-loader type="text" width="300px" class="skeleton-breadcrumbs"></skeleton-loader>
          <skeleton-loader type="text" width="200px" class="skeleton-title"></skeleton-loader>
          <div class="skeleton-cards">
            ${Array(6).fill(0).map(() => html`
              <div class="skeleton-card">
                <skeleton-loader type="text" width="60%" class="skeleton-card-title"></skeleton-loader>
                <skeleton-loader type="text" width="100%" class="skeleton-card-content"></skeleton-loader>
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  private renderPageContent() {
    const currentComponent = this.routerController.getCurrentComponent();
    const context = this.routerController.context;

    // Show skeleton loading for protected routes during navigation
    if (this.requiresAuth && this.isNavigating) {
      return this.renderSkeletonLoading();
    }

    return html`
      <div class="page-content ${this.isTransitioning ? 'page-transition transitioning' : 'page-transition'}">
        ${this.renderPage(currentComponent, context)}
      </div>
    `;
  }

  private renderPage(component: string, context: any) {
    // Pass all necessary controllers and context to page components
    const baseProps = {
      stateController: this.stateController,
      routerController: this.routerController,
      themeController: this.themeController,
      loadingController: this.loadingController,
      context
    };

    console.log('[AppLayout] Rendering component:', component, 'with context:', context);

    switch (component) {
      case 'landing-page':
        return html`<landing-page ...${baseProps}></landing-page>`;
      
      case 'sign-in-page':
        return html`<sign-in-page .stateController=${this.stateController}></sign-in-page>`;
      
      case 'sign-up-page':
        return html`<sign-up-page .stateController=${this.stateController}></sign-up-page>`;
      
      case 'forgot-password-page':
        return html`<forgot-password-page .stateController=${this.stateController}></forgot-password-page>`;
      
      case 'reset-password-page':
        return html`<reset-password-page .stateController=${this.stateController}></reset-password-page>`;
      
      case 'confirm-page':
        return html`<confirm-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
        ></confirm-page>`;
      
      case 'email-confirmation-page':
        return html`<email-confirmation-page 
          .stateController=${this.stateController}
          .email=${context.query.get('email')}
        ></email-confirmation-page>`;
      
      case 'onboarding-page':
        return html`<onboarding-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></onboarding-page>`;
      
      case 'dashboard-page':
        return html`<dashboard-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></dashboard-page>`;
      
      case 'team-dashboard-page':
        return html`<team-dashboard-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></team-dashboard-page>`;
      
      case 'scopes-page':
        return html`<scopes-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></scopes-page>`;
      
      case 'scope-items-page':
        return html`<scope-items-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></scope-items-page>`;
      
      case 'data-settings-page':
        return html`<data-settings-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></data-settings-page>`;
      
      case 'profile-page':
        return html`<profile-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></profile-page>`;
      
      case 'team-page':
        return html`<team-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></team-page>`;
      
      case 'team-members-page':
        return html`<team-members-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></team-members-page>`;
      
      case 'billing-page':
        return html`<billing-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></billing-page>`;
      
      case 'documentation-page':
        return html`<documentation-page 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .loadingController=${this.loadingController}
          .context=${context}
        ></documentation-page>`;
      
      case 'not-found-page':
      default:
        return html`<not-found-page .routerController=${this.routerController}></not-found-page>`;
    }
  }

  render() {
    const showSidebar = this.requiresAuth && this.currentTeamSlug;
    const showHeader = this.requiresAuth;

    return html`
      <div class="layout-container">
        <!-- Mobile backdrop -->
        ${showSidebar ? html`
          <div 
            class="mobile-backdrop ${this.sidebarOpen ? 'visible' : ''}"
            @click=${this.closeSidebar}
          ></div>
        ` : ''}

        <!-- Sidebar for protected team routes -->
        ${showSidebar ? html`
          <div class="sidebar-container ${this.sidebarOpen ? 'mobile-open' : ''}">
            <app-sidebar 
              .stateController=${this.stateController}
              .routerController=${this.routerController}
              .themeController=${this.themeController}
              .currentTeamSlug=${this.currentTeamSlug}
              @sidebar-close=${this.closeSidebar}
            ></app-sidebar>
          </div>
        ` : ''}

        <!-- Main content area -->
        <div class="main-container">
          <!-- Header for protected routes -->
          ${showHeader ? html`
            <div class="header-container">
              <app-header 
                .stateController=${this.stateController}
                .routerController=${this.routerController}
                .themeController=${this.themeController}
                .currentTeamSlug=${this.currentTeamSlug}
                .showSidebarToggle=${showSidebar}
                @sidebar-toggle=${this.toggleSidebar}
              ></app-header>
            </div>
          ` : ''}

          <!-- Page content -->
          <div class="content-container">
            ${this.renderPageContent()}
          </div>
        </div>
      </div>
    `;
  }
}

