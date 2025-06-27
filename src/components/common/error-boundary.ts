// src/components/common/error-boundary.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('error-boundary')
export class ErrorBoundary extends LitElement {
  @state() private hasError = false;
  @state() private errorMessage = '';
  @property() fallback?: string;

  static styles = css`
    .error-container {
      padding: 2rem;
      text-align: center;
      border: 1px solid var(--sl-color-danger-300);
      border-radius: var(--sl-border-radius-medium);
      background-color: var(--sl-color-danger-50);
      margin: 1rem;
    }

    .error-title {
      color: var(--sl-color-danger-600);
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      margin-bottom: 0.5rem;
    }

    .error-message {
      color: var(--sl-color-danger-700);
      margin-bottom: 1rem;
    }

    .error-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  private handleError = (event: ErrorEvent) => {
    console.error('Error caught by boundary:', event.error);
    this.hasError = true;
    this.errorMessage = event.error?.message || 'An unexpected error occurred';
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    this.hasError = true;
    this.errorMessage = event.reason?.message || 'An unexpected error occurred';
  };

  private retry() {
    this.hasError = false;
    this.errorMessage = '';
    // Trigger re-render of children
    this.requestUpdate();
  }

  private refresh() {
    window.location.reload();
  }

  render() {
    if (this.hasError) {
      return html`
        <div class="error-container">
          <div class="error-title">Something went wrong</div>
          <div class="error-message">${this.errorMessage}</div>
          <div class="error-actions">
            <sl-button variant="primary" @click=${this.retry}>
              Try Again
            </sl-button>
            <sl-button variant="default" @click=${this.refresh}>
              Refresh Page
            </sl-button>
          </div>
        </div>
      `;
    }

    return html`<slot></slot>`;
  }
}

