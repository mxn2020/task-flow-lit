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

    .password-requirements {
      background: var(--sl-color-primary-50);
      border: 1px solid var(--sl-color-primary-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .requirements-title {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-primary-700);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .requirements-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .requirement-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-700);
    }

    .requirement-item.valid {
      color: var(--sl-color-success-700);
    }

    .requirement-item.invalid {
      color: var(--sl-color-danger-700);
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

    .status-content {
      text-align: center;
      padding: 2rem;
    }

    .status-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      display: block;
    }

    .status-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      margin-bottom: 1rem;
    }

    .status-text {
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .success-content .status-title {
      color: var(--sl-color-success-700);
    }

    .success-content .status-text {
      color: var(--sl-color-neutral-600);
    }

    .error-content .status-title {
      color: var(--sl-color-danger-700);
    }

    .error-content .status-text {
      color: var(--sl-color-neutral-600);
    }

    .status-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .success-next-steps {
      background: var(--sl-color-success-50);
      border: 1px solid var(--sl-color-success-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: left;
    }

    .next-steps-title {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-success-700);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .next-steps-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .next-steps-list li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: var(--sl-color-success-700);
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

    :host(.sl-theme-dark) .reset-password-card {
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

    :host(.sl-theme-dark) .footer-links a {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .footer-links a:hover {
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .password-requirements {
      background: var(--sl-color-primary-950);
      border-color: var(--sl-color-primary-800);
    }

    :host(.sl-theme-dark) .requirements-title {
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .requirement-item {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .requirement-item.valid {
      color: var(--sl-color-success-400);
    }

    :host(.sl-theme-dark) .requirement-item.invalid {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .success-content .status-title {
      color: var(--sl-color-success-400);
    }

    :host(.sl-theme-dark) .success-content .status-text {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .error-content .status-title {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .error-content .status-text {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .success-next-steps {
      background: var(--sl-color-success-950);
      border-color: var(--sl-color-success-800);
    }

    :host(.sl-theme-dark) .next-steps-title {
      color: var(--sl-color-success-300);
    }

    :host(.sl-theme-dark) .next-steps-list li {
      color: var(--sl-color-success-400);
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
        <sl-card class="reset-password-card">
          <div class="card-header">
            <div class="logo">
              <sl-icon name="layers" class="logo-icon"></sl-icon>
              <div class="logo-text">Task Flow</div>
            </div>

            <h1 class="form-title">Set new password</h1>
            <p class="form-subtitle">
              Enter your new password below. Make sure it's secure and memorable.
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

            <div class="password-requirements">
              <div class="requirements-title">
                <sl-icon name="shield-check"></sl-icon>
                Password Requirements
              </div>
              <ul class="requirements-list">
                <li class="requirement-item ${this.password.length >= 8 ? 'valid' : 'invalid'}">
                  <sl-icon name=${this.password.length >= 8 ? 'check-circle' : 'x-circle'}></sl-icon>
                  At least 8 characters long
                </li>
                <li class="requirement-item ${this.hasUppercase(this.password) ? 'valid' : 'invalid'}">
                  <sl-icon name=${this.hasUppercase(this.password) ? 'check-circle' : 'x-circle'}></sl-icon>
                  Contains uppercase letter
                </li>
                <li class="requirement-item ${this.hasLowercase(this.password) ? 'valid' : 'invalid'}">
                  <sl-icon name=${this.hasLowercase(this.password) ? 'check-circle' : 'x-circle'}></sl-icon>
                  Contains lowercase letter
                </li>
                <li class="requirement-item ${this.hasNumber(this.password) ? 'valid' : 'invalid'}">
                  <sl-icon name=${this.hasNumber(this.password) ? 'check-circle' : 'x-circle'}></sl-icon>
                  Contains a number
                </li>
                <li class="requirement-item ${this.password === this.confirmPassword && this.password.length > 0 ? 'valid' : 'invalid'}">
                  <sl-icon name=${this.password === this.confirmPassword && this.password.length > 0 ? 'check-circle' : 'x-circle'}></sl-icon>
                  Passwords match
                </li>
              </ul>
            </div>

            <form @submit=${this.handleSubmit}>
              <div class="form-section">
                <sl-input
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  .value=${this.password}
                  @sl-input=${(e: CustomEvent) => this.password = (e.target as any).value}
                  required
                  autocomplete="new-password"
                  help-text="Choose a strong password you'll remember"
                >
                  <sl-icon slot="prefix" name="lock"></sl-icon>
                </sl-input>
              </div>

              <div class="form-section">
                <sl-input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
                  .value=${this.confirmPassword}
                  @sl-input=${(e: CustomEvent) => this.confirmPassword = (e.target as any).value}
                  required
                  autocomplete="new-password"
                >
                  <sl-icon slot="prefix" name="lock-fill"></sl-icon>
                </sl-input>
              </div>

              <div class="form-actions">
                <sl-button
                  type="submit"
                  variant="primary"
                  size="large"
                  ?loading=${this.isSubmitting}
                  ?disabled=${!this.isFormValid()}
                >
                  <sl-icon slot="prefix" name="check-circle"></sl-icon>
                  ${this.isSubmitting ? 'Updating Password...' : 'Update Password'}
                </sl-button>
              </div>
            </form>

            <div class="footer-links">
              <p>
                <sl-icon name="arrow-left"></sl-icon>
                <a href="/auth/sign-in">Back to Sign In</a>
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
        <sl-card class="reset-password-card">
          <div class="status-content success-content">
            <sl-icon name="check-circle" class="status-icon" style="color: var(--sl-color-success-600);"></sl-icon>
            
            <h2 class="status-title">Password Updated Successfully!</h2>
            <p class="status-text">
              Your password has been updated. You can now sign in with your new password.
            </p>

            <div class="success-next-steps">
              <div class="next-steps-title">
                <sl-icon name="list-check"></sl-icon>
                What's next?
              </div>
              <ul class="next-steps-list">
                <li>
                  <sl-icon name="check"></sl-icon>
                  Your account is now secure with your new password
                </li>
                <li>
                  <sl-icon name="check"></sl-icon>
                  Sign in to access your dashboard
                </li>
                <li>
                  <sl-icon name="check"></sl-icon>
                  Consider enabling two-factor authentication
                </li>
              </ul>
            </div>

            <div class="status-actions">
              <sl-button variant="primary" size="large" href="/auth/sign-in">
                <sl-icon slot="prefix" name="box-arrow-in-right"></sl-icon>
                Sign In Now
              </sl-button>
              
              <sl-button variant="default" href="/">
                <sl-icon slot="prefix" name="house"></sl-icon>
                Go to Homepage
              </sl-button>
            </div>
          </div>
        </sl-card>
      </div>
    `;
  }

  private renderError() {
    return html`
      <div class="container">
        <sl-card class="reset-password-card">
          <div class="status-content error-content">
            <sl-icon name="exclamation-triangle" class="status-icon" style="color: var(--sl-color-danger-600);"></sl-icon>
            
            <h2 class="status-title">Invalid Reset Link</h2>
            <p class="status-text">
              This password reset link is invalid, expired, or has already been used. 
              Please request a new password reset link.
            </p>

            <sl-alert variant="warning" open style="margin: 1.5rem 0; text-align: left;">
              <sl-icon slot="icon" name="info-circle"></sl-icon>
              <strong>Common reasons for this error:</strong>
              <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
                <li>The link has expired (links are valid for 1 hour)</li>
                <li>The link has already been used</li>
                <li>The link was copied incorrectly</li>
              </ul>
            </sl-alert>

            <div class="status-actions">
              <sl-button variant="primary" size="large" href="/auth/forgot-password">
                <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                Request New Reset Link
              </sl-button>
              
              <sl-button variant="default" href="/auth/sign-in">
                <sl-icon slot="prefix" name="arrow-left"></sl-icon>
                Back to Sign In
              </sl-button>
            </div>
          </div>
        </sl-card>
      </div>
    `;
  }

  private isFormValid(): boolean {
    return (
      this.password.length >= 8 &&
      this.hasUppercase(this.password) &&
      this.hasLowercase(this.password) &&
      this.hasNumber(this.password) &&
      this.password === this.confirmPassword &&
      this.accessToken !== ''
    );
  }

  private hasUppercase(str: string): boolean {
    return /[A-Z]/.test(str);
  }

  private hasLowercase(str: string): boolean {
    return /[a-z]/.test(str);
  }

  private hasNumber(str: string): boolean {
    return /\d/.test(str);
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
      this.error = error instanceof Error ? error.message : 'Password update failed. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}

