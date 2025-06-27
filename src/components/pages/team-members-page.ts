// src/components/pages/team-members-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import '../layout/app-sidebar';

interface UpcomingFeature {
  icon: string;
  title: string;
  description: string;
}

@customElement('team-members-page')
export class TeamMembersPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    .page-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    .coming-soon-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-section {
      text-align: center;
      padding: 3rem 2rem;
      background: linear-gradient(135deg, var(--sl-color-primary-50), var(--sl-color-warning-50));
      border-radius: var(--sl-border-radius-large);
      margin-bottom: 3rem;
    }

    .hero-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      display: block;
    }

    .hero-title {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 1rem 0;
    }

    .hero-description {
      color: var(--sl-color-neutral-600);
      font-size: 1.125rem;
      line-height: 1.6;
      margin: 0 0 2rem 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .features-section {
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 1.5rem 0;
      text-align: center;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      border: none;
      transition: transform 0.2s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
    }

    .feature-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .feature-icon {
      font-size: 2rem;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--sl-color-primary-100);
      border-radius: var(--sl-border-radius-circle);
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

    .status-section {
      text-align: center;
      padding: 2rem;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-large);
      border: 2px dashed var(--sl-color-neutral-300);
    }

    .status-timeline {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }

    .timeline-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      max-width: 150px;
    }

    .timeline-icon {
      width: 3rem;
      height: 3rem;
      border-radius: var(--sl-border-radius-circle);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: white;
    }

    .timeline-icon.completed {
      background: var(--sl-color-success-600);
    }

    .timeline-icon.current {
      background: var(--sl-color-warning-600);
    }

    .timeline-icon.pending {
      background: var(--sl-color-neutral-400);
    }

    .timeline-label {
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-700);
      text-align: center;
    }

    .timeline-status {
      font-size: var(--sl-font-size-x-small);
      color: var(--sl-color-neutral-500);
    }

    .newsletter-section {
      background: var(--sl-color-primary-50);
      padding: 2rem;
      border-radius: var(--sl-border-radius-large);
      text-align: center;
    }

    .newsletter-form {
      max-width: 400px;
      margin: 1.5rem auto 0;
      display: flex;
      gap: 0.75rem;
    }

    .newsletter-form sl-input {
      flex: 1;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .hero-section {
        padding: 2rem 1rem;
      }

      .hero-title {
        font-size: 1.5rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .status-timeline {
        flex-direction: column;
        align-items: center;
      }

      .newsletter-form {
        flex-direction: column;
      }
    }

    /* Dark theme */
    :host(.sl-theme-dark) .page-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .page-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .hero-section {
      background: linear-gradient(135deg, var(--sl-color-primary-900), var(--sl-color-warning-900));
    }

    :host(.sl-theme-dark) .hero-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .hero-description {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .feature-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .feature-description {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .feature-icon {
      background: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .status-section {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .timeline-label {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .timeline-status {
      color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .newsletter-section {
      background: var(--sl-color-primary-900);
    }
  `;

  @state() private emailAddress = '';
  @state() private isSubscribing = false;

  private upcomingFeatures: UpcomingFeature[] = [
    {
      icon: '👥',
      title: 'Invite Team Members',
      description: 'Send email invitations to team members with customizable welcome messages and onboarding flows.'
    },
    {
      icon: '🔐',
      title: 'Role-Based Permissions',
      description: 'Assign roles like Admin, Member, or Viewer with granular permissions for different team functions.'
    },
    {
      icon: '📊',
      title: 'Member Activity Tracking',
      description: 'Monitor team member activity, contributions, and engagement across all projects and scopes.'
    },
    {
      icon: '⚙️',
      title: 'Bulk Management',
      description: 'Manage multiple team members at once with bulk actions for roles, permissions, and access control.'
    },
    {
      icon: '🔔',
      title: 'Member Notifications',
      description: 'Configure notification preferences and communication settings for each team member.'
    },
    {
      icon: '📈',
      title: 'Team Analytics',
      description: 'View detailed analytics about team performance, collaboration patterns, and productivity metrics.'
    }
  ];

  render() {
    return html`
      <div class="page-layout">
        <app-sidebar 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .currentTeamSlug=${this.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">Team Members</h1>
            <p class="page-subtitle">Manage your team members, roles, and permissions</p>
          </div>

          <div class="page-content">
            <div class="coming-soon-container">
              ${this.renderHeroSection()}
              ${this.renderFeaturesSection()}
              ${this.renderStatusSection()}
              ${this.renderNewsletterSection()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderHeroSection() {
    return html`
      <div class="hero-section">
        <div class="hero-icon">👥</div>
        <h2 class="hero-title">Team Management Coming Soon!</h2>
        <p class="hero-description">
          We're building powerful team collaboration features that will transform how you work together. 
          Invite members, assign roles, and manage permissions all from one centralized dashboard.
        </p>
        
        <div class="hero-actions">
          <sl-button variant="primary" size="large" @click=${this.handleRequestAccess}>
            <sl-icon slot="prefix" name="bell"></sl-icon>
            Get Notified When Available
          </sl-button>
          <sl-button variant="default" size="large" @click=${this.handleViewRoadmap}>
            <sl-icon slot="prefix" name="map"></sl-icon>
            View Development Roadmap
          </sl-button>
        </div>
      </div>
    `;
  }

  private renderFeaturesSection() {
    return html`
      <div class="features-section">
        <h3 class="section-title">What's Coming</h3>
        <div class="features-grid">
          ${this.upcomingFeatures.map(feature => html`
            <sl-card class="feature-card">
              <div class="feature-header">
                <div class="feature-icon">${feature.icon}</div>
                <h4 class="feature-title">${feature.title}</h4>
              </div>
              <p class="feature-description">${feature.description}</p>
            </sl-card>
          `)}
        </div>
      </div>
    `;
  }

  private renderStatusSection() {
    return html`
      <div class="status-section">
        <h3 class="section-title">Development Progress</h3>
        <p style="color: var(--sl-color-neutral-600); margin-bottom: 2rem;">
          Track our progress as we build these exciting team management features.
        </p>
        
        <div class="status-timeline">
          <div class="timeline-item">
            <div class="timeline-icon completed">
              <sl-icon name="check"></sl-icon>
            </div>
            <div class="timeline-label">Research & Planning</div>
            <div class="timeline-status">Completed</div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-icon completed">
              <sl-icon name="check"></sl-icon>
            </div>
            <div class="timeline-label">Database Design</div>
            <div class="timeline-status">Completed</div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-icon current">
              <sl-icon name="gear"></sl-icon>
            </div>
            <div class="timeline-label">Core Development</div>
            <div class="timeline-status">In Progress</div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-icon pending">
              <sl-icon name="flask"></sl-icon>
            </div>
            <div class="timeline-label">Testing & QA</div>
            <div class="timeline-status">Next</div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-icon pending">
              <sl-icon name="rocket"></sl-icon>
            </div>
            <div class="timeline-label">Release</div>
            <div class="timeline-status">Q2 2025</div>
          </div>
        </div>

        <sl-alert variant="primary" open>
          <sl-icon slot="icon" name="info-circle"></sl-icon>
          <strong>Early Access Available:</strong> Want to test these features before they're released? 
          Join our beta program for early access and help shape the final product.
        </sl-alert>
      </div>
    `;
  }

  private renderNewsletterSection() {
    return html`
      <div class="newsletter-section">
        <h3 class="section-title">Stay Updated</h3>
        <p style="color: var(--sl-color-neutral-600); margin-bottom: 0;">
          Be the first to know when team management features are available. 
          We'll send you an email as soon as they're ready.
        </p>
        
        <form class="newsletter-form" @submit=${this.handleSubscribe}>
          <sl-input
            type="email"
            placeholder="Enter your email address"
            .value=${this.emailAddress}
            @sl-input=${(e: CustomEvent) => this.emailAddress = (e.target as any).value}
            required
          >
            <sl-icon slot="prefix" name="envelope"></sl-icon>
          </sl-input>
          <sl-button 
            type="submit" 
            variant="primary"
            ?loading=${this.isSubscribing}
            ?disabled=${!this.emailAddress.trim()}
          >
            <sl-icon slot="prefix" name="bell"></sl-icon>
            Notify Me
          </sl-button>
        </form>
      </div>
    `;
  }

  private handleRequestAccess() {
    // Scroll to newsletter section
    const newsletterSection = this.shadowRoot?.querySelector('.newsletter-section');
    newsletterSection?.scrollIntoView({ behavior: 'smooth' });
  }

  private handleViewRoadmap() {
    // Open roadmap in new tab (placeholder URL)
    window.open('/roadmap', '_blank');
  }

  private async handleSubscribe(event: Event) {
    event.preventDefault();
    
    if (!this.emailAddress.trim() || this.isSubscribing) return;
    
    this.isSubscribing = true;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      const alert = document.createElement('sl-alert');
      alert.variant = 'success';
      alert.closable = true;
      alert.innerHTML = `
        <sl-icon slot="icon" name="check-circle"></sl-icon>
        <strong>Success!</strong> You'll be notified when team management features are available.
      `;
      
      this.shadowRoot?.appendChild(alert);
      alert.show();
      
      // Clear form
      this.emailAddress = '';
      
      // Remove alert after 5 seconds
      setTimeout(() => {
        alert.remove();
      }, 5000);
      
    } catch (error) {
      // Show error message
      const alert = document.createElement('sl-alert');
      alert.variant = 'danger';
      alert.closable = true;
      alert.innerHTML = `
        <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
        <strong>Error:</strong> Failed to subscribe. Please try again later.
      `;
      
      this.shadowRoot?.appendChild(alert);
      alert.show();
      
      setTimeout(() => {
        alert.remove();
      }, 5000);
    } finally {
      this.isSubscribing = false;
    }
  }
}

