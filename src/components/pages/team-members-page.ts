// src/components/pages/team-members-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'inactive';
  joined_at: string;
  last_active?: string;
}

interface InviteData {
  email: string;
  role: string;
  message: string;
}

interface UpcomingFeature {
  icon: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'testing';
}

@customElement('team-members-page')
export class UpdatedTeamMembersPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Team members specific styles */
    .member-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--sl-color-neutral-0);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      margin-bottom: 1rem;
      transition: all 0.2s ease;
    }

    .member-card:hover {
      box-shadow: var(--sl-shadow-medium);
      border-color: var(--sl-color-primary-300);
      transform: translateY(-2px);
    }

    .member-avatar {
      flex-shrink: 0;
    }

    .member-info {
      flex: 1;
      min-width: 0;
    }

    .member-name {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.25rem 0;
      font-size: var(--sl-font-size-medium);
    }

    .member-email {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0 0 0.5rem 0;
    }

    .member-meta {
      display: flex;
      gap: 1rem;
      font-size: var(--sl-font-size-x-small);
      color: var(--sl-color-neutral-500);
    }

    .member-role-status {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .member-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .invite-form {
      display: grid;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-large);
      border: 2px dashed var(--sl-color-neutral-300);
    }

    .invite-form.active {
      border-color: var(--sl-color-primary-400);
      background: var(--sl-color-primary-50);
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr auto;
      gap: 1rem;
      align-items: end;
    }

    .hero-section {
      text-align: center;
      padding: 3rem 2rem;
      background: linear-gradient(135deg, var(--sl-color-primary-50), var(--sl-color-warning-50));
      border-radius: var(--sl-border-radius-large);
      margin-bottom: 2rem;
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

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .feature-card {
      border: none;
      transition: transform 0.2s ease;
      position: relative;
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

    .status-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: var(--sl-font-size-x-small);
    }

    .timeline-section {
      background: var(--sl-color-neutral-50);
      padding: 2rem;
      border-radius: var(--sl-border-radius-large);
      border: 2px dashed var(--sl-color-neutral-300);
      text-align: center;
      margin-bottom: 2rem;
    }

    .timeline-items {
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

    .current-members-preview {
      background: var(--sl-color-neutral-0);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .preview-member {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
    }

    .preview-member:last-child {
      margin-bottom: 0;
    }

    .preview-info {
      flex: 1;
    }

    .preview-name {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      margin: 0;
      font-size: var(--sl-font-size-small);
    }

    .preview-role {
      font-size: var(--sl-font-size-x-small);
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    /* Beta signup section */
    .beta-section {
      background: var(--sl-color-primary-50);
      padding: 2rem;
      border-radius: var(--sl-border-radius-large);
      text-align: center;
    }

    .beta-form {
      max-width: 400px;
      margin: 1.5rem auto 0;
      display: flex;
      gap: 0.75rem;
    }

    .beta-form sl-input {
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

      .timeline-items {
        flex-direction: column;
        align-items: center;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .beta-form {
        flex-direction: column;
      }

      .member-card {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .member-role-status,
      .member-actions {
        justify-content: center;
      }
    }

    /* Dark theme */
    :host(.sl-theme-dark) .hero-section {
      background: linear-gradient(135deg, var(--sl-color-primary-900), var(--sl-color-warning-900));
    }

    :host(.sl-theme-dark) .hero-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .hero-description {
      color: var(--sl-color-neutral-300);
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

    :host(.sl-theme-dark) .timeline-section {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .timeline-label {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .timeline-status {
      color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .beta-section {
      background: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .member-card,
    :host(.sl-theme-dark) .current-members-preview {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .member-card:hover {
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .member-name,
    :host(.sl-theme-dark) .preview-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .member-email,
    :host(.sl-theme-dark) .preview-role {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .member-meta {
      color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .invite-form {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .invite-form.active {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .preview-member {
      background: var(--sl-color-neutral-700);
    }
  `;

  @state() private members: TeamMember[] = [];
  @state() private inviteData: InviteData = {
    email: '',
    role: 'member',
    message: ''
  };
  @state() private showInviteForm = false;
  @state() private emailAddress = '';
  @state() private isSubscribing = false;
  @state() private isInviting = false;

  private upcomingFeatures: UpcomingFeature[] = [
    {
      icon: '📧',
      title: 'Email Invitations',
      description: 'Send beautiful email invitations with custom welcome messages and onboarding flows.',
      status: 'in-progress'
    },
    {
      icon: '🔐',
      title: 'Role Management',
      description: 'Assign granular permissions with roles like Admin, Member, and Viewer.',
      status: 'planned'
    },
    {
      icon: '👥',
      title: 'Bulk Operations',
      description: 'Manage multiple team members at once with bulk invite and role assignment.',
      status: 'planned'
    },
    {
      icon: '📊',
      title: 'Activity Tracking',
      description: 'Monitor team member activity, contributions, and engagement analytics.',
      status: 'planned'
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Configurable notification preferences for team updates and mentions.',
      status: 'testing'
    },
    {
      icon: '🎯',
      title: 'Team Insights',
      description: 'Advanced analytics on team performance, collaboration patterns, and productivity.',
      status: 'planned'
    }
  ];

  async connectedCallback() {
    super.connectedCallback();
    await this.loadPageData();
  }

  protected async loadPageData(): Promise<void> {
    await this.withPageLoading(async () => {
      // Simulate API call for current team members
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock current members - in real app this would come from API
      this.members = [
        {
          id: '1',
          name: this.user?.name || 'Current User',
          email: this.user?.email || 'user@example.com',
          role: 'owner',
          status: 'active',
          joined_at: '2024-01-15T10:00:00Z',
          last_active: '2024-01-20T15:30:00Z'
        }
      ];
    });
  }

  private getStatusVariant(status: string): string {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'testing': return 'primary';
      case 'planned': return 'neutral';
      default: return 'neutral';
    }
  }

  private getRoleVariant(role: string): string {
    switch (role) {
      case 'owner': return 'primary';
      case 'admin': return 'success';
      case 'member': return 'neutral';
      case 'viewer': return 'default';
      default: return 'neutral';
    }
  }

  private getStatusVariantForMember(status: string): string {
    switch (status) {
      case 'active': return 'success';
      case 'invited': return 'warning';
      case 'inactive': return 'neutral';
      default: return 'neutral';
    }
  }

  private handleToggleInviteForm() {
    this.showInviteForm = !this.showInviteForm;
    if (!this.showInviteForm) {
      this.inviteData = { email: '', role: 'member', message: '' };
    }
  }

  private handleInviteFormInput(field: keyof InviteData, value: string) {
    this.inviteData = { ...this.inviteData, [field]: value };
  }

  private async handleSendInvite() {
    if (!this.inviteData.email.trim() || this.isInviting) return;

    this.isInviting = true;
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      this.showNotification('success', `Invitation sent to ${this.inviteData.email}`);
      
      // Reset form
      this.inviteData = { email: '', role: 'member', message: '' };
      this.showInviteForm = false;
      
    } catch (error) {
      this.showNotification('error', 'Failed to send invitation. Please try again.');
    } finally {
      this.isInviting = false;
    }
  }

  private async handleSubscribeUpdates(event: Event) {
    event.preventDefault();
    
    if (!this.emailAddress.trim() || this.isSubscribing) return;
    
    this.isSubscribing = true;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.showNotification('success', 'You\'ll be notified when team management is available!');
      this.emailAddress = '';
      
    } catch (error) {
      this.showNotification('error', 'Failed to subscribe. Please try again later.');
    } finally {
      this.isSubscribing = false;
    }
  }

  private showNotification(type: 'success' | 'error', message: string) {
    // Simple notification implementation - you can enhance this
    const event = new CustomEvent('show-notification', {
      detail: { type, message },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  private handleEditMember(member: TeamMember) {
    console.log('Edit member:', member);
    this.showNotification('success', 'Member editing will be available soon!');
  }

  private handleRemoveMember(member: TeamMember) {
    if (member.role === 'owner') {
      this.showNotification('error', 'Cannot remove the team owner.');
      return;
    }
    
    if (confirm(`Remove ${member.name} from the team?`)) {
      console.log('Remove member:', member);
      this.showNotification('success', 'Member removal will be available soon!');
    }
  }

  protected renderPageContent() {
    if (this.pageError) {
      return this.renderError(this.pageError, () => this.refreshPageData());
    }

    if (this.isLoading) {
      return this.renderLoading('Loading team information...');
    }

    const memberStats = [
      { label: 'Team Members', value: this.members.length, icon: 'people' },
      { label: 'Active Members', value: this.members.filter(m => m.status === 'active').length, icon: 'person-check' },
      { label: 'Pending Invites', value: this.members.filter(m => m.status === 'invited').length, icon: 'envelope' },
      { label: 'Available Features', value: `${this.upcomingFeatures.filter(f => f.status === 'in-progress').length}/6`, icon: 'gear' }
    ];

    return html`
      ${this.renderPageHeader(
        'Team Members',
        'Manage your team members, roles, and permissions',
        html`
          <sl-button variant="primary" @click=${this.handleToggleInviteForm} ?disabled=${true}>
            <sl-icon slot="prefix" name="person-plus"></sl-icon>
            Invite Member (Coming Soon)
          </sl-button>
        `
      )}

      <div class="page-content">
        ${this.renderStats(memberStats)}

        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-icon">👥</div>
          <h2 class="hero-title">Advanced Team Management Coming Soon!</h2>
          <p class="hero-description">
            We're building powerful collaboration features that will transform how your team works together. 
            Invite members, assign roles, track activity, and manage permissions all from one dashboard.
          </p>
          
          <div class="hero-actions">
            <sl-button variant="primary" size="large" @click=${this.scrollToBetaSignup}>
              <sl-icon slot="prefix" name="bell"></sl-icon>
              Get Early Access
            </sl-button>
            <sl-button variant="default" size="large" @click=${this.handleViewRoadmap}>
              <sl-icon slot="prefix" name="map"></sl-icon>
              View Roadmap
            </sl-button>
          </div>
        </div>

        <div class="content-grid cols-1">
          <!-- Current Team Preview -->
          <div class="content-section">
            ${this.renderSectionHeader(
              'Current Team',
              'Your team members and their roles',
              html`
                <sl-badge variant="success" pill>
                  ${this.members.length} member${this.members.length !== 1 ? 's' : ''}
                </sl-badge>
              `
            )}
            
            <div class="current-members-preview">
              ${this.members.map(member => html`
                <div class="preview-member">
                  <sl-avatar 
                    initial=${member.name.charAt(0)} 
                    label="${member.name} avatar"
                    size="small"
                  ></sl-avatar>
                  <div class="preview-info">
                    <div class="preview-name">${member.name}</div>
                    <div class="preview-role">${member.email} • ${member.role}</div>
                  </div>
                  <sl-badge variant=${this.getRoleVariant(member.role)} size="small">
                    ${member.role}
                  </sl-badge>
                  <sl-badge variant=${this.getStatusVariantForMember(member.status)} size="small">
                    ${member.status}
                  </sl-badge>
                </div>
              `)}
            </div>
          </div>

          <!-- Upcoming Features -->
          <div class="content-section">
            ${this.renderSectionHeader('What\'s Coming')}
            
            <div class="features-grid">
              ${this.upcomingFeatures.map(feature => html`
                <div class="content-card feature-card">
                  <sl-badge 
                    variant=${this.getStatusVariant(feature.status)} 
                    class="status-badge"
                    size="small"
                  >
                    ${feature.status.replace('-', ' ')}
                  </sl-badge>
                  
                  <div class="feature-header">
                    <div class="feature-icon">${feature.icon}</div>
                    <h4 class="feature-title">${feature.title}</h4>
                  </div>
                  <p class="feature-description">${feature.description}</p>
                </div>
              `)}
            </div>
          </div>

          <!-- Development Timeline -->
          <div class="content-section">
            ${this.renderSectionHeader('Development Progress')}
            
            <div class="timeline-section">
              <p style="color: var(--sl-color-neutral-600); margin-bottom: 2rem;">
                Track our progress as we build these exciting team management features.
              </p>
              
              <div class="timeline-items">
                <div class="timeline-item">
                  <div class="timeline-icon completed">
                    <sl-icon name="check"></sl-icon>
                  </div>
                  <div class="timeline-label">Research & Design</div>
                  <div class="timeline-status">Completed</div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-icon completed">
                    <sl-icon name="check"></sl-icon>
                  </div>
                  <div class="timeline-label">Database Schema</div>
                  <div class="timeline-status">Completed</div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-icon current">
                    <sl-icon name="gear"></sl-icon>
                  </div>
                  <div class="timeline-label">Core Features</div>
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
                  <div class="timeline-label">Beta Release</div>
                  <div class="timeline-status">Q2 2025</div>
                </div>
              </div>

              <sl-alert variant="primary" open>
                <sl-icon slot="icon" name="info-circle"></sl-icon>
                <strong>Beta Program:</strong> Want early access? Join our beta program to test features 
                before they're released and help shape the final product.
              </sl-alert>
            </div>
          </div>

          <!-- Beta Signup -->
          <div class="content-section">
            ${this.renderSectionHeader('Stay Updated')}
            
            <div class="beta-section">
              <h3>Get Early Access</h3>
              <p style="color: var(--sl-color-neutral-600); margin-bottom: 0;">
                Be the first to try team management features. We'll notify you as soon as beta access is available.
              </p>
              
              <form class="beta-form" @submit=${this.handleSubscribeUpdates}>
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
                  Join Beta
                </sl-button>
              </form>
            </div>
          </div>

          <!-- Invite Form (Hidden for now) -->
          ${this.showInviteForm ? html`
            <div class="content-section">
              ${this.renderSectionHeader('Invite Team Member')}
              
              <div class="invite-form ${this.showInviteForm ? 'active' : ''}">
                <div class="form-row">
                  <sl-input
                    label="Email Address"
                    type="email"
                    placeholder="colleague@company.com"
                    .value=${this.inviteData.email}
                    @sl-input=${(e: CustomEvent) => this.handleInviteFormInput('email', (e.target as any).value)}
                    required
                  >
                    <sl-icon slot="prefix" name="envelope"></sl-icon>
                  </sl-input>
                  
                  <sl-select
                    label="Role"
                    .value=${this.inviteData.role}
                    @sl-change=${(e: CustomEvent) => this.handleInviteFormInput('role', (e.target as any).value)}
                  >
                    <sl-option value="viewer">Viewer</sl-option>
                    <sl-option value="member">Member</sl-option>
                    <sl-option value="admin">Admin</sl-option>
                  </sl-select>
                  
                  <sl-button 
                    variant="primary" 
                    @click=${this.handleSendInvite}
                    ?loading=${this.isInviting}
                    ?disabled=${!this.inviteData.email.trim()}
                  >
                    <sl-icon slot="prefix" name="send"></sl-icon>
                    Send Invite
                  </sl-button>
                </div>
                
                <sl-textarea
                  label="Personal Message (Optional)"
                  placeholder="Add a personal welcome message..."
                  .value=${this.inviteData.message}
                  @sl-input=${(e: CustomEvent) => this.handleInviteFormInput('message', (e.target as any).value)}
                  rows="3"
                ></sl-textarea>
                
                <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                  <sl-button variant="default" @click=${this.handleToggleInviteForm}>
                    Cancel
                  </sl-button>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private scrollToBetaSignup() {
    const betaSection = this.shadowRoot?.querySelector('.beta-section');
    betaSection?.scrollIntoView({ behavior: 'smooth' });
  }

  private handleViewRoadmap() {
    // Open roadmap in new tab (placeholder)
    window.open('/roadmap', '_blank');
  }
}

