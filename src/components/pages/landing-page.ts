import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('landing-page')
export class LandingPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--sl-color-primary-50) 0%, var(--sl-color-warning-50) 100%);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--sl-color-primary-700);
    }

    .nav-actions {
      display: flex;
      gap: 1rem;
    }

    .hero {
      text-align: center;
      padding: 4rem 0 6rem;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: bold;
      color: var(--sl-color-neutral-900);
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--sl-color-neutral-600);
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      padding: 4rem 0;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: var(--sl-border-radius-large);
      box-shadow: var(--sl-shadow-medium);
      text-align: center;
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.5rem;
    }

    .feature-description {
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
    }

    .footer {
      text-align: center;
      padding: 2rem 0;
      color: var(--sl-color-neutral-500);
      border-top: 1px solid var(--sl-color-neutral-200);
      margin-top: 4rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.125rem;
      }

      .nav-actions {
        flex-direction: column;
        gap: 0.5rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .features {
        grid-template-columns: 1fr;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .logo {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .hero-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .hero-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .feature-card {
      background: var(--sl-color-neutral-800);
      border: 1px solid var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .feature-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .feature-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .footer {
      border-top-color: var(--sl-color-neutral-700);
      color: var(--sl-color-neutral-500);
    }
  `;

  render() {
    return html`
      <div class="container">
        <header class="header">
          <div class="logo">Task Flow</div>
          <nav class="nav-actions">
            <sl-button variant="default" href="/auth/sign-in">Sign In</sl-button>
            <sl-button variant="primary" href="/auth/sign-up">Get Started</sl-button>
          </nav>
        </header>

        <section class="hero">
          <h1 class="hero-title">Organize Your Work,<br>Amplify Your Flow</h1>
          <p class="hero-subtitle">
            Task Flow helps teams and individuals organize their work with flexible scopes, 
            intelligent task management, and seamless collaboration tools.
          </p>
          <div class="cta-buttons">
            <sl-button variant="primary" size="large" href="/auth/sign-up">
              Start Free Today
            </sl-button>
            <sl-button variant="default" size="large" href="/auth/sign-in">
              Sign In to Continue
            </sl-button>
          </div>
        </section>

        <section class="features">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Flexible Scopes</h3>
            <p class="feature-description">
              Organize your work with customizable scopes - from simple todos to complex projects. 
              Each scope adapts to your workflow needs.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3 class="feature-title">Lightning Fast</h3>
            <p class="feature-description">
              Built for speed and performance. Create, update, and manage your tasks with 
              minimal friction and maximum efficiency.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3 class="feature-title">Team Collaboration</h3>
            <p class="feature-description">
              Work together seamlessly with team accounts, role-based permissions, 
              and real-time collaboration features.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3 class="feature-title">Smart Analytics</h3>
            <p class="feature-description">
              Gain insights into your productivity with detailed analytics, 
              progress tracking, and performance metrics.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3 class="feature-title">Secure & Private</h3>
            <p class="feature-description">
              Your data is protected with enterprise-grade security, 
              privacy controls, and reliable cloud infrastructure.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">Customizable</h3>
            <p class="feature-description">
              Tailor your workspace with custom fields, labels, categories, 
              and themes that match your workflow.
            </p>
          </div>
        </section>

        <footer class="footer">
          <p>&copy; 2025 Task Flow. Built with modern web technologies.</p>
        </footer>
      </div>
    `;
  }
}

