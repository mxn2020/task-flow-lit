// src/components/common/loading-spinner.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('loading-spinner')
export class LoadingSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .spinner-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .spinner {
      border: 2px solid var(--sl-color-neutral-200);
      border-top: 2px solid var(--sl-color-primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner.small {
      width: 1rem;
      height: 1rem;
    }

    .spinner.medium {
      width: 1.5rem;
      height: 1.5rem;
    }

    .spinner.large {
      width: 2rem;
      height: 2rem;
    }

    .text {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .spinner {
      border: 2px solid var(--sl-color-neutral-700);
      border-top: 2px solid var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .text {
      color: var(--sl-color-neutral-400);
    }
  `;

  @property() size: 'small' | 'medium' | 'large' = 'medium';
  @property() text?: string;

  render() {
    return html`
      <div class="spinner-container">
        <div class="spinner ${this.size}"></div>
        ${this.text ? html`<span class="text">${this.text}</span>` : ''}
      </div>
    `;
  }
}
