import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mn-button')
export class MnButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--mn-radius, 8px);
      border: 1px solid var(--mn-btn-border, var(--sl-color-primary-600));
      background: var(--mn-btn-bg, var(--sl-color-primary-600));
      color: var(--mn-btn-color, #fff);
      font-size: 1rem;
      font-weight: 500;
      padding: 0.5rem 1.25rem;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      box-shadow: var(--mn-btn-shadow, none);
    }
    button[variant="outline"] {
      background: transparent;
      color: var(--mn-btn-outline-color, var(--sl-color-primary-700));
      border: 1.5px solid var(--mn-btn-border, var(--sl-color-primary-600));
    }
    button[variant="ghost"] {
      background: transparent;
      color: var(--mn-btn-ghost-color, var(--sl-color-primary-700));
      border: none;
      box-shadow: none;
    }
    button:active {
      box-shadow: var(--mn-btn-shadow-active, var(--sl-shadow-x-small));
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
  @property({ type: String }) variant: 'solid' | 'outline' | 'ghost' = 'solid';
  @property({ type: Boolean }) disabled = false;
  render() {
    return html`<button ?disabled=${this.disabled} variant=${this.variant}><slot></slot></button>`;
  }
}
