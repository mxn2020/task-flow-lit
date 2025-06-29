// Enhanced onboarding-page.ts with profile collection step

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface UserProfileData {
  fullName: string;
  company?: string;
  role?: string;
  usageType: 'personal' | 'business' | 'education' | 'other';
  teamSize?: string;
  industry?: string;
  timezone?: string;
  phoneNumber?: string;
}

export interface UserPreferences {
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  weekStart: 'sunday' | 'monday';
  timezone?: string;
  notifications: {
    email: boolean;
    desktop: boolean;
    mobile: boolean;
  };
  theme: 'system' | 'light' | 'dark';
  emailFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
}

@customElement('onboarding-page')
export class OnboardingPage extends LitElement {
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

    .onboarding-card {
      width: 100%;
      max-width: 650px;
      border: none;
      box-shadow: var(--sl-shadow-x-large);
    }

    .step-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .step-progress {
      margin-bottom: 2rem;
    }

    .step-indicators {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .step-dot {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: var(--sl-border-radius-circle);
      background-color: var(--sl-color-neutral-300);
      transition: all 0.3s ease;
    }

    .step-dot.active {
      background-color: var(--sl-color-primary-600);
      transform: scale(1.2);
    }

    .step-dot.completed {
      background-color: var(--sl-color-success-600);
    }

    .step-info {
      text-align: center;
    }

    .step-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .step-title {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .step-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0;
      line-height: 1.5;
    }

    .step-content {
      margin: 2rem 0;
      max-height: 60vh;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .form-section {
      margin-bottom: 1.5rem;
    }

    .form-section-title {
      font-size: 1.1rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-grid.single {
      grid-template-columns: 1fr;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      margin-top: 2rem;
    }

    .usage-type-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .usage-type-card {
      border: 2px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }

    .usage-type-card:hover {
      border-color: var(--sl-color-primary-300);
      transform: translateY(-2px);
    }

    .usage-type-card.selected {
      border-color: var(--sl-color-primary-600);
      background-color: var(--sl-color-primary-50);
    }

    .usage-type-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .usage-type-title {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.25rem 0;
    }

    .usage-type-description {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    .preferences-grid {
      display: grid;
      gap: 1.5rem;
    }

    .preference-group {
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
    }

    .preference-group-title {
      font-size: 1rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .notification-grid {
      display: grid;
      gap: 0.75rem;
    }

    .notification-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;
    }

    .notification-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .email-preview {
      background: var(--sl-color-neutral-100);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      margin-top: 1rem;
    }

    .email-readonly {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-700);
    }

    .skip-link {
      color: var(--sl-color-neutral-500);
      text-decoration: none;
      font-size: var(--sl-font-size-small);
      text-align: center;
      margin-top: 1rem;
      display: block;
    }

    .skip-link:hover {
      color: var(--sl-color-neutral-700);
      text-decoration: underline;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .onboarding-card {
        max-width: 100%;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .usage-type-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background: linear-gradient(135deg, var(--sl-color-neutral-900) 0%, var(--sl-color-neutral-800) 100%);
    }

    :host(.sl-theme-dark) .step-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .step-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .form-section-title,
    :host(.sl-theme-dark) .preference-group-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .usage-type-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .usage-type-card.selected {
      background-color: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .usage-type-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .preference-group {
      background: var(--sl-color-neutral-800);
    }

    :host(.sl-theme-dark) .email-preview {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-600);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;

  @state() private currentStep = 1;
  @state() private totalSteps = 4;
  @state() private isSubmitting = false;
  @state() private error = '';

  // Profile data
  @state() private profileData: UserProfileData = {
    fullName: '',
    usageType: 'business'
  };

  // User preferences
  @state() private preferences: UserPreferences = {
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    weekStart: 'sunday',
    notifications: {
      email: true,
      desktop: true,
      mobile: false
    },
    theme: 'system',
    emailFrequency: 'daily'
  };

  // Other state
  @state() private teamName = '';
  @state() private selectedPlan = 'free';

  private steps: OnboardingStep[] = [
    { id: 1, title: 'Complete Your Profile', subtitle: 'Tell us a bit about yourself and your preferences', icon: '👤' },
    { id: 2, title: 'Set Your Preferences', subtitle: 'Customize your workspace experience', icon: '⚙️' },
    { id: 3, title: 'Create Your Team', subtitle: 'Give your team a name to get started', icon: '🏢' },
    { id: 4, title: 'Welcome to Task Flow!', subtitle: 'You\'re all set to start organizing', icon: '🎉' }
  ];

  connectedCallback() {
    super.connectedCallback();
    this.loadUserData();
  }

  private loadUserData() {
    const user = this.stateController.state.user;
    if (user) {
      // Pre-populate from auth user data
      this.profileData = {
        ...this.profileData,
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || ''
      };
    }
  }

  render() {
    const currentStepData = this.steps[this.currentStep - 1];

    return html`
      <div class="container">
        <sl-card class="onboarding-card">
          <div class="step-header">
            <div class="step-progress">
              <div class="step-indicators">
                ${Array.from({ length: this.totalSteps }, (_, i) => {
                  const stepNum = i + 1;
                  let className = 'step-dot';
                  if (stepNum < this.currentStep) className += ' completed';
                  else if (stepNum === this.currentStep) className += ' active';
                  
                  return html`<div class="${className}"></div>`;
                })}
              </div>
              
              <sl-progress-bar 
                value=${((this.currentStep - 1) / (this.totalSteps - 1)) * 100}
                style="--height: 4px;"
              ></sl-progress-bar>
            </div>
            
            <div class="step-info">
              <div class="step-icon">${currentStepData.icon}</div>
              <h1 class="step-title">${currentStepData.title}</h1>
              <p class="step-subtitle">${currentStepData.subtitle}</p>
            </div>
          </div>

          <div class="step-content">
            ${this.renderStepContent()}
          </div>
        </sl-card>
      </div>
    `;
  }

  private renderStepContent() {
    switch (this.currentStep) {
      case 1:
        return this.renderProfileStep();
      case 2:
        return this.renderPreferencesStep();
      case 3:
        return this.renderTeamStep();
      case 4:
        return this.renderSuccessStep();
      default:
        return html``;
    }
  }

  private renderProfileStep() {
    const user = this.stateController.state.user;
    const userEmail = user?.email || '';

    return html`
      ${this.error ? html`
        <sl-alert variant="danger" open closable @sl-hide=${() => this.error = ''}>
          <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
          <strong>Error:</strong> ${this.error}
        </sl-alert>
      ` : ''}

      <form @submit=${this.handleProfileSubmit}>
        <div class="form-section">
          <h3 class="form-section-title">
            <sl-icon name="person"></sl-icon>
            Basic Information
          </h3>
          
          <div class="email-preview">
            <sl-input
              label="Email Address"
              value=${userEmail}
              readonly
              help-text="This email is linked to your account"
            >
              <sl-icon slot="prefix" name="envelope"></sl-icon>
            </sl-input>
          </div>

          <div class="form-grid">
            <sl-input
              label="Full Name"
              placeholder="Enter your full name"
              .value=${this.profileData.fullName}
              @sl-input=${(e: CustomEvent) => this.profileData = {...this.profileData, fullName: (e.target as any).value}}
              required
            >
              <sl-icon slot="prefix" name="person"></sl-icon>
            </sl-input>

            <sl-input
              label="Phone Number (Optional)"
              placeholder="+1 (555) 000-0000"
              .value=${this.profileData.phoneNumber || ''}
              @sl-input=${(e: CustomEvent) => this.profileData = {...this.profileData, phoneNumber: (e.target as any).value}}
            >
              <sl-icon slot="prefix" name="telephone"></sl-icon>
            </sl-input>
          </div>
        </div>

        <div class="form-section">
          <h3 class="form-section-title">
            <sl-icon name="briefcase"></sl-icon>
            Professional Information (Optional)
          </h3>
          
          <div class="form-grid">
            <sl-input
              label="Company/Organization"
              placeholder="Acme Inc."
              .value=${this.profileData.company || ''}
              @sl-input=${(e: CustomEvent) => this.profileData = {...this.profileData, company: (e.target as any).value}}
            >
              <sl-icon slot="prefix" name="building"></sl-icon>
            </sl-input>

            <sl-input
              label="Role/Title"
              placeholder="Product Manager"
              .value=${this.profileData.role || ''}
              @sl-input=${(e: CustomEvent) => this.profileData = {...this.profileData, role: (e.target as any).value}}
            >
              <sl-icon slot="prefix" name="award"></sl-icon>
            </sl-input>
          </div>

          <div class="form-grid">
            <sl-select
              label="Industry"
              placeholder="Select your industry"
              .value=${this.profileData.industry || ''}
              @sl-change=${(e: CustomEvent) => this.profileData = {...this.profileData, industry: (e.target as any).value}}
            >
              <sl-option value="technology">Technology</sl-option>
              <sl-option value="healthcare">Healthcare</sl-option>
              <sl-option value="finance">Finance</sl-option>
              <sl-option value="education">Education</sl-option>
              <sl-option value="retail">Retail</sl-option>
              <sl-option value="manufacturing">Manufacturing</sl-option>
              <sl-option value="consulting">Consulting</sl-option>
              <sl-option value="nonprofit">Non-profit</sl-option>
              <sl-option value="government">Government</sl-option>
              <sl-option value="other">Other</sl-option>
            </sl-select>

            <sl-select
              label="Team Size"
              placeholder="Select your team size"
              .value=${this.profileData.teamSize || ''}
              @sl-change=${(e: CustomEvent) => this.profileData = {...this.profileData, teamSize: (e.target as any).value}}
            >
              <sl-option value="just-me">Just me</sl-option>
              <sl-option value="2-5">2-5 people</sl-option>
              <sl-option value="6-10">6-10 people</sl-option>
              <sl-option value="11-25">11-25 people</sl-option>
              <sl-option value="26-50">26-50 people</sl-option>
              <sl-option value="51-100">51-100 people</sl-option>
              <sl-option value="100+">100+ people</sl-option>
            </sl-select>
          </div>
        </div>

        <div class="form-section">
          <h3 class="form-section-title">
            <sl-icon name="flag"></sl-icon>
            How will you use Task Flow?
          </h3>
          
          <div class="usage-type-grid">
            <div 
              class="usage-type-card ${this.profileData.usageType === 'personal' ? 'selected' : ''}"
              @click=${() => this.profileData = {...this.profileData, usageType: 'personal'}}
            >
              <div class="usage-type-icon">👤</div>
              <div class="usage-type-title">Personal</div>
              <div class="usage-type-description">Personal projects & tasks</div>
            </div>
            
            <div 
              class="usage-type-card ${this.profileData.usageType === 'business' ? 'selected' : ''}"
              @click=${() => this.profileData = {...this.profileData, usageType: 'business'}}
            >
              <div class="usage-type-icon">💼</div>
              <div class="usage-type-title">Business</div>
              <div class="usage-type-description">Team & work projects</div>
            </div>
            
            <div 
              class="usage-type-card ${this.profileData.usageType === 'education' ? 'selected' : ''}"
              @click=${() => this.profileData = {...this.profileData, usageType: 'education'}}
            >
              <div class="usage-type-icon">🎓</div>
              <div class="usage-type-title">Education</div>
              <div class="usage-type-description">Academic projects</div>
            </div>
            
            <div 
              class="usage-type-card ${this.profileData.usageType === 'other' ? 'selected' : ''}"
              @click=${() => this.profileData = {...this.profileData, usageType: 'other'}}
            >
              <div class="usage-type-icon">🔧</div>
              <div class="usage-type-title">Other</div>
              <div class="usage-type-description">Something else</div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <sl-button variant="default" href="/auth/sign-in">
            <sl-icon slot="prefix" name="arrow-left"></sl-icon>
            Back to Sign In
          </sl-button>
          <sl-button
            type="submit"
            variant="primary"
            size="large"
            ?loading=${this.isSubmitting}
            ?disabled=${!this.profileData.fullName.trim()}
          >
            <sl-icon slot="suffix" name="arrow-right"></sl-icon>
            Continue
          </sl-button>
        </div>

        <a href="#" class="skip-link" @click=${this.handleSkipStep}>
          Skip this step for now
        </a>
      </form>
    `;
  }

  private renderPreferencesStep() {
    return html`
      <div class="preferences-grid">
        <div class="preference-group">
          <h3 class="preference-group-title">
            <sl-icon name="globe"></sl-icon>
            Regional Settings
          </h3>
          
          <div class="form-grid">
            <sl-select
              label="Language"
              .value=${this.preferences.language}
              @sl-change=${(e: CustomEvent) => this.preferences = {...this.preferences, language: (e.target as any).value}}
            >
              <sl-option value="en">English</sl-option>
              <sl-option value="es">Español</sl-option>
              <sl-option value="fr">Français</sl-option>
              <sl-option value="de">Deutsch</sl-option>
              <sl-option value="pt">Português</sl-option>
            </sl-select>

            <sl-select
              label="Timezone"
              .value=${this.preferences.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
              @sl-change=${(e: CustomEvent) => this.preferences = {...this.preferences, timezone: (e.target as any).value}}
            >
              <sl-option value="America/New_York">Eastern Time (ET)</sl-option>
              <sl-option value="America/Chicago">Central Time (CT)</sl-option>
              <sl-option value="America/Denver">Mountain Time (MT)</sl-option>
              <sl-option value="America/Los_Angeles">Pacific Time (PT)</sl-option>
              <sl-option value="Europe/London">London (GMT)</sl-option>
              <sl-option value="Europe/Paris">Paris (CET)</sl-option>
              <sl-option value="Asia/Tokyo">Tokyo (JST)</sl-option>
              <sl-option value="Australia/Sydney">Sydney (AEST)</sl-option>
            </sl-select>
          </div>

          <div class="form-grid">
            <sl-select
              label="Date Format"
              .value=${this.preferences.dateFormat}
              @sl-change=${(e: CustomEvent) => this.preferences = {...this.preferences, dateFormat: (e.target as any).value}}
            >
              <sl-option value="MM/DD/YYYY">MM/DD/YYYY (US)</sl-option>
              <sl-option value="DD/MM/YYYY">DD/MM/YYYY (EU)</sl-option>
              <sl-option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</sl-option>
            </sl-select>

            <sl-select
              label="Time Format"
              .value=${this.preferences.timeFormat}
              @sl-change=${(e: CustomEvent) => this.preferences = {...this.preferences, timeFormat: (e.target as any).value}}
            >
              <sl-option value="12h">12 hour (AM/PM)</sl-option>
              <sl-option value="24h">24 hour</sl-option>
            </sl-select>
          </div>
        </div>

        <div class="preference-group">
          <h3 class="preference-group-title">
            <sl-icon name="bell"></sl-icon>
            Notification Preferences
          </h3>
          
          <div class="notification-grid">
            <div class="notification-item">
              <div class="notification-label">
                <sl-icon name="envelope"></sl-icon>
                Email notifications
              </div>
              <sl-switch
                .checked=${this.preferences.notifications.email}
                @sl-change=${(e: CustomEvent) => this.preferences = {
                  ...this.preferences,
                  notifications: {
                    ...this.preferences.notifications,
                    email: (e.target as any).checked
                  }
                }}
              ></sl-switch>
            </div>

            <div class="notification-item">
              <div class="notification-label">
                <sl-icon name="display"></sl-icon>
                Desktop notifications
              </div>
              <sl-switch
                .checked=${this.preferences.notifications.desktop}
                @sl-change=${(e: CustomEvent) => this.preferences = {
                  ...this.preferences,
                  notifications: {
                    ...this.preferences.notifications,
                    desktop: (e.target as any).checked
                  }
                }}
              ></sl-switch>
            </div>

            <div class="notification-item">
              <div class="notification-label">
                <sl-icon name="phone"></sl-icon>
                Mobile notifications
              </div>
              <sl-switch
                .checked=${this.preferences.notifications.mobile}
                @sl-change=${(e: CustomEvent) => this.preferences = {
                  ...this.preferences,
                  notifications: {
                    ...this.preferences.notifications,
                    mobile: (e.target as any).checked
                  }
                }}
              ></sl-switch>
            </div>
          </div>

          <sl-select
            label="Email Frequency"
            .value=${this.preferences.emailFrequency}
            @sl-change=${(e: CustomEvent) => this.preferences = {...this.preferences, emailFrequency: (e.target as any).value}}
            style="margin-top: 1rem;"
          >
            <sl-option value="immediate">Immediate</sl-option>
            <sl-option value="daily">Daily digest</sl-option>
            <sl-option value="weekly">Weekly summary</sl-option>
            <sl-option value="never">Never</sl-option>
          </sl-select>
        </div>

        <div class="preference-group">
          <h3 class="preference-group-title">
            <sl-icon name="palette"></sl-icon>
            Appearance
          </h3>
          
          <sl-select
            label="Theme"
            .value=${this.preferences.theme}
            @sl-change=${(e: CustomEvent) => this.preferences = {...this.preferences, theme: (e.target as any).value}}
          >
            <sl-option value="system">System (auto)</sl-option>
            <sl-option value="light">Light</sl-option>
            <sl-option value="dark">Dark</sl-option>
          </sl-select>

          <sl-select
            label="Week starts on"
            .value=${this.preferences.weekStart}
            @sl-change=${(e: CustomEvent) => this.preferences = {...this.preferences, weekStart: (e.target as any).value}}
          >
            <sl-option value="sunday">Sunday</sl-option>
            <sl-option value="monday">Monday</sl-option>
          </sl-select>
        </div>
      </div>

      <div class="form-actions">
        <sl-button variant="default" @click=${() => this.currentStep = 1}>
          <sl-icon slot="prefix" name="arrow-left"></sl-icon>
          Back
        </sl-button>
        <sl-button
          variant="primary"
          size="large"
          @click=${this.handlePreferencesSubmit}
          ?loading=${this.isSubmitting}
        >
          <sl-icon slot="suffix" name="arrow-right"></sl-icon>
          Continue
        </sl-button>
      </div>

      <a href="#" class="skip-link" @click=${this.handleSkipStep}>
        Skip and use defaults
      </a>
    `;
  }

  private renderTeamStep() {
    return html`
      <div class="form-section">
        <sl-input
          label="Team Name"
          placeholder="e.g., My Awesome Team"
          .value=${this.teamName}
          @sl-input=${(e: CustomEvent) => this.teamName = (e.target as any).value}
          required
          help-text="You can always change this later in team settings"
          size="large"
        >
          <sl-icon slot="prefix" name="building"></sl-icon>
        </sl-input>
      </div>

      <div class="form-actions">
        <sl-button variant="default" @click=${() => this.currentStep = 2}>
          <sl-icon slot="prefix" name="arrow-left"></sl-icon>
          Back
        </sl-button>
        <sl-button
          variant="primary"
          size="large"
          @click=${this.handleTeamSubmit}
          ?loading=${this.isSubmitting}
          ?disabled=${!this.teamName.trim()}
        >
          <sl-icon slot="suffix" name="rocket"></sl-icon>
          Complete Setup
        </sl-button>
      </div>
    `;
  }

  private renderSuccessStep() {
    return html`
      <div class="success-content">
        <div class="success-animation">
          <div class="success-icon">🎉</div>
          <h2 class="success-title">Welcome to Task Flow!</h2>
          <p class="success-text">
            Your profile and team "<strong>${this.teamName}</strong>" have been set up successfully. 
            You're all set to start organizing your work and collaborating with your team.
          </p>
        </div>

        <sl-alert variant="success" open>
          <sl-icon slot="icon" name="check-circle"></sl-icon>
          <strong>Setup Complete!</strong> Your workspace is ready and you can start creating scopes and managing tasks.
        </sl-alert>

        <div class="success-actions">
          <sl-button
            variant="primary"
            size="large"
            @click=${this.handleGetStarted}
          >
            <sl-icon slot="prefix" name="rocket"></sl-icon>
            Go to Dashboard
          </sl-button>
          
          <sl-button
            variant="default"
            @click=${this.handleExploreFeatures}
          >
            <sl-icon slot="prefix" name="compass"></sl-icon>
            Explore Features
          </sl-button>
        </div>
      </div>
    `;
  }

  private async handleProfileSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting || !this.profileData.fullName.trim()) return;
    
    this.isSubmitting = true;
    this.error = '';

    try {
      // Update the personal account with profile information
      const result = await this.stateController.updatePersonalAccountInfo(this.profileData);
      
      if (result.error) {
        this.error = result.error;
      } else {
        this.currentStep = 2;
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to save profile';
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handlePreferencesSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.error = '';

    try {
      // Update the personal account with user preferences
      const result = await this.stateController.updatePersonalAccountSettings(this.preferences);
      
      if (result.error) {
        this.error = result.error;
      } else {
        this.currentStep = 3;
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to save preferences';
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleTeamSubmit() {
    if (this.isSubmitting || !this.teamName.trim()) return;
    
    this.isSubmitting = true;
    this.error = '';

    try {
      // Create team account
      const { data, error } = await this.stateController.createTeamAccount(this.teamName.trim());
      
      if (error) {
        this.error = error;
      } else if (data) {
        // Mark onboarding as completed
        await this.stateController.completeOnboarding({
          team_created: true,
          team_name: this.teamName.trim(),
          onboarding_flow_version: '1.0'
        });
        
        this.currentStep = 4;
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to create team';
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleSkipStep(event: Event) {
    event.preventDefault();
    
    if (this.currentStep === 1) {
      // Skip profile step, just move to preferences with basic data
      this.profileData.fullName = this.profileData.fullName || 'User';
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      // Skip preferences step, use defaults
      this.currentStep = 3;
    }
  }

  private handleGetStarted() {
    if (this.stateController.state.currentAccount?.slug) {
      this.routerController.goToTeam(this.stateController.state.currentAccount.slug);
    } else {
      this.routerController.goToDashboard();
    }
  }

  private handleExploreFeatures() {
    // Navigate to a features tour or documentation
    window.open('/docs/getting-started', '_blank');
  }
  
}

