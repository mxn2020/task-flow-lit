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

    .sign-in-button {
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

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .sign-in-card {
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
  `;

  @property({ type: Object }) stateController!: StateController;

  @state() private email = '';
  @state() private password = '';
  @state() private isSubmitting = false;
  @state() private error = '';

  render() {
    return html`
      <div class="container">
        <div class="sign-in-card">
          <div class="logo">
            <div class="logo-text">Task Flow</div>
          </div>

          <h1 class="form-title">Welcome back</h1>
          <p class="form-subtitle">Sign in to your account to continue</p>

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

            <div class="form-group">
              <sl-input
                label="Password"
                type="password"
                placeholder="Enter your password"
                .value=${this.password}
                @sl-input=${(e: CustomEvent) => this.password = e.target.value}
                required
                autocomplete="current-password"
              ></sl-input>
            </div>

            <div class="form-actions">
              <sl-button
                class="sign-in-button"
                type="submit"
                variant="primary"
                size="large"
                ?loading=${this.isSubmitting}
                ?disabled=${!this.email || !this.password}
              >
                ${this.isSubmitting ? 'Signing in...' : 'Sign In'}
              </sl-button>
            </div>
          </form>

          <div class="divider">
            <span>or</span>
          </div>

          <div class="footer-links">
            <p>
              <a href="/auth/forgot-password">Forgot your password?</a>
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

  private async handleSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.error = '';

    try {
      const { error } = await this.stateController.signIn(this.email, this.password);
      
      if (error) {
        this.error = error;
      }
      // Success will be handled by the StateController's auth state listener
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Sign in failed';
    } finally {
      this.isSubmitting = false;
    }
  }
}

