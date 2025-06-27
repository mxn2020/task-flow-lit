// src/components/pages/team-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';
import '../common/error-message';

interface TeamFormData {
  name: string;
  description: string;
  email: string;
}

interface TeamStats {
  members: number;
  projects: number;
  scopes: number;
  tasks: number;
}

@customElement('team-page')
export class TeamPage extends BasePage {
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

    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .settings-card {
      border: none;
      box-shadow: var(--sl-shadow-medium);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .card-title-section {
      flex: 1;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-description {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0;
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

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--sl-color-neutral-200);
    }

    .team-avatar-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: var(--sl-color-primary-50);
      border-radius: var(--sl-border-radius-large);
      border: 1px solid var(--sl-color-primary-200);
    }

    .team-avatar {
      width: 5rem;
      height: 5rem;
      border-radius: var(--sl-border-radius-large);
      background: var(--sl-color-primary-600);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-bold);
      flex-shrink: 0;
    }

    .avatar-info {
      flex: 1;
    }

    .team-name-display {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-800);
      margin: 0 0 0.25rem 0;
    }

    .team-slug {
      color: var(--sl-color-primary-600);
      font-size: var(--sl-font-size-small);
      margin: 0 0 0.5rem 0;
      font-family: var(--sl-font-mono);
    }

    .team-created {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-item {
      text-align: center;
      padding: 1.5rem;
      background: var(--sl-color-neutral-50);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      transition: all 0.2s ease;
    }

    .stat-item:hover {
      background: var(--sl-color-neutral-100);
      border-color: var(--sl-color-primary-300);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-600);
      margin: 0 0 0.25rem 0;
    }

    .stat-label {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0;
      font-weight: var(--sl-font-weight-medium);
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .action-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      text-decoration: none;
      color: var(--sl-color-neutral-700);
      transition: all 0.2s ease;
      background: var(--sl-color-neutral-50);
    }

    .action-link:hover {
      background: var(--sl-color-primary-50);
      border-color: var(--sl-color-primary-300);
      color: var(--sl-color-primary-700);
      transform: translateY(-1px);
    }

    .action-icon {
      font-size: 1.25rem;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--sl-color-neutral-100);
      border-radius: var(--sl-border-radius-small);
    }

    .action-link:hover .action-icon {
      background: var(--sl-color-primary-100);
    }

    .action-content {
      flex: 1;
    }

    .action-title {
      font-weight: var(--sl-font-weight-medium);
      margin: 0 0 0.25rem 0;
    }

    .action-description {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    .danger-zone {
      border: 2px solid var(--sl-color-danger-200);
      border-radius: var(--sl-border-radius-large);
      padding: 2rem;
      background: var(--sl-color-danger-50);
      margin-top: 1rem;
    }

    .danger-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .danger-icon {
      font-size: 1.5rem;
      color: var(--sl-color-danger-600);
    }

    .danger-title {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-danger-700);
      margin: 0;
    }

    .danger-description {
      color: var(--sl-color-danger-600);
      font-size: var(--sl-font-size-small);
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }

    .danger-actions {
      display: flex;
      gap: 1rem;
    }

    .readonly-info {
      display: grid;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-600);
    }

    .info-value {
      color: var(--sl-color-neutral-900);
      font-family: var(--sl-font-mono);
      font-size: var(--sl-font-size-small);
    }

    .notification-area {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      max-width: 400px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions-grid {
        grid-template-columns: 1fr;
      }

      .team-avatar-section {
        flex-direction: column;
        text-align: center;
      }

      .danger-actions {
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

    :host(.sl-theme-dark) .card-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .card-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .team-avatar-section {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-700);
    }

    :host(.sl-theme-dark) .team-name-display {
      color: var(--sl-color-primary-200);
    }

    :host(.sl-theme-dark) .team-slug {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .team-created {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .stat-item {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .stat-item:hover {
      background: var(--sl-color-neutral-700);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .stat-label {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .action-link {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .action-link:hover {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-600);
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .action-icon {
      background: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .action-link:hover .action-icon {
      background: var(--sl-color-primary-800);
    }

    :host(.sl-theme-dark) .action-description {
      color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .danger-zone {
      background: var(--sl-color-danger-950);
      border-color: var(--sl-color-danger-800);
    }

    :host(.sl-theme-dark) .danger-title {
      color: var(--sl-color-danger-300);
    }

    :host(.sl-theme-dark) .danger-description {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .danger-icon {
      color: var(--sl-color-danger-400);
    }

    :host(.sl-theme-dark) .info-item {
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .info-label {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .info-value {
      color: var(--sl-color-neutral-200);
    }

    :host(.sl-theme-dark) .form-actions {
      border-top-color: var(--sl-color-neutral-700);
    }
  `;

  @state() private formData: TeamFormData = {
    name: '',
    description: '',
    email: '',
  };
  @state() private isSubmitting = false;
  @state() private notification: { type: 'success' | 'error'; message: string } | null = null;
  @state() private teamStats: TeamStats = { members: 1, projects: 0, scopes: 0, tasks: 0 };

  connectedCallback() {
    super.connectedCallback();
    this.loadTeamData();
    this.loadTeamStats();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('context')) {
      this.loadTeamData();
      this.loadTeamStats();
    }
  }

  private loadTeamData() {
    if (this.currentAccount) {
      this.formData = {
        name: this.currentAccount.name || '',
        description: this.currentAccount.account_info?.description || '',
        email: this.currentAccount.email || '',
      };
    }
  }

  private async loadTeamStats() {
    // TODO: Load actual stats from API
    // For now, using placeholder data
    this.teamStats = {
      members: 1,
      projects: 0,
      scopes: 0,
      tasks: 0
    };
  }

  render() {
    if (!this.currentAccount) {
      return html`
        <div class="page-layout">
          <app-sidebar 
            .stateController=${this.stateController}
            .routerController=${this.routerController}
            .themeController=${this.themeController}
            .currentTeamSlug=${this.teamSlug}
          ></app-sidebar>
          <div class="main-content">
            <div class="page-content">
              <error-message 
                title="Team Not Found"
                message="The requested team could not be found or you don't have access to it."
                .showRetry=${false}
              >
                <sl-button slot="actions" variant="primary" @click=${() => this.routerController.goToDashboard()}>
                  <sl-icon slot="prefix" name="house"></sl-icon>
                  Go to Dashboard
                </sl-button>
              </error-message>
            </div>
          </div>
        </div>
      `;
    }

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
            <h1 class="page-title">Team Settings</h1>
            <p class="page-subtitle">Manage your team configuration and preferences</p>
          </div>

          <div class="page-content">
            <div class="settings-grid">
              ${this.renderGeneralSettingsCard()}
              ${this.renderQuickActionsCard()}
              ${this.renderTeamOverviewCard()}
              ${this.renderDangerZoneCard()}
            </div>
          </div>
        </div>
      </div>

      ${this.renderNotifications()}
    `;
  }

  private renderGeneralSettingsCard() {
    return html`
      <sl-card class="settings-card">
        <div class="card-header">
          <div class="card-title-section">
            <h2 class="card-title">
              <sl-icon name="gear"></sl-icon>
              General Settings
            </h2>
            <p class="card-description">Basic team information and configuration</p>
          </div>
        </div>

        <form @submit=${this.handleGeneralSubmit}>
          <div class="form-section">
            <h3 class="section-title">Team Information</h3>
            <div class="form-grid">
              <sl-input
                label="Team Name"
                .value=${this.formData.name}
                @sl-input=${(e: CustomEvent) => this.updateFormData('name', (e.target as any).value)}
                required
                help-text="This name will be visible to all team members"
              >
                <sl-icon slot="prefix" name="building"></sl-icon>
              </sl-input>

              <sl-input
                label="Team Email"
                type="email"
                .value=${this.formData.email}
                @sl-input=${(e: CustomEvent) => this.updateFormData('email', (e.target as any).value)}
                help-text="Public email for team communications"
              >
                <sl-icon slot="prefix" name="envelope"></sl-icon>
              </sl-input>

              <sl-textarea
                label="Description"
                .value=${this.formData.description}
                @sl-input=${(e: CustomEvent) => this.updateFormData('description', (e.target as any).value)}
                rows="3"
                help-text="Brief description of your team's purpose (optional)"
                placeholder="Describe what your team does..."
              ></sl-textarea>
            </div>
          </div>

          <div class="form-actions">
            <sl-button variant="default" @click=${this.resetForm}>
              <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
              Reset
            </sl-button>
            <sl-button 
              type="submit"
              variant="primary" 
              ?loading=${this.isSubmitting}
            >
              <sl-icon slot="prefix" name="check"></sl-icon>
              Save Changes
            </sl-button>
          </div>
        </form>
      </sl-card>
    `;
  }

  private renderTeamOverviewCard() {
    return html`
      <sl-card class="settings-card">
        <div class="card-header">
          <div class="card-title-section">
            <h2 class="card-title">
              <sl-icon name="info-circle"></sl-icon>
              Team Overview
            </h2>
            <p class="card-description">Current team status and information</p>
          </div>
        </div>

        <div class="team-avatar-section">
          <div class="team-avatar">
            ${this.stateController.state.currentAccount?.name?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div class="avatar-info">
            <h3 class="team-name-display">${this.stateController.state.currentAccount?.name}</h3>
            <p class="team-slug">@${this.stateController.state.currentAccount?.slug}</p>
            <p class="team-created">
              Created ${new Date(this.stateController.state.currentAccount?.created_at ?? '').toLocaleDateString()}
            </p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${this.teamStats.members}</div>
            <div class="stat-label">Members</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.teamStats.projects}</div>
            <div class="stat-label">Projects</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.teamStats.scopes}</div>
            <div class="stat-label">Scopes</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.teamStats.tasks}</div>
            <div class="stat-label">Tasks</div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Technical Details</h3>
          <div class="readonly-info">
            <div class="info-item">
              <span class="info-label">Team ID</span>
              <span class="info-value">${this.stateController.state.currentAccount?.id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Account Type</span>
              <span class="info-value">${this.stateController.state.currentAccount?.account_type}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Updated</span>
              <span class="info-value">${new Date(this.stateController.state.currentAccount?.updated_at ?? '').toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </sl-card>
    `;
  }

  private renderQuickActionsCard() {
    return html`
      <sl-card class="settings-card">
        <div class="card-header">
          <div class="card-title-section">
            <h2 class="card-title">
              <sl-icon name="lightning"></sl-icon>
              Quick Actions
            </h2>
            <p class="card-description">Common team management tasks</p>
          </div>
        </div>

        <div class="quick-actions-grid">
          <a 
            class="action-link" 
            href="/app/${this.teamSlug}/team/members"
          >
            <div class="action-icon">👥</div>
            <div class="action-content">
              <div class="action-title">Manage Members</div>
              <div class="action-description">Invite and manage team members</div>
            </div>
            <sl-icon name="arrow-right"></sl-icon>
          </a>
          
          <a 
            class="action-link" 
            href="/app/${this.teamSlug}/billing"
          >
            <div class="action-icon">💳</div>
            <div class="action-content">
              <div class="action-title">Billing & Plans</div>
              <div class="action-description">Manage subscription and billing</div>
            </div>
            <sl-icon name="arrow-right"></sl-icon>
          </a>
          
          <a 
            class="action-link" 
            href="/app/${this.teamSlug}/data-settings"
          >
            <div class="action-icon">⚙️</div>
            <div class="action-content">
              <div class="action-title">Data Settings</div>
              <div class="action-description">Configure labels, categories & types</div>
            </div>
            <sl-icon name="arrow-right"></sl-icon>
          </a>
          
          <a 
            class="action-link" 
            href="/app/${this.teamSlug}/scopes"
          >
            <div class="action-icon">🎯</div>
            <div class="action-content">
              <div class="action-title">Manage Scopes</div>
              <div class="action-description">Create and organize project scopes</div>
            </div>
            <sl-icon name="arrow-right"></sl-icon>
          </a>
        </div>
      </sl-card>
    `;
  }

  private renderDangerZoneCard() {
    return html`
      <sl-card class="settings-card">
        <div class="card-header">
          <div class="card-title-section">
            <h2 class="card-title">
              <sl-icon name="exclamation-triangle"></sl-icon>
              Danger Zone
            </h2>
            <p class="card-description">Irreversible and destructive actions</p>
          </div>
        </div>

        <div class="danger-zone">
          <div class="danger-header">
            <div class="danger-icon">⚠️</div>
            <h3 class="danger-title">Delete Team</h3>
          </div>
          <p class="danger-description">
            Permanently delete this team and all associated data including projects, tasks, scopes, and member access. 
            This action cannot be undone and will immediately revoke access for all team members.
          </p>
          
          <sl-alert variant="warning" open>
            <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
            <strong>Warning:</strong> This will permanently delete all team data including:
            <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
              <li>All projects and scopes</li>
              <li>All tasks and documents</li>
              <li>Team member access</li>
              <li>Billing and subscription data</li>
            </ul>
          </sl-alert>

          <div class="danger-actions">
            <sl-button variant="danger" @click=${this.handleDeleteTeam}>
              <sl-icon slot="prefix" name="trash"></sl-icon>
              Delete Team Permanently
            </sl-button>
            <sl-button variant="default" @click=${this.handleExportData}>
              <sl-icon slot="prefix" name="download"></sl-icon>
              Export Data First
            </sl-button>
          </div>
        </div>
      </sl-card>
    `;
  }

  private renderNotifications() {
    if (!this.notification) return '';

    return html`
      <div class="notification-area">
        <sl-alert 
          variant=${this.notification.type} 
          open 
          closable
          @sl-hide=${() => this.notification = null}
        >
          <sl-icon 
            slot="icon" 
            name=${this.notification.type === 'success' ? 'check-circle' : 'exclamation-triangle'}
          ></sl-icon>
          ${this.notification.message}
        </sl-alert>
      </div>
    `;
  }

  // Helper methods
  private updateFormData(key: keyof TeamFormData, value: string) {
    this.formData = { ...this.formData, [key]: value };
  }

  private resetForm() {
    this.loadTeamData();
    this.showNotification('success', 'Form reset to current values');
  }

  private showNotification(type: 'success' | 'error', message: string) {
    this.notification = { type, message };
    
    // Auto-hide success notifications
    if (type === 'success') {
      setTimeout(() => {
        this.notification = null;
      }, 3000);
    }
  }

  // Event handlers
  private async handleGeneralSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.formData.name.trim()) {
      this.showNotification('error', 'Team name is required');
      return;
    }

    this.isSubmitting = true;

    try {
      if (!this.currentAccount) throw new Error('No current account');

      const { data, error } = await supabase.updateAccount(this.currentAccount.id, {
        name: this.formData.name.trim(),
        email: this.formData.email.trim() || undefined,
        account_info: {
          ...this.currentAccount.account_info,
          description: this.formData.description.trim() || null,
        },
      });

      if (error) throw new Error(error);

      this.showNotification('success', 'Team settings updated successfully!');
      
      // Update the current account in state
      await this.stateController.loadUserData();
      
    } catch (error) {
      console.error('Failed to update team settings:', error);
      this.showNotification('error', 'Failed to update team settings. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleDeleteTeam() {
    const teamName = this.currentAccount?.name;
    
    // First confirmation
    const firstConfirm = confirm(
      `⚠️ WARNING: You are about to delete the team "${teamName}".\n\n` +
      `This will permanently delete:\n` +
      `• All projects and scopes\n` +
      `• All tasks and documents\n` +
      `• All team member access\n` +
      `• All billing and subscription data\n\n` +
      `This action CANNOT be undone.\n\n` +
      `Are you sure you want to continue?`
    );
    
    if (!firstConfirm) return;

    // Second confirmation with typing requirement
    const typedConfirmation = prompt(
      `To confirm deletion, please type the team name exactly as shown:\n\n"${teamName}"\n\nType here:`
    );
    
    if (typedConfirmation !== teamName) {
      this.showNotification('error', 'Team name did not match. Deletion cancelled.');
      return;
    }

    // Final confirmation
    const finalConfirm = confirm(
      `🚨 FINAL WARNING 🚨\n\n` +
      `You have confirmed deletion of team "${teamName}".\n\n` +
      `This is your LAST CHANCE to cancel.\n\n` +
      `Click OK to permanently delete this team and all its data.`
    );
    
    if (!finalConfirm) return;

    try {
      // TODO: Implement actual team deletion
      // For now, show a message that it's not implemented
      this.showNotification('error', 'Team deletion is not implemented yet. Please contact support to delete your team.');
      
      // In a real implementation, you would:
      // 1. Call the delete API
      // 2. Handle the response
      // 3. Redirect to dashboard or sign out
      // 4. Show appropriate messages
      
    } catch (error) {
      console.error('Failed to delete team:', error);
      this.showNotification('error', 'Failed to delete team. Please contact support.');
    }
  }

  private handleExportData() {
    // TODO: Implement data export functionality
    this.showNotification('success', 'Data export feature coming soon! Contact support for manual export.');
  }
}