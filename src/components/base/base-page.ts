// src/components/base/base-page.ts
import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { LoadingController } from '../../controllers/loading-controller';
import { RouteContext } from '../../types';

export abstract class BasePage extends LitElement {
  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) loadingController!: LoadingController;
  @property({ type: Object }) context!: RouteContext;

  @state() protected pageLoading = false;
  @state() protected pageError: string | null = null;

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }

    .page-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--sl-color-neutral-0);
    }

    .page-header {
      flex-shrink: 0;
      padding: 1.5rem 2rem;
      background-color: var(--sl-color-neutral-0);
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .page-header.sticky {
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }

    .page-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0;
      font-size: var(--sl-font-size-large);
      line-height: 1.4;
    }

    .page-actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .page-content {
      flex: 1;
      overflow-y: auto;
      scroll-behavior: smooth;
      padding: 2rem;
    }

    .page-content.no-padding {
      padding: 0;
    }

    .page-content.compact {
      padding: 1rem;
    }

    /* Content sections */
    .content-section {
      margin-bottom: 2rem;
    }

    .content-section:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0;
    }

    .section-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0.25rem 0 0 0;
      font-size: var(--sl-font-size-medium);
    }

    .section-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-shrink: 0;
    }

    /* Loading states */
    .page-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      flex-direction: column;
      gap: 1rem;
    }

    .content-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100px;
      color: var(--sl-color-neutral-600);
    }

    /* Error states */
    .page-error {
      padding: 2rem;
      text-align: center;
    }

    /* Empty states */
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--sl-color-neutral-600);
    }

    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
      color: var(--sl-color-neutral-400);
    }

    .empty-state-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-700);
      margin-bottom: 0.5rem;
    }

    .empty-state-description {
      color: var(--sl-color-neutral-600);
      margin-bottom: 1.5rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.5;
    }

    .empty-state-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Cards and grids */
    .content-grid {
      display: grid;
      gap: 1.5rem;
    }

    .content-grid.cols-1 { grid-template-columns: 1fr; }
    .content-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
    .content-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
    .content-grid.cols-4 { grid-template-columns: repeat(4, 1fr); }

    .content-card {
      background: var(--sl-color-neutral-0);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      padding: 1.5rem;
      transition: all 0.2s ease;
    }

    .content-card:hover {
      box-shadow: var(--sl-shadow-medium);
      border-color: var(--sl-color-neutral-300);
    }

    .content-card.interactive {
      cursor: pointer;
    }

    .content-card.interactive:hover {
      transform: translateY(-2px);
      box-shadow: var(--sl-shadow-large);
    }

    /* Stats/metrics */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--sl-color-neutral-0);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.25rem;
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-600);
      display: block;
      line-height: 1;
    }

    .stat-label {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
      margin-top: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Responsive design */
    @media (max-width: 1024px) {
      .content-grid.cols-4 { grid-template-columns: repeat(2, 1fr); }
      .content-grid.cols-3 { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .page-header {
        padding: 1rem 1.5rem;
      }

      .page-content {
        padding: 1.5rem;
      }

      .page-content.compact {
        padding: 0.75rem;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .content-grid.cols-4,
      .content-grid.cols-3,
      .content-grid.cols-2 {
        grid-template-columns: 1fr;
      }

      .page-actions,
      .section-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .page-actions sl-button,
      .section-actions sl-button {
        width: 100%;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .page-header {
        padding: 1rem;
      }

      .page-content {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .empty-state {
        padding: 2rem 1rem;
      }
    }

    /* Dark theme support */
    :host(.sl-theme-dark) .page-container,
    :host(.sl-theme-dark) .page-header {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .page-header {
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .page-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .page-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .section-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .content-card,
    :host(.sl-theme-dark) .stat-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .content-card:hover {
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .content-loading {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .empty-state {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .empty-state-icon {
      color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .empty-state-title {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .stat-label {
      color: var(--sl-color-neutral-400);
    }

    /* Print styles */
    @media print {
      .page-actions,
      .section-actions {
        display: none;
      }

      .page-content {
        overflow: visible;
      }

      .content-card {
        break-inside: avoid;
      }
    }

    /* Focus and accessibility */
    .content-card.interactive:focus-visible {
      outline: 2px solid var(--sl-color-primary-600);
      outline-offset: 2px;
    }

    /* Animation and transitions */
    .content-card,
    .stat-card {
      transition: all 0.2s ease;
    }

    .page-content {
      transition: opacity 0.2s ease;
    }

    .page-content.loading {
      opacity: 0.7;
    }
  `;

  // Helper getters
  protected get currentAccount() {
    return this.stateController.state.currentAccount;
  }

  protected get isAuthenticated() {
    return this.stateController.state.isAuthenticated;
  }

  protected get user() {
    return this.stateController.state.user;
  }

  protected get teamSlug() {
    return this.context.params.teamSlug;
  }

  protected get isLoading() {
    return this.pageLoading || this.stateController.state.loading;
  }

  // Lifecycle methods that subclasses can override
  protected async loadPageData(): Promise<void> {
    // Override in subclasses to load page-specific data
  }

  protected async refreshPageData(): Promise<void> {
    // Override in subclasses to refresh page data
    await this.loadPageData();
  }

  // Data loading with error handling
  protected async withPageLoading<T>(operation: () => Promise<T>): Promise<T | null> {
    this.pageLoading = true;
    this.pageError = null;
    this.requestUpdate();

    try {
      const result = await operation();
      return result;
    } catch (error) {
      this.pageError = error instanceof Error ? error.message : 'An error occurred';
      return null;
    } finally {
      this.pageLoading = false;
      this.requestUpdate();
    }
  }

  // Navigation helpers
  protected navigateTo(path: string) {
    this.routerController.navigate(path);
  }

  protected goBack() {
    this.routerController.back();
  }

  // Error handling
  protected clearPageError() {
    this.pageError = null;
    this.requestUpdate();
  }

  // Common render helpers
  protected renderPageHeader(title: string, subtitle?: string, actions?: any) {
    return html`
      <div class="page-header">
        <h1 class="page-title">${title}</h1>
        ${subtitle ? html`<p class="page-subtitle">${subtitle}</p>` : ''}
        ${actions ? html`<div class="page-actions">${actions}</div>` : ''}
      </div>
    `;
  }

  protected renderSectionHeader(title: string, subtitle?: string, actions?: any) {
    return html`
      <div class="section-header">
        <div>
          <h2 class="section-title">${title}</h2>
          ${subtitle ? html`<p class="section-subtitle">${subtitle}</p>` : ''}
        </div>
        ${actions ? html`<div class="section-actions">${actions}</div>` : ''}
      </div>
    `;
  }

  protected renderLoading(message = 'Loading...') {
    return html`
      <div class="page-loading">
        <sl-spinner style="font-size: 2rem;"></sl-spinner>
        <p>${message}</p>
      </div>
    `;
  }

  protected renderError(error: string, onRetry?: () => void) {
    return html`
      <div class="page-error">
        <sl-alert variant="danger" open>
          <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
          <strong>Error:</strong> ${error}
          ${onRetry ? html`
            <sl-button slot="suffix" variant="default" size="small" @click=${onRetry}>
              <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
              Retry
            </sl-button>
          ` : ''}
        </sl-alert>
      </div>
    `;
  }

  protected renderEmptyState(
    icon: string,
    title: string,
    description: string,
    actions?: any
  ) {
    return html`
      <div class="empty-state">
        <sl-icon name="${icon}" class="empty-state-icon"></sl-icon>
        <h3 class="empty-state-title">${title}</h3>
        <p class="empty-state-description">${description}</p>
        ${actions ? html`<div class="empty-state-actions">${actions}</div>` : ''}
      </div>
    `;
  }

  protected renderStats(stats: Array<{ label: string; value: string | number; icon?: string }>) {
    return html`
      <div class="stats-grid">
        ${stats.map(stat => html`
          <div class="stat-card">
            ${stat.icon ? html`<sl-icon name="${stat.icon}" style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--sl-color-primary-600);"></sl-icon>` : ''}
            <span class="stat-value">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
          </div>
        `)}
      </div>
    `;
  }

  // Template method - subclasses should override this
  protected abstract renderPageContent(): any;

  render() {
    return html`
      <div class="page-container">
        ${this.pageError ? this.renderError(this.pageError, () => this.refreshPageData()) : ''}
        ${this.renderPageContent()}
      </div>
    `;
  }
}

