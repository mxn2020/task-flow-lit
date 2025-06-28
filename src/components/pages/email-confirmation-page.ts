// src/components/pages/email-confirmation-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';

@customElement('email-confirmation-page')
export class EmailConfirmationPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--sl-color-success-50) 0%, var(--sl-color-primary-50) 100%);
    }

    .container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .confirmation-card {
      width: 100%;
      max-width: 600px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .card-header {
      text-align: center;
      padding: 2rem 2rem 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .logo-text {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-700);
    }

    .success-content {
      text-align: center;
      padding: 0 2rem 2rem;
    }

    .success-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      display: block;
      color: var(--sl-color-success-600);
    }

    .success-title {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-success-700);
      margin-bottom: 1rem;
    }

    .success-subtitle {
      font-size: 1.1rem;
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .email-highlight {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-primary-700);
      background: var(--sl-color-primary-50);
      padding: 0.25rem 0.5rem;
      border-radius: var(--sl-border-radius-small);
      border: 1px solid var(--sl-color-primary-200);
    }

    .steps-section {
      background: var(--sl-color-success-50);
      border: 1px solid var(--sl-color-success-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: left;
    }

    .steps-title {
      margin: 0 0 1rem 0;
      font-size: var(--sl-font-size-large);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-success-700);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .steps-list {
      margin: 0;
      padding-left: 1.5rem;
      color: var(--sl-color-success-800);
    }

    .steps-list li {
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }

    .steps-list li:last-child {
      margin-bottom: 0;
    }

    .actions-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .resend-section {
      text-align: center;
      margin: 1.5rem 0;
    }

    .resend-text {
      color: var(--sl-color-neutral-600);
      margin-bottom: 1rem;
      font-size: var(--sl-font-size-medium);
    }

    .help-section {
      background: var(--sl-color-primary-50);
      border: 1px solid var(--sl-color-primary-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin: 1.5rem 0;
    }

    .help-title {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-primary-700);
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .help-tips {
      margin: 0;
      padding-left: 1.5rem;
      color: var(--sl-color-primary-800);
    }

    .help-tips li {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }

    .footer-links {
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid var(--sl-color-neutral-200);
    }

    .footer-links a {
      color: var(--sl-color-primary-600);
      text-decoration: none;
      font-weight: var(--sl-font-weight-medium);
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: var(--sl-color-primary-700);
      text-decoration: underline;
    }

    .footer-links p {
      margin: 0.5rem 0;
      color: var(--sl-color-neutral-600);
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .card-header {
        padding: 1.5rem 1.5rem 1rem;
      }

      .success-content {
        padding: 0 1.5rem 1.5rem;
      }

      .success-title {
        font-size: 1.5rem;
      }

      .actions-section sl-button {
        width: 100%;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .confirmation-card {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .logo-text {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .success-title {
      color: var(--sl-color-success-400);
    }

    :host(.sl-theme-dark) .success-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .email-highlight {
      color: var(--sl-color-primary-300);
      background: var(--sl-color-primary-950);
      border-color: var(--sl-color-primary-800);
    }

    :host(.sl-theme-dark) .steps-section {
      background: var(--sl-color-success-950);
      border-color: var(--sl-color-success-800);
    }

    :host(.sl-theme-dark) .steps-title {
      color: var(--sl-color-success-300);
    }

    :host(.sl-theme-dark) .steps-list {
      color: var(--sl-color-success-400);
    }

    :host(.sl-theme-dark) .resend-text {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .help-section {
      background: var(--sl-color-primary-950);
      border-color: var(--sl-color-primary-800);
    }

    :host(.sl-theme-dark) .help-title {
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .help-tips {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .footer-links {
      border-top-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .footer-links p {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .footer-links a {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .footer-links a:hover {
      color: var(--sl-color-primary-300);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: String }) email?: string;

  @state() private isResending = false;

  render() {
    const userEmail = this.email || 'your email address';

    return html`
      <div class="container">
        <sl-card class="confirmation-card">
          <div class="card-header">
            <div class="logo">
              <sl-icon name="layers" class="logo-icon"></sl-icon>
              <div class="logo-text">Task Flow</div>
            </div>
          </div>

          <div class="success-content">
            <sl-icon name="envelope-check" class="success-icon"></sl-icon>
            
            <h1 class="success-title">Check Your Email!</h1>
            <p class="success-subtitle">
              We've sent a confirmation email to<br>
              <span class="email-highlight">${userEmail}</span>
            </p>

            <div class="steps-section">
              <h3 class="steps-title">
                <sl-icon name="list-check"></sl-icon>
                Next Steps:
              </h3>
              <ol class="steps-list">
                <li>Open your email inbox and look for an email from Task Flow</li>
                <li>Click the "Confirm Email Address" button in the email</li>
                <li>You'll be redirected back to complete your account setup</li>
                <li>Start organizing your tasks and boost your productivity!</li>
              </ol>
            </div>

            <div class="resend-section">
              <p class="resend-text">Didn't receive the email?</p>
              <sl-button 
                variant="default" 
                size="medium"
                ?loading=${this.isResending}
                @click=${this.handleResendEmail}
              >
                <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                ${this.isResending ? 'Sending...' : 'Resend Confirmation Email'}
              </sl-button>
            </div>

            <div class="help-section">
              <h4 class="help-title">
                <sl-icon name="question-circle"></sl-icon>
                Troubleshooting Tips:
              </h4>
              <ul class="help-tips">
                <li>Check your spam or junk mail folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes - emails can sometimes be delayed</li>
                <li>Add noreply@taskflow.com to your contacts</li>
              </ul>
            </div>

            <div class="actions-section">
              <sl-button variant="primary" size="large" href="/auth/sign-in">
                <sl-icon slot="prefix" name="box-arrow-in-right"></sl-icon>
                Go to Sign In
              </sl-button>
            </div>

            <div class="footer-links">
              <p>
                <a href="/auth/sign-up">← Create a Different Account</a>
              </p>
              <p>
                <a href="/">Back to Homepage</a>
              </p>
              <p>
                Need help? <a href="/support">Contact Support</a>
              </p>
            </div>
          </div>
        </sl-card>
      </div>
    `;
  }

  private async handleResendEmail() {
    if (!this.email) {
      this.showNotification(
        'danger',
        'Error',
        'Email address not available. Please try signing up again.'
      );
      return;
    }

    this.isResending = true;

    try {
      // In a real implementation, you would call a resend confirmation email API
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success notification
      this.showNotification(
        'success',
        'Email Sent!',
        'We\'ve sent another confirmation email to your inbox.'
      );
      
    } catch (error) {
      console.error('Resend email failed:', error);
      this.showNotification(
        'danger',
        'Failed to Resend',
        'There was an error sending the confirmation email. Please try again later.'
      );
    } finally {
      this.isResending = false;
    }
  }

  private showNotification(variant: string, title: string, message: string) {
    const notification = Object.assign(document.createElement('sl-alert'), {
      variant,
      closable: true,
      duration: 4000,
      innerHTML: `
        <sl-icon slot="icon" name="${variant === 'success' ? 'check-circle' : 'exclamation-triangle'}"></sl-icon>
        <strong>${title}</strong><br>
        ${message}
      `
    });

    document.body.appendChild(notification);
    notification.toast();
  }
}
