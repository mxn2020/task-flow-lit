// src/components/pages/sign-up-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';

@customElement('sign-up-page')
export class SignUpPage extends LitElement {
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

    .sign-up-card {
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
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .sign-up-button {
      width: 100%;
    }

    .divider {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
      color: var(--sl-color-neutral-500);
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--sl-color-neutral-300);
      z-index: 1;
    }

    .divider span {
      background: white;
      padding: 0 1rem;
      position: relative;
      z-index: 2;
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

    .success-message {
      text-align: center;
      padding: 2rem;
    }

    .success-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: var(--sl-color-success-600);
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

    .success-steps {
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: left;
    }

    .success-steps h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
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

    .debug-info {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--sl-color-neutral-100);
      border-radius: var(--sl-border-radius-medium);
      font-size: var(--sl-font-size-small);
      max-height: 150px;
      overflow-y: auto;
    }

    .debug-info pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .sign-up-card {
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

    :host(.sl-theme-dark) .divider {
      color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .divider::before {
      background: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .divider span {
      background: var(--sl-color-neutral-800);
    }

    :host(.sl-theme-dark) .success-title {
      color: var(--sl-color-success-400);
    }

    :host(.sl-theme-dark) .success-text {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .success-steps {
      background: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .success-steps h3 {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .success-steps ol {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .debug-info {
      background: var(--sl-color-neutral-700);
      color: var(--sl-color-neutral-300);
    }
  `;

  @property({ type: Object }) stateController!: StateController;

  @state() private name = '';
  @state() private email = '';
  @state() private password = '';
  @state() private confirmPassword = '';
  @state() private isSubmitting = false;
  @state() private error = '';
  @state() private showSuccess = false;
  @state() private debugLogs: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.addDebugLog('🔌 SignUpPage connected');
    this.addDebugLog(`📍 Current URL: ${window.location.href}`);
    this.addDebugLog(`🔐 StateController provided: ${!!this.stateController}`);
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    console.log(`[SignUpPage] ${logMessage}`);
    this.debugLogs = [...this.debugLogs.slice(-8), logMessage]; // Keep last 8 logs
    this.requestUpdate();
  }

  render() {
    if (this.showSuccess) {
      return this.renderSuccess();
    }

    return html`
      <div class="container">
        <div class="sign-up-card">
          <div class="logo">
            <div class="logo-text">Task Flow</div>
          </div>

          <h1 class="form-title">Create your account</h1>
          <p class="form-subtitle">Start organizing your work today</p>

          ${this.error ? html`
            <sl-alert variant="danger" open>
              <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
              ${this.error}
            </sl-alert>
          ` : ''}

          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <sl-input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                .value=${this.name}
                @sl-input=${(e: CustomEvent) => this.name = (e.target as any).value}
                required
                autocomplete="name"
              ></sl-input>
            </div>

            <div class="form-group">
              <sl-input
                label="Email"
                type="email"
                placeholder="Enter your email"
                .value=${this.email}
                @sl-input=${(e: CustomEvent) => this.email = (e.target as any).value}
                required
                autocomplete="email"
              ></sl-input>
            </div>

            <div class="form-group">
              <sl-input
                label="Password"
                type="password"
                placeholder="Create a password"
                .value=${this.password}
                @sl-input=${(e: CustomEvent) => this.password = (e.target as any).value}
                required
                autocomplete="new-password"
                help-text="Password must be at least 8 characters long"
              ></sl-input>
            </div>

            <div class="form-group">
              <sl-input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                .value=${this.confirmPassword}
                @sl-input=${(e: CustomEvent) => this.confirmPassword = (e.target as any).value}
                required
                autocomplete="new-password"
              ></sl-input>
            </div>

            <div class="form-actions">
              <sl-button
                class="sign-up-button"
                type="submit"
                variant="primary"
                size="large"
                ?loading=${this.isSubmitting}
                ?disabled=${!this.isFormValid()}
              >
                ${this.isSubmitting ? 'Creating account...' : 'Create Account'}
              </sl-button>
            </div>
          </form>

          <div class="divider">
            <span>or</span>
          </div>

          <div class="footer-links">
            <p>
              Already have an account? 
              <a href="/auth/sign-in">Sign in</a>
            </p>
          </div>

          ${this.debugLogs.length > 0 ? html`
            <div class="debug-info">
              <strong>SignUp Debug:</strong>
              <pre>${this.debugLogs.join('\n')}</pre>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderSuccess() {
    return html`
      <div class="container">
        <div class="sign-up-card">
          <div class="success-message">
            <div class="success-icon">✅</div>
            <h2 class="success-title">Account Created Successfully!</h2>
            <p class="success-text">
              Welcome to Task Flow! We've sent a confirmation email to <strong>${this.email}</strong>.
            </p>

            <div class="success-steps">
              <h3>Next Steps:</h3>
              <ol>
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the confirmation link in the email</li>
                <li>Complete the setup process</li>
                <li>Start organizing your tasks!</li>
              </ol>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <sl-button variant="primary" href="/auth/sign-in">
                Go to Sign In
              </sl-button>
              <sl-button variant="default" @click=${this.handleResendEmail}>
                Resend Confirmation Email
              </sl-button>
            </div>

            <p style="font-size: var(--sl-font-size-small); color: var(--sl-color-neutral-600); margin-top: 1rem;">
              Didn't receive the email? Check your spam folder or click "Resend" above.
            </p>
          </div>

          ${this.debugLogs.length > 0 ? html`
            <div class="debug-info">
              <strong>SignUp Debug:</strong>
              <pre>${this.debugLogs.join('\n')}</pre>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private isFormValid(): boolean {
    const valid = (
      this.name.trim() !== '' &&
      this.email.trim() !== '' &&
      this.password.length >= 8 &&
      this.password === this.confirmPassword
    );
    
    if (this.debugLogs.length > 0) { // Only log if debug is active
      this.addDebugLog(`📝 Form validation: ${valid} (name: ${!!this.name.trim()}, email: ${!!this.email.trim()}, pwd: ${this.password.length >= 8}, match: ${this.password === this.confirmPassword})`);
    }
    
    return valid;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting || !this.isFormValid()) {
      this.addDebugLog('⚠️ Submit called but form invalid or already submitting');
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.addDebugLog('❌ Passwords do not match');
      this.error = 'Passwords do not match';
      return;
    }
    
    this.addDebugLog(`📝 Form submitted - name: ${this.name}, email: ${this.email}`);
    this.isSubmitting = true;
    this.error = '';

    try {
      this.addDebugLog('🔄 Calling stateController.signUp...');
      const { error } = await this.stateController.signUp(this.email, this.password, this.name);
      
      if (error) {
        this.addDebugLog(`❌ Sign up error: ${error}`);
        this.error = error;
      } else {
        this.addDebugLog('✅ Sign up successful - showing success message');
        this.showSuccess = true;
        
        // Clear form data for security
        this.password = '';
        this.confirmPassword = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      this.addDebugLog(`💥 Sign up exception: ${errorMessage}`);
      this.error = errorMessage;
    } finally {
      this.isSubmitting = false;
      this.addDebugLog(`🏁 Sign up process complete, isSubmitting: ${this.isSubmitting}, showSuccess: ${this.showSuccess}`);
    }
  }

  private async handleResendEmail() {
    this.addDebugLog('📧 Resend email requested');
    try {
      // In a real implementation, you would call a resend confirmation email API
      // For now, we'll just show a message
      this.addDebugLog('📧 Attempting to resend confirmation email...');
      
      // You could add a method to StateController for resending emails
      // await this.stateController.resendConfirmationEmail(this.email);
      
      // For now, just show a success message
      alert('Confirmation email resent! Please check your inbox.');
      this.addDebugLog('✅ Resend email completed');
    } catch (error) {
      this.addDebugLog(`❌ Resend email failed: ${error}`);
      alert('Failed to resend email. Please try again later.');
    }
  }
}

