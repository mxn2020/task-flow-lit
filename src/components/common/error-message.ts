// src/components/common/error-message.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('error-message')
export class ErrorMessage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .error-container {
      max-width: 500px;
      margin: 0 auto;
    }

    .error-content {
      text-align: center;
      padding: 2rem;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .error-title {
      font-size: var(--sl-font-size-x-large);
      font-weight: var(--sl-font-weight-semibold);
      margin-bottom: 0.75rem;
      color: var(--sl-color-neutral-900);
    }

    .error-message {
      font-size: var(--sl-font-size-medium);
      margin-bottom: 1.5rem;
      line-height: 1.6;
      color: var(--sl-color-neutral-700);
    }

    .error-details {
      background-color: var(--sl-color-neutral-100);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }

    .error-details summary {
      font-weight: var(--sl-font-weight-semibold);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--sl-color-neutral-800);
    }

    .error-details summary:hover {
      color: var(--sl-color-primary-600);
    }

    .error-details pre {
      margin: 0.75rem 0 0 0;
      font-size: var(--sl-font-size-small);
      background-color: var(--sl-color-neutral-50);
      padding: 0.75rem;
      border-radius: var(--sl-border-radius-small);
      overflow-x: auto;
      border: 1px solid var(--sl-color-neutral-300);
      color: var(--sl-color-neutral-800);
    }

    .error-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .recovery-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--sl-color-neutral-200);
    }

    .recovery-warning {
      margin-bottom: 1rem;
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .error-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .error-message {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .error-details {
      background-color: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .error-details summary {
      color: var(--sl-color-neutral-200);
    }

    :host(.sl-theme-dark) .error-details summary:hover {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .error-details pre {
      background-color: var(--sl-color-neutral-900);
      border-color: var(--sl-color-neutral-600);
      color: var(--sl-color-neutral-200);
    }

    :host(.sl-theme-dark) .recovery-section {
      border-top-color: var(--sl-color-neutral-700);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .error-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .error-content {
        padding: 1.5rem 1rem;
      }
    }
  `;

  @property() message: string = 'An error occurred';
  @property() title: string = 'Error';
  @property() details?: string; // Technical error details
  @property({ type: Boolean }) showRetry: boolean = true;
  @property({ type: Boolean }) showHome: boolean = false;
  @property({ type: Boolean }) showRecovery: boolean = false;
  @property({ type: Boolean }) showRefresh: boolean = false;

  @state() private showDetails = false;

  render() {
    return html`
      <div class="error-container">
        <sl-card class="error-content">
          <div slot="header">
            <span class="error-icon">⚠️</span>
            <h2 class="error-title">${this.title}</h2>
          </div>

          <div class="error-message">${this.message}</div>

          ${this.details ? html`
            <details class="error-details" ?open=${this.showDetails}>
              <summary @click=${() => this.showDetails = !this.showDetails}>
                <sl-icon name="info-circle"></sl-icon>
                Technical Details
              </summary>
              <pre>${this.details}</pre>
            </details>
          ` : ''}

          <div class="error-actions">
            ${this.showRetry ? html`
              <sl-button variant="primary" @click=${this.handleRetry}>
                <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                Try Again
              </sl-button>
            ` : ''}
            
            ${this.showRefresh ? html`
              <sl-button variant="default" @click=${this.handleRefresh}>
                <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                Refresh Page
              </sl-button>
            ` : ''}

            ${this.showHome ? html`
              <sl-button variant="default" @click=${this.handleGoHome}>
                <sl-icon slot="prefix" name="house"></sl-icon>
                Go Home
              </sl-button>
            ` : ''}
          </div>

          ${this.showRecovery ? html`
            <div class="recovery-section">
              <sl-alert variant="warning" open class="recovery-warning">
                <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                <strong>Still having trouble?</strong> Try the recovery options below as a last resort.
              </sl-alert>
              
              <div class="error-actions">
                <sl-button variant="warning" @click=${this.handleRecovery}>
                  <sl-icon slot="prefix" name="tools"></sl-icon>
                  Force Recovery
                </sl-button>
                <sl-button variant="danger" @click=${this.handleClearData}>
                  <sl-icon slot="prefix" name="trash"></sl-icon>
                  Clear Local Data
                </sl-button>
              </div>
            </div>
          ` : ''}
        </sl-card>
      </div>
    `;
  }

  private handleRetry() {
    this.dispatchEvent(new CustomEvent('retry', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleRefresh() {
    window.location.reload();
  }

  private handleGoHome() {
    this.dispatchEvent(new CustomEvent('go-home', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleRecovery() {
    // Try global recovery methods
    const recovery = (window as any).taskFlowRecovery;
    if (recovery) {
      console.log('[ErrorMessage] Triggering force recovery...');
      recovery.forceFullRecovery().then((success: boolean) => {
        if (!success) {
          console.warn('[ErrorMessage] Force recovery failed, trying page reload...');
          recovery.forceReload();
        }
      }).catch((error: any) => {
        console.error('[ErrorMessage] Recovery failed:', error);
        recovery.forceReload();
      });
    } else {
      console.warn('[ErrorMessage] No recovery methods available, reloading page...');
      window.location.reload();
    }
  }

  private handleClearData() {
    if (!confirm('This will clear all local data and refresh the page. Are you sure?')) {
      return;
    }

    try {
      // Clear various storage types
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any indexed DB (if used)
      if ('indexedDB' in window) {
        indexedDB.databases?.().then(databases => {
          databases.forEach(db => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        });
      }

      // Clear cache if available
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }

      console.log('[ErrorMessage] Local data cleared, reloading...');
      window.location.reload();
    } catch (error) {
      console.error('[ErrorMessage] Failed to clear data:', error);
      window.location.reload();
    }
  }
}

