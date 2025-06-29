// src/components/pages/scopes-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext, SystemScopeType, Scope } from '../../types';
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
      color: var(--sl-color-primary-600);
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
      color: var(--sl-color-neutral-400);
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

    .type-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      cursor: pointer;
      transition: all 0.2s;
    }

    .type-option:hover {
      border-color: var(--sl-color-primary-300);
      background-color: var(--sl-color-primary-50);
    }

    .type-option.selected {
      border-color: var(--sl-color-primary-500);
      background-color: var(--sl-color-primary-100);
    }

    .type-option-icon {
      font-size: 1.25rem;
      color: var(--sl-color-primary-600);
    }

    .type-option-info {
      flex: 1;
    }

    .type-option-name {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      margin-bottom: 0.25rem;
    }

    .type-option-description {
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .type-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
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

      .type-grid {
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

    :host(.sl-theme-dark) .type-option {
      border-color: var(--sl-color-neutral-700);
      background-color: var(--sl-color-neutral-800);
    }

    :host(.sl-theme-dark) .type-option:hover {
      border-color: var(--sl-color-primary-400);
      background-color: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .type-option.selected {
      border-color: var(--sl-color-primary-500);
      background-color: var(--sl-color-primary-900);
    }

    :host(.sl-theme-dark) .type-option-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .type-option-description {
      color: var(--sl-color-neutral-400);
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
    if (changedProperties.has('context') || changedProperties.has('stateController')) {
      const newAccountId = this.stateController.state.currentAccount?.id;
      const oldAccountId = changedProperties.get('stateController')?.state?.currentAccount?.id;
      
      if (newAccountId && newAccountId !== oldAccountId) {
        await this.loadScopes();
      }
    }
  }

  private async loadScopes() {
    const accountId = this.stateController.state.currentAccount?.id;
    if (!accountId) {
      console.log('[ScopesPage] No account ID available');
      this.loading = false;
      return;
    }

    try {
      this.loading = true;
      this.error = '';

      console.log('[ScopesPage] Loading scopes for account:', accountId);
      const { data, error } = await supabase.getScopes(accountId);
      if (error) {
        console.error('[ScopesPage] Error loading scopes:', error);
        throw error;
      }
      
      console.log('[ScopesPage] Loaded scopes:', data);
      this.scopes = data || [];
    } catch (error) {
      console.error('[ScopesPage] Failed to load scopes:', error);
      this.error = error instanceof Error ? error.message : 'Failed to load scopes';
    } finally {
      this.loading = false;
    }
  }

  private goToScope(scope: Scope) {
    const teamSlug = this.context.params.teamSlug;
    if (teamSlug) {
      this.routerController.goToScopeItems(teamSlug, scope.id);
    }
  }

  private getIconForScopeType(type: SystemScopeType): string {
    const scopeType = this.systemScopeTypes.find(st => st.type === type);
    return scopeType?.icon || 'pencil-square';
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
            <sl-alert variant="danger" open>
              <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
              <strong>Error loading scopes</strong><br>
              ${this.error}
              <sl-button slot="action" variant="neutral" size="small" @click=${this.loadScopes}>
                Retry
              </sl-button>
            </sl-alert>
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
        <div class="empty-state-icon">
          <sl-icon name="target"></sl-icon>
        </div>
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
                  <sl-icon name=${this.getIconForScopeType(scope.slug as SystemScopeType)}></sl-icon>
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
                <sl-icon slot="prefix" name="pencil"></sl-icon>
                Edit
              </sl-button>
              <sl-button size="small" variant="danger" ?disabled=${scope.is_system}>
                <sl-icon slot="prefix" name="trash"></sl-icon>
                Delete
              </sl-button>
            </div>
          </div>
        `)}
        
        <div class="create-scope-card" @click=${this.handleCreateScope}>
          <div class="create-scope-icon">
            <sl-icon name="plus-circle"></sl-icon>
          </div>
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
          @sl-input=${(e: CustomEvent) => this.formName = (e.target as HTMLInputElement)?.value || ''}
          required
        ></sl-input>

        <sl-textarea
          label="Description"
          placeholder="Describe what this scope is for (optional)"
          .value=${this.formDescription}
          @sl-input=${(e: CustomEvent) => this.formDescription = (e.target as HTMLTextAreaElement)?.value || ''}
          rows="2"
        ></sl-textarea>

        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: var(--sl-font-weight-medium);">
            Scope Type
          </label>
          <div class="type-grid">
            ${this.systemScopeTypes.map(type => html`
              <div 
                class="type-option ${this.formType === type.type ? 'selected' : ''}"
                @click=${() => this.formType = type.type}
              >
                <div class="type-option-icon">
                  <sl-icon name=${type.icon}></sl-icon>
                </div>
                <div class="type-option-info">
                  <div class="type-option-name">${type.label}</div>
                  <div class="type-option-description">${type.description}</div>
                </div>
              </div>
            `)}
          </div>
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
    this.formType = 'todo';
  }

  private async submitCreate() {
    if (this.isSubmitting || !this.formName.trim()) return;
    
    this.isSubmitting = true;
    this.error = '';

    try {
      const accountId = this.stateController.state.currentAccount?.id;
      if (!accountId) throw new Error('Account not found');

      console.log('[ScopesPage] Creating scope:', {
        accountId,
        name: this.formName.trim(),
        description: this.formDescription?.trim(),
        type: this.formType
      });

      const { error } = await supabase.createScope({
        account_id: accountId,
        name: this.formName.trim(),
        description: this.formDescription?.trim() || '',
        slug: this.formType,
        is_system: false,
        show_in_sidebar: true
      });

      if (error) {
        console.error('[ScopesPage] Create scope error:', error);
        throw error;
      }

      console.log('[ScopesPage] Scope created successfully');
      this.showCreateDialog = false;
      this.resetForm();
      await this.loadScopes();
      
      // Trigger sidebar refresh
      this.dispatchEvent(new CustomEvent('scopes-updated', {
        bubbles: true,
        composed: true
      }));
      
    } catch (error) {
      console.error('[ScopesPage] Failed to create scope:', error);
      this.error = error instanceof Error ? error.message : 'Failed to create scope';
    } finally {
      this.isSubmitting = false;
    }
  }
}

