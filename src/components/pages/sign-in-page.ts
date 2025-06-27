// src/components/pages/sign-in-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';

@customElement('sign-in-page')
export class SignInPage extends LitElement {
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

    .sign-in-card {
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
      margin: 0;
    }

    .welcome-badge {
      margin-bottom: 1rem;
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
      margin-bottom: 1.5rem;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0;
      font-size: var(--sl-font-size-small);
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .forgot-link {
      color: var(--sl-color-primary-600);
      text-decoration: none;
      font-weight: var(--sl-font-weight-medium);
    }

    .forgot-link:hover {
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

    .demo-section {
      background: var(--sl-color-neutral-50);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .demo-title {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.5rem;
      font-size: var(--sl-font-size-small);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .demo-credentials {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-700);
      font-family: var(--sl-font-mono);
      background: var(--sl-color-neutral-100);
      padding: 0.5rem;
      border-radius: var(--sl-border-radius-small);
      margin: 0.25rem 0;
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

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--sl-border-radius-large);
      backdrop-filter: blur(4px);
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

      .form-options {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .form-actions sl-button {
        width: 100%;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .sign-in-card {
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

    :host(.sl-theme-dark) .forgot-link {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .forgot-link:hover {
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .demo-section {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .demo-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .demo-credentials {
      background: var(--sl-color-neutral-700);
      color: var(--sl-color-neutral-200);
    }

    :host(.sl-theme-dark) .loading-overlay {
      background: rgba(0, 0, 0, 0.8);
    }
  `;

  @property({ type: Object }) stateController!: StateController;

  @state() private email = '';
  @state() private password = '';
  @state() private rememberMe = false;
  @state() private isSubmitting = false;
  @state() private error = '';
  @state() private debugLogs: string[] = [];
  @state() private showDebug = false;

  connectedCallback() {
    super.connectedCallback();
    this.addDebugLog('🔌 SignInPage connected');
    this.addDebugLog(`📍 Current URL: ${window.location.href}`);
    this.addDebugLog(`🔐 StateController provided: ${!!this.stateController}`);
    
    // Load saved email if remember me was used
    const savedEmail = localStorage.getItem('taskflow-remember-email');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    console.log(`[SignInPage] ${logMessage}`);
    this.debugLogs = [...this.debugLogs.slice(-10), logMessage];
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="container">
        <sl-card class="sign-in-card">
          ${this.isSubmitting ? html`
            <div class="loading-overlay">
              <sl-spinner style="font-size: 2rem;"></sl-spinner>
            </div>
          ` : ''}

          <div class="card-header">
            <div class="logo">
              <sl-icon name="layers" class="logo-icon"></sl-icon>
              <div class="logo-text">Task Flow</div>
            </div>

            <sl-badge variant="primary" pill class="welcome-badge">
              <sl-icon slot="prefix" name="star"></sl-icon>
              Welcome Back
            </sl-badge>

            <h1 class="form-title">Sign in to your account</h1>
            <p class="form-subtitle">Enter your credentials to access your workspace</p>
          </div>

          <div class="form-content">
            ${this.error ? html`
              <div class="form-section">
                <sl-alert variant="danger" open>
                  <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                  <strong>Sign In Failed</strong><br>
                  ${this.error}
                </sl-alert>
              </div>
            ` : ''}

            ${this.renderDemoSection()}

            <form @submit=${this.handleSubmit}>
              <div class="form-section">
                <sl-input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  .value=${this.email}
                  @sl-input=${(e: CustomEvent) => this.email = (e.target as any).value}
                  required
                  autocomplete="email"
                >
                  <sl-icon slot="prefix" name="envelope"></sl-icon>
                </sl-input>
              </div>

              <div class="form-section">
                <sl-input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  .value=${this.password}
                  @sl-input=${(e: CustomEvent) => this.password = (e.target as any).value}
                  required
                  autocomplete="current-password"
                  password-toggle
                >
                  <sl-icon slot="prefix" name="lock"></sl-icon>
                </sl-input>
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <sl-checkbox
                    .checked=${this.rememberMe}
                    @sl-change=${(e: CustomEvent) => this.rememberMe = (e.target as any).checked}
                  ></sl-checkbox>
                  Remember me
                </label>
                <a href="/auth/forgot-password" class="forgot-link">
                  Forgot password?
                </a>
              </div>

              <div class="form-actions">
                <sl-button
                  type="submit"
                  variant="primary"
                  size="large"
                  ?loading=${this.isSubmitting}
                  ?disabled=${!this.email || !this.password}
                >
                  <sl-icon slot="prefix" name="box-arrow-in-right"></sl-icon>
                  ${this.isSubmitting ? 'Signing in...' : 'Sign In'}
                </sl-button>
              </div>
            </form>

            <div class="divider">
              <span>New to Task Flow?</span>
            </div>

            <div class="footer-links">
              <p>
                Don't have an account? 
                <a href="/auth/sign-up">Create one here</a>
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

  private renderDemoSection() {
    return html`
      <div class="demo-section">
        <div class="demo-title">
          <sl-icon name="play-circle"></sl-icon>
          Demo Account
        </div>
        <p style="margin: 0 0 0.5rem 0; font-size: var(--sl-font-size-small); color: var(--sl-color-neutral-600);">
          Try Task Flow without creating an account:
        </p>
        <div class="demo-credentials">
          Email: demo@taskflow.com<br>
          Password: demo123456
        </div>
        <sl-button
          variant="default"
          size="small"
          @click=${this.fillDemoCredentials}
          style="margin-top: 0.5rem;"
        >
          <sl-icon slot="prefix" name="magic"></sl-icon>
          Use Demo Account
        </sl-button>
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

  private fillDemoCredentials() {
    this.email = 'demo@taskflow.com';
    this.password = 'demo123456';
    this.addDebugLog('🎭 Demo credentials filled');
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting) {
      this.addDebugLog('⚠️ Submit called while already submitting, ignoring');
      return;
    }
    
    this.addDebugLog(`📝 Form submitted with email: ${this.email}, remember: ${this.rememberMe}`);
    this.isSubmitting = true;
    this.error = '';

    // Handle remember me
    if (this.rememberMe) {
      localStorage.setItem('taskflow-remember-email', this.email);
      this.addDebugLog('💾 Email saved for remember me');
    } else {
      localStorage.removeItem('taskflow-remember-email');
      this.addDebugLog('🗑️ Remember me email cleared');
    }

    try {
      this.addDebugLog('🔄 Calling stateController.signIn...');
      const { error } = await this.stateController.signIn(this.email, this.password);
      
      if (error) {
        this.addDebugLog(`❌ Sign in error: ${error}`);
        this.error = error;
        
        // Clear password on error for security
        this.password = '';
      } else {
        this.addDebugLog('✅ Sign in successful - waiting for auth state change');
        // Success will be handled by the StateController's auth state listener
        // Clear form for security
        this.password = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      this.addDebugLog(`💥 Sign in exception: ${errorMessage}`);
      this.error = errorMessage;
      this.password = '';
    } finally {
      this.isSubmitting = false;
      this.addDebugLog(`🏁 Form submission complete, isSubmitting: ${this.isSubmitting}`);
    }
  }
}

