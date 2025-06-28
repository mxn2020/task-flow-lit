// src/components/pages/team-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { supabase } from '../../services/supabase';

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

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
}

@customElement('team-page')
export class UpdatedTeamPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Team settings specific styles */
    .team-header-card {
      background: linear-gradient(135deg, var(--sl-color-primary-50) 0%, var(--sl-color-primary-100) 100%);
      border: 2px solid var(--sl-color-primary-200);
      margin-bottom: 2rem;
    }

    .team-avatar-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
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
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      flex-shrink: 0;
      box-shadow: var(--sl-shadow-medium);
    }

    .team-info {
      flex: 1;
    }

    .team-name-display {
      font-size: 1.75rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-800);
      margin: 0 0 0.25rem 0;
    }

    .team-slug {
      color: var(--sl-color-primary-600);
      font-size: var(--sl-font-size-medium);
      margin: 0 0 0.5rem 0;
      font-family: var(--sl-font-mono);
      font-weight: var(--sl-font-weight-medium);
    }

    .team-meta {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section:last-child {
      margin-bottom: 0;
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

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .action-card {
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      padding: 1.5rem;
      background: var(--sl-color-neutral-0);
      transition: all 0.2s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .action-card:hover {
      border-color: var(--sl-color-primary-300);
      box-shadow: var(--sl-shadow-medium);
      transform: translateY(-2px);
    }

    .action-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .action-icon {
      width: 3rem;
      height: 3rem;
      border-radius: var(--sl-border-radius-medium);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .action-content {
      flex: 1;
    }

    .action-title {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .action-description {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0;
      line-height: 1.4;
    }

    .readonly-section {
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      border: 1px solid var(--sl-color-neutral-200);
    }

    .readonly-grid {
      display: grid;
      gap: 1rem;
    }

    .readonly-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .readonly-item:last-child {
      border-bottom: none;
    }

    .readonly-label {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-600);
    }

    .readonly-value {
      color: var(--sl-color-neutral-900);
      font-family: var(--sl-font-mono);
      font-size: var(--sl-font-size-small);
      background: var(--sl-color-neutral-100);
      padding: 0.25rem 0.5rem;
      border-radius: var(--sl-border-radius-small);
    }

    .danger-zone {
      border: 2px solid var(--sl-color-danger-200);
      border-radius: var(--sl-border-radius-large);
      padding: 2rem;
      background: var(--sl-color-danger-50);
    }

    .danger-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .danger-icon {
      font-size: 2rem;
      color: var(--sl-color-danger-600);
    }

    .danger-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-danger-700);
      margin: 0;
    }

    .danger-description {
      color: var(--sl-color-danger-600);
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }

    .danger-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .notification-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      display: grid;
      gap: 0.5rem;
      max-width: 400px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .team-avatar-section {
        flex-direction: column;
        text-align: center;
        align-items: center;
      }

      .team-meta {
        justify-content: center;
        gap: 1rem;
      }

      .quick-actions-grid {
        grid-template-columns: 1fr;
      }

      .form-actions,
      .danger-actions {
        flex-direction: column;
      }

      .form-actions sl-button,
      .danger-actions sl-button {
        width: 100%;
      }

      .readonly-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .readonly-value {
        width: 100%;
        text-align: left;
      }
    }

    /* Dark theme */
    :host(.sl-theme-dark) .team-header-card {
      background: linear-gradient(135deg, var(--sl-color-primary-900) 0%, var(--sl-color-primary-800) 100%);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .team-name-display {
      color: var(--sl-color-primary-200);
    }

    :host(.sl-theme-dark) .team-slug {
      color: var(--sl-color-primary-400);
    }

    :host(.sl-theme-dark) .team-meta {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .action-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .action-card:hover {
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .action-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .action-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .readonly-section {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .readonly-item {
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .readonly-label {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .readonly-value {
      color: var(--sl-color-neutral-200);
      background: var(--sl-color-neutral-700);
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
  @state() private notifications: Array<{ type: 'success' | 'error'; message: string; id: string }> = [];
  @state() private teamStats: TeamStats = { members: 1, projects: 0, scopes: 0, tasks: 0 };
  @state() private isDeletingTeam = false;

  // Convert quickActions to a getter to avoid referencing this.teamSlug before it's available
  private get quickActions(): QuickAction[] {
    const slug = this.currentAccount?.slug || '';
    return [
      {
        title: 'Team Members',
        description: 'Invite and manage team members, assign roles and permissions',
        icon: '👥',
        path: `/app/${slug}/team/members`,
        color: 'var(--sl-color-primary-100)'
      },
      {
        title: 'Billing & Subscription',
        description: 'Manage your subscription, payment methods and billing history',
        icon: '💳',
        path: `/app/${slug}/billing`,
        color: 'var(--sl-color-success-100)'
      },
      {
        title: 'Data Settings',
        description: 'Configure labels, categories, types and other data organization tools',
        icon: '⚙️',
        path: `/app/${slug}/data-settings`,
        color: 'var(--sl-color-warning-100)'
      },
      {
        title: 'Scopes & Projects',
        description: 'Create and manage project scopes, organize work and track progress',
        icon: '🎯',
        path: `/app/${slug}/scopes`,
        color: 'var(--sl-color-neutral-100)'
      }
    ];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadPageData();
  }

  protected async loadPageData(): Promise<void> {
    await this.withPageLoading(async () => {
      if (!this.currentAccount) {
        this.pageError = 'No team account found';
        return;
      }

      // Load team data
      this.formData = {
        name: this.currentAccount.name || '',
        description: this.currentAccount.account_info?.description || '',
        email: this.currentAccount.email || '',
      };

      // Load team stats - in real app this would come from API
      await new Promise(resolve => setTimeout(resolve, 300));
      this.teamStats = {
        members: 1,
        projects: 0,
        scopes: 0,
        tasks: 0
      };
    });
  }

  private updateFormData(key: keyof TeamFormData, value: string) {
    this.formData = { ...this.formData, [key]: value };
  }

  private resetForm() {
    if (this.currentAccount) {
      this.formData = {
        name: this.currentAccount.name || '',
        description: this.currentAccount.account_info?.description || '',
        email: this.currentAccount.email || '',
      };
      this.showNotification('success', 'Form reset to current values');
    }
  }

  private showNotification(type: 'success' | 'error', message: string) {
    const notification = {
      type,
      message,
      id: crypto.randomUUID()
    };
    
    this.notifications = [...this.notifications, notification];
    
    // Auto-hide success notifications
    if (type === 'success') {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 3000);
    }
  }

  private removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

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

  private handleQuickAction(action: QuickAction) {
    this.routerController.navigate(action.path);
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

    this.isDeletingTeam = true;

    try {
      // TODO: Implement actual team deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, show a message that it's not implemented
      this.showNotification('error', 'Team deletion is not implemented yet. Please contact support to delete your team.');
      
    } catch (error) {
      console.error('Failed to delete team:', error);
      this.showNotification('error', 'Failed to delete team. Please contact support.');
    } finally {
      this.isDeletingTeam = false;
    }
  }

  private handleExportData() {
    // TODO: Implement data export functionality
    this.showNotification('success', 'Data export feature coming soon! Contact support for manual export.');
  }

  protected renderPageContent() {
    if (this.pageError) {
      return this.renderError(this.pageError, () => this.refreshPageData());
    }

    if (this.isLoading) {
      return this.renderLoading('Loading team settings...');
    }

    if (!this.currentAccount) {
      return this.renderError('Team not found or you don\'t have access to it.');
    }

    const teamStats = [
      { label: 'Team Members', value: this.teamStats.members, icon: 'people' },
      { label: 'Active Projects', value: this.teamStats.projects, icon: 'collection' },
      { label: 'Total Scopes', value: this.teamStats.scopes, icon: 'folder' },
      { label: 'Completed Tasks', value: this.teamStats.tasks, icon: 'check-circle' }
    ];

    const formatDate = (dateStr?: string) => {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? '-' : d.toISOString();
    };

    return html`
      ${this.renderPageHeader(
        'Team Settings',
        'Manage your team configuration, members, and preferences'
      )}

      <div class="page-content">
        ${this.renderStats(teamStats)}

        <!-- Team Overview Card -->
        <div class="content-section">
          <div class="content-card team-header-card">
            <div class="team-avatar-section">
              <div class="team-avatar">
                ${this.currentAccount.name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <div class="team-info">
                <h2 class="team-name-display">${this.currentAccount.name}</h2>
                <p class="team-slug">@${this.currentAccount.slug}</p>
                <div class="team-meta">
                  <div class="meta-item">
                    <sl-icon name="calendar"></sl-icon>
                    Created ${new Date(this.currentAccount.created_at ?? '').toLocaleDateString()}
                  </div>
                  <div class="meta-item">
                    <sl-icon name="gear"></sl-icon>
                    ${this.currentAccount.account_type}
                  </div>
                  <div class="meta-item">
                    <sl-icon name="clock"></sl-icon>
                    Updated ${new Date(this.currentAccount.updated_at ?? '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-grid cols-1">
          <!-- General Settings -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'General Settings',
              'Basic team information and configuration'
            )}
            
            <div class="content-card">
              <form @submit=${this.handleGeneralSubmit}>
                <div class="form-section">
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
                  <sl-button variant="default" @click=${this.resetForm} type="button">
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
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'Quick Actions',
              'Common team management tasks'
            )}
            
            <div class="quick-actions-grid">
              ${this.quickActions.map(action => html`
                <a 
                  class="action-card" 
                  href="#"
                  @click=${(e: Event) => {
                    e.preventDefault();
                    this.handleQuickAction(action);
                  }}
                >
                  <div class="action-header">
                    <div class="action-icon" style="background-color: ${action.color}">
                      ${action.icon}
                    </div>
                    <div class="action-content">
                      <div class="action-title">${action.title}</div>
                      <div class="action-description">${action.description}</div>
                    </div>
                    <sl-icon name="arrow-right"></sl-icon>
                  </div>
                </a>
              `)}
            </div>
          </div>

          <!-- Technical Details -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'Technical Details',
              'Read-only team information and identifiers'
            )}
            
            <div class="readonly-section">
              <div class="readonly-grid">
                <div class="readonly-item">
                  <span class="readonly-label">Team ID</span>
                  <span class="readonly-value">${this.currentAccount.id}</span>
                </div>
                <div class="readonly-item">
                  <span class="readonly-label">Account Type</span>
                  <span class="readonly-value">${this.currentAccount.account_type}</span>
                </div>
                <div class="readonly-item">
                  <span class="readonly-label">Slug</span>
                  <span class="readonly-value">${this.currentAccount.slug}</span>
                </div>
                <div class="readonly-item">
                  <span class="readonly-label">Created</span>
                  <span class="readonly-value">${formatDate(this.currentAccount.created_at)}</span>
                </div>
                <div class="readonly-item">
                  <span class="readonly-label">Last Updated</span>
                  <span class="readonly-value">${formatDate(this.currentAccount.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'Danger Zone',
              'Irreversible and destructive actions'
            )}
            
            <div class="danger-zone">
              <div class="danger-header">
                <div class="danger-icon">⚠️</div>
                <h3 class="danger-title">Delete Team</h3>
              </div>
              <p class="danger-description">
                Permanently delete this team and all associated data including projects, tasks, scopes, and member access. 
                This action cannot be undone and will immediately revoke access for all team members.
              </p>
              
              <sl-alert variant="warning" open style="margin-bottom: 1.5rem;">
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
                <sl-button 
                  variant="danger" 
                  @click=${this.handleDeleteTeam}
                  ?loading=${this.isDeletingTeam}
                >
                  <sl-icon slot="prefix" name="trash"></sl-icon>
                  Delete Team Permanently
                </sl-button>
                <sl-button variant="default" @click=${this.handleExportData}>
                  <sl-icon slot="prefix" name="download"></sl-icon>
                  Export Data First
                </sl-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${this.renderNotifications()}
    `;
  }

  private renderNotifications() {
    return html`
      <div class="notification-container">
        ${this.notifications.map(notification => html`
          <sl-alert 
            variant=${notification.type} 
            open 
            closable
            @sl-hide=${() => this.removeNotification(notification.id)}
          >
            <sl-icon 
              slot="icon" 
              name=${notification.type === 'success' ? 'check-circle' : 'exclamation-triangle'}
            ></sl-icon>
            ${notification.message}
          </sl-alert>
        `)}
      </div>
    `;
  }
}

