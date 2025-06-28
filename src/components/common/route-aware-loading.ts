// src/components/common/route-aware-loading.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { RouterController } from '../../controllers/router-controller';
import './loading-spinner';
import './skeleton-loader';

export type LoadingLayoutType = 
  | 'fullscreen'      // Full screen loading (app-level)
  | 'page'           // Page with sidebar layout
  | 'content'        // Content area only
  | 'card'           // Single card/component
  | 'inline';        // Inline loading

@customElement('route-aware-loading')
export class RouteAwareLoading extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      flex-direction: column;
      gap: 1rem;
    }

    .loading-message {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-medium);
      margin: 0;
    }

    /* Fullscreen skeleton layout */
    .skeleton-fullscreen {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .skeleton-header {
      height: 60px;
      background: var(--sl-color-neutral-100);
      border-bottom: 1px solid var(--sl-color-neutral-200);
      display: flex;
      align-items: center;
      padding: 0 2rem;
    }

    .skeleton-body {
      flex: 1;
      display: flex;
    }

    /* Page skeleton layout (with sidebar) */
    .skeleton-page {
      min-height: 100vh;
      display: flex;
    }

    .skeleton-sidebar {
      width: 280px;
      background: var(--sl-color-neutral-50);
      border-right: 1px solid var(--sl-color-neutral-200);
      padding: 1rem;
    }

    .skeleton-main {
      flex: 1;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .skeleton-page-header {
      margin-bottom: 2rem;
    }

    .skeleton-page-content {
      display: grid;
      gap: 2rem;
    }

    /* Content skeleton layout */
    .skeleton-content {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .skeleton-content-header {
      margin-bottom: 2rem;
    }

    .skeleton-content-body {
      display: grid;
      gap: 1.5rem;
    }

    /* Card skeleton layout */
    .skeleton-card {
      padding: 1.5rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      background: var(--sl-color-neutral-0);
    }

    /* Inline skeleton layout */
    .skeleton-inline {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .skeleton-page {
        flex-direction: column;
      }

      .skeleton-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--sl-color-neutral-200);
      }

      .skeleton-main, .skeleton-content {
        padding: 1rem;
      }
    }

    /* Dark theme */
    :host(.sl-theme-dark) .skeleton-header {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .skeleton-sidebar {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .skeleton-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .loading-message {
      color: var(--sl-color-neutral-400);
    }
  `;

  @property({ type: Object }) routerController?: RouterController;
  @property({ type: String }) layoutType: LoadingLayoutType = 'fullscreen';
  @property({ type: String }) message?: string;
  @property({ type: Boolean }) forceSkeleton?: boolean;
  @property({ type: Boolean }) forceSpinner?: boolean;
  @property({ type: Number }) skeletonCount: number = 3;
  @property({ type: String }) skeletonType: 'title' | 'card' | 'list' | 'page' = 'card';

  private shouldShowSkeleton(): boolean {
    // Allow explicit override
    if (this.forceSkeleton) return true;
    if (this.forceSpinner) return false;

    // Check if current route requires auth
    const requiresAuth = this.routerController?.requiresAuth() ?? false;
    
    // Show skeleton for protected routes, spinner for public routes
    return requiresAuth;
  }

  private getDefaultMessage(): string {
    const requiresAuth = this.routerController?.requiresAuth() ?? false;
    
    if (requiresAuth) {
      switch (this.layoutType) {
        case 'page': return 'Loading page...';
        case 'content': return 'Loading content...';
        case 'card': return 'Loading...';
        case 'inline': return 'Loading...';
        default: return 'Loading...';
      }
    } else {
      return 'Loading...';
    }
  }

  render() {
    const showSkeleton = this.shouldShowSkeleton();
    const loadingMessage = this.message || this.getDefaultMessage();

    if (showSkeleton) {
      return this.renderSkeleton();
    } else {
      return this.renderSpinner(loadingMessage);
    }
  }

  private renderSpinner(message: string) {
    if (this.layoutType === 'inline') {
      return html`
        <div class="skeleton-inline">
          <loading-spinner size="small"></loading-spinner>
          ${message ? html`<span class="loading-message">${message}</span>` : ''}
        </div>
      `;
    }

    return html`
      <div class="loading-container">
        <loading-spinner size="large"></loading-spinner>
        ${message ? html`<p class="loading-message">${message}</p>` : ''}
      </div>
    `;
  }

  private renderSkeleton() {
    switch (this.layoutType) {
      case 'fullscreen':
        return this.renderFullscreenSkeleton();
      case 'page':
        return this.renderPageSkeleton();
      case 'content':
        return this.renderContentSkeleton();
      case 'card':
        return this.renderCardSkeleton();
      case 'inline':
        return this.renderInlineSkeleton();
      default:
        return this.renderFullscreenSkeleton();
    }
  }

  private renderFullscreenSkeleton() {
    return html`
      <div class="skeleton-fullscreen">
        <div class="skeleton-header">
          <skeleton-loader type="title"></skeleton-loader>
        </div>
        <div class="skeleton-body">
          <div class="skeleton-sidebar">
            <skeleton-loader type="list" count="6"></skeleton-loader>
          </div>
          <div class="skeleton-main">
            <div class="skeleton-page-header">
              <skeleton-loader type="title"></skeleton-loader>
            </div>
            <div class="skeleton-page-content">
              <skeleton-loader type="${this.skeletonType}" count="${this.skeletonCount}"></skeleton-loader>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderPageSkeleton() {
    return html`
      <div class="skeleton-page">
        <div class="skeleton-sidebar">
          <skeleton-loader type="title"></skeleton-loader>
          <skeleton-loader type="list" count="6"></skeleton-loader>
        </div>
        <div class="skeleton-main">
          <div class="skeleton-page-header">
            <skeleton-loader type="title"></skeleton-loader>
          </div>
          <div class="skeleton-page-content">
            <skeleton-loader type="${this.skeletonType}" count="${this.skeletonCount}"></skeleton-loader>
          </div>
        </div>
      </div>
    `;
  }

  private renderContentSkeleton() {
    return html`
      <div class="skeleton-content">
        <div class="skeleton-content-header">
          <skeleton-loader type="title"></skeleton-loader>
        </div>
        <div class="skeleton-content-body">
          <skeleton-loader type="${this.skeletonType}" count="${this.skeletonCount}"></skeleton-loader>
        </div>
      </div>
    `;
  }

  private renderCardSkeleton() {
    return html`
      <div class="skeleton-card">
        <skeleton-loader type="${this.skeletonType}" count="${this.skeletonCount}"></skeleton-loader>
      </div>
    `;
  }

  private renderInlineSkeleton() {
    return html`
      <div class="skeleton-inline">
        <skeleton-loader type="title" count="1"></skeleton-loader>
      </div>
    `;
  }
}

// Usage examples:
// 
// <!-- App-level loading -->
// <route-aware-loading 
//   .routerController=${this.routerController}
//   layoutType="fullscreen"
//   message="Loading Task Flow..."
// ></route-aware-loading>
//
// <!-- Page with sidebar loading -->
// <route-aware-loading 
//   .routerController=${this.routerController}
//   layoutType="page"
//   skeletonType="card"
//   skeletonCount="4"
// ></route-aware-loading>
//
// <!-- Force spinner for auth operations -->
// <route-aware-loading 
//   .routerController=${this.routerController}
//   layoutType="content"
//   message="Signing in..."
//   forceSpinner
// ></route-aware-loading>
//
// <!-- Inline loading for small components -->
// <route-aware-loading 
//   .routerController=${this.routerController}
//   layoutType="inline"
//   message="Saving..."
// ></route-aware-loading>