// src/components/pages/team-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext } from '../../types';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';

@customElement('team-page')
export class TeamPage extends LitElement {
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

    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      max-width: 1200px;
    }

    .settings-card {
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
      margin: 0 0 0.25rem 0;
    }

    .card-description {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0;
    }

    .card-content {
      padding: 1.5rem;
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

    .team-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      text-align: center;
      padding: 1rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-small);
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-600);
      margin: 0 0 0.25rem 0;
    }

    .stat-label {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .team-avatar {
      width: 4rem;
      height: 4rem;
      border-radius: var(--sl-border-radius-medium);
      background-color: var(--sl-color-primary-600);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
    }

    .avatar-info {
      flex: 1;
    }

    .team-name-display {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.25rem 0;
    }

    .team-slug {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .action-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-small);
      text-decoration: none;
      color: var(--sl-color-neutral-700);
      transition: all 0.2s;
    }

    .action-link:hover {
      background-color: var(--sl-color-neutral-50);
      border-color: var(--sl-color-primary-300);
      color: var(--sl-color-primary-700);
    }

    .action-icon {
      font-size: 1.125rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        padding: 1rem;
      }

      .settings-grid {
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

      .team-stats {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }

      .avatar-section {
        flex-direction: column;
        text-align: center;
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

    :host(.sl-theme-dark) .settings-card {
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

    :host(.sl-theme-dark) .card-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .team-name-display {
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

    :host(.sl-theme-dark) .stat-item {
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .action-link {
      border-color: var(--sl-color-neutral-600);
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .action-link:hover {
      background-color: var(--sl-color-neutral-700);
      color: var(--sl-color-primary-400);
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
    description: '',
    email: '',
  };
  @state() private isSubmitting = false;
  @state() private error = '';
  @state() private successMessage = '';

  connectedCallback() {
    super.connectedCallback();
    this.loadTeamData();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('context')) {
      this.loadTeamData();
    }
  }

  private loadTeamData() {
    const currentAccount = this.stateController.state.currentAccount;
    if (currentAccount) {
      this.formData = {
        name: currentAccount.name || '',
        description: currentAccount.account_info?.description || '',
        email: currentAccount.email || '',
      };
    }
  }

  render() {
    const currentAccount = this.stateController.state.currentAccount;

    if (!currentAccount) {
      return html`
        <div class="page-layout">
          <app-sidebar 
            .stateController=${this.stateController}
            .routerController=${this.routerController}
            .themeController=${this.themeController}
            .currentTeamSlug=${this.context.params.teamSlug}
          ></app-sidebar>
          <div class="main-content">
            <div class="page-content">
              <error-message message="Team not found"></error-message>
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
          .currentTeamSlug=${this.context.params.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">Team Settings</h1>
            <p class="page-subtitle">Manage your team configuration and preferences</p>
          </div>

          <div class="page-content">
            <div class="settings-grid">
              ${this.renderGeneralSettingsCard(currentAccount)}
              ${this.renderQuickActionsCard()}
              ${this.renderTeamInfoCard(currentAccount)}
              ${this.renderDangerZoneCard()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderGeneralSettingsCard(currentAccount: any) {
    return html`
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">General Settings</h2>
          <p class="card-description">Basic team information and configuration</p>
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

          <form @submit=${this.handleGeneralSubmit}>
            <div class="form-section">
              <h3 class="section-title">Team Information</h3>
              <div class="form-grid">
                <sl-input
                  label="Team Name"
                  .value=${this.formData.name}
                  @sl-input=${(e: CustomEvent) => this.updateFormData('name', e.target.value)}
                  required
                ></sl-input>

                <sl-input
                  label="Team Email"
                  type="email"
                  .value=${this.formData.email}
                  @sl-input=${(e: CustomEvent) => this.updateFormData('email', e.target.value)}
                  help-text="Public email for team communications"
                ></sl-input>

                <sl-textarea
                  label="Description"
                  .value=${this.formData.description}
                  @sl-input=${(e: CustomEvent) => this.updateFormData('description', e.target.value)}
                  rows="3"
                  help-text="Brief description of your team's purpose"
                ></sl-textarea>
              </div>
            </div>

            <div class="form-actions">
              <sl-button variant="default" @click=${this.resetForm}>
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

  private renderTeamInfoCard(currentAccount: any) {
    return html`
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">Team Overview</h2>
          <p class="card-description">Current team status and statistics</p>
        </div>
        <div class="card-content">
          <div class="avatar-section">
            <div class="team-avatar">
              ${currentAccount.name?.charAt(0).toUpperCase() || 'T'}
            </div>
            <div class="avatar-info">
              <h3 class="team-name-display">${currentAccount.name}</h3>
              <p class="team-slug">@${currentAccount.slug}</p>
            </div>
          </div>

          <div class="team-stats">
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">Members</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">Projects</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">Scopes</div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Team Details</h3>
            <div class="form-grid">
              <sl-input
                label="Team ID"
                .value=${currentAccount.id}
                readonly
                help-text="Unique identifier for this team"
              ></sl-input>
              <sl-input
                label="Created"
                .value=${new Date(currentAccount.created_at).toLocaleDateString()}
                readonly
              ></sl-input>
              <sl-input
                label="Last Updated"
                .value=${new Date(currentAccount.updated_at).toLocaleDateString()}
                readonly
              ></sl-input>
              <sl-input
                label="Account Type"
                .value=${currentAccount.account_type}
                readonly
              ></sl-input>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderQuickActionsCard() {
    return html`
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">Quick Actions</h2>
          <p class="card-description">Common team management tasks</p>
        </div>
        <div class="card-content">
          <div class="quick-actions">
            <a 
              class="action-link" 
              href="/app/${this.context.params.teamSlug}/team/members"
            >
              <span class="action-icon">👥</span>
              Manage Members
            </a>
            
            <a 
              class="action-link" 
              href="/app/${this.context.params.teamSlug}/billing"
            >
              <span class="action-icon">💳</span>
              Billing & Plans
            </a>
            
            <a 
              class="action-link" 
              href="/app/${this.context.params.teamSlug}/data-settings"
            >
              <span class="action-icon">⚙️</span>
              Data Settings
            </a>
            
            <a 
              class="action-link" 
              href="/app/${this.context.params.teamSlug}/scopes"
            >
              <span class="action-icon">🎯</span>
              Manage Scopes
            </a>
          </div>
        </div>
      </div>
    `;
  }

  private renderDangerZoneCard() {
    return html`
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">Danger Zone</h2>
          <p class="card-description">Irreversible and destructive actions</p>
        </div>
        <div class="card-content">
          <div class="danger-zone">
            <h3 class="danger-title">Delete Team</h3>
            <p class="danger-description">
              Permanently delete this team and all associated data including projects, tasks, and member access. 
              This action cannot be undone.
            </p>
            <sl-button variant="danger" @click=${this.handleDeleteTeam}>
              Delete Team
            </sl-button>
          </div>
        </div>
      </div>
    `;
  }

  private updateFormData(key: string, value: string) {
    this.formData = { ...this.formData, [key]: value };
  }

  private resetForm() {
    this.loadTeamData();
    this.clearMessages();
  }

  private clearMessages() {
    this.error = '';
    this.successMessage = '';
  }

  private async handleGeneralSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.formData.name.trim()) return;

    this.isSubmitting = true;
    this.clearMessages();

    try {
      const currentAccount = this.stateController.state.currentAccount;
      if (!currentAccount) throw new Error('No current account');

      const { data, error } = await supabase.updateAccount(currentAccount.id, {
        name: this.formData.name.trim(),
        email: this.formData.email.trim() || null,
        account_info: {
          ...currentAccount.account_info,
          description: this.formData.description.trim() || null,
        },
      });

      if (error) throw error;

      this.successMessage = 'Team settings updated successfully!';
      
      // Update the current account in state
      await this.stateController.loadUserData();
      
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to update team settings';
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleDeleteTeam() {
    const teamName = this.stateController.state.currentAccount?.name;
    const confirmed = confirm(`Are you sure you want to delete the team "${teamName}"? This action cannot be undone and will permanently delete all team data.`);
    
    if (!confirmed) return;

    const doubleConfirmed = confirm('This is your final warning. Are you absolutely sure you want to delete this team?');
    
    if (!doubleConfirmed) return;

    // TODO: Implement team deletion
    alert('Team deletion is not implemented yet. Please contact support to delete your team.');
  }
}

