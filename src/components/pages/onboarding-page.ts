// src/components/pages/onboarding-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { supabase } from '../../services/supabase';

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
      background: white;
      border-radius: var(--sl-border-radius-large);
      box-shadow: var(--sl-shadow-large);
      padding: 2rem;
      width: 100%;
      max-width: 500px;
    }

    .step-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .step-indicator {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .step-dot {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background-color: var(--sl-color-neutral-300);
      margin: 0 0.25rem;
      transition: background-color 0.2s;
    }

    .step-dot.active {
      background-color: var(--sl-color-primary-600);
    }

    .step-dot.completed {
      background-color: var(--sl-color-success-600);
    }

    .step-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.5rem;
    }

    .step-subtitle {
      color: var(--sl-color-neutral-600);
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      margin-top: 2rem;
    }

    .plan-cards {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .plan-card {
      border: 2px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .plan-card:hover {
      border-color: var(--sl-color-primary-300);
    }

    .plan-card.selected {
      border-color: var(--sl-color-primary-600);
      background-color: var(--sl-color-primary-50);
    }

    .plan-card.selected::after {
      content: '✓';
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      color: var(--sl-color-primary-600);
      font-weight: bold;
    }

    .plan-name {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.5rem;
    }

    .plan-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--sl-color-primary-600);
      margin-bottom: 0.5rem;
    }

    .plan-description {
      color: var(--sl-color-neutral-600);
      margin-bottom: 1rem;
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .plan-features li {
      display: flex;
      align-items: center;
      color: var(--sl-color-neutral-700);
      margin-bottom: 0.5rem;
    }

    .plan-features li::before {
      content: '✓';
      color: var(--sl-color-success-600);
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .success-content {
      text-align: center;
    }

    .success-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .success-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-success-700);
      margin-bottom: 1rem;
    }

    .success-text {
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .onboarding-card {
      background: var(--sl-color-neutral-800);
      border: 1px solid var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .step-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .step-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .plan-card {
      border-color: var(--sl-color-neutral-600);
      background-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .plan-card.selected {
      background-color: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .plan-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .plan-description {
      color: var(--sl-color-neutral-400);
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

  render() {
    return html`
      <div class="container">
        <div class="onboarding-card">
          <div class="step-header">
            <div class="step-indicator">
              ${Array.from({ length: this.totalSteps }, (_, i) => {
                const stepNum = i + 1;
                let className = 'step-dot';
                if (stepNum < this.currentStep) className += ' completed';
                else if (stepNum === this.currentStep) className += ' active';
                
                return html`<div class="${className}"></div>`;
              })}
            </div>
            ${this.renderStepContent()}
          </div>
        </div>
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
      <h1 class="step-title">Create Your Team</h1>
      <p class="step-subtitle">Give your team a name to get started with Task Flow</p>

      ${this.error ? html`
        <sl-alert variant="danger" open>
          <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
          ${this.error}
        </sl-alert>
      ` : ''}

      <form @submit=${this.handleTeamSubmit}>
        <div class="form-group">
          <sl-input
            label="Team Name"
            placeholder="e.g., My Awesome Team"
            .value=${this.teamName}
            @sl-input=${(e: CustomEvent) => this.teamName = e.target.value}
            required
            help-text="You can always change this later in team settings"
          ></sl-input>
        </div>

        <div class="form-actions">
          <sl-button variant="default" href="/auth/sign-in">
            Back to Sign In
          </sl-button>
          <sl-button
            type="submit"
            variant="primary"
            ?loading=${this.isSubmitting}
            ?disabled=${!this.teamName.trim()}
          >
            Continue
          </sl-button>
        </div>
      </form>
    `;
  }

  private renderPlanStep() {
    return html`
      <h1 class="step-title">Choose Your Plan</h1>
      <p class="step-subtitle">Start with our free plan and upgrade anytime</p>

      <div class="plan-cards">
        <div 
          class="plan-card ${this.selectedPlan === 'free' ? 'selected' : ''}"
          @click=${() => this.selectedPlan = 'free'}
        >
          <div class="plan-name">Free Plan</div>
          <div class="plan-price">$0<span style="font-size: 0.875rem; font-weight: normal;">/month</span></div>
          <div class="plan-description">Perfect for getting started</div>
          <ul class="plan-features">
            <li>2 active projects</li>
            <li>3 team members</li>
            <li>10 documents</li>
            <li>Basic task management</li>
            <li>Email support</li>
          </ul>
        </div>

        <div 
          class="plan-card ${this.selectedPlan === 'creator' ? 'selected' : ''}"
          @click=${() => this.selectedPlan = 'creator'}
        >
          <div class="plan-name">Creator Plan</div>
          <div class="plan-price">$9<span style="font-size: 0.875rem; font-weight: normal;">/month</span></div>
          <div class="plan-description">For growing teams and projects</div>
          <ul class="plan-features">
            <li>10 active projects</li>
            <li>10 team members</li>
            <li>Unlimited documents</li>
            <li>Advanced task management</li>
            <li>Analytics & reporting</li>
            <li>Priority support</li>
          </ul>
        </div>
      </div>

      <div class="form-actions">
        <sl-button variant="default" @click=${() => this.currentStep = 1}>
          Back
        </sl-button>
        <sl-button
          variant="primary"
          @click=${this.handlePlanSubmit}
          ?loading=${this.isSubmitting}
        >
          ${this.selectedPlan === 'free' ? 'Start Free' : 'Continue with Creator Plan'}
        </sl-button>
      </div>
    `;
  }

  private renderSuccessStep() {
    return html`
      <div class="success-content">
        <div class="success-icon">🎉</div>
        <h1 class="success-title">Welcome to Task Flow!</h1>
        <p class="success-text">
          Your team "<strong>${this.teamName}</strong>" has been created successfully. 
          You're all set to start organizing your work and collaborating with your team.
        </p>
        
        <sl-button
          variant="primary"
          size="large"
          @click=${this.handleGetStarted}
        >
          Get Started
        </sl-button>
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
}

