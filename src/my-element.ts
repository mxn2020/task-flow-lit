// src/my-element.ts

import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import litLogo from './assets/lit.svg'
import viteLogo from '/vite.svg'

// Import Shoelace components and theme
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/card/card.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/badge/badge.js'

/**
 * An example element with Shoelace components.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  @property()
  name = 'World'

  render() {
    return html`
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src=${viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://lit.dev" target="_blank">
          <img src=${litLogo} class="logo lit" alt="Lit logo" />
        </a>
      </div>
      <slot></slot>
      
      <!-- Shoelace Card with components -->
      <sl-card class="card-overview">
        <img
          slot="image"
          src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
          alt="A kitten sits patiently between a terracotta pot and decorative grasses."
        />

        <strong>Shoelace + Lit Demo</strong><br />
        This demonstrates Shoelace components working with Lit.

        <div slot="footer">
          <sl-input 
            label="Your name" 
            placeholder="Enter your name"
            value=${this.name}
            @sl-input=${this.handleNameInput}>
          </sl-input>
          
          <sl-button variant="primary" pill @click=${this._onClick}>
            Click count: <sl-badge variant="neutral">${this.count}</sl-badge>
          </sl-button>
        </div>
      </sl-card>

      <p class="read-the-docs">${this.docsHint}</p>
      <p>Hello, ${this.name}!</p>
    `
  }

  private _onClick() {
    this.count++
  }

  private handleNameInput(e: Event) {
    this.name = (e.target as any).value
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card-overview {
      max-width: 300px;
      margin: 2rem auto;
    }

    .card-overview small {
      color: var(--sl-color-neutral-500);
    }

    .card-overview [slot='footer'] {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    sl-button {
      margin-top: 1rem;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}

