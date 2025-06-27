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
      background: white;
      border-radius: var(--sl-border-radius-large);
      box-shadow: var(--sl-shadow-large);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }

    .logo {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-text {
      font-size: 1.75rem;
      font-weight: bold;
      color: var(--sl-color-primary-700);
    }

    .form-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .form-subtitle {
      color: var(--sl-color-neutral-600);
      text-align: center;
      margin-bottom: 2rem;
      line-height: 1.5;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .reset-button {
      width: 100%;
    }

    .footer-links {
      text-align: center;
      margin-top: 1.5rem;
    }

    .footer-links a {
      color: var(--sl-color-primary-600);
      text-decoration: none;
    }

    .footer-links a:hover {
      text-decoration: underline;
    }

    .success-content {
      text-align: center;
    }

    .success-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: var(--sl-color-success-600);
    }

    .success-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-success-700);
      margin-bottom: 1rem;
    }

    .success-text {
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .forgot-password-card {
      background: var(--sl-color-neutral-800);
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

    :host(.sl-theme-dark) .success-title {
      color: var(--sl-color-success-400);
    }

    :host(.sl-theme-dark) .success-text {
      color: var(--sl-color-neutral-400);
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
        <div class="forgot-password-card">
          <div class="logo">
            <div class="logo-text">Task Flow</div>
          </div>

          <h1 class="form-title">Reset your password</h1>
          <p class="form-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          ${this.error ? html`
            <sl-alert variant="danger" open>
              <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
              ${this.error}
            </sl-alert>
          ` : ''}

          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <sl-input
                label="Email"
                type="email"
                placeholder="Enter your email"
                .value=${this.email}
                @sl-input=${(e: CustomEvent) => this.email = e.target.value}
                required
                autocomplete="email"
              ></sl-input>
            </div>

            <div class="form-actions">
              <sl-button
                class="reset-button"
                type="submit"
                variant="primary"
                size="large"
                ?loading=${this.isSubmitting}
                ?disabled=${!this.email.trim()}
              >
                ${this.isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </sl-button>
            </div>
          </form>

          <div class="footer-links">
            <p>
              Remember your password? 
              <a href="/auth/sign-in">Sign in</a>
            </p>
            <p>
              Don't have an account? 
              <a href="/auth/sign-up">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private renderSuccess() {
    return html`
      <div class="container">
        <div class="forgot-password-card">
          <div class="success-content">
            <div class="success-icon">📧</div>
            <h2 class="success-title">Check your email</h2>
            <p class="success-text">
              We've sent a password reset link to <strong>${this.email}</strong>. 
              Please check your email and follow the instructions to reset your password.
            </p>
            <sl-button variant="default" href="/auth/sign-in">
              Back to Sign In
            </sl-button>
          </div>
        </div>
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
      this.error = error instanceof Error ? error.message : 'Password reset failed';
    } finally {
      this.isSubmitting = false;
    }
  }
}

