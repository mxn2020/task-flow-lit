// src/components/pages/billing-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import '../layout/app-sidebar';

interface PlanData {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  isCurrent: boolean;
  isPopular?: boolean;
}

interface UsageData {
  label: string;
  current: number;
  limit: number;
  percentage: number;
}

interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  invoice_url?: string;
}

@customElement('billing-page')
export class BillingPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Billing page specific styles */
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
        display: flex;
        justify-content: space-between;
        align-items: center;
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
        align-items: flex-start;
        margin-bottom: 1.5rem;
        gap: 1rem;
      }

      .plan-info {
        flex: 1;
      }

      .plan-info h3 {
        margin: 0 0 0.5rem 0;
        color: var(--sl-color-neutral-900);
        font-size: 1.25rem;
      }

      .plan-price {
        font-size: 1.75rem;
        font-weight: var(--sl-font-weight-bold);
        color: var(--sl-color-primary-600);
        margin-bottom: 1rem;
      }

      .plan-price-suffix {
        font-size: 1rem;
        font-weight: var(--sl-font-weight-normal);
        color: var(--sl-color-neutral-600);
      }

      .plan-features {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.5rem;
      }

      .plan-features li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--sl-color-neutral-700);
      }

      .usage-section {
        margin-top: 1.5rem;
      }

      .usage-item {
        margin-bottom: 1.5rem;
      }

      .usage-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .usage-label {
        font-size: var(--sl-font-size-medium);
        font-weight: var(--sl-font-weight-medium);
        color: var(--sl-color-neutral-800);
      }

      .usage-value {
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-600);
      }

      .usage-progress {
        margin-top: 0.5rem;
      }

      .plan-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
      }

      .plan-card {
        position: relative;
        border: 2px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-large);
        padding: 1.5rem;
        transition: all 0.2s ease;
      }

      .plan-card:hover {
        border-color: var(--sl-color-primary-300);
        box-shadow: var(--sl-shadow-medium);
      }

      .plan-card.current {
        border-color: var(--sl-color-primary-600);
        background-color: var(--sl-color-primary-50);
      }

      .plan-card.popular {
        border-color: var(--sl-color-warning-400);
        background-color: var(--sl-color-warning-50);
      }

      .plan-badge {
        position: absolute;
        top: -0.5rem;
        left: 50%;
        transform: translateX(-50%);
      }

      .plan-card-header {
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .plan-card h3 {
        margin: 0 0 0.5rem 0;
        color: var(--sl-color-neutral-900);
        font-size: 1.25rem;
      }

      .plan-card .plan-price {
        margin-bottom: 1rem;
      }

      .plan-card .plan-features {
        margin-bottom: 1.5rem;
      }

      .plan-card-actions {
        text-align: center;
      }

      .plan-card-actions sl-button {
        width: 100%;
      }

      .payment-methods {
        display: grid;
        gap: 1rem;
      }

      .payment-method {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-medium);
        background-color: var(--sl-color-neutral-50);
      }

      .payment-method.default {
        border-color: var(--sl-color-primary-300);
        background-color: var(--sl-color-primary-50);
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
        margin-bottom: 0.25rem;
      }

      .card-details {
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-600);
      }

      .billing-history {
        display: grid;
        gap: 0.5rem;
      }

      .history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-medium);
        background-color: var(--sl-color-neutral-50);
      }

      .history-info {
        flex: 1;
      }

      .history-description {
        font-weight: var(--sl-font-weight-medium);
        color: var(--sl-color-neutral-900);
        margin-bottom: 0.25rem;
      }

      .history-date {
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-neutral-600);
      }

      .history-amount {
        font-weight: var(--sl-font-weight-semibold);
        color: var(--sl-color-neutral-900);
        margin-right: 1rem;
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--sl-color-neutral-600);
      }

      .empty-state sl-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
      }

      /* Mobile styles */
      @media (max-width: 768px) {
        .current-plan {
          flex-direction: column;
        }

        .plan-cards {
          grid-template-columns: 1fr;
        }

        .history-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .history-amount {
          margin-right: 0;
        }
      }

      /* Dark theme styles */
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

      :host(.sl-theme-dark) .plan-card {
        border-color: var(--sl-color-neutral-600);
        background-color: var(--sl-color-neutral-700);
      }

      :host(.sl-theme-dark) .plan-card.current {
        background-color: var(--sl-color-primary-900);
        border-color: var(--sl-color-primary-600);
      }

      :host(.sl-theme-dark) .plan-card.popular {
        background-color: var(--sl-color-warning-900);
        border-color: var(--sl-color-warning-600);
      }

      :host(.sl-theme-dark) .plan-card h3 {
        color: var(--sl-color-neutral-100);
      }

      :host(.sl-theme-dark) .payment-method,
      :host(.sl-theme-dark) .history-item {
        background-color: var(--sl-color-neutral-700);
        border-color: var(--sl-color-neutral-600);
      }

      :host(.sl-theme-dark) .payment-method.default {
        background-color: var(--sl-color-primary-900);
        border-color: var(--sl-color-primary-600);
      }

      :host(.sl-theme-dark) .card-number,
      :host(.sl-theme-dark) .history-description,
      :host(.sl-theme-dark) .history-amount {
        color: var(--sl-color-neutral-100);
      }

      :host(.sl-theme-dark) .card-details,
      :host(.sl-theme-dark) .history-date {
        color: var(--sl-color-neutral-400);
      }
  `;

  @state() private currentPlan: PlanData = {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    interval: 'month',
    features: [
      '2 active projects',
      '3 team members',
      '10 documents',
      'Basic task management',
      'Email support'
    ],
    isCurrent: true
  };

  @state() private availablePlans: PlanData[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      interval: 'month',
      features: [
        '2 active projects',
        '3 team members',
        '10 documents',
        'Basic task management',
        'Email support'
      ],
      isCurrent: true
    },
    {
      id: 'creator',
      name: 'Creator Plan',
      price: 9,
      interval: 'month',
      features: [
        '10 active projects',
        '10 team members',
        'Unlimited documents',
        'Advanced task management',
        'Analytics & reporting',
        'Priority support'
      ],
      isCurrent: false,
      isPopular: true
    },
    {
      id: 'team',
      name: 'Team Plan',
      price: 19,
      interval: 'month',
      features: [
        'Unlimited projects',
        'Unlimited team members',
        'Unlimited documents',
        'Advanced features',
        'Custom workflows',
        '24/7 support'
      ],
      isCurrent: false
    }
  ];

  @state() private usageData: UsageData[] = [
    { label: 'Active Projects', current: 1, limit: 2, percentage: 50 },
    { label: 'Team Members', current: 1, limit: 3, percentage: 33 },
    { label: 'Documents', current: 0, limit: 10, percentage: 0 }
  ];

  @state() private billingHistory: BillingHistoryItem[] = [];

  @state() private hasPaymentMethod = false;

  render() {
    return html`
      <div class="page-layout">
        <app-sidebar 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .currentTeamSlug=${this.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">Billing & Subscription</h1>
            <p class="page-subtitle">Manage your subscription, billing, and payment methods</p>
          </div>

          <div class="page-content">
            <div class="billing-grid">
              
              <!-- Current Plan Section -->
              <sl-card class="billing-section">
                <div slot="header" class="section-header">
                  <h2 class="section-title">Current Plan</h2>
                  <sl-badge variant=${this.currentPlan.price === 0 ? 'neutral' : 'success'} pill>
                    ${this.currentPlan.price === 0 ? 'Free' : 'Active'}
                  </sl-badge>
                </div>
                
                <div class="section-content">
                  <div class="current-plan">
                    <div class="plan-info">
                      <h3>${this.currentPlan.name}</h3>
                      <div class="plan-price">
                        $${this.currentPlan.price}
                        <span class="plan-price-suffix">/${this.currentPlan.interval}</span>
                      </div>
                      <ul class="plan-features">
                        ${this.currentPlan.features.map(feature => html`
                          <li>
                            <sl-icon name="check-circle" style="color: var(--sl-color-success-600);"></sl-icon>
                            ${feature}
                          </li>
                        `)}
                      </ul>
                    </div>
                  </div>
                  
                  <!-- Usage Statistics -->
                  <div class="usage-section">
                    <h4>Usage Statistics</h4>
                    ${this.usageData.map(usage => html`
                      <div class="usage-item">
                        <div class="usage-header">
                          <span class="usage-label">${usage.label}</span>
                          <span class="usage-value">${usage.current} / ${usage.limit}</span>
                        </div>
                        <sl-progress-bar 
                          value=${usage.percentage} 
                          class="usage-progress"
                        ></sl-progress-bar>
                      </div>
                    `)}
                  </div>
                </div>
              </sl-card>

              <!-- Available Plans Section -->
              <sl-card class="billing-section">
                <div slot="header" class="section-header">
                  <h2 class="section-title">Available Plans</h2>
                  <sl-button variant="default" size="small" @click=${this.handleRefreshPlans}>
                    <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                    Refresh
                  </sl-button>
                </div>
                
                <div class="section-content">
                  <div class="plan-cards">
                    ${this.availablePlans.map(plan => html`
                      <div class="plan-card ${plan.isCurrent ? 'current' : ''} ${plan.isPopular ? 'popular' : ''}">
                        ${plan.isCurrent ? html`
                          <sl-badge variant="primary" class="plan-badge">Current Plan</sl-badge>
                        ` : plan.isPopular ? html`
                          <sl-badge variant="warning" class="plan-badge">Most Popular</sl-badge>
                        ` : ''}
                        
                        <div class="plan-card-header">
                          <h3>${plan.name}</h3>
                          <div class="plan-price">
                            $${plan.price}
                            <span class="plan-price-suffix">/${plan.interval}</span>
                          </div>
                        </div>
                        
                        <ul class="plan-features">
                          ${plan.features.map(feature => html`
                            <li>
                              <sl-icon name="check" style="color: var(--sl-color-success-600);"></sl-icon>
                              ${feature}
                            </li>
                          `)}
                        </ul>
                        
                        <div class="plan-card-actions">
                          ${plan.isCurrent ? html`
                            <sl-button variant="default" disabled>
                              <sl-icon slot="prefix" name="check"></sl-icon>
                              Current Plan
                            </sl-button>
                          ` : html`
                            <sl-button 
                              variant=${plan.isPopular ? 'primary' : 'default'}
                              @click=${() => this.handleUpgradePlan(plan)}
                            >
                              <sl-icon slot="prefix" name="arrow-up"></sl-icon>
                              Upgrade to ${plan.name}
                            </sl-button>
                          `}
                        </div>
                      </div>
                    `)}
                  </div>
                </div>
              </sl-card>

              <!-- Payment Method Section -->
              <sl-card class="billing-section">
                <div slot="header" class="section-header">
                  <h2 class="section-title">Payment Methods</h2>
                  <sl-button variant="primary" size="small" @click=${this.handleAddPaymentMethod}>
                    <sl-icon slot="prefix" name="plus"></sl-icon>
                    Add Payment Method
                  </sl-button>
                </div>
                
                <div class="section-content">
                  ${this.hasPaymentMethod ? html`
                    <div class="payment-methods">
                      <div class="payment-method default">
                        <div class="card-icon">💳</div>
                        <div class="card-info">
                          <div class="card-number">•••• •••• •••• 4242</div>
                          <div class="card-details">Expires 12/2025 • Visa</div>
                        </div>
                        <sl-badge variant="primary" pill>Default</sl-badge>
                        <sl-dropdown>
                          <sl-icon-button slot="trigger" name="three-dots-vertical"></sl-icon-button>
                          <sl-menu>
                            <sl-menu-item @click=${this.handleEditPaymentMethod}>
                              <sl-icon slot="prefix" name="pencil"></sl-icon>
                              Edit
                            </sl-menu-item>
                            <sl-menu-item @click=${this.handleRemovePaymentMethod}>
                              <sl-icon slot="prefix" name="trash"></sl-icon>
                              Remove
                            </sl-menu-item>
                          </sl-menu>
                        </sl-dropdown>
                      </div>
                    </div>
                  ` : html`
                    <div class="empty-state">
                      <sl-icon name="credit-card"></sl-icon>
                      <h3>No payment methods</h3>
                      <p>Add a payment method to upgrade your plan and access premium features.</p>
                    </div>
                  `}
                </div>
              </sl-card>

              <!-- Billing History Section -->
              <sl-card class="billing-section">
                <div slot="header" class="section-header">
                  <h2 class="section-title">Billing History</h2>
                  <sl-button variant="default" size="small" @click=${this.handleDownloadReceipts}>
                    <sl-icon slot="prefix" name="download"></sl-icon>
                    Download All
                  </sl-button>
                </div>
                
                <div class="section-content">
                  ${this.billingHistory.length > 0 ? html`
                    <div class="billing-history">
                      ${this.billingHistory.map(item => html`
                        <div class="history-item">
                          <div class="history-info">
                            <div class="history-description">${item.description}</div>
                            <div class="history-date">${new Date(item.date).toLocaleDateString()}</div>
                          </div>
                          <div class="history-amount">$${item.amount.toFixed(2)}</div>
                          <sl-badge variant=${this.getStatusVariant(item.status)}>
                            ${item.status}
                          </sl-badge>
                          ${item.invoice_url ? html`
                            <sl-icon-button 
                              name="download" 
                              label="Download invoice"
                              @click=${() => this.handleDownloadInvoice(item.invoice_url!)}
                            ></sl-icon-button>
                          ` : ''}
                        </div>
                      `)}
                    </div>
                  ` : html`
                    <div class="empty-state">
                      <sl-icon name="receipt"></sl-icon>
                      <h3>No billing history</h3>
                      <p>Your billing history will appear here once you start a paid subscription.</p>
                    </div>
                  `}
                </div>
              </sl-card>

            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getStatusVariant(status: string): string {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'neutral';
    }
  }

  private getUsageVariant(percentage: number): string {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'primary';
  }

  private handleRefreshPlans() {
    // TODO: Refresh plans from API
    console.log('Refreshing plans...');
  }

  private handleUpgradePlan(plan: PlanData) {
    // TODO: Handle plan upgrade
    console.log('Upgrading to plan:', plan);
  }

  private handleAddPaymentMethod() {
    // TODO: Open payment method modal
    console.log('Adding payment method...');
  }

  private handleEditPaymentMethod() {
    // TODO: Edit payment method
    console.log('Editing payment method...');
  }

  private handleRemovePaymentMethod() {
    // TODO: Remove payment method
    console.log('Removing payment method...');
  }

  private handleDownloadReceipts() {
    // TODO: Download all receipts
    console.log('Downloading all receipts...');
  }

  private handleDownloadInvoice(url: string) {
    // TODO: Download specific invoice
    window.open(url, '_blank');
  }
}

