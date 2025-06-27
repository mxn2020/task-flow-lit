// src/components/pages/confirm-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { supabase } from '../../services/supabase';
import { AuthService } from '../../services/auth-service';

interface ConfirmationState {
  status: 'loading' | 'success' | 'error';
  message: string;
  isNewUser: boolean;
  debugInfo: string[];
}

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
      width: 100%;
      max-width: 500px;
    }

    .logo {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-text {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-700);
    }

    .content-section {
      text-align: center;
      padding: 1rem;
    }

    .status-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
    }

    .status-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      margin-bottom: 1rem;
    }

    .status-message {
      line-height: 1.6;
      margin-bottom: 2rem;
      color: var(--sl-color-neutral-700);
    }

    .loading-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .success .status-icon {
      color: var(--sl-color-success-600);
    }

    .success .status-title {
      color: var(--sl-color-success-700);
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
      margin-top: 1.5rem;
    }

    .redirect-info {
      margin-top: 1rem;
      padding: 1rem;
      background-color: var(--sl-color-neutral-100);
      border-radius: var(--sl-border-radius-medium);
      border-left: 4px solid var(--sl-color-primary-600);
    }

    .redirect-countdown {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-primary-700);
    }

    .debug-section {
      margin-top: 2rem;
    }

    .debug-content {
      max-height: 300px;
      overflow-y: auto;
      font-family: var(--sl-font-mono);
      font-size: var(--sl-font-size-small);
      white-space: pre-wrap;
      word-wrap: break-word;
      text-align: left;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .actions {
        gap: 0.75rem;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .logo-text {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .status-message {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .success .status-title {
      color: var(--sl-color-success-400);
    }

    :host(.sl-theme-dark) .error .status-title {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .error .status-message {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .redirect-info {
      background-color: var(--sl-color-neutral-800);
      border-left-color: var(--sl-color-primary-500);
    }

    :host(.sl-theme-dark) .redirect-countdown {
      color: var(--sl-color-primary-400);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;

  @state() private confirmationState: ConfirmationState = {
    status: 'loading',
    message: '',
    isNewUser: false,
    debugInfo: []
  };

  @state() private redirectCountdown = 3;
  @state() private showDebug = false;

  private redirectTimer?: number;
  private authService = new AuthService();

  async connectedCallback() {
    super.connectedCallback();
    this.addDebugLog('🔌 ConfirmPage connected, starting email confirmation process');
    this.addDebugLog(`📍 Current URL: ${window.location.href}`);
    await this.handleEmailConfirmation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.redirectTimer) {
      clearInterval(this.redirectTimer);
    }
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    this.confirmationState = {
      ...this.confirmationState,
      debugInfo: [...this.confirmationState.debugInfo, logMessage]
    };
  }

  private startRedirectCountdown(targetRoute: () => void) {
    this.redirectCountdown = 3;
    this.redirectTimer = window.setInterval(() => {
      this.redirectCountdown--;
      if (this.redirectCountdown <= 0) {
        if (this.redirectTimer) {
          clearInterval(this.redirectTimer);
        }
        this.addDebugLog(`🚀 Executing redirect...`);
        targetRoute();
      }
    }, 1000);
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
        
        const isNewUser = isNewUserCheck1 || isNewUserCheck2;
        this.addDebugLog(`✅ Is new user: ${isNewUser}`);

        this.confirmationState = {
          ...this.confirmationState,
          status: 'success',
          message: isNewUser 
            ? 'Your email has been confirmed! Welcome to Task Flow.'
            : 'Your email has been confirmed successfully.',
          isNewUser
        };

        this.addDebugLog(`✅ Status set to success with message: "${this.confirmationState.message}"`);

        // Clean up the URL
        const callbackUrl = callback ? decodeURIComponent(callback) : '/';
        this.addDebugLog(`🔄 Cleaning up URL, callback: ${callbackUrl}`);
        window.history.replaceState({}, '', callbackUrl);

        // Check current auth state after verification
        const { data: { session: newSession } } = await supabase.refreshSession();
        this.addDebugLog(`🔐 Current session after verification: ${newSession ? 'exists' : 'none'}`);

        // Start redirect countdown
        this.addDebugLog(`⏰ Starting redirect countdown...`);
        const targetRoute = isNewUser 
          ? () => this.routerController.goToOnboarding()
          : () => this.routerController.goToDashboard();
        
        this.startRedirectCountdown(targetRoute);

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
      
      let errorMessage = 'Email confirmation failed. Please try again.';
      
      if (error.message?.includes('Token has expired')) {
        errorMessage = 'This confirmation link has expired. Please request a new confirmation email.';
        this.addDebugLog('🕐 Token expired error detected');
      } else if (error.message?.includes('Invalid token')) {
        errorMessage = 'This confirmation link is invalid or has already been used.';
        this.addDebugLog('🔑 Invalid token error detected');
      } else if (error.name === 'AuthRetryableFetchError') {
        errorMessage = 'Network timeout occurred. Please check your connection and try again.';
        this.addDebugLog('🌐 Network timeout error detected');
      } else {
        this.addDebugLog('❓ Generic error detected');
      }

      this.confirmationState = {
        ...this.confirmationState,
        status: 'error',
        message: errorMessage
      };

      this.addDebugLog(`📝 Final error message: "${errorMessage}"`);
    }
  }

  render() {
    return html`
      <div class="container">
        <sl-card class="confirm-card">
          <div class="logo">
            <div class="logo-text">Task Flow</div>
          </div>

          ${this.renderContent()}
          
          ${this.confirmationState.debugInfo.length > 0 ? html`
            <div class="debug-section">
              <sl-details summary="Debug Information" ?open=${this.showDebug}>
                <div class="debug-content">
                  ${this.confirmationState.debugInfo.join('\n')}
                </div>
              </sl-details>
            </div>
          ` : ''}
        </sl-card>
      </div>
    `;
  }

  private renderContent() {
    const { status, message, isNewUser } = this.confirmationState;

    switch (status) {
      case 'loading':
        return html`
          <div class="content-section">
            <div class="loading-section">
              <div class="status-icon">📧</div>
              <h1 class="status-title">Confirming your email...</h1>
              <sl-spinner style="font-size: 2rem;"></sl-spinner>
              <p class="status-message">Please wait while we verify your email address.</p>
            </div>
          </div>
        `;

      case 'success':
        return html`
          <div class="content-section success">
            <div class="status-icon">✅</div>
            <h1 class="status-title">Email Confirmed!</h1>
            <p class="status-message">${message}</p>
            
            ${this.redirectTimer ? html`
              <sl-alert variant="primary" open>
                <sl-icon slot="icon" name="info-circle"></sl-icon>
                <div class="redirect-countdown">
                  Redirecting automatically in ${this.redirectCountdown} second${this.redirectCountdown !== 1 ? 's' : ''}...
                </div>
              </sl-alert>
            ` : ''}
            
            <div class="actions">
              ${isNewUser ? html`
                <sl-button variant="primary" size="large" @click=${() => this.routerController.goToOnboarding()}>
                  <sl-icon slot="prefix" name="rocket"></sl-icon>
                  Get Started
                </sl-button>
                <sl-button variant="default" @click=${() => this.routerController.goToSignIn()}>
                  <sl-icon slot="prefix" name="box-arrow-in-right"></sl-icon>
                  Sign In Instead
                </sl-button>
              ` : html`
                <sl-button variant="primary" size="large" @click=${() => this.routerController.goToDashboard()}>
                  <sl-icon slot="prefix" name="house"></sl-icon>
                  Go to Dashboard
                </sl-button>
                <sl-button variant="default" @click=${() => this.routerController.goToSignIn()}>
                  <sl-icon slot="prefix" name="box-arrow-in-right"></sl-icon>
                  Sign In
                </sl-button>
              `}
            </div>
          </div>
        `;

      case 'error':
        return html`
          <div class="content-section error">
            <div class="status-icon">❌</div>
            <h1 class="status-title">Confirmation Failed</h1>
            <p class="status-message">${message}</p>
            
            <sl-alert variant="danger" open>
              <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
              <strong>What you can do:</strong>
              <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
                <li>Check if you have a newer confirmation email</li>
                <li>Request a new confirmation email</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </sl-alert>
            
            <div class="actions">
              <sl-button variant="primary" @click=${this.handleResendConfirmation}>
                <sl-icon slot="prefix" name="envelope"></sl-icon>
                Resend Confirmation Email
              </sl-button>
              <sl-button variant="default" @click=${() => this.routerController.goToSignIn()}>
                <sl-icon slot="prefix" name="arrow-left"></sl-icon>
                Back to Sign In
              </sl-button>
              <sl-button variant="default" @click=${() => this.routerController.goToSignUp()}>
                <sl-icon slot="prefix" name="person-plus"></sl-icon>
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
    
    // Show a dialog to get the email address
    const email = prompt('Please enter your email address to resend the confirmation:');
    
    if (!email) {
      return;
    }

    try {
      const { error } = await this.authService.resendConfirmation(email);
      
      if (error) {
        throw error;
      }

      // Show success message
      const alert = document.createElement('sl-alert');
      alert.variant = 'success';
      alert.closable = true;
      alert.innerHTML = `
        <sl-icon slot="icon" name="check-circle"></sl-icon>
        <strong>Confirmation email sent!</strong> Please check your inbox and spam folder.
      `;
      
      document.body.appendChild(alert);
      alert.show();
      
      // Remove after 5 seconds
      setTimeout(() => {
        alert.remove();
      }, 5000);

    } catch (error: any) {
      console.error('Failed to resend confirmation:', error);
      
      // Show error message
      const alert = document.createElement('sl-alert');
      alert.variant = 'danger';
      alert.closable = true;
      alert.innerHTML = `
        <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
        <strong>Failed to send confirmation email.</strong> ${error.message || 'Please try again later.'}
      `;
      
      document.body.appendChild(alert);
      alert.show();
      
      // Remove after 5 seconds
      setTimeout(() => {
        alert.remove();
      }, 5000);
    }
  }
}

