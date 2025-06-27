// src/components/pages/confirm-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { supabase } from '../../services/supabase';

@customElement('confirm-page')
export class ConfirmPage extends LitElement {
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

    .confirm-card {
      background: white;
      border-radius: var(--sl-border-radius-large);
      box-shadow: var(--sl-shadow-large);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    .logo {
      margin-bottom: 2rem;
    }

    .logo-text {
      font-size: 1.75rem;
      font-weight: bold;
      color: var(--sl-color-primary-700);
    }

    .status-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .status-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      margin-bottom: 1rem;
    }

    .status-message {
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .success .status-icon {
      color: var(--sl-color-success-600);
    }

    .success .status-title {
      color: var(--sl-color-success-700);
    }

    .success .status-message {
      color: var(--sl-color-neutral-600);
    }

    .error .status-icon {
      color: var(--sl-color-danger-600);
    }

    .error .status-title {
      color: var(--sl-color-danger-700);
    }

    .error .status-message {
      color: var(--sl-color-danger-600);
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .actions sl-button {
      width: 100%;
    }

    .debug-info {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--sl-color-neutral-100);
      border-radius: var(--sl-border-radius-medium);
      font-size: var(--sl-font-size-small);
      text-align: left;
      max-height: 200px;
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

    :host(.sl-theme-dark) .confirm-card {
      background: var(--sl-color-neutral-800);
      border: 1px solid var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .logo-text {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .success .status-title {
      color: var(--sl-color-success-400);
    }

    :host(.sl-theme-dark) .success .status-message {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .error .status-title {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .error .status-message {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .debug-info {
      background: var(--sl-color-neutral-700);
      color: var(--sl-color-neutral-300);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;

  @state() private status: 'loading' | 'success' | 'error' = 'loading';
  @state() private message = '';
  @state() private isNewUser = false;
  @state() private debugInfo: string[] = [];

  async connectedCallback() {
    super.connectedCallback();
    this.addDebugLog('🔌 ConfirmPage connected, starting email confirmation process');
    this.addDebugLog(`📍 Current URL: ${window.location.href}`);
    await this.handleEmailConfirmation();
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    this.debugInfo = [...this.debugInfo, logMessage];
    this.requestUpdate();
  }

  private async handleEmailConfirmation() {
    try {
      this.addDebugLog('🚀 Starting handleEmailConfirmation');
      
      const urlParams = new URLSearchParams(window.location.search);
      const tokenHash = urlParams.get('token_hash');
      const type = urlParams.get('type');
      const callback = urlParams.get('callback');

      this.addDebugLog(`📋 URL Parameters:`);
      this.addDebugLog(`  - token_hash: ${tokenHash ? `${tokenHash.substring(0, 10)}...` : 'null'}`);
      this.addDebugLog(`  - type: ${type}`);
      this.addDebugLog(`  - callback: ${callback}`);

      if (!tokenHash || !type) {
        this.addDebugLog('❌ Missing required parameters');
        throw new Error('Invalid confirmation link');
      }

      this.addDebugLog('✅ URL parameters validated, proceeding with Supabase verification');

      // Check current auth state before verification
      const { data: { session: currentSession } } = await supabase.refreshSession();
      this.addDebugLog(`🔐 Current session before verification: ${currentSession ? 'exists' : 'none'}`);
      if (currentSession?.user) {
        this.addDebugLog(`👤 Current user: ${currentSession.user.email} (confirmed: ${currentSession.user.email_confirmed_at ? 'yes' : 'no'})`);
      }

      this.addDebugLog('📡 Calling supabase.verifyOtp...');
      const startTime = Date.now();

      // Verify the email confirmation with Supabase
      const { data, error } = await supabase.verifyOtp({
        token_hash: tokenHash,
        type: type as any,
      });

      const endTime = Date.now();
      this.addDebugLog(`⏱️ verifyOtp completed in ${endTime - startTime}ms`);

      if (error) {
        this.addDebugLog(`❌ Supabase verifyOtp error:`);
        this.addDebugLog(`  - Name: ${error.name}`);
        this.addDebugLog(`  - Message: ${error.message}`);
        this.addDebugLog(`  - Status: ${error.status || 'unknown'}`);
        this.addDebugLog(`  - Full error: ${JSON.stringify(error, null, 2)}`);
        throw error;
      }

      this.addDebugLog('✅ verifyOtp successful, analyzing response data');
      this.addDebugLog(`📊 Response data session: ${data.session ? 'exists' : 'none'}`);
      this.addDebugLog(`📊 Response data user: ${data.user ? 'exists' : 'none'}`);

      if (data.user) {
        this.addDebugLog(`👤 Verified user details:`);
        this.addDebugLog(`  - ID: ${data.user.id}`);
        this.addDebugLog(`  - Email: ${data.user.email}`);
        this.addDebugLog(`  - Email confirmed: ${data.user.email_confirmed_at ? 'yes' : 'no'}`);
        this.addDebugLog(`  - Created at: ${data.user.created_at}`);
        this.addDebugLog(`  - Email confirmed at: ${data.user.email_confirmed_at}`);

        // Check if this is a new user (just signed up) or existing user
        const isNewUserCheck1 = data.user.email_confirmed_at === data.user.created_at;
        const isNewUserCheck2 = new Date(data.user.created_at).getTime() > Date.now() - 60000;
        
        this.addDebugLog(`🔍 New user checks:`);
        this.addDebugLog(`  - email_confirmed_at === created_at: ${isNewUserCheck1}`);
        this.addDebugLog(`  - created within last minute: ${isNewUserCheck2}`);
        
        this.isNewUser = isNewUserCheck1 || isNewUserCheck2;
        this.addDebugLog(`✅ Is new user: ${this.isNewUser}`);

        this.status = 'success';
        this.message = this.isNewUser 
          ? 'Your email has been confirmed! Welcome to Task Flow.'
          : 'Your email has been confirmed successfully.';

        this.addDebugLog(`✅ Status set to success with message: "${this.message}"`);

        // Clean up the URL
        const callbackUrl = callback ? decodeURIComponent(callback) : '/';
        this.addDebugLog(`🔄 Cleaning up URL, callback: ${callbackUrl}`);
        window.history.replaceState({}, '', callbackUrl);

        // Check current auth state after verification
        const { data: { session: newSession } } = await supabase.refreshSession();
        this.addDebugLog(`🔐 Current session after verification: ${newSession ? 'exists' : 'none'}`);

        // Auto-redirect after a short delay
        this.addDebugLog(`⏰ Setting up redirect in 2 seconds to: ${this.isNewUser ? 'onboarding' : 'dashboard'}`);
        setTimeout(() => {
          this.addDebugLog(`🚀 Executing redirect...`);
          if (this.isNewUser) {
            this.routerController.goToOnboarding();
          } else {
            this.routerController.goToDashboard();
          }
        }, 2000);

      } else {
        this.addDebugLog('❌ No user data in response');
        throw new Error('Email confirmation failed - no user data returned');
      }

    } catch (error: any) {
      this.addDebugLog(`💥 Error in handleEmailConfirmation:`);
      this.addDebugLog(`  - Error type: ${error.constructor.name}`);
      this.addDebugLog(`  - Error message: ${error.message}`);
      this.addDebugLog(`  - Error stack: ${error.stack}`);
      
      if (error.cause) {
        this.addDebugLog(`  - Error cause: ${JSON.stringify(error.cause, null, 2)}`);
      }

      console.error('Email confirmation error:', error);
      this.status = 'error';
      
      if (error.message?.includes('Token has expired')) {
        this.message = 'This confirmation link has expired. Please request a new confirmation email.';
        this.addDebugLog('🕐 Token expired error detected');
      } else if (error.message?.includes('Invalid token')) {
        this.message = 'This confirmation link is invalid or has already been used.';
        this.addDebugLog('🔑 Invalid token error detected');
      } else if (error.name === 'AuthRetryableFetchError') {
        this.message = 'Network timeout occurred. Please check your connection and try again.';
        this.addDebugLog('🌐 Network timeout error detected');
      } else {
        this.message = error.message || 'Email confirmation failed. Please try again.';
        this.addDebugLog('❓ Generic error detected');
      }

      this.addDebugLog(`📝 Final error message: "${this.message}"`);
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="confirm-card">
          <div class="logo">
            <div class="logo-text">Task Flow</div>
          </div>

          ${this.renderStatus()}
          
          ${this.debugInfo.length > 0 ? html`
            <div class="debug-info">
              <strong>Debug Log:</strong>
              <pre>${this.debugInfo.join('\n')}</pre>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderStatus() {
    switch (this.status) {
      case 'loading':
        return html`
          <div class="loading">
            <div class="status-icon">📧</div>
            <h1 class="status-title">Confirming your email...</h1>
            <loading-spinner size="medium" text="Please wait"></loading-spinner>
          </div>
        `;

      case 'success':
        return html`
          <div class="success">
            <div class="status-icon">✅</div>
            <h1 class="status-title">Email Confirmed!</h1>
            <p class="status-message">${this.message}</p>
            
            <div class="actions">
              ${this.isNewUser ? html`
                <sl-button variant="primary" @click=${() => this.routerController.goToOnboarding()}>
                  Get Started
                </sl-button>
                <p style="font-size: var(--sl-font-size-small); color: var(--sl-color-neutral-600); margin: 0;">
                  Redirecting automatically in 2 seconds...
                </p>
              ` : html`
                <sl-button variant="primary" @click=${() => this.routerController.goToDashboard()}>
                  Go to Dashboard
                </sl-button>
                <sl-button variant="default" @click=${() => this.routerController.goToSignIn()}>
                  Sign In
                </sl-button>
                <p style="font-size: var(--sl-font-size-small); color: var(--sl-color-neutral-600); margin: 0;">
                  Redirecting automatically in 2 seconds...
                </p>
              `}
            </div>
          </div>
        `;

      case 'error':
        return html`
          <div class="error">
            <div class="status-icon">❌</div>
            <h1 class="status-title">Confirmation Failed</h1>
            <p class="status-message">${this.message}</p>
            
            <div class="actions">
              <sl-button variant="primary" @click=${this.handleResendConfirmation}>
                Resend Confirmation Email
              </sl-button>
              <sl-button variant="default" @click=${() => this.routerController.goToSignIn()}>
                Back to Sign In
              </sl-button>
              <sl-button variant="default" @click=${() => this.routerController.goToSignUp()}>
                Create New Account
              </sl-button>
            </div>
          </div>
        `;

      default:
        return html``;
    }
  }

  private async handleResendConfirmation() {
    this.addDebugLog('🔄 Resend confirmation requested');
    // In a real app, you'd prompt for email and resend confirmation
    // For now, redirect to sign up
    this.routerController.goToSignUp();
  }
}

