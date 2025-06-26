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
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;

  @state() private status: 'loading' | 'success' | 'error' = 'loading';
  @state() private message = '';
  @state() private isNewUser = false;

  async connectedCallback() {
    super.connectedCallback();
    
    // First check if user is already authenticated
    await this.checkCurrentSession();
    
    // If not already handled, try the email confirmation
    if (this.status === 'loading') {
      await this.handleEmailConfirmation();
    }
  }

  private async checkCurrentSession() {
    try {
      console.log('🔍 Checking current session...');
      const { data: { session }, error } = await supabase.supabaseClient.auth.getSession();
      
      console.log('📱 Current session check:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        emailConfirmed: session?.user?.email_confirmed_at,
        error: error ? { message: error.message } : null
      });

      if (session?.user?.email_confirmed_at) {
        console.log('✅ User already confirmed and authenticated');
        this.status = 'success';
        this.message = 'Your email is already confirmed. Redirecting...';
        
        // Determine if new user based on recent creation
        this.isNewUser = new Date(session.user.created_at).getTime() > Date.now() - 300000; // 5 minutes
        
        // Redirect immediately since they're already confirmed
        setTimeout(() => {
          if (this.isNewUser) {
            this.routerController.goToOnboarding();
          } else {
            this.routerController.goToDashboard();
          }
        }, 1000);
        
        return;
      }
    } catch (error) {
      console.log('📱 Session check failed, proceeding with token verification:', error);
      // Continue to email confirmation flow
    }
  }

  private async handleEmailConfirmation() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenHash = urlParams.get('token_hash');
      const type = urlParams.get('type');
      const callback = urlParams.get('callback');

      console.log('🔍 Email confirmation started:', {
        tokenHash: tokenHash ? `${tokenHash.substring(0, 10)}...` : null,
        type,
        callback,
        fullUrl: window.location.href
      });

      if (!tokenHash || !type) {
        throw new Error('Invalid confirmation link - missing token_hash or type parameter');
      }

      console.log('📝 Attempting to verify OTP with Supabase...');
      
      // Verify the email confirmation with Supabase
      const { data, error } = await supabase.supabaseClient.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as any,
      });

      console.log('📧 Supabase verifyOtp response:', {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        userEmail: data?.user?.email,
        userConfirmed: data?.user?.email_confirmed_at,
        error: error ? {
          name: error.name,
          message: error.message,
          status: error.status,
          statusCode: error.status
        } : null
      });

      if (error) {
        console.error('❌ Supabase verifyOtp error:', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Email verification successful:', {
          userId: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          createdAt: data.user.created_at,
          isNewUser: this.isNewUser
        });

        // Check if this is a new user (just signed up) or existing user
        this.isNewUser = data.user.email_confirmed_at === data.user.created_at || 
                        new Date(data.user.created_at).getTime() > Date.now() - 300000; // Within last 5 minutes

        console.log('👤 User classification:', {
          isNewUser: this.isNewUser,
          emailConfirmedAt: data.user.email_confirmed_at,
          createdAt: data.user.created_at,
          timeDiff: new Date(data.user.created_at).getTime() - Date.now()
        });

        this.status = 'success';
        this.message = this.isNewUser 
          ? 'Your email has been confirmed! Welcome to Task Flow.'
          : 'Your email has been confirmed successfully.';

        // Clean up the URL
        const callbackUrl = callback ? decodeURIComponent(callback) : '/';
        console.log('🔄 Cleaning URL and preparing redirect:', { callbackUrl });
        window.history.replaceState({}, '', callbackUrl);

        // Auto-redirect after a short delay
        setTimeout(() => {
          console.log('🚀 Auto-redirecting user:', { isNewUser: this.isNewUser });
          if (this.isNewUser) {
            this.routerController.goToOnboarding();
          } else {
            this.routerController.goToDashboard();
          }
        }, 3000); // Increased from 2 to 3 seconds

      } else {
        console.error('❌ No user data returned from verifyOtp');
        throw new Error('Email confirmation failed - no user data returned');
      }

    } catch (error) {
      console.error('💥 Email confirmation error:', {
        error,
        errorName: error?.name,
        errorMessage: error?.message,
        errorStatus: error?.status,
        errorStatusCode: error?.status,
        stack: error?.stack
      });

      this.status = 'error';
      
      // Handle specific error cases
      if (error?.name === 'AuthRetryableFetchError') {
        this.message = 'Connection timeout occurred. Your email may already be confirmed. Try signing in.';
      } else if (error?.message?.includes('Token has expired')) {
        this.message = 'This confirmation link has expired. Please request a new confirmation email.';
      } else if (error?.message?.includes('Invalid token')) {
        this.message = 'This confirmation link is invalid or has already been used.';
      } else if (error?.message?.includes('timeout') || error?.message?.includes('504')) {
        this.message = 'Server timeout occurred. Your email may already be confirmed. Try signing in.';
      } else if (error?.status === 504) {
        this.message = 'Gateway timeout - your email may already be confirmed. Please try signing in.';
      } else {
        this.message = error?.message || 'Email confirmation failed. Please try again or contact support.';
      }

      // Log additional debugging info
      console.log('🔧 Debug info:', {
        currentUrl: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
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
            <h1 class="status-title">Confirmation Issue</h1>
            <p class="status-message">${this.message}</p>
            
            <div class="actions">
              <sl-button variant="primary" @click=${() => this.routerController.goToSignIn()}>
                Try Sign In Instead
              </sl-button>
              <sl-button variant="default" @click=${this.handleResendConfirmation}>
                Resend Confirmation Email
              </sl-button>
              <sl-button variant="default" @click=${this.handleManualCheck}>
                Check if Already Confirmed
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
    // In a real app, you'd prompt for email and resend confirmation
    // For now, redirect to sign up
    this.routerController.goToSignUp();
  }

  private async handleManualCheck() {
    console.log('🔄 Manual confirmation check requested');
    this.status = 'loading';
    await this.checkCurrentSession();
    
    // If still loading after session check, that means we need to try the original flow
    if (this.status === 'loading') {
      await this.handleEmailConfirmation();
    }
  }
}

