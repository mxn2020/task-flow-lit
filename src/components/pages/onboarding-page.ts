// src/components/pages/onboarding-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { supabase } from '../../services/supabase';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

@customElement('onboarding-page')
export class OnboardingPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--sl-color-primary-50) 0%, var(--sl-color-warning-50) 100%);
    }

    .container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .onboarding-card {
      width: 100%;
      max-width: 600px;
      border: none;
      box-shadow: var(--sl-shadow-x-large);
    }

    .step-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .step-progress {
      margin-bottom: 2rem;
    }

    .step-indicators {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .step-dot {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: var(--sl-border-radius-circle);
      background-color: var(--sl-color-neutral-300);
      transition: all 0.3s ease;
    }

    .step-dot.active {
      background-color: var(--sl-color-primary-600);
      transform: scale(1.2);
    }

    .step-dot.completed {
      background-color: var(--sl-color-success-600);
    }

    .step-info {
      text-align: center;
    }

    .step-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .step-title {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .step-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0;
      line-height: 1.5;
    }

    .step-content {
      margin: 2rem 0;
    }

    .form-section {
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      margin-top: 2rem;
    }

    .plan-grid {
      display: grid;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .plan-card {
      position: relative;
      border: 2px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }

    .plan-card:hover {
      border-color: var(--sl-color-primary-300);
      transform: translateY(-2px);
      box-shadow: var(--sl-shadow-medium);
    }

    .plan-card.selected {
      border-color: var(--sl-color-primary-600);
      background-color: var(--sl-color-primary-50);
      box-shadow: var(--sl-shadow-large);
    }

    .plan-card.popular {
      border-color: var(--sl-color-warning-400);
    }

    .plan-badge {
      position: absolute;
      top: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
    }

    .plan-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .plan-name {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .plan-price {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-600);
      margin: 0 0 0.5rem 0;
    }

    .plan-price-suffix {
      font-size: 1rem;
      font-weight: var(--sl-font-weight-normal);
      color: var(--sl-color-neutral-600);
    }

    .plan-description {
      color: var(--sl-color-neutral-600);
      margin: 0 0 1.5rem 0;
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: left;
    }

    .plan-features li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--sl-color-neutral-700);
      margin-bottom: 0.5rem;
      font-size: var(--sl-font-size-small);
    }

    .plan-check {
      color: var(--sl-color-success-600);
      font-weight: var(--sl-font-weight-bold);
    }

    .success-content {
      text-align: center;
      padding: 2rem 0;
    }

    .success-animation {
      margin-bottom: 2rem;
    }

    .success-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
      animation: bounce 0.6s ease-in-out;
    }

    @keyframes bounce {
      0%, 20%, 60%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      80% { transform: translateY(-10px); }
    }

    .success-title {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-success-700);
      margin: 0 0 1rem 0;
    }

    .success-text {
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
      margin: 0 0 2rem 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 300px;
      margin: 0 auto;
    }

    .welcome-features {
      display: grid;
      gap: 1rem;
      margin: 2rem 0;
      text-align: left;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
    }

    .feature-icon {
      font-size: 1.5rem;
    }

    .feature-text {
      color: var(--sl-color-neutral-700);
      font-size: var(--sl-font-size-small);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .onboarding-card {
        max-width: 100%;
      }

      .step-title {
        font-size: 1.5rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .plan-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .step-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .step-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .plan-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .plan-card.selected {
      background-color: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .plan-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .plan-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .plan-features li {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .feature-item {
      background: var(--sl-color-neutral-800);
    }

    :host(.sl-theme-dark) .feature-text {
      color: var(--sl-color-neutral-300);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;

  @state() private currentStep = 1;
  @state() private totalSteps = 3;
  @state() private teamName = '';
  @state() private selectedPlan = 'free';
  @state() private isSubmitting = false;
  @state() private error = '';

  private steps: OnboardingStep[] = [
    { id: 1, title: 'Create Your Team', subtitle: 'Give your team a name to get started', icon: '🏢' },
    { id: 2, title: 'Choose Your Plan', subtitle: 'Select the plan that fits your needs', icon: '🚀' },
    { id: 3, title: 'Welcome to Task Flow!', subtitle: 'You\'re all set to start organizing', icon: '🎉' }
  ];

  private planOptions: PlanOption[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        '2 active projects',
        '3 team members',
        '10 documents',
        'Basic task management',
        'Email support'
      ]
    },
    {
      id: 'creator',
      name: 'Creator Plan',
      price: 9,
      description: 'For growing teams and projects',
      features: [
        '10 active projects',
        '10 team members',
        'Unlimited documents',
        'Advanced task management',
        'Analytics & reporting',
        'Priority support'
      ],
      popular: true
    }
  ];

  render() {
    const currentStepData = this.steps[this.currentStep - 1];

    return html`
      <div class="container">
        <sl-card class="onboarding-card">
          <div class="step-header">
            <div class="step-progress">
              <div class="step-indicators">
                ${Array.from({ length: this.totalSteps }, (_, i) => {
                  const stepNum = i + 1;
                  let className = 'step-dot';
                  if (stepNum < this.currentStep) className += ' completed';
                  else if (stepNum === this.currentStep) className += ' active';
                  
                  return html`<div class="${className}"></div>`;
                })}
              </div>
              
              <sl-progress-bar 
                value=${((this.currentStep - 1) / (this.totalSteps - 1)) * 100}
                style="--height: 4px;"
              ></sl-progress-bar>
            </div>
            
            <div class="step-info">
              <div class="step-icon">${currentStepData.icon}</div>
              <h1 class="step-title">${currentStepData.title}</h1>
              <p class="step-subtitle">${currentStepData.subtitle}</p>
            </div>
          </div>

          <div class="step-content">
            ${this.renderStepContent()}
          </div>
        </sl-card>
      </div>
    `;
  }

  private renderStepContent() {
    switch (this.currentStep) {
      case 1:
        return this.renderTeamStep();
      case 2:
        return this.renderPlanStep();
      case 3:
        return this.renderSuccessStep();
      default:
        return html``;
    }
  }

  private renderTeamStep() {
    return html`
      ${this.error ? html`
        <sl-alert variant="danger" open closable @sl-hide=${() => this.error = ''}>
          <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
          <strong>Error:</strong> ${this.error}
        </sl-alert>
      ` : ''}

      <form @submit=${this.handleTeamSubmit}>
        <div class="form-section">
          <sl-input
            label="Team Name"
            placeholder="e.g., My Awesome Team"
            .value=${this.teamName}
            @sl-input=${(e: CustomEvent) => this.teamName = (e.target as any).value}
            required
            help-text="You can always change this later in team settings"
            size="large"
          >
            <sl-icon slot="prefix" name="building"></sl-icon>
          </sl-input>
        </div>

        <div class="welcome-features">
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-text">Create and manage flexible scopes for any project</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">👥</div>
            <div class="feature-text">Collaborate with team members in real-time</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <div class="feature-text">Track progress with built-in analytics</div>
          </div>
        </div>

        <div class="form-actions">
          <sl-button variant="default" href="/auth/sign-in">
            <sl-icon slot="prefix" name="arrow-left"></sl-icon>
            Back to Sign In
          </sl-button>
          <sl-button
            type="submit"
            variant="primary"
            size="large"
            ?loading=${this.isSubmitting}
            ?disabled=${!this.teamName.trim()}
          >
            <sl-icon slot="suffix" name="arrow-right"></sl-icon>
            Continue
          </sl-button>
        </div>
      </form>
    `;
  }

  private renderPlanStep() {
    return html`
      <div class="plan-grid">
        ${this.planOptions.map(plan => html`
          <div 
            class="plan-card ${this.selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}"
            @click=${() => this.selectedPlan = plan.id}
          >
            ${plan.popular ? html`
              <sl-badge variant="warning" class="plan-badge">
                <sl-icon slot="prefix" name="star-fill"></sl-icon>
                Most Popular
              </sl-badge>
            ` : ''}

            <div class="plan-header">
              <h3 class="plan-name">${plan.name}</h3>
              <div class="plan-price">
                $${plan.price}
                <span class="plan-price-suffix">/month</span>
              </div>
              <p class="plan-description">${plan.description}</p>
            </div>

            <ul class="plan-features">
              ${plan.features.map(feature => html`
                <li>
                  <sl-icon name="check" class="plan-check"></sl-icon>
                  ${feature}
                </li>
              `)}
            </ul>
          </div>
        `)}
      </div>

      <sl-alert variant="primary" open>
        <sl-icon slot="icon" name="info-circle"></sl-icon>
        <strong>No commitment required.</strong> Start with any plan and change or cancel anytime.
      </sl-alert>

      <div class="form-actions">
        <sl-button variant="default" @click=${() => this.currentStep = 1}>
          <sl-icon slot="prefix" name="arrow-left"></sl-icon>
          Back
        </sl-button>
        <sl-button
          variant="primary"
          size="large"
          @click=${this.handlePlanSubmit}
          ?loading=${this.isSubmitting}
        >
          <sl-icon slot="suffix" name="rocket"></sl-icon>
          ${this.selectedPlan === 'free' ? 'Start Free' : 'Continue with Creator Plan'}
        </sl-button>
      </div>
    `;
  }

  private renderSuccessStep() {
    return html`
      <div class="success-content">
        <div class="success-animation">
          <div class="success-icon">🎉</div>
          <h2 class="success-title">Welcome to Task Flow!</h2>
          <p class="success-text">
            Your team "<strong>${this.teamName}</strong>" has been created successfully. 
            You're all set to start organizing your work and collaborating with your team.
          </p>
        </div>

        <sl-alert variant="success" open>
          <sl-icon slot="icon" name="check-circle"></sl-icon>
          <strong>Setup Complete!</strong> Your workspace is ready and you can start creating scopes and managing tasks.
        </sl-alert>

        <div class="success-actions">
          <sl-button
            variant="primary"
            size="large"
            @click=${this.handleGetStarted}
          >
            <sl-icon slot="prefix" name="rocket"></sl-icon>
            Go to Dashboard
          </sl-button>
          
          <sl-button
            variant="default"
            @click=${this.handleExploreFeatures}
          >
            <sl-icon slot="prefix" name="compass"></sl-icon>
            Explore Features
          </sl-button>
        </div>
      </div>
    `;
  }

  private async handleTeamSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting || !this.teamName.trim()) return;
    
    this.isSubmitting = true;
    this.error = '';

    try {
      const { data, error } = await this.stateController.createTeamAccount(this.teamName.trim());
      
      if (error) {
        this.error = error;
      } else if (data) {
        this.currentStep = 2;
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to create team';
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handlePlanSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.error = '';

    try {
      // For now, just complete onboarding since we're auto-selecting free plan
      // In a real app, you'd handle payment flow for paid plans here
      
      if (this.stateController.state.currentAccount?.id) {
        await supabase.completeOnboarding(this.stateController.state.currentAccount.id);
      }
      
      this.currentStep = 3;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to setup plan';
    } finally {
      this.isSubmitting = false;
    }
  }

  private handleGetStarted() {
    if (this.stateController.state.currentAccount?.slug) {
      this.routerController.goToTeam(this.stateController.state.currentAccount.slug);
    } else {
      this.routerController.goToDashboard();
    }
  }

  private handleExploreFeatures() {
    // Navigate to a features tour or documentation
    window.open('/docs/getting-started', '_blank');
  }
}

