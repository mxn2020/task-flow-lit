// src/components/pages/team-members-page.ts

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext } from '../../types';
import '../layout/app-sidebar';

@customElement('team-members-page')
export class TeamMembersPage extends LitElement {
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

    .page-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    .page-content {
      flex: 1;
      padding: 2rem;
    }

    .placeholder-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      padding: 3rem;
    }

    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .placeholder-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 1rem;
    }

    .placeholder-description {
      color: var(--sl-color-neutral-600);
      margin-bottom: 2rem;
      max-width: 500px;
      line-height: 1.6;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
      text-align: left;
    }

    .feature-list li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
      color: var(--sl-color-neutral-700);
    }

    .feature-list li::before {
      content: '✓';
      color: var(--sl-color-success-600);
      font-weight: bold;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        padding: 1rem;
      }

      .placeholder-container {
        padding: 2rem 1rem;
      }

      .placeholder-title {
        font-size: 1.25rem;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .main-content {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .page-header {
      background-color: var(--sl-color-neutral-800);
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .page-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .page-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .placeholder-container {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .placeholder-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .placeholder-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .feature-list li {
      color: var(--sl-color-neutral-300);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) context!: RouteContext;

  render() {
    return html`
      <div class="page-layout">
        <app-sidebar 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .currentTeamSlug=${this.context.params.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">Team Members</h1>
            <p class="page-subtitle">Manage your team members, roles, and permissions</p>
          </div>

          <div class="page-content">
            <div class="placeholder-container">
              <div class="placeholder-icon">👥</div>
              <h2 class="placeholder-title">Team Members Management</h2>
              <p class="placeholder-description">
                This feature is coming soon! You'll be able to invite team members, manage roles, 
                and control access permissions for your workspace.
              </p>
              
              <ul class="feature-list">
                <li>Invite team members via email</li>
                <li>Assign roles and permissions</li>
                <li>Manage team member access</li>
                <li>View member activity and status</li>
                <li>Remove or suspend members</li>
                <li>Bulk member management actions</li>
              </ul>

              <sl-button variant="primary" @click=${this.handleContactSupport}>
                Request Early Access
              </sl-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private handleContactSupport() {
    // TODO: Implement contact support functionality
    alert('Thanks for your interest! Team member management will be available soon.');
  }
}

