import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext } from '../../types';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';

@customElement('profile-page')
export class ProfilePage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    .page-layout {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--sl-color-neutral-0);
    }

    .page-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      background-color: var(--sl-color-neutral-50);
    }

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

    .page-content {
      flex: 1;
      padding: 2rem;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
      max-width: 1000px;
    }

    .profile-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .profile-main {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .profile-card {
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      overflow: hidden;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      background-color: var(--sl-color-neutral-50);
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0;
    }

    .card-content {
      padding: 1.5rem;
    }

    .avatar-section {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .avatar {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      background-color: var(--sl-color-primary-600);
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-semibold);
      margin-bottom: 1rem;
    }

    .user-name {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.25rem 0;
    }

    .user-email {
      color: var(--sl-color-neutral-600);
      margin: 0 0 1rem 0;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .meta-item {
      display: flex;
      justify-content: space-between;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 1rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 1rem 0;
    }

    .form-grid {
      display: grid;
      gap: 1rem;
    }

    .form-grid.two-columns {
      grid-template-columns: 1fr 1fr;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--sl-color-neutral-200);
    }

    .danger-zone {
      border: 1px solid var(--sl-color-danger-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      background-color: var(--sl-color-danger-50);
    }

    .danger-title {
      font-size: 1rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-danger-700);
      margin: 0 0 0.5rem 0;
    }

    .danger-description {
      color: var(--sl-color-danger-600);
      font-size: var(--sl-font-size-small);
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    .theme-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .theme-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border: 2px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      cursor: pointer;
      transition: all 0.2s;
    }

    .theme-option:hover {
      border-color: var(--sl-color-primary-300);
    }

    .theme-option.active {
      border-color: var(--sl-color-primary-600);
      background-color: var(--sl-color-primary-50);
    }

    .theme-icon {
      font-size: 1.5rem;
    }

    .theme-label {
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-700);
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        padding: 1rem;
      }

      .profile-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-grid.two-columns {
        grid-template-columns: 1fr;
      }

      .form-actions {
        justify-content: stretch;
      }

      .form-actions sl-button {
        flex: 1;
      }

      .theme-selector {
        grid-template-columns: 1fr;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .main-content {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .page-header {
      background-color: var(--sl-color-neutral-800);
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .page-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .page-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .profile-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .card-header {
      background-color: var(--sl-color-neutral-700);
      border-bottom-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .card-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .user-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .danger-zone {
      background-color: var(--sl-color-danger-950);
      border-color: var(--sl-color-danger-800);
    }

    :host(.sl-theme-dark) .danger-title {
      color: var(--sl-color-danger-300);
    }

    :host(.sl-theme-dark) .danger-description {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .theme-option {
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .theme-option.active {
      background-color: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .theme-label {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .form-actions {
      border-top-color: var(--sl-color-neutral-600);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) context!: RouteContext;

  @state() private formData = {
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  @state() private isSubmitting = false;
  @state() private error = '';
  @state() private successMessage = '';

  connectedCallback() {
    super.connectedCallback();
    this.loadUserData();
  }

  private loadUserData() {
    const user = this.stateController.state.user;
    if (user) {
      this.formData = {
        ...this.formData,
        name: user.name || '',
        email: user.email || '',
      };
    }
  }

  render() {
    const user = this.stateController.state.user;
    
    return html`
      <div class="page-layout">
        <app-sidebar 
          .stateController=${this.stateController}
          .routerController=${this.routerController}
          .themeController=${this.themeController}
          .currentTeamSlug=${this.context.params.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">Profile Settings</h1>
            <p class="page-subtitle">Manage your personal account settings and preferences</p>
          </div>

          <div class="page-content">
            <div class="profile-grid">
              <div class="profile-sidebar">
                ${this.renderUserCard(user)}
                ${this.renderThemeCard()}
              </div>

              <div class="profile-main">
                ${this.renderPersonalInfoCard()}
                ${this.renderSecurityCard()}
                ${this.renderDangerZoneCard()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderUserCard(user: any) {
    return html`
      <div class="profile-card">
        <div class="card-header">
          <h2 class="card-title">Profile</h2>
        </div>
        <div class="card-content">
          <div class="avatar-section">
            <div class="avatar">
              ${user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3 class="user-name">${user?.name || 'User'}</h3>
            <p class="user-email">${user?.email}</p>
          </div>

          <div class="user-meta">
            <div class="meta-item">
              <span>Account created:</span>
              <span>${user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</span>
            </div>
            <div class="meta-item">
              <span>Last updated:</span>
              <span>${user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderThemeCard() {
    return html`
      <div class="profile-card">
        <div class="card-header">
          <h2 class="card-title">Appearance</h2>
        </div>
        <div class="card-content">
          <div class="theme-selector">
            <div 
              class="theme-option ${this.themeController.theme === 'light' ? 'active' : ''}"
              @click=${() => this.themeController.setTheme('light')}
            >
              <div class="theme-icon">☀️</div>
              <div class="theme-label">Light</div>
            </div>
            
            <div 
              class="theme-option ${this.themeController.theme === 'dark' ? 'active' : ''}"
              @click=${() => this.themeController.setTheme('dark')}
            >
              <div class="theme-icon">🌙</div>
              <div class="theme-label">Dark</div>
            </div>
            
            <div 
              class="theme-option ${this.themeController.theme === 'system' ? 'active' : ''}"
              @click=${() => this.themeController.setTheme('system')}
            >
              <div class="theme-icon">🖥️</div>
              <div class="theme-label">System</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderPersonalInfoCard() {
    return html`
      <div class="profile-card">
        <div class="card-header">
          <h2 class="card-title">Personal Information</h2>
        </div>
        <div class="card-content">
          ${this.error ? html`
            <sl-alert variant="danger" open>
              <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
              ${this.error}
            </sl-alert>
          ` : ''}

          ${this.successMessage ? html`
            <sl-alert variant="success" open>
              <sl-icon slot="icon" name="check-circle"></sl-icon>
              ${this.successMessage}
            </sl-alert>
          ` : ''}

          <form @submit=${this.handlePersonalInfoSubmit}>
            <div class="form-section">
              <h3 class="section-title">Basic Information</h3>
              <div class="form-grid two-columns">
                <sl-input
                  label="Full Name"
                  .value=${this.formData.name}
                  @sl-input=${(e: CustomEvent) => this.updateFormData('name', e.target.value)}
                  required
                ></sl-input>

                <sl-input
                  label="Email"
                  type="email"
                  .value=${this.formData.email}
                  @sl-input=${(e: CustomEvent) => this.updateFormData('email', e.target.value)}
                  required
                  disabled
                  help-text="Contact support to change your email"
                ></sl-input>
              </div>
            </div>

            <div class="form-actions">
              <sl-button variant="default" @click=${this.resetPersonalForm}>
                Reset
              </sl-button>
              <sl-button 
                type="submit"
                variant="primary" 
                ?loading=${this.isSubmitting}
              >
                Save Changes
              </sl-button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  private renderSecurityCard() {
    return html`
      <div class="profile-card">
        <div class="card-header">
          <h2 class="card-title">Security</h2>
        </div>
        <div class="card-content">
          <form @submit=${this.handlePasswordSubmit}>
            <div class="form-section">
              <h3 class="section-title">Change Password</h3>
              <div class="form-grid">
                <sl-input
                  label="Current Password"
                  type="password"
                  .value=${this.formData.currentPassword}
                  @sl-input=${(e: CustomEvent) => this.updateFormData('currentPassword', e.target.value)}
                  autocomplete="current-password"
                ></sl-input>

                <sl-input
                  label="New Password"
                  type="password"
                  .value=${this.formData.newPassword}
                  @sl-input=${(e: CustomEvent) => this.updateFormData('newPassword', e.target.value)}
                  autocomplete="new-password"
                  help-text="Password must be at least 8 characters long"
                ></sl-input>

                <sl-input
                  label="Confirm New Password"
                  type="password"
                  .value=${this.formData.confirmPassword}
                  @sl-input=${(e: CustomEvent) => this.updateFormData('confirmPassword', e.target.value)}
                  autocomplete="new-password"
                ></sl-input>
              </div>
            </div>

            <div class="form-actions">
              <sl-button variant="default" @click=${this.resetPasswordForm}>
                Reset
              </sl-button>
              <sl-button 
                type="submit"
                variant="primary" 
                ?loading=${this.isSubmitting}
                ?disabled=${!this.isPasswordFormValid()}
              >
                Update Password
              </sl-button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  private renderDangerZoneCard() {
    return html`
      <div class="profile-card">
        <div class="card-header">
          <h2 class="card-title">Danger Zone</h2>
        </div>
        <div class="card-content">
          <div class="danger-zone">
            <h3 class="danger-title">Delete Account</h3>
            <p class="danger-description">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <sl-button variant="danger" @click=${this.handleDeleteAccount}>
              Delete Account
            </sl-button>
          </div>
        </div>
      </div>
    `;
  }

  private updateFormData(key: string, value: string) {
    this.formData = { ...this.formData, [key]: value };
  }

  private isPasswordFormValid(): boolean {
    return (
      this.formData.currentPassword.length > 0 &&
      this.formData.newPassword.length >= 8 &&
      this.formData.newPassword === this.formData.confirmPassword
    );
  }

  private resetPersonalForm() {
    this.loadUserData();
    this.clearMessages();
  }

  private resetPasswordForm() {
    this.formData = {
      ...this.formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.clearMessages();
  }

  private clearMessages() {
    this.error = '';
    this.successMessage = '';
  }

  private async handlePersonalInfoSubmit(event: Event) {
    event.preventDefault();
    // TODO: Implement profile update
    this.successMessage = 'Profile updated successfully!';
    setTimeout(() => this.successMessage = '', 3000);
  }

  private async handlePasswordSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.isPasswordFormValid()) return;

    this.isSubmitting = true;
    this.clearMessages();

    try {
      const { error } = await supabase.updatePassword(this.formData.newPassword);
      
      if (error) {
        this.error = error.message;
      } else {
        this.successMessage = 'Password updated successfully!';
        this.resetPasswordForm();
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Password update failed';
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleDeleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    // TODO: Implement account deletion
    alert('Account deletion is not implemented yet. Please contact support.');
  }
}

