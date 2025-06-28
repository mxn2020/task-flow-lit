// src/components/pages/profile-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { supabase } from '../../services/supabase';

@customElement('profile-page')
export class ProfilePage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Profile-specific styles */
    .avatar-section {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .user-avatar {
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
      border: 3px solid var(--sl-color-primary-200);
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
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--sl-color-neutral-100);
    }

    .meta-item:last-child {
      border-bottom: none;
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
      border: 2px solid var(--sl-color-danger-300);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--sl-color-danger-50) 0%, var(--sl-color-danger-100) 100%);
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
      background: var(--sl-color-neutral-0);
    }

    .theme-option:hover {
      border-color: var(--sl-color-primary-300);
      transform: translateY(-2px);
      box-shadow: var(--sl-shadow-medium);
    }

    .theme-option.active {
      border-color: var(--sl-color-primary-600);
      background: var(--sl-color-primary-50);
    }

    .theme-icon {
      font-size: 1.5rem;
    }

    .theme-label {
      font-size: var(--sl-font-size-small);
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-700);
    }

    .profile-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--sl-color-primary-50);
      border: 1px solid var(--sl-color-primary-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.25rem;
      text-align: center;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-700);
      display: block;
      line-height: 1;
    }

    .stat-label {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-primary-600);
      margin-top: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .form-grid.two-columns {
        grid-template-columns: 1fr;
      }

      .form-actions {
        justify-content: stretch;
        flex-direction: column;
      }

      .theme-selector {
        grid-template-columns: 1fr;
      }

      .profile-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .profile-stats {
        grid-template-columns: 1fr;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .user-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .danger-zone {
      background: linear-gradient(135deg, var(--sl-color-danger-950) 0%, var(--sl-color-danger-900) 100%);
      border-color: var(--sl-color-danger-700);
    }

    :host(.sl-theme-dark) .danger-title {
      color: var(--sl-color-danger-300);
    }

    :host(.sl-theme-dark) .danger-description {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .theme-option {
      border-color: var(--sl-color-neutral-600);
      background: var(--sl-color-neutral-800);
    }

    :host(.sl-theme-dark) .theme-option.active {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .theme-label {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .form-actions {
      border-top-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .meta-item {
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .stat-card {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-700);
    }

    :host(.sl-theme-dark) .stat-value {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .stat-label {
      color: var(--sl-color-primary-500);
    }

    :host(.sl-theme-dark) .user-avatar {
      background-color: var(--sl-color-primary-700);
      border-color: var(--sl-color-primary-500);
    }
  `;

  @state() private formData = {
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  @state() private isSubmitting = false;
  @state() private successMessage = '';
  @state() private currentTheme: string = 'system';

  async connectedCallback() {
    super.connectedCallback();
    this.syncThemeState();
    await this.loadPageData();
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    // Sync theme state when theme controller changes
    if (changedProperties.has('themeController')) {
      this.syncThemeState();
    }
  }

  private syncThemeState() {
    if (this.themeController) {
      this.currentTheme = this.themeController.theme;
    }
  }

  protected async loadPageData(): Promise<void> {
    await this.withPageLoading(async () => {
      const user = this.stateController.state.user;
      if (user) {
        this.formData = {
          ...this.formData,
          name: (user as any).user_metadata?.name || user.email?.split('@')[0] || '',
          email: user.email || '',
        };
      }
      
      // Simulate loading profile data
      await new Promise(resolve => setTimeout(resolve, 300));
    });
  }

  private updateFormData(key: string, value: string) {
    this.formData = { ...this.formData, [key]: value };
    this.clearPageError();
  }

  private isPasswordFormValid(): boolean {
    return (
      this.formData.currentPassword.length > 0 &&
      this.formData.newPassword.length >= 8 &&
      this.formData.newPassword === this.formData.confirmPassword
    );
  }

  private resetPersonalForm() {
    this.loadPageData();
    this.clearPageError();
    this.successMessage = '';
  }

  private resetPasswordForm() {
    this.formData = {
      ...this.formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.clearPageError();
    this.successMessage = '';
  }

  private async handlePersonalInfoSubmit(event: Event) {
    event.preventDefault();
    
    this.isSubmitting = true;
    this.clearPageError();
    this.successMessage = '';

    try {
      // TODO: Implement profile update with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      this.successMessage = 'Profile updated successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      this.pageError = error instanceof Error ? error.message : 'Failed to update profile';
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handlePasswordSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.isPasswordFormValid()) {
      this.pageError = 'Please fill in all password fields correctly';
      return;
    }

    this.isSubmitting = true;
    this.clearPageError();
    this.successMessage = '';

    try {
      const { error } = await supabase.updatePassword(this.formData.newPassword);
      
      if (error) {
        throw new Error(error.message);
      }
      
      this.successMessage = 'Password updated successfully!';
      this.resetPasswordForm();
    } catch (error) {
      this.pageError = error instanceof Error ? error.message : 'Password update failed';
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

  private handleThemeChange(theme: 'light' | 'dark' | 'system') {
    this.themeController.setTheme(theme);
    // Sync state after theme change
    this.syncThemeState();
  }

  private renderUserCard() {
    const user = this.stateController.state.user;
    const supabaseUser = user as any;
    const userName = supabaseUser?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

    return html`
      <div class="content-card">
        <div class="avatar-section">
          <div class="user-avatar">
            ${userName.charAt(0).toUpperCase()}
          </div>
          <h3 class="user-name">${userName}</h3>
          <p class="user-email">${user?.email}</p>
        </div>

        <div class="user-meta">
          <div class="meta-item">
            <span>Account created:</span>
            <span>${supabaseUser?.created_at ? new Date(supabaseUser.created_at).toLocaleDateString() : 'Unknown'}</span>
          </div>
          <div class="meta-item">
            <span>Last sign in:</span>
            <span>${supabaseUser?.last_sign_in_at ? new Date(supabaseUser.last_sign_in_at).toLocaleDateString() : 'Unknown'}</span>
          </div>
          <div class="meta-item">
            <span>Email confirmed:</span>
            <span>${supabaseUser?.email_confirmed_at ? '✅ Yes' : '❌ No'}</span>
          </div>
        </div>
      </div>
    `;
  }

  private renderThemeCard() {
    return html`
      <div class="content-card">
        <h3 style="margin: 0 0 1rem 0;">Appearance</h3>
        <div class="theme-selector">
          <div 
            class="theme-option ${this.currentTheme === 'light' ? 'active' : ''}"
            @click=${() => this.handleThemeChange('light')}
          >
            <div class="theme-icon">☀️</div>
            <div class="theme-label">Light</div>
          </div>
          
          <div 
            class="theme-option ${this.currentTheme === 'dark' ? 'active' : ''}"
            @click=${() => this.handleThemeChange('dark')}
          >
            <div class="theme-icon">🌙</div>
            <div class="theme-label">Dark</div>
          </div>
          
          <div 
            class="theme-option ${this.currentTheme === 'system' ? 'active' : ''}"
            @click=${() => this.handleThemeChange('system')}
          >
            <div class="theme-icon">🖥️</div>
            <div class="theme-label">System</div>
          </div>
        </div>
      </div>
    `;
  }

  private renderPersonalInfoCard() {
    return html`
      <div class="content-card">
        ${this.successMessage ? html`
          <sl-alert variant="success" open style="margin-bottom: 1.5rem;">
            <sl-icon slot="icon" name="check-circle"></sl-icon>
            ${this.successMessage}
          </sl-alert>
        ` : ''}

        <form @submit=${this.handlePersonalInfoSubmit}>
          <div class="form-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="form-grid two-columns">
              <sl-input
                label="Full Name"
                .value=${this.formData.name}
                @sl-input=${(e: any) => this.updateFormData('name', e.target.value)}
                required
              ></sl-input>

              <sl-input
                label="Email"
                type="email"
                .value=${this.formData.email}
                @sl-input=${(e: any) => this.updateFormData('email', e.target.value)}
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
    `;
  }

  private renderSecurityCard() {
    return html`
      <div class="content-card">
        <form @submit=${this.handlePasswordSubmit}>
          <div class="form-section">
            <h3 class="section-title">Change Password</h3>
            <div class="form-grid">
              <sl-input
                label="Current Password"
                type="password"
                .value=${this.formData.currentPassword}
                @sl-input=${(e: any) => this.updateFormData('currentPassword', e.target.value)}
                autocomplete="current-password"
              ></sl-input>

              <sl-input
                label="New Password"
                type="password"
                .value=${this.formData.newPassword}
                @sl-input=${(e: any) => this.updateFormData('newPassword', e.target.value)}
                autocomplete="new-password"
                help-text="Password must be at least 8 characters long"
              ></sl-input>

              <sl-input
                label="Confirm New Password"
                type="password"
                .value=${this.formData.confirmPassword}
                @sl-input=${(e: any) => this.updateFormData('confirmPassword', e.target.value)}
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
    `;
  }

  private renderDangerZoneCard() {
    return html`
      <div class="content-card">
        <h3 style="margin: 0 0 1rem 0;">Danger Zone</h3>
        <div class="danger-zone">
          <h4 class="danger-title">Delete Account</h4>
          <p class="danger-description">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <sl-button variant="danger" @click=${this.handleDeleteAccount}>
            <sl-icon slot="prefix" name="trash"></sl-icon>
            Delete Account
          </sl-button>
        </div>
      </div>
    `;
  }

  protected renderPageContent() {
    if (this.isLoading) {
      return this.renderLoading('Loading profile...');
    }

    const user = this.stateController.state.user;
    const userName = (user as any)?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

    const profileStats = [
      { label: 'Account Status', value: 'Active', icon: 'check-circle' },
      { label: 'Teams', value: this.stateController.state.accounts?.filter(acc => acc.account_type === 'team').length || 0, icon: 'people' },
      { label: 'Projects', value: 0, icon: 'collection' },
      { label: 'Last Active', value: 'Today', icon: 'clock' }
    ];

    return html`
      ${this.renderPageHeader(
        `${userName}'s Profile`,
        'Manage your personal account settings and preferences',
        html`
          <sl-button variant="default" @click=${() => this.refreshPageData()}>
            <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
            Refresh
          </sl-button>
        `
      )}

      <div class="page-content">
        ${this.renderStats(profileStats)}

        <div class="content-grid cols-2">
          <!-- Left Column -->
          <div class="content-section">
            ${this.renderSectionHeader('Profile Overview')}
            ${this.renderUserCard()}
          </div>

          <div class="content-section">
            ${this.renderSectionHeader('Appearance')}
            ${this.renderThemeCard()}
          </div>

          <!-- Right Column -->
          <div class="content-section">
            ${this.renderSectionHeader('Personal Information')}
            ${this.renderPersonalInfoCard()}
          </div>

          <div class="content-section">
            ${this.renderSectionHeader('Security')}
            ${this.renderSecurityCard()}
          </div>

          <!-- Full Width -->
          <div class="content-section" style="grid-column: 1 / -1;">
            ${this.renderSectionHeader('Account Management')}
            ${this.renderDangerZoneCard()}
          </div>
        </div>
      </div>
    `;
  }
}

