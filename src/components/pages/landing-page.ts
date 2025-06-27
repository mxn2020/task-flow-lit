// src/components/pages/landing-page.ts
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

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
      padding: 1.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-700);
      text-decoration: none;
    }

    .logo sl-icon {
      font-size: 2rem;
    }

    .nav-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .hero {
      text-align: center;
      padding: 6rem 0 8rem;
    }

    .hero-badge {
      margin-bottom: 2rem;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 1.5rem;
      line-height: 1.1;
      background: linear-gradient(135deg, var(--sl-color-primary-600), var(--sl-color-warning-600));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--sl-color-neutral-600);
      margin-bottom: 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
    }

    .trust-indicators {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
      opacity: 0.7;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      padding: 4rem 0;
    }

    .feature-card {
      text-align: center;
      border: none;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--sl-shadow-x-large);
      background: rgba(255, 255, 255, 0.95);
    }

    .feature-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .feature-icon {
      font-size: 3rem;
      width: 4rem;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--sl-color-primary-100), var(--sl-color-warning-100));
      border-radius: var(--sl-border-radius-circle);
      border: 2px solid rgba(255, 255, 255, 0.5);
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0;
    }

    .feature-description {
      color: var(--sl-color-neutral-600);
      line-height: 1.6;
      margin: 0;
    }

    .cta-section {
      text-align: center;
      padding: 4rem 0;
      background: linear-gradient(135deg, var(--sl-color-primary-600), var(--sl-color-warning-600));
      border-radius: var(--sl-border-radius-large);
      margin: 4rem 0;
      color: white;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: var(--sl-font-weight-bold);
      margin-bottom: 1rem;
      color: white;
    }

    .cta-subtitle {
      font-size: 1.125rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .pricing-preview {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }

    .price-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem 1.5rem;
      border-radius: var(--sl-border-radius-medium);
      backdrop-filter: blur(10px);
    }

    .price-label {
      font-size: var(--sl-font-size-small);
      opacity: 0.8;
      margin-bottom: 0.25rem;
    }

    .price-value {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-bold);
    }

    .footer {
      text-align: center;
      padding: 3rem 0;
      color: var(--sl-color-neutral-500);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      margin-top: 4rem;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .footer-links {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .footer-link {
      color: var(--sl-color-neutral-600);
      text-decoration: none;
      font-size: var(--sl-font-size-small);
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: var(--sl-color-primary-600);
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.125rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .nav-actions {
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .features {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .trust-indicators {
        flex-direction: column;
        gap: 1rem;
      }

      .footer-content {
        flex-direction: column;
        text-align: center;
      }

      .pricing-preview {
        flex-direction: column;
        align-items: center;
      }

      .cta-title {
        font-size: 2rem;
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
      background: linear-gradient(135deg, var(--sl-color-primary-400), var(--sl-color-warning-400));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    :host(.sl-theme-dark) .hero-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .feature-card {
      background: rgba(0, 0, 0, 0.4);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .feature-card:hover {
      background: rgba(0, 0, 0, 0.6);
    }

    :host(.sl-theme-dark) .feature-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .feature-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .trust-item {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .footer {
      border-top-color: var(--sl-color-neutral-700);
      color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .footer-link {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .footer-link:hover {
      color: var(--sl-color-primary-400);
    }
  `;

  private features: Feature[] = [
    {
      icon: '🎯',
      title: 'Flexible Scopes',
      description: 'Organize your work with customizable scopes - from simple todos to complex projects. Each scope adapts to your workflow needs.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built for speed and performance. Create, update, and manage your tasks with minimal friction and maximum efficiency.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Work together seamlessly with team accounts, role-based permissions, and real-time collaboration features.'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Gain insights into your productivity with detailed analytics, progress tracking, and performance metrics.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security, privacy controls, and reliable cloud infrastructure.'
    },
    {
      icon: '🎨',
      title: 'Customizable',
      description: 'Tailor your workspace with custom fields, labels, categories, and themes that match your workflow.'
    }
  ];

  render() {
    return html`
      <div class="container">
        <header class="header">
          <a href="/" class="logo">
            <sl-icon name="layers"></sl-icon>
            Task Flow
          </a>
          <nav class="nav-actions">
            <sl-button variant="default" href="/auth/sign-in">
              <sl-icon slot="prefix" name="box-arrow-in-right"></sl-icon>
              Sign In
            </sl-button>
            <sl-button variant="primary" href="/auth/sign-up">
              <sl-icon slot="prefix" name="rocket"></sl-icon>
              Get Started Free
            </sl-button>
          </nav>
        </header>

        <section class="hero">
          <sl-badge variant="primary" pill class="hero-badge">
            <sl-icon slot="prefix" name="star-fill"></sl-icon>
            Now in Beta - Free for Early Users
          </sl-badge>
          
          <h1 class="hero-title">Organize Your Work,<br>Amplify Your Flow</h1>
          <p class="hero-subtitle">
            Task Flow helps teams and individuals organize their work with flexible scopes, 
            intelligent task management, and seamless collaboration tools. Built for the modern workflow.
          </p>
          
          <div class="cta-buttons">
            <sl-button variant="primary" size="large" href="/auth/sign-up">
              <sl-icon slot="prefix" name="rocket"></sl-icon>
              Start Free Today
            </sl-button>
            <sl-button variant="default" size="large" href="/auth/sign-in">
              <sl-icon slot="prefix" name="play"></sl-icon>
              Watch Demo
            </sl-button>
          </div>

          <div class="trust-indicators">
            <div class="trust-item">
              <sl-icon name="shield-check"></sl-icon>
              <span>Enterprise Security</span>
            </div>
            <div class="trust-item">
              <sl-icon name="clock"></sl-icon>
              <span>Setup in 2 Minutes</span>
            </div>
            <div class="trust-item">
              <sl-icon name="credit-card"></sl-icon>
              <span>No Credit Card Required</span>
            </div>
          </div>
        </section>

        <section class="features">
          ${this.features.map(feature => html`
            <sl-card class="feature-card">
              <div class="feature-header">
                <div class="feature-icon">${feature.icon}</div>
                <h3 class="feature-title">${feature.title}</h3>
              </div>
              <p class="feature-description">${feature.description}</p>
            </sl-card>
          `)}
        </section>

        <section class="cta-section">
          <h2 class="cta-title">Ready to Transform Your Workflow?</h2>
          <p class="cta-subtitle">
            Join thousands of teams who have already made the switch to smarter task management.
          </p>

          <div class="pricing-preview">
            <div class="price-item">
              <div class="price-label">Free Plan</div>
              <div class="price-value">$0/month</div>
            </div>
            <div class="price-item">
              <div class="price-label">Pro Plan</div>
              <div class="price-value">$9/month</div>
            </div>
            <div class="price-item">
              <div class="price-label">Team Plan</div>
              <div class="price-value">$19/month</div>
            </div>
          </div>

          <div class="cta-buttons">
            <sl-button variant="default" size="large" style="--sl-color-neutral-0: white;">
              <sl-icon slot="prefix" name="rocket"></sl-icon>
              Start Your Free Trial
            </sl-button>
            <sl-button variant="text" size="large" style="color: white;">
              <sl-icon slot="prefix" name="telephone"></sl-icon>
              Talk to Sales
            </sl-button>
          </div>
        </section>

        <footer class="footer">
          <div class="footer-content">
            <div class="logo">
              <sl-icon name="layers"></sl-icon>
              Task Flow
            </div>
            
            <div class="footer-links">
              <a href="/privacy" class="footer-link">Privacy Policy</a>
              <a href="/terms" class="footer-link">Terms of Service</a>
              <a href="/support" class="footer-link">Support</a>
              <a href="/docs" class="footer-link">Documentation</a>
              <a href="/blog" class="footer-link">Blog</a>
            </div>
          </div>
          
          <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(0,0,0,0.1);">
            <p>&copy; 2025 Task Flow. Built with modern web technologies and ❤️</p>
          </div>
        </footer>
      </div>
    `;
  }
}

