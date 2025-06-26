import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('error-message')
export class ErrorMessage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .error-container {
      max-width: 400px;
      padding: 1.5rem;
      border-radius: var(--sl-border-radius-medium);
      background-color: var(--sl-color-danger-50);
      border: 1px solid var(--sl-color-danger-200);
      text-align: center;
    }

    .error-icon {
      font-size: 2rem;
      color: var(--sl-color-danger-600);
      margin-bottom: 1rem;
    }

    .error-title {
      font-size: var(--sl-font-size-large);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-danger-700);
      margin-bottom: 0.5rem;
    }

    .error-message {
      color: var(--sl-color-danger-600);
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .error-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .error-container {
      background-color: var(--sl-color-danger-950);
      border-color: var(--sl-color-danger-800);
    }

    :host(.sl-theme-dark) .error-icon {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .error-title {
      color: var(--sl-color-danger-300);
    }

    :host(.sl-theme-dark) .error-message {
      color: var(--sl-color-danger-400);
    }
  `;

  @property() message: string = 'An error occurred';
  @property() title: string = 'Error';
  @property({ type: Boolean }) showRetry: boolean = true;
  @property({ type: Boolean }) showHome: boolean = false;

  render() {
    return html`
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-title">${this.title}</div>
        <div class="error-message">${this.message}</div>
        <div class="error-actions">
          ${this.showRetry ? html`
            <sl-button variant="primary" @click=${this.handleRetry}>
              Try Again
            </sl-button>
          ` : ''}
          ${this.showHome ? html`
            <sl-button variant="default" @click=${this.handleGoHome}>
              Go Home
            </sl-button>
          ` : ''}
        </div>
      </div>
    `;
  }

  private handleRetry() {
    this.dispatchEvent(new CustomEvent('retry', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleGoHome() {
    this.dispatchEvent(new CustomEvent('go-home', {
      bubbles: true,
      composed: true,
    }));
  }
}

