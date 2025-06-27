// src/components/base/base-page.ts
import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext } from '../../types';

export abstract class BasePage extends LitElement {
  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) context!: RouteContext;

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    .page-layout {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--sl-color-neutral-0);
    }

    .page-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      background-color: var(--sl-color-neutral-50);
    }

    .page-content {
      flex: 1;
      padding: 2rem;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }
      
      .page-content {
        padding: 1rem;
      }
    }

    /* Dark theme */
    :host(.sl-theme-dark) .main-content {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .page-header {
      background-color: var(--sl-color-neutral-800);
      border-bottom-color: var(--sl-color-neutral-700);
    }
  `;

  protected get currentAccount() {
    return this.stateController.state.currentAccount;
  }

  protected get isAuthenticated() {
    return this.stateController.state.isAuthenticated;
  }

  protected get teamSlug() {
    return this.context.params.teamSlug;
  }
}

