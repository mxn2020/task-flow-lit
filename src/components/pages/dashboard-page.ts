import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { Account } from '../../types';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--sl-color-neutral-50);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      margin-bottom: 3rem;
    }

    .welcome-title {
      font-size: 2rem;
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .welcome-subtitle {
      color: var(--sl-color-neutral-600);
      margin: 0;
    }

    .dashboard-grid {
      display: grid;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-small);
      border: 1px solid var(--sl-color-neutral-200);
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
    }

    .teams-section {
      background: white;
      padding: 2rem;
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-small);
      border: 1px solid var(--sl-color-neutral-200);
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 1.5rem 0;
    }

    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .team-card {
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      transition: all 0.2s;
      cursor: pointer;
    }

    .team-card:hover {
      box-shadow: var(--sl-shadow-medium);
      border-color: var(--sl-color-primary-300);
    }

    .team-name {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.5rem 0;
    }

    .team-role {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0 0 1rem 0;
      text-transform: capitalize;
    }

    .team-stats {
      display: flex;
      gap: 1rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .create-team-card {
      border: 2px dashed var(--sl-color-neutral-300);
      border-radius: var(--sl-border-radius-medium);
      padding: 2rem;
      text-align: center;
      transition: all 0.2s;
      cursor: pointer;
    }

    .create-team-card:hover {
      border-color: var(--sl-color-primary-500);
      background-color: var(--sl-color-primary-50);
    }

    .create-team-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .create-team-text {
      color: var(--sl-color-neutral-600);
      font-weight: var(--sl-font-weight-medium);
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
    }

    .empty-state-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.5rem;
    }

    .empty-state-text {
      color: var(--sl-color-neutral-600);
      margin-bottom: 2rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .welcome-title {
        font-size: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .teams-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) {
      background-color: var(--sl-color-neutral-900);
    }

    :host(.sl-theme-dark) .welcome-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .welcome-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .stat-card,
    :host(.sl-theme-dark) .teams-section {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .team-card {
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .team-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .team-role,
    :host(.sl-theme-dark) .team-stats {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .create-team-card {
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .create-team-card:hover {
      background-color: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .empty-state-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .empty-state-text {
      color: var(--sl-color-neutral-400);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;

  @state() private showCreateTeamDialog = false;

  render() {
    const { user, accounts, loading } = this.stateController.state;
    const teams = accounts.filter(account => account.account_type === 'team');

    if (loading) {
      return html`
        <div class="container">
          <skeleton-loader type="title"></skeleton-loader>
          <skeleton-loader type="text"></skeleton-loader>
          <skeleton-loader type="card" count="3"></skeleton-loader>
        </div>
      `;
    }

    return html`
      <div class="container">
        <div class="header">
          <h1 class="welcome-title">Welcome back, ${user?.name || 'there'}!</h1>
          <p class="welcome-subtitle">Here's what's happening with your teams</p>
        </div>

        <div class="dashboard-grid">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${teams.length}</div>
              <div class="stat-label">Active Teams</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">0</div>
              <div class="stat-label">Total Projects</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">0</div>
              <div class="stat-label">Pending Tasks</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">0</div>
              <div class="stat-label">Completed Today</div>
            </div>
          </div>

          <div class="teams-section">
            <h2 class="section-title">Your Teams</h2>
            
            ${teams.length === 0 ? this.renderEmptyState() : this.renderTeams(teams)}
          </div>
        </div>

        <!-- Create Team Dialog -->
        <sl-dialog label="Create New Team" ?open=${this.showCreateTeamDialog} @sl-request-close=${() => this.showCreateTeamDialog = false}>
          <team-create-form 
            .stateController=${this.stateController}
            @team-created=${this.handleTeamCreated}
            @cancel=${() => this.showCreateTeamDialog = false}
          ></team-create-form>
        </sl-dialog>
      </div>
    `;
  }

  private renderEmptyState() {
    return html`
      <div class="empty-state">
        <div class="empty-state-icon">🏢</div>
        <h3 class="empty-state-title">No teams yet</h3>
        <p class="empty-state-text">
          Create your first team to start organizing your work and collaborating with others.
        </p>
        <sl-button variant="primary" @click=${this.handleCreateTeam}>
          Create Your First Team
        </sl-button>
      </div>
    `;
  }

  private handleCreateTeam() {
    this.showCreateTeamDialog = true;
  }

  private handleTeamCreated(event: CustomEvent) {
    const team = event.detail.team;
    this.showCreateTeamDialog = false;
    this.routerController.goToTeam(team.slug);
  }
}

