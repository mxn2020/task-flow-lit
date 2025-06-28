import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mn-label')
export class MnLabel extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      color: var(--mn-label-color, var(--sl-color-neutral-700));
      font-size: var(--mn-label-size, 0.95rem);
      font-weight: var(--mn-label-weight, 500);
      margin-bottom: 0.25rem;
      letter-spacing: 0.01em;
    }
  `;
  @property({ type: String }) for = '';
  render() {
    return html`<label for="${this.for}"><slot></slot></label>`;
  }
}
