// src/components/pages/billing-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext } from '../../types';
import '../layout/app-sidebar';

@customElement('billing-page')
export class BillingPage extends LitElement {
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

    .billing-grid {
      display: grid;
      gap: 2rem;
      max-width: 1200px;
    }

    .billing-section {
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      overflow: hidden;
    }

    .section-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      background-color: var(--sl-color-neutral-50);
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0;
    }

    .section-content {
      padding: 1.5rem;
    }

    .current-plan {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .plan-info h3 {
      margin: 0 0 0.5rem 0;
      color: var(--sl-color-neutral-900);
    }

    .plan-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--sl-color-primary-600);
    }

    .plan-status {
      padding: 0.25rem 0.75rem;
      border-radius: var(--sl-border-radius-medium);
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .plan-status.active {
      background-color: var(--sl-color-success-100);
      color: var(--sl-color-success-700);
    }

    .plan-status.free {
      background-color: var(--sl-color-neutral-100);
      color: var(--sl-color-neutral-700);
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .plan-features li {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      color: var(--sl-color-neutral-700);
    }

    .plan-features li::before {
      content: '✓';
      color: var(--sl-color-success-600);
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .usage-bar {
      margin: 1rem 0;
    }

    .usage-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .usage-progress {
      width: 100%;
      height: 0.5rem;
      background-color: var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-small);
      overflow: hidden;
    }

    .usage-fill {
      height: 100%;
      background-color: var(--sl-color-primary-600);
      transition: width 0.3s ease;
    }

    .billing-history {
      margin-top: 1rem;
    }

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--sl-color-neutral-100);
    }

    .history-item:last-child {
      border-bottom: none;
    }

    .history-date {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
    }

    .history-amount {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
    }

    .payment-method {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      margin-bottom: 1rem;
    }

    .card-icon {
      font-size: 1.5rem;
    }

    .card-info {
      flex: 1;
    }

    .card-number {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
    }

    .card-expires {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .plan-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .plan-card {
      border: 2px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      text-align: center;
      position: relative;
    }

    .plan-card.current {
      border-color: var(--sl-color-primary-600);
      background-color: var(--sl-color-primary-50);
    }

    .plan-card.current::after {
      content: 'Current Plan';
      position: absolute;
      top: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--sl-color-primary-600);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: var(--sl-border-radius-medium);
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-medium);
    }

    .plan-card h3 {
      margin: 0 0 0.5rem 0;
      color: var(--sl-color-neutral-900);
    }

    .plan-card .plan-price {
      margin-bottom: 1rem;
    }

    .plan-card .plan-features {
      text-align: left;
      margin-bottom: 1.5rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        padding: 1rem;
      }

      .current-plan {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .plan-cards {
        grid-template-columns: 1fr;
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

    :host(.sl-theme-dark) .billing-section {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .section-header {
      background-color: var(--sl-color-neutral-700);
      border-bottom-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .plan-info h3 {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .plan-features li {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .payment-method {
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .card-number {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .card-expires {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .plan-card {
      border-color: var(--sl-color-neutral-600);
      background-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .plan-card.current {
      background-color: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .plan-card h3 {
      color: var(--sl-color-neutral-100);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) context!: RouteContext;

  @state() private loading = false;

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
            <h1 class="page-title">Billing & Subscription</h1>
            <p class="page-subtitle">Manage your subscription, billing, and payment methods</p>
          </div>

          <div class="page-content">
            <div class="billing-grid">
              
              <!-- Current Plan Section -->
              <div class="billing-section">
                <div class="section-header">
                  <h2 class="section-title">Current Plan</h2>
                </div>
                <div class="section-content">
                  <div class="current-plan">
                    <div class="plan-info">
                      <h3>Free Plan</h3>
                      <div class="plan-price">$0<span style="font-size: 1rem; font-weight: normal;">/month</span></div>
                      <ul class="plan-features">
                        <li>2 active projects</li>
                        <li>3 team members</li>
                        <li>10 documents</li>
                        <li>Basic task management</li>
                        <li>Email support</li>
                      </ul>
                    </div>
                    <div class="plan-status free">Free</div>
                  </div>
                  
                  <!-- Usage Statistics -->
                  <div class="usage-bar">
                    <div class="usage-label">
                      <span>Active Projects</span>
                      <span>1 / 2</span>
                    </div>
                    <div class="usage-progress">
                      <div class="usage-fill" style="width: 50%"></div>
                    </div>
                  </div>
                  
                  <div class="usage-bar">
                    <div class="usage-label">
                      <span>Team Members</span>
                      <span>1 / 3</span>
                    </div>
                    <div class="usage-progress">
                      <div class="usage-fill" style="width: 33%"></div>
                    </div>
                  </div>
                  
                  <div class="usage-bar">
                    <div class="usage-label">
                      <span>Documents</span>
                      <span>0 / 10</span>
                    </div>
                    <div class="usage-progress">
                      <div class="usage-fill" style="width: 0%"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Available Plans Section -->
              <div class="billing-section">
                <div class="section-header">
                  <h2 class="section-title">Available Plans</h2>
                </div>
                <div class="section-content">
                  <div class="plan-cards">
                    <div class="plan-card current">
                      <h3>Free Plan</h3>
                      <div class="plan-price">$0<span style="font-size: 1rem; font-weight: normal;">/month</span></div>
                      <ul class="plan-features">
                        <li>2 active projects</li>
                        <li>3 team members</li>
                        <li>10 documents</li>
                        <li>Basic task management</li>
                        <li>Email support</li>
                      </ul>
                      <sl-button variant="default" disabled>Current Plan</sl-button>
                    </div>

                    <div class="plan-card">
                      <h3>Creator Plan</h3>
                      <div class="plan-price">$9<span style="font-size: 1rem; font-weight: normal;">/month</span></div>
                      <ul class="plan-features">
                        <li>10 active projects</li>
                        <li>10 team members</li>
                        <li>Unlimited documents</li>
                        <li>Advanced task management</li>
                        <li>Analytics & reporting</li>
                        <li>Priority support</li>
                      </ul>
                      <sl-button variant="primary">Upgrade to Creator</sl-button>
                    </div>

                    <div class="plan-card">
                      <h3>Team Plan</h3>
                      <div class="plan-price">$19<span style="font-size: 1rem; font-weight: normal;">/month</span></div>
                      <ul class="plan-features">
                        <li>Unlimited projects</li>
                        <li>Unlimited team members</li>
                        <li>Unlimited documents</li>
                        <li>Advanced features</li>
                        <li>Custom workflows</li>
                        <li>24/7 support</li>
                      </ul>
                      <sl-button variant="primary">Upgrade to Team</sl-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Method Section -->
              <div class="billing-section">
                <div class="section-header">
                  <h2 class="section-title">Payment Method</h2>
                </div>
                <div class="section-content">
                  <p style="color: var(--sl-color-neutral-600); margin-bottom: 1rem;">
                    No payment method required for the free plan.
                  </p>
                  <sl-button variant="default" disabled>
                    <sl-icon slot="prefix" name="credit-card"></sl-icon>
                    Add Payment Method
                  </sl-button>
                </div>
              </div>

              <!-- Billing History Section -->
              <div class="billing-section">
                <div class="section-header">
                  <h2 class="section-title">Billing History</h2>
                </div>
                <div class="section-content">
                  <div class="billing-history">
                    <div style="text-align: center; padding: 2rem; color: var(--sl-color-neutral-600);">
                      <sl-icon name="receipt" style="font-size: 2rem; margin-bottom: 1rem;"></sl-icon>
                      <p>No billing history available</p>
                      <p style="font-size: var(--sl-font-size-small);">
                        Your billing history will appear here once you start a paid subscription.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
  }
}

