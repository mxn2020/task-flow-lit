// src/components/pages/reset-password-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { supabase } from '../../services/supabase';

@customElement('reset-password-page')
export class ResetPasswordPage extends LitElement {
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

    .reset-password-card {
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

    .error-content {
      text-align: center;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: var(--sl-color-danger-600);
    }

    .error-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-danger-700);
      margin-bottom: 1rem;
    }

    .error-text {
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .reset-password-card {
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

    :host(.sl-theme-dark) .error-title {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .error-text {
      color: var(--sl-color-neutral-400);
    }
  `;

  @property({ type: Object }) stateController!: StateController;

  @state() private password = '';
  @state() private confirmPassword = '';
  @state() private isSubmitting = false;
  @state() private error = '';
  @state() private showSuccess = false;
  @state() private showError = false;
  @state() private accessToken = '';

  connectedCallback() {
    super.connectedCallback();
    this.checkResetToken();
  }

  private checkResetToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const type = urlParams.get('type');

    if (!accessToken || type !== 'recovery') {
      this.showError = true;
      this.error = 'Invalid or expired reset link';
      return;
    }

    this.accessToken = accessToken;
  }

  render() {
    if (this.showError) {
      return this.renderError();
    }

    if (this.showSuccess) {
      return this.renderSuccess();
    }

    return html`
      <div class="container">
        <div class="reset-password-card">
          <div class="logo">
            <div class="logo-text">Task Flow</div>
          </div>

          <h1 class="form-title">Set new password</h1>
          <p class="form-subtitle">
            Enter your new password below. Make sure it's secure and easy to remember.
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
                label="New Password"
                type="password"
                placeholder="Enter new password"
                .value=${this.password}
                @sl-input=${(e: CustomEvent) => this.password = e.target.value}
                required
                autocomplete="new-password"
                help-text="Password must be at least 8 characters long"
              ></sl-input>
            </div>

            <div class="form-group">
              <sl-input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                .value=${this.confirmPassword}
                @sl-input=${(e: CustomEvent) => this.confirmPassword = e.target.value}
                required
                autocomplete="new-password"
              ></sl-input>
            </div>

            <div class="form-actions">
              <sl-button
                class="reset-button"
                type="submit"
                variant="primary"
                size="large"
                ?loading=${this.isSubmitting}
                ?disabled=${!this.isFormValid()}
              >
                ${this.isSubmitting ? 'Updating password...' : 'Update Password'}
              </sl-button>
            </div>
          </form>

          <div class="footer-links">
            <p>
              <a href="/auth/sign-in">Back to Sign In</a>
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private renderSuccess() {
    return html`
      <div class="container">
        <div class="reset-password-card">
          <div class="success-content">
            <div class="success-icon">✅</div>
            <h2 class="success-title">Password updated</h2>
            <p class="success-text">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <sl-button variant="primary" href="/auth/sign-in">
              Sign In
            </sl-button>
          </div>
        </div>
      </div>
    `;
  }

  private renderError() {
    return html`
      <div class="container">
        <div class="reset-password-card">
          <div class="error-content">
            <div class="error-icon">❌</div>
            <h2 class="error-title">Invalid reset link</h2>
            <p class="error-text">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
            <sl-button variant="primary" href="/auth/forgot-password">
              Request New Reset Link
            </sl-button>
          </div>
        </div>
      </div>
    `;
  }

  private isFormValid(): boolean {
    return (
      this.password.length >= 8 &&
      this.password === this.confirmPassword &&
      this.accessToken !== ''
    );
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting || !this.isFormValid()) return;
    
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    
    this.isSubmitting = true;
    this.error = '';

    try {
      const { error } = await supabase.updatePassword(this.password);
      
      if (error) {
        this.error = error.message;
      } else {
        this.showSuccess = true;
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Password update failed';
    } finally {
      this.isSubmitting = false;
    }
  }
}

