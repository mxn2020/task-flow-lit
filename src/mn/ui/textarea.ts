import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mn-textarea')
export class MnTextarea extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    textarea {
      width: 100%;
      border-radius: var(--mn-radius, 8px);
      border: 1px solid var(--mn-input-border, var(--sl-color-neutral-300));
      background: var(--mn-input-bg, var(--sl-color-neutral-0));
      color: var(--mn-input-color, var(--sl-color-neutral-900));
      font-size: 1rem;
      padding: 0.75rem 1rem;
      outline: none;
      min-height: 80px;
      resize: vertical;
      transition: border 0.2s;
    }
    textarea:focus {
      border-color: var(--mn-input-focus, var(--sl-color-primary-600));
    }
    textarea:disabled {
      background: var(--sl-color-neutral-100);
      opacity: 0.7;
      cursor: not-allowed;
    }
  `;
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) disabled = false;
  render() {
    return html`<textarea
      .value=${this.value}
      .placeholder=${this.placeholder}
      ?disabled=${this.disabled}
      @input=${(e: any) => this.value = e.target.value}
    ></textarea>`;
  }
}
