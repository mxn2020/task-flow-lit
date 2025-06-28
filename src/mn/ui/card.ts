import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mn-card')
export class MnCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--mn-card-bg, var(--sl-color-neutral-0));
      border-radius: var(--mn-radius, 12px);
      border: 1px solid var(--mn-card-border, var(--sl-color-neutral-200));
      box-shadow: var(--mn-card-shadow, var(--sl-shadow-x-small));
      padding: 1.25rem;
      transition: box-shadow 0.2s;
    }
    :host([elevated]) {
      box-shadow: var(--mn-card-shadow-elevated, var(--sl-shadow-medium));
    }
  `;
  render() {
    return html`<slot></slot>`;
  }
}
