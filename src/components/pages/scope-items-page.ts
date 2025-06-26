import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext, Scope, ScopeItem } from '../../types';
import { ScopeItemFormData, validateScopeItem, getScopeRequiredFields } from '../../types/scopes';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';

@customElement('scope-items-page')
export class ScopeItemsPage extends LitElement {
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

    .content-section {
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0;
    }

    .create-item-form {
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-grid {
      display: grid;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-grid.two-columns {
      grid-template-columns: 1fr 1fr;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .items-grid {
      display: grid;
      gap: 1rem;
    }

    .item-card {
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      transition: all 0.2s;
    }

    .item-card:hover {
      box-shadow: var(--sl-shadow-medium);
      border-color: var(--sl-color-primary-300);
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .item-title {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      margin: 0;
    }

    .item-status {
      font-size: var(--sl-font-size-small);
      padding: 0.25rem 0.5rem;
      border-radius: var(--sl-border-radius-small);
      font-weight: var(--sl-font-weight-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .item-status.not_started {
      background-color: var(--sl-color-neutral-100);
      color: var(--sl-color-neutral-700);
    }

    .item-status.in_progress {
      background-color: var(--sl-color-warning-100);
      color: var(--sl-color-warning-700);
    }

    .item-status.done {
      background-color: var(--sl-color-success-100);
      color: var(--sl-color-success-700);
    }

    .item-meta {
      display: flex;
      gap: 1rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--sl-color-neutral-600);
    }

    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .checklist-items {
      margin-top: 0.5rem;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
      font-size: var(--sl-font-size-small);
    }

    .add-checklist-item {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        padding: 1rem;
      }

      .form-grid.two-columns {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
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

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .create-item-form,
    :host(.sl-theme-dark) .item-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .item-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .item-meta {
      color: var(--sl-color-neutral-400);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) context!: RouteContext;

  @state() private scope: Scope | null = null;
  @state() private items: ScopeItem[] = [];
  @state() private loading = true;
  @state() private error = '';
  @state() private showCreateForm = false;
  
  // Form state
  @state() private formData: ScopeItemFormData = {};
  @state() private isSubmitting = false;
  @state() private newChecklistItem = '';

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('context')) {
      this.loadData();
    }
  }

  private async loadData() {
    const scopeId = this.context.params.scopeId;
    const accountId = this.stateController.state.currentAccount?.id;
    
    if (!scopeId || !accountId) return;

    try {
      this.loading = true;
      this.error = '';

      // Load scope details
      const { data: scopes, error: scopeError } = await supabase.getScopes(accountId);
      if (scopeError) throw scopeError;
      
      this.scope = scopes?.find(s => s.id === scopeId) || null;
      if (!this.scope) {
        this.error = 'Scope not found';
        return;
      }

      // Load scope items
      const { data: items, error: itemsError } = await supabase.getScopeItems(accountId, scopeId);
      if (itemsError) throw itemsError;
      
      this.items = items || [];
    } catch (error) {
      console.error('Failed to load scope data:', error);
      this.error = error instanceof Error ? error.message : 'Failed to load data';
    } finally {
      this.loading = false;
    }
  }

  render() {
    const currentAccount = this.stateController.state.currentAccount;
    
    if (this.loading) {
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
              <skeleton-loader type="title"></skeleton-loader>
              <skeleton-loader type="text" count="3"></skeleton-loader>
            </div>
          </div>
        </div>
      `;
    }

    if (this.error) {
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
              <error-message 
                .message=${this.error}
                @retry=${this.loadData}
                showHome
                @go-home=${() => this.routerController.goToTeam(this.context.params.teamSlug)}
              ></error-message>
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
            <h1 class="page-title">${this.scope?.name || 'Scope Items'}</h1>
            <p class="page-subtitle">${this.scope?.description || 'Manage items in this scope'}</p>
          </div>

          <div class="page-content">
            <div class="content-section">
              <div class="section-header">
                <h2 class="section-title">Create New Item</h2>
                <sl-button 
                  variant=${this.showCreateForm ? 'default' : 'primary'}
                  @click=${() => this.showCreateForm = !this.showCreateForm}
                >
                  ${this.showCreateForm ? 'Cancel' : 'Add Item'}
                </sl-button>
              </div>

              ${this.showCreateForm ? this.renderCreateForm() : ''}
            </div>

            <div class="content-section">
              <div class="section-header">
                <h2 class="section-title">Items (${this.items.length})</h2>
              </div>

              ${this.items.length === 0 ? this.renderEmptyState() : this.renderItems()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderCreateForm() {
    const requiredFields = getScopeRequiredFields(this.scope?.metadata?.scope_type || 'todo');
    const scopeType = this.scope?.metadata?.scope_type || 'todo';

    return html`
      <div class="create-item-form">
        <div class="form-grid">
          ${requiredFields.includes('title') || !requiredFields.includes('content') ? html`
            <sl-input
              label="Title"
              placeholder="Enter item title"
              .value=${this.formData.title || ''}
              @sl-input=${(e: CustomEvent) => this.updateFormData('title', e.target.value)}
              ?required=${requiredFields.includes('title')}
            ></sl-input>
          ` : ''}

          ${requiredFields.includes('content') ? html`
            <sl-textarea
              label="Content"
              placeholder="Enter content"
              rows="3"
              .value=${this.formData.content || ''}
              @sl-input=${(e: CustomEvent) => this.updateFormData('content', e.target.value)}
              required
            ></sl-textarea>
          ` : ''}

          ${requiredFields.includes('url') ? html`
            <sl-input
              label="URL"
              type="url"
              placeholder="https://example.com"
              .value=${this.formData.url || ''}
              @sl-input=${(e: CustomEvent) => this.updateFormData('url', e.target.value)}
              required
            ></sl-input>
          ` : ''}
        </div>

        ${requiredFields.includes('items') ? html`
          <div class="checklist-items">
            <label>Checklist Items</label>
            ${(this.formData.items || []).map((item, index) => html`
              <div class="checklist-item">
                <sl-checkbox 
                  ?checked=${item.completed}
                  @sl-change=${(e: CustomEvent) => this.updateChecklistItem(index, 'completed', e.target.checked)}
                ></sl-checkbox>
                <sl-input 
                  .value=${item.text}
                  @sl-input=${(e: CustomEvent) => this.updateChecklistItem(index, 'text', e.target.value)}
                  placeholder="Checklist item"
                ></sl-input>
                <sl-button 
                  variant="text" 
                  size="small"
                  @click=${() => this.removeChecklistItem(index)}
                >
                  Remove
                </sl-button>
              </div>
            `)}
            
            <div class="add-checklist-item">
              <sl-input 
                placeholder="Add checklist item"
                .value=${this.newChecklistItem}
                @sl-input=${(e: CustomEvent) => this.newChecklistItem = e.target.value}
                @keydown=${this.handleChecklistKeydown}
              ></sl-input>
              <sl-button 
                variant="default" 
                @click=${this.addChecklistItem}
                ?disabled=${!this.newChecklistItem.trim()}
              >
                Add
              </sl-button>
            </div>
          </div>
        ` : ''}

        <div class="form-grid two-columns">
          <sl-select
            label="Priority"
            .value=${this.formData.priority_level || ''}
            @sl-change=${(e: CustomEvent) => this.updateFormData('priority_level', e.target.value)}
          >
            <sl-option value="">No priority</sl-option>
            <sl-option value="low">Low</sl-option>
            <sl-option value="medium">Medium</sl-option>
            <sl-option value="high">High</sl-option>
            <sl-option value="critical">Critical</sl-option>
            <sl-option value="urgent">Urgent</sl-option>
          </sl-select>

          <sl-input
            label="Due Date"
            type="datetime-local"
            .value=${this.formData.due_at || ''}
            @sl-input=${(e: CustomEvent) => this.updateFormData('due_at', e.target.value)}
          ></sl-input>
        </div>

        <sl-textarea
          label="Notes"
          placeholder="Additional notes (optional)"
          rows="2"
          .value=${this.formData.notes || ''}
          @sl-input=${(e: CustomEvent) => this.updateFormData('notes', e.target.value)}
        ></sl-textarea>

        <div class="form-actions">
          <sl-button variant="default" @click=${this.resetForm}>
            Cancel
          </sl-button>
          <sl-button 
            variant="primary" 
            @click=${this.handleSubmit}
            ?loading=${this.isSubmitting}
            ?disabled=${!this.isFormValid()}
          >
            Create Item
          </sl-button>
        </div>
      </div>
    `;
  }

  private renderItems() {
    return html`
      <div class="items-grid">
        ${this.items.map(item => html`
          <div class="item-card">
            <div class="item-header">
              <h3 class="item-title">${item.title}</h3>
              <span class="item-status ${item.status}">${item.status.replace('_', ' ')}</span>
            </div>
            
            ${item.notes ? html`<p>${item.notes}</p>` : ''}
            
            <div class="item-meta">
              ${item.priority_level ? html`<span>Priority: ${item.priority_level}</span>` : ''}
              ${item.due_at ? html`<span>Due: ${new Date(item.due_at).toLocaleDateString()}</span>` : ''}
              <span>Created: ${new Date(item.created_at).toLocaleDateString()}</span>
            </div>

            <div class="item-actions">
              <sl-button size="small" variant="default">
                Edit
              </sl-button>
              <sl-button size="small" variant="default">
                ${item.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </sl-button>
              <sl-button size="small" variant="danger">
                Delete
              </sl-button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  private renderEmptyState() {
    return html`
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <h3>No items yet</h3>
        <p>Create your first item to get started with this scope.</p>
      </div>
    `;
  }

  private updateFormData(key: keyof ScopeItemFormData, value: any) {
    this.formData = { ...this.formData, [key]: value };
  }

  private updateChecklistItem(index: number, key: string, value: any) {
    const items = [...(this.formData.items || [])];
    items[index] = { ...items[index], [key]: value };
    this.updateFormData('items', items);
  }

  private addChecklistItem() {
    if (!this.newChecklistItem.trim()) return;
    
    const items = [...(this.formData.items || [])];
    items.push({
      id: crypto.randomUUID(),
      text: this.newChecklistItem.trim(),
      completed: false
    });
    
    this.updateFormData('items', items);
    this.newChecklistItem = '';
  }

  private removeChecklistItem(index: number) {
    const items = [...(this.formData.items || [])];
    items.splice(index, 1);
    this.updateFormData('items', items);
  }

  private handleChecklistKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addChecklistItem();
    }
  }

  private isFormValid(): boolean {
    const scopeType = this.scope?.metadata?.scope_type || 'todo';
    return validateScopeItem(scopeType, this.formData);
  }

  private async handleSubmit() {
    if (!this.isFormValid() || this.isSubmitting) return;

    const accountId = this.stateController.state.currentAccount?.id;
    const scopeId = this.scope?.id;
    
    if (!accountId || !scopeId) return;

    this.isSubmitting = true;

    try {
      const itemData = {
        account_id: accountId,
        scope_id: scopeId,
        title: this.formData.title || '',
        notes: this.formData.notes || '',
        priority_level: this.formData.priority_level || null,
        due_at: this.formData.due_at || null,
        metadata: {
          content: this.formData.content || '',
          url: this.formData.url || '',
          items: this.formData.items || [],
        },
        tags: this.formData.tags || [],
        checklist_items: this.formData.items || [],
      };

      const { data, error } = await supabase.createScopeItem(itemData);
      
      if (error) throw error;
      
      if (data) {
        this.items = [data, ...this.items];
        this.resetForm();
      }
    } catch (error) {
      console.error('Failed to create item:', error);
      // TODO: Show error message
    } finally {
      this.isSubmitting = false;
    }
  }

  private resetForm() {
    this.formData = {};
    this.newChecklistItem = '';
    this.showCreateForm = false;
  }
}

