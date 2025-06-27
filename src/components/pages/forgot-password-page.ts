// src/components/pages/forgot-password-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';

@customElement('forgot-password-page')
export class ForgotPasswordPage extends LitElement {
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

    .forgot-password-card {
      width: 100%;
      max-width: 450px;
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

    .form-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.5rem;
    }

    .form-subtitle {
      color: var(--sl-color-neutral-600);
      line-height: 1.5;
      margin: 0;
    }

    .form-content {
      padding: 0 2rem 2rem;
    }

    .form-section {
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .footer-links {
      text-align: center;
      padding-top: 1rem;
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

    .success-content {
      text-align: center;
      padding: 2rem;
    }

    .success-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      display: block;
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
      margin-bottom: 1.5rem;
    }

    .success-email {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
    }

    .success-steps {
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: left;
    }

    .success-steps h4 {
      margin: 0 0 1rem 0;
      font-size: var(--sl-font-size-medium);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
    }

    .success-steps ol {
      margin: 0;
      padding-left: 1.5rem;
      color: var(--sl-color-neutral-700);
    }

    .success-steps li {
      margin-bottom: 0.5rem;
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .card-header {
        padding: 1.5rem 1.5rem 1rem;
      }

      .form-content {
        padding: 0 1.5rem 1.5rem;
      }

      .form-actions sl-button {
        width: 100%;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .forgot-password-card {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .logo-text {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .form-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .form-subtitle {
      color: var(--sl-color-neutral-400);
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

    :host(.sl-theme-dark) .success-title {
      color: var(--sl-color-success-400);
    }

    :host(.sl-theme-dark) .success-text {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .success-email {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .success-steps {
      background: var(--sl-color-neutral-800);
    }

    :host(.sl-theme-dark) .success-steps h4 {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .success-steps ol {
      color: var(--sl-color-neutral-300);
    }
  `;

  @property({ type: Object }) stateController!: StateController;

  @state() private email = '';
  @state() private isSubmitting = false;
  @state() private error = '';
  @state() private showSuccess = false;

  render() {
    if (this.showSuccess) {
      return this.renderSuccess();
    }

    return html`
      <div class="container">
        <sl-card class="forgot-password-card">
          <div class="card-header">
            <div class="logo">
              <sl-icon name="layers" class="logo-icon"></sl-icon>
              <div class="logo-text">Task Flow</div>
            </div>

            <h1 class="form-title">Reset your password</h1>
            <p class="form-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <div class="form-content">
            ${this.error ? html`
              <div class="form-section">
                <sl-alert variant="danger" open>
                  <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                  <strong>Reset Failed</strong><br>
                  ${this.error}
                </sl-alert>
              </div>
            ` : ''}

            <form @submit=${this.handleSubmit}>
              <div class="form-section">
                <sl-input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  .value=${this.email}
                  @sl-input=${(e: CustomEvent) => this.email = (e.target as any).value}
                  required
                  autocomplete="email"
                  help-text="We'll send a password reset link to this email"
                >
                  <sl-icon slot="prefix" name="envelope"></sl-icon>
                </sl-input>
              </div>

              <div class="form-actions">
                <sl-button
                  type="submit"
                  variant="primary"
                  size="large"
                  ?loading=${this.isSubmitting}
                  ?disabled=${!this.email.trim()}
                >
                  <sl-icon slot="prefix" name="send"></sl-icon>
                  ${this.isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
                </sl-button>
              </div>
            </form>

            <div class="footer-links">
              <p>
                <sl-icon name="arrow-left"></sl-icon>
                <a href="/auth/sign-in">Back to Sign In</a>
              </p>
              <p>
                Don't have an account? 
                <a href="/auth/sign-up">Create one here</a>
              </p>
            </div>
          </div>
        </sl-card>
      </div>
    `;
  }

  private renderSuccess() {
    return html`
      <div class="container">
        <sl-card class="forgot-password-card">
          <div class="success-content">
            <sl-icon name="check-circle" class="success-icon" style="color: var(--sl-color-success-600);"></sl-icon>
            
            <h2 class="success-title">Check your email</h2>
            <p class="success-text">
              We've sent a password reset link to 
              <span class="success-email">${this.email}</span>
            </p>

            <div class="success-steps">
              <h4>Next steps:</h4>
              <ol>
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the "Reset Password" link in the email</li>
                <li>Enter your new password</li>
                <li>Sign in with your new password</li>
              </ol>
            </div>

            <div class="success-actions">
              <sl-button variant="primary" href="/auth/sign-in">
                <sl-icon slot="prefix" name="box-arrow-in-right"></sl-icon>
                Back to Sign In
              </sl-button>
              
              <sl-button variant="default" @click=${this.handleResendEmail}>
                <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                Resend Reset Link
              </sl-button>
            </div>

            <sl-alert variant="primary" open style="margin-top: 1rem;">
              <sl-icon slot="icon" name="info-circle"></sl-icon>
              <strong>Didn't receive the email?</strong> 
              Check your spam folder or try resending the link above.
            </sl-alert>
          </div>
        </sl-card>
      </div>
    `;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting || !this.email.trim()) return;
    
    this.isSubmitting = true;
    this.error = '';

    try {
      const { error } = await this.stateController.resetPassword(this.email);
      
      if (error) {
        this.error = error;
      } else {
        this.showSuccess = true;
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Password reset failed. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleResendEmail() {
    // Reset the success state to show the form again, but keep the email
    this.showSuccess = false;
    // Automatically submit the form again
    setTimeout(() => {
      this.handleSubmit(new Event('submit'));
    }, 100);
  }
}

