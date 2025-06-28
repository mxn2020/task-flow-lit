// src/components/pages/billing-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';

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
export class UpdatedBillingPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Billing-specific styles */
    .current-plan-card {
      background: linear-gradient(135deg, var(--sl-color-primary-50) 0%, var(--sl-color-primary-100) 100%);
      border: 2px solid var(--sl-color-primary-200);
    }

    .plan-price {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-600);
      margin: 1rem 0;
    }

    .plan-price-suffix {
      font-size: 1rem;
      font-weight: var(--sl-font-weight-normal);
      color: var(--sl-color-neutral-600);
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
      display: grid;
      gap: 0.75rem;
    }

    .plan-features li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--sl-color-neutral-700);
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
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-800);
    }

    .usage-value {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .plan-card {
      position: relative;
      transition: all 0.2s ease;
    }

    .plan-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--sl-shadow-large);
    }

    .plan-card.current {
      border-color: var(--sl-color-primary-600);
      background: var(--sl-color-primary-50);
    }

    .plan-card.popular {
      border-color: var(--sl-color-warning-400);
      background: var(--sl-color-warning-50);
    }

    .plan-badge {
      position: absolute;
      top: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
    }

    .payment-method {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      background: var(--sl-color-neutral-50);
      margin-bottom: 1rem;
      transition: all 0.2s ease;
    }

    .payment-method:hover {
      background: var(--sl-color-neutral-100);
      border-color: var(--sl-color-neutral-300);
    }

    .payment-method.default {
      border-color: var(--sl-color-primary-300);
      background: var(--sl-color-primary-50);
    }

    .card-icon {
      font-size: 1.5rem;
      width: 40px;
      text-align: center;
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

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      background: var(--sl-color-neutral-50);
      margin-bottom: 0.75rem;
      transition: all 0.2s ease;
    }

    .history-item:hover {
      background: var(--sl-color-neutral-100);
      transform: translateX(4px);
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
      font-size: 1.1rem;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .plan-card {
        margin-bottom: 1rem;
      }

      .history-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .history-amount {
        margin-right: 0;
        align-self: flex-end;
      }

      .payment-method {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }
    }

    /* Dark theme */
    :host(.sl-theme-dark) .current-plan-card {
      background: linear-gradient(135deg, var(--sl-color-primary-900) 0%, var(--sl-color-primary-800) 100%);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .plan-card.current {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .plan-card.popular {
      background: var(--sl-color-warning-900);
      border-color: var(--sl-color-warning-600);
    }

    :host(.sl-theme-dark) .plan-features li {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .payment-method,
    :host(.sl-theme-dark) .history-item {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .payment-method:hover,
    :host(.sl-theme-dark) .history-item:hover {
      background: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .payment-method.default {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .card-number,
    :host(.sl-theme-dark) .history-description,
    :host(.sl-theme-dark) .history-amount {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .usage-label {
      color: var(--sl-color-neutral-200);
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

  async connectedCallback() {
    super.connectedCallback();
    await this.loadPageData();
  }

  protected async loadPageData(): Promise<void> {
    await this.withPageLoading(async () => {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Loading billing data for team:', this.teamSlug);
      
      // Simulate some billing history for demo
      if (this.currentPlan.price > 0) {
        this.billingHistory = [
          {
            id: '1',
            date: '2024-01-15',
            amount: 19.00,
            status: 'paid',
            description: 'Team Plan - January 2024'
          },
          {
            id: '2',
            date: '2023-12-15',
            amount: 19.00,
            status: 'paid',
            description: 'Team Plan - December 2023'
          }
        ];
        this.hasPaymentMethod = true;
      }
    });
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
    this.refreshPageData();
  }

  private handleUpgradePlan(plan: PlanData) {
    console.log('Upgrading to plan:', plan);
  }

  private handleAddPaymentMethod() {
    console.log('Adding payment method...');
  }

  private handleEditPaymentMethod() {
    console.log('Editing payment method...');
  }

  private handleRemovePaymentMethod() {
    console.log('Removing payment method...');
  }

  private handleDownloadInvoice(url: string) {
    window.open(url, '_blank');
  }

  protected renderPageContent() {
    if (this.pageError) {
      return this.renderError(this.pageError, () => this.refreshPageData());
    }

    if (this.isLoading) {
      return this.renderLoading('Loading billing information...');
    }

    const usageStats = [
      { label: 'Monthly Cost', value: `$${this.currentPlan.price}`, icon: 'credit-card' },
      { label: 'Team Members', value: this.usageData.find(u => u.label === 'Team Members')?.current || 0, icon: 'people' },
      { label: 'Active Projects', value: this.usageData.find(u => u.label === 'Active Projects')?.current || 0, icon: 'collection' },
      { label: 'Next Billing', value: 'Jan 15', icon: 'calendar' }
    ];

    return html`
      ${this.renderPageHeader(
        'Billing & Subscription',
        'Manage your subscription, billing, and payment methods',
        html`
          <sl-button variant="default" @click=${this.handleRefreshPlans}>
            <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
            Refresh
          </sl-button>
        `
      )}

      <div class="page-content">
        ${this.renderStats(usageStats)}

        <div class="content-grid cols-1">
          <!-- Current Plan Section -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'Current Plan',
              undefined,
              html`
                <sl-badge variant=${this.currentPlan.price === 0 ? 'neutral' : 'success'} pill>
                  ${this.currentPlan.price === 0 ? 'Free' : 'Active'}
                </sl-badge>
              `
            )}
            
            <div class="content-card current-plan-card">
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
              
              <!-- Usage Statistics -->
              <div style="margin-top: 2rem;">
                <h4 style="margin-bottom: 1rem;">Usage Statistics</h4>
                ${this.usageData.map(usage => html`
                  <div class="usage-item">
                    <div class="usage-header">
                      <span class="usage-label">${usage.label}</span>
                      <span class="usage-value">${usage.current} / ${usage.limit}</span>
                    </div>
                    <sl-progress-bar 
                      value=${usage.percentage} 
                      variant=${this.getUsageVariant(usage.percentage)}
                    ></sl-progress-bar>
                  </div>
                `)}
              </div>
            </div>
          </div>

          <!-- Available Plans Section -->
          <div class="content-section">
            ${this.renderSectionHeader('Available Plans')}
            
            <div class="content-grid cols-3">
              ${this.availablePlans.map(plan => html`
                <div class="content-card plan-card ${plan.isCurrent ? 'current' : ''} ${plan.isPopular ? 'popular' : ''}">
                  ${plan.isCurrent ? html`
                    <sl-badge variant="primary" class="plan-badge">Current Plan</sl-badge>
                  ` : plan.isPopular ? html`
                    <sl-badge variant="warning" class="plan-badge">Most Popular</sl-badge>
                  ` : ''}
                  
                  <h3>${plan.name}</h3>
                  <div class="plan-price">
                    $${plan.price}
                    <span class="plan-price-suffix">/${plan.interval}</span>
                  </div>
                  
                  <ul class="plan-features">
                    ${plan.features.map(feature => html`
                      <li>
                        <sl-icon name="check" style="color: var(--sl-color-success-600);"></sl-icon>
                        ${feature}
                      </li>
                    `)}
                  </ul>
                  
                  <div style="margin-top: auto; padding-top: 1rem;">
                    ${plan.isCurrent ? html`
                      <sl-button variant="default" disabled style="width: 100%;">
                        <sl-icon slot="prefix" name="check"></sl-icon>
                        Current Plan
                      </sl-button>
                    ` : html`
                      <sl-button 
                        variant=${plan.isPopular ? 'primary' : 'default'}
                        style="width: 100%;"
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

          <!-- Payment Method Section -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'Payment Methods',
              undefined,
              html`
                <sl-button variant="primary" @click=${this.handleAddPaymentMethod}>
                  <sl-icon slot="prefix" name="plus"></sl-icon>
                  Add Payment Method
                </sl-button>
              `
            )}
            
            <div class="content-card">
              ${this.hasPaymentMethod ? html`
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
              ` : this.renderEmptyState(
                'credit-card',
                'No payment methods',
                'Add a payment method to upgrade your plan and access premium features.',
                html`
                  <sl-button variant="primary" @click=${this.handleAddPaymentMethod}>
                    <sl-icon slot="prefix" name="plus"></sl-icon>
                    Add Payment Method
                  </sl-button>
                `
              )}
            </div>
          </div>

          <!-- Billing History Section -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'Billing History',
              undefined,
              html`
                <sl-button variant="default" size="small">
                  <sl-icon slot="prefix" name="download"></sl-icon>
                  Download All
                </sl-button>
              `
            )}
            
            <div class="content-card">
              ${this.billingHistory.length > 0 ? html`
                <div style="display: grid; gap: 0.75rem;">
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
              ` : this.renderEmptyState(
                'receipt',
                'No billing history',
                'Your billing history will appear here once you start a paid subscription.'
              )}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

