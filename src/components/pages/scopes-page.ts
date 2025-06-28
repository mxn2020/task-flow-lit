// src/components/pages/scopes-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext, Scope } from '../../types';
import { SystemScopeType } from '../../types';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';
import '../common/skeleton-loader';

@customElement('scopes-page')
export class ScopesPage extends LitElement {
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

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .header-text {
      flex: 1;
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

    .scopes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .scope-card {
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      transition: all 0.2s;
      cursor: pointer;
      position: relative;
    }

    .scope-card:hover {
      box-shadow: var(--sl-shadow-medium);
      border-color: var(--sl-color-primary-300);
    }

    .scope-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .scope-info {
      flex: 1;
      min-width: 0;
    }

    .scope-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .scope-name {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.25rem 0;
    }

    .scope-description {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0 0 1rem 0;
      line-height: 1.4;
    }

    .scope-stats {
      display: flex;
      gap: 1rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
      margin-bottom: 1rem;
    }

    .scope-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-500);
    }

    .scope-type-badge {
      padding: 0.25rem 0.5rem;
      border-radius: var(--sl-border-radius-small);
      font-size: var(--sl-font-size-x-small);
      font-weight: var(--sl-font-weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .scope-type-badge.system {
      background-color: var(--sl-color-primary-100);
      color: var(--sl-color-primary-700);
    }

    .scope-type-badge.custom {
      background-color: var(--sl-color-success-100);
      color: var(--sl-color-success-700);
    }

    .scope-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .create-scope-card {
      background: var(--sl-color-neutral-50);
      border: 2px dashed var(--sl-color-neutral-300);
      border-radius: var(--sl-border-radius-medium);
      padding: 2rem;
      text-align: center;
      transition: all 0.2s;
      cursor: pointer;
    }

    .create-scope-card:hover {
      border-color: var(--sl-color-primary-500);
      background-color: var(--sl-color-primary-50);
    }

    .create-scope-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--sl-color-neutral-500);
    }

    .create-scope-text {
      color: var(--sl-color-neutral-600);
      font-weight: var(--sl-font-weight-medium);
      margin-bottom: 0.5rem;
    }

    .create-scope-description {
      color: var(--sl-color-neutral-500);
      font-size: var(--sl-font-size-small);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--sl-color-neutral-600);
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
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    /* Create Scope Form */
    .create-form {
      display: grid;
      gap: 1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .scopes-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        justify-content: stretch;
      }

      .form-actions sl-button {
        flex: 1;
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

    :host(.sl-theme-dark) .scope-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .scope-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .scope-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .create-scope-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .create-scope-card:hover {
      background-color: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .empty-state-title {
      color: var(--sl-color-neutral-100);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) context!: RouteContext;

  @state() private scopes: Scope[] = [];
  @state() private loading = true;
  @state() private error = '';
  @state() private showCreateDialog = false;
  @state() private isSubmitting = false;

  // Form state
  @state() private formName = '';
  @state() private formDescription = '';
  @state() private formIcon = '';
  @state() private formType: SystemScopeType = 'todo';

  private systemScopeTypes: Array<{type: SystemScopeType, label: string, icon: string, description: string}> = [
    { type: 'todo', label: 'Todo', icon: 'check-circle', description: 'Task and to-do management' },
    { type: 'note', label: 'Note', icon: 'pencil-square', description: 'Notes and documentation' },
    { type: 'brainstorm', label: 'Brainstorm', icon: 'light-bulb', description: 'Ideas and brainstorming' },
    { type: 'checklist', label: 'Checklist', icon: 'check-square', description: 'Step-by-step checklists' },
    { type: 'milestone', label: 'Milestone', icon: 'target', description: 'Goals and milestones' },
    { type: 'resource', label: 'Resource', icon: 'book-open', description: 'Resources and references' },
    { type: 'bookmark', label: 'Bookmark', icon: 'bookmark', description: 'Bookmarks and links' },
    { type: 'event', label: 'Event', icon: 'calendar', description: 'Events and calendar items' },
    { type: 'timeblock', label: 'Time Block', icon: 'clock', description: 'Time blocking and scheduling' },
    { type: 'flow', label: 'Flow', icon: 'arrows-right-left', description: 'Workflows and processes' },
  ];

  async connectedCallback() {
    super.connectedCallback();
    await this.loadScopes();
  }

  async updated(changedProperties: Map<string, any>) {
    const accountId = this.stateController.state.currentAccount?.id;
    if (changedProperties.has('context') || changedProperties.has('stateController')) {
      await this.loadScopes();
    }
  }

  private async loadScopes() {
    const accountId = this.stateController.state.currentAccount?.id;
    if (!accountId) return;

    try {
      this.loading = true;
      this.error = '';

      const { data, error } = await supabase.getScopes(accountId);
      if (error) throw error;
      
      this.scopes = data || [];
    } catch (error) {
      console.error('Failed to load scopes:', error);
      this.error = error instanceof Error ? error.message : 'Failed to load scopes';
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="main-content">
          <div class="page-content">
            <skeleton-loader type="title"></skeleton-loader>
            <skeleton-loader type="card" count="6"></skeleton-loader>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="main-content">
          <div class="page-content">
            <error-message 
              .message=${this.error}
              @retry=${this.loadScopes}
            ></error-message>
          </div>
        </div>
      `;
    }

    return html`
      <div class="main-content">
        <div class="page-header">
          <div class="header-content">
            <div class="header-text">
              <h1 class="page-title">Scopes</h1>
              <p class="page-subtitle">Organize your work with flexible scope types</p>
            </div>
            <sl-button variant="primary" @click=${this.handleCreateScope}>
              <sl-icon slot="prefix" name="plus"></sl-icon>
              Create Scope
            </sl-button>
          </div>
        </div>

        <div class="page-content">
          ${this.scopes.length === 0 ? this.renderEmptyState() : this.renderScopes()}
        </div>

        <!-- Create Scope Dialog -->
        <sl-dialog 
          label="Create New Scope" 
          ?open=${this.showCreateDialog} 
          @sl-request-close=${() => this.showCreateDialog = false}
        >
          ${this.renderCreateForm()}
        </sl-dialog>
      </div>
    `;
  }

  private renderEmptyState() {
    return html`
      <div class="empty-state">
        <div class="empty-state-icon">🎯</div>
        <h2 class="empty-state-title">No scopes yet</h2>
        <p class="empty-state-text">
          Scopes help you organize different types of work. Create your first scope to get started.
        </p>
        <sl-button variant="primary" @click=${this.handleCreateScope}>
          Create Your First Scope
        </sl-button>
      </div>
    `;
  }

  private renderScopes() {
    return html`
      <div class="scopes-grid">
        ${this.scopes.map(scope => html`
          <div class="scope-card" @click=${() => this.goToScope(scope)}>
            <div class="scope-header">
              <div class="scope-info">
                <div class="scope-icon">
                  <sl-icon name=${this.mapEmojiToHeroicon(scope.icon || '📝')}></sl-icon>
                </div>
                <h3 class="scope-name">${scope.name}</h3>
                <p class="scope-description">${scope.description || 'No description'}</p>
              </div>
              <div class="scope-type-badge ${scope.is_system ? 'system' : 'custom'}">
                ${scope.is_system ? 'System' : 'Custom'}
              </div>
            </div>
            
            <div class="scope-stats">
              <span>0 items</span>
              <span>Updated ${new Date(scope.updated_at).toLocaleDateString()}</span>
            </div>
            
            <div class="scope-actions" @click=${(e: Event) => e.stopPropagation()}>
              <sl-button size="small" variant="default">
                Edit
              </sl-button>
              <sl-button size="small" variant="danger" ?disabled=${scope.is_system}>
                Delete
              </sl-button>
            </div>
          </div>
        `)}
        
        <div class="create-scope-card" @click=${this.handleCreateScope}>
          <div class="create-scope-icon">➕</div>
          <div class="create-scope-text">Create New Scope</div>
          <div class="create-scope-description">Add a custom scope type</div>
        </div>
      </div>
    `;
  }

  private renderCreateForm() {
    return html`
      <div class="create-form">
        <sl-input
          label="Scope Name"
          placeholder="Enter scope name"
          .value=${this.formName}
          @sl-input=${(e: CustomEvent) => this.formName = (e.target as HTMLInputElement)?.value}
          required
        ></sl-input>

        <sl-textarea
          label="Description"
          placeholder="Describe what this scope is for (optional)"
          .value=${this.formDescription}
          @sl-input=${(e: CustomEvent) => this.formDescription = (e.target as HTMLTextAreaElement)?.value}
          rows="2"
        ></sl-textarea>

        <div class="form-grid">
          <sl-select
            label="Scope Type"
            .value=${this.formType}
            @sl-change=${(e: CustomEvent) => this.formType = (e.target as HTMLSelectElement)?.value as SystemScopeType}
            required
          >
            ${this.systemScopeTypes.map(type => html`
              <sl-option value=${type.type}>
                ${type.icon} ${type.label} - ${type.description}
              </sl-option>
            `)}
          </sl-select>

          <sl-input
            label="Icon (Emoji)"
            placeholder="📝"
            .value=${this.formIcon}
            @sl-input=${(e: CustomEvent) => this.formIcon = (e.target as HTMLInputElement)?.value}
            maxlength="2"
          ></sl-input>
        </div>

        <div class="form-actions">
          <sl-button variant="default" @click=${this.cancelCreate}>
            Cancel
          </sl-button>
          <sl-button 
            variant="primary" 
            @click=${this.submitCreate}
            ?loading=${this.isSubmitting}
            ?disabled=${!this.formName.trim()}
          >
            Create Scope
          </sl-button>
        </div>
      </div>
    `;
  }

  private handleCreateScope() {
    this.showCreateDialog = true;
    this.resetForm();
  }

  private cancelCreate() {
    this.showCreateDialog = false;
    this.resetForm();
  }

  private resetForm() {
    this.formName = '';
    this.formDescription = '';
    this.formIcon = '';
    this.formType = 'todo';
  }

  private async submitCreate() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      const accountId = this.stateController.state.currentAccount?.id;
      if (!accountId) throw new Error('Account not found');

      const { error } = await supabase.createScope(accountId, {
        name: this.formName.trim(),
        description: this.formDescription?.trim() || '',
        icon: this.formIcon.trim(),
        type: this.formType,
      });

      if (error) throw error;

      this.showCreateDialog = false;
      this.resetForm();
      await this.loadScopes();
    } catch (error) {
      console.error('Failed to create scope:', error);
      this.error = error instanceof Error ? error.message : 'Failed to create scope';
    } finally {
      this.isSubmitting = false;
    }
  }

  private mapEmojiToHeroicon(emoji: string): string {
    switch (emoji) {
      case '📝': return 'pencil-square';
      case '🎯': return 'target';
      case '✅': return 'check-circle';
      case '☑️': return 'check-square';
      case '📚': return 'book-open';
      case '🔖': return 'bookmark';
      case '📅': return 'calendar';
      case '⏰': return 'clock';
      case '🔄': return 'arrows-right-left';
      case '💡': return 'light-bulb';
      default: return 'pencil-square';
    }
  }
}

