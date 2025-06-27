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
      width: 100%;
      max-width: 500px;
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
      margin: 0;
    }

    .hero-badge {
      margin-bottom: 1rem;
    }

    .form-content {
      padding: 0 2rem 2rem;
    }

    .form-section {
      margin-bottom: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .password-strength {
      margin-top: 0.5rem;
    }

    .strength-meter {
      height: 4px;
      background: var(--sl-color-neutral-200);
      border-radius: 2px;
      overflow: hidden;
      margin: 0.5rem 0;
    }

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 2px;
    }

    .strength-weak {
      width: 25%;
      background: var(--sl-color-danger-500);
    }

    .strength-fair {
      width: 50%;
      background: var(--sl-color-warning-500);
    }

    .strength-good {
      width: 75%;
      background: var(--sl-color-primary-500);
    }

    .strength-strong {
      width: 100%;
      background: var(--sl-color-success-500);
    }

    .strength-label {
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-medium);
    }

    .terms-section {
      margin: 1rem 0;
      padding: 1rem;
      background: var(--sl-color-neutral-50);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      font-size: var(--sl-font-size-small);
    }

    .terms-checkbox {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .terms-text {
      color: var(--sl-color-neutral-700);
      line-height: 1.5;
    }

    .terms-text a {
      color: var(--sl-color-primary-600);
      text-decoration: none;
      font-weight: var(--sl-font-weight-medium);
    }

    .terms-text a:hover {
      color: var(--sl-color-primary-700);
      text-decoration: underline;
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
      background: rgba(255, 255, 255, 0.95);
      padding: 0 1rem;
      position: relative;
      z-index: 2;
      font-size: var(--sl-font-size-small);
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
      background: var(--sl-color-success-50);
      border: 1px solid var(--sl-color-success-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: left;
    }

    .success-steps h4 {
      margin: 0 0 1rem 0;
      font-size: var(--sl-font-size-medium);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-success-700);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .success-steps ol {
      margin: 0;
      padding-left: 1.5rem;
      color: var(--sl-color-success-700);
    }

    .success-steps li {
      margin-bottom: 0.5rem;
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .debug-section {
      margin-top: 1rem;
    }

    .debug-content {
      max-height: 200px;
      overflow-y: auto;
      font-family: var(--sl-font-mono);
      font-size: var(--sl-font-size-small);
      background: var(--sl-color-neutral-900);
      color: var(--sl-color-neutral-100);
      padding: 1rem;
      border-radius: var(--sl-border-radius-medium);
      white-space: pre-wrap;
      word-wrap: break-word;
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

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-actions sl-button {
        width: 100%;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .sign-up-card {
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

    :host(.sl-theme-dark) .terms-section {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .terms-text {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .terms-text a {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .terms-text a:hover {
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .divider {
      color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .divider::before {
      background: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .divider span {
      background: rgba(0, 0, 0, 0.4);
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
      background: var(--sl-color-success-950);
      border-color: var(--sl-color-success-800);
    }

    :host(.sl-theme-dark) .success-steps h4 {
      color: var(--sl-color-success-300);
    }

    :host(.sl-theme-dark) .success-steps ol {
      color: var(--sl-color-success-400);
    }
  `;

  @property({ type: Object }) stateController!: StateController;

  @state() private name = '';
  @state() private email = '';
  @state() private password = '';
  @state() private confirmPassword = '';
  @state() private acceptTerms = false;
  @state() private isSubmitting = false;
  @state() private error = '';
  @state() private showSuccess = false;
  @state() private debugLogs: string[] = [];
  @state() private showDebug = false;

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
    this.debugLogs = [...this.debugLogs.slice(-10), logMessage];
    this.requestUpdate();
  }

  render() {
    if (this.showSuccess) {
      return this.renderSuccess();
    }

    return html`
      <div class="container">
      <sl-card class="sign-up-card">
        <div class="card-header">
        <div class="logo">
          <sl-icon name="layers" class="logo-icon"></sl-icon>
          <div class="logo-text">Task Flow</div>
        </div>

        <sl-badge variant="success" pill class="hero-badge">
          <sl-icon slot="prefix" name="rocket"></sl-icon>
          Start Your Journey
        </sl-badge>

        <h1 class="form-title">Create your account</h1>
        <p class="form-subtitle">Join thousands of users organizing their work better</p>
        </div>

        <div class="form-content">
        ${this.error ? html`
          <div class="form-section">
          <sl-alert variant="danger" open>
            <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
            <strong>Sign Up Failed</strong><br>
            ${this.error}
          </sl-alert>
          </div>
        ` : ''}

        <form @submit=${this.handleSubmit}>
          <div class="form-section">
          <sl-input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            .value=${this.name}
            @sl-input=${(e: CustomEvent) => this.name = (e.target as any).value}
            required
            autocomplete="name"
            help-text="This will be displayed in your profile"
          >
            <sl-icon slot="prefix" name="person"></sl-icon>
          </sl-input>
          </div>

          <div class="form-section">
          <sl-input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            .value=${this.email}
            @sl-input=${(e: CustomEvent) => this.email = (e.target as any).value}
            required
            autocomplete="email"
            help-text="We'll send a confirmation email to this address"
          >
            <sl-icon slot="prefix" name="envelope"></sl-icon>
          </sl-input>
          </div>

          <div class="form-section">
          <sl-input
            label="Password"
            type="password"
            placeholder="Create a password"
            .value=${this.password}
            @sl-input=${(e: CustomEvent) => this.password = (e.target as any).value}
            required
            autocomplete="new-password"
            password-toggle
          >
            <sl-icon slot="prefix" name="lock"></sl-icon>
          </sl-input>
          ${this.renderPasswordStrength()}
          </div>

          <div class="form-section">
          <sl-input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            .value=${this.confirmPassword}
            @sl-input=${(e: CustomEvent) => this.confirmPassword = (e.target as any).value}
            required
            autocomplete="new-password"
          >
            <sl-icon slot="prefix" name="lock-fill"></sl-icon>
          </sl-input>
          </div>

          <div class="terms-section">
          <div class="terms-checkbox">
            <sl-checkbox
            .checked=${this.acceptTerms}
            @sl-change=${(e: CustomEvent) => this.acceptTerms = (e.target as any).checked}
            required
            ></sl-checkbox>
            <div class="terms-text">
            I agree to the <a href="/terms" target="_blank">Terms of Service</a> and 
            <a href="/privacy" target="_blank">Privacy Policy</a>. I understand that Task Flow 
            will process my data according to these terms.
            </div>
          </div>
          </div>

          <div class="form-actions">
          <sl-button
            type="submit"
            variant="primary"
            size="large"
            ?loading=${this.isSubmitting}
            ?disabled=${!this.isFormValid()}
          >
            <sl-icon slot="prefix" name="rocket"></sl-icon>
            ${this.isSubmitting ? 'Creating Account...' : 'Create Account'}
          </sl-button>
          </div>
        </form>

        <div class="divider">
          <span>Already have an account?</span>
        </div>

        <div class="footer-links">
          <p>
          <a href="/auth/sign-in">Sign in to your existing account</a>
          </p>
          <p>
          <a href="/">← Back to Homepage</a>
          </p>
        </div>

        ${this.renderDebugSection()}
        </div>
      </sl-card>
      </div>
    `;
  }

  private renderPasswordStrength() {
    if (!this.password) return '';

    const strength = this.calculatePasswordStrength(this.password);
    const strengthClass = `strength-${strength.level}`;
    const strengthText = strength.level.charAt(0).toUpperCase() + strength.level.slice(1);

    return html`
      <div class="password-strength">
        <div class="strength-meter">
          <div class="strength-fill ${strengthClass}"></div>
        </div>
        <div class="strength-label" style="color: var(--sl-color-${this.getStrengthColor(strength.level)}-600);">
          Password strength: ${strengthText} (${strength.score}/4)
        </div>
      </div>
    `;
  }

  private renderSuccess() {
    return html`
      <div class="container">
        <sl-card class="sign-up-card">
          <div class="success-content">
            <sl-icon name="check-circle" class="success-icon" style="color: var(--sl-color-success-600);"></sl-icon>
            
            <h2 class="success-title">Account Created Successfully!</h2>
            <p class="success-text">
              Welcome to Task Flow! We've sent a confirmation email to 
              <span class="success-email">${this.email}</span>
            </p>

            <div class="success-steps">
              <h4>
                <sl-icon name="list-check"></sl-icon>
                Next Steps:
              </h4>
              <ol>
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the confirmation link in the email</li>
                <li>Complete your profile setup</li>
                <li>Start organizing your tasks!</li>
              </ol>
            </div>

            <div class="success-actions">
              <sl-button variant="primary" size="large" href="/auth/sign-in">
                <sl-icon slot="prefix" name="box-arrow-in-right"></sl-icon>
                Go to Sign In
              </sl-button>
              
              <sl-button variant="default" @click=${this.handleResendEmail}>
                <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                Resend Confirmation Email
              </sl-button>
            </div>

            <sl-alert variant="primary" open style="margin-top: 1.5rem; text-align: left;">
              <sl-icon slot="icon" name="info-circle"></sl-icon>
              <strong>Didn't receive the email?</strong> 
              Check your spam folder or click "Resend" above. The confirmation link is valid for 24 hours.
            </sl-alert>
          </div>

          ${this.renderDebugSection()}
        </sl-card>
      </div>
    `;
  }

  private renderDebugSection() {
    if (this.debugLogs.length === 0) return '';

    return html`
      <div class="debug-section">
        <sl-details summary="Debug Information" ?open=${this.showDebug}>
          <div class="debug-content">${this.debugLogs.join('\n')}</div>
          <sl-button
            variant="text"
            size="small"
            @click=${() => this.debugLogs = []}
            style="margin-top: 0.5rem;"
          >
            <sl-icon slot="prefix" name="trash"></sl-icon>
            Clear Logs
          </sl-button>
        </sl-details>
      </div>
    `;
  }

  private calculatePasswordStrength(password: string) {
    let score = 0;
    let level = 'weak';

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    // Determine level
    if (score >= 6) level = 'strong';
    else if (score >= 4) level = 'good';
    else if (score >= 2) level = 'fair';

    return { score: Math.min(score, 4), level };
  }

  private getStrengthColor(level: string): string {
    switch (level) {
      case 'weak': return 'danger';
      case 'fair': return 'warning';
      case 'good': return 'primary';
      case 'strong': return 'success';
      default: return 'neutral';
    }
  }

  private isFormValid(): boolean {
    const valid = (
      this.name.trim() !== '' &&
      this.email.trim() !== '' &&
      this.password.length >= 8 &&
      this.password === this.confirmPassword &&
      this.acceptTerms
    );
    
    if (this.debugLogs.length > 0) {
      this.addDebugLog(`📝 Form validation: ${valid} (name: ${!!this.name.trim()}, email: ${!!this.email.trim()}, pwd: ${this.password.length >= 8}, match: ${this.password === this.confirmPassword}, terms: ${this.acceptTerms})`);
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

    if (!this.acceptTerms) {
      this.addDebugLog('❌ Terms not accepted');
      this.error = 'Please accept the Terms of Service and Privacy Policy';
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
      this.addDebugLog('📧 Attempting to resend confirmation email...');
      
      // Show loading state
      const button = this.shadowRoot?.querySelector('sl-button[variant="default"]') as any;
      if (button) {
        button.loading = true;
      }

      // In a real implementation, you would call a resend confirmation email API
      // await this.stateController.resendConfirmationEmail(this.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success notification
      const notification = Object.assign(document.createElement('sl-alert'), {
        variant: 'success',
        closable: true,
        duration: 4000,
        innerHTML: `
          <sl-icon slot="icon" name="check-circle"></sl-icon>
          <strong>Email Sent!</strong> Please check your inbox for the confirmation email.
        `
      });

      document.body.appendChild(notification);
      notification.toast();
      
      this.addDebugLog('✅ Resend email completed');
    } catch (error) {
      this.addDebugLog(`❌ Resend email failed: ${error}`);
      
      // Show error notification
      const notification = Object.assign(document.createElement('sl-alert'), {
        variant: 'danger',
        closable: true,
        duration: 4000,
        innerHTML: `
          <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
          <strong>Failed to resend email.</strong> Please try again later.
        `
      });

      document.body.appendChild(notification);
      notification.toast();
    } finally {
      // Remove loading state
      const button = this.shadowRoot?.querySelector('sl-button[variant="default"]') as any;
      if (button) {
        button.loading = false;
      }
    }
  }
}

