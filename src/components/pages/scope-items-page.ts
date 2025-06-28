// src/components/pages/scope-items-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext, Scope, ScopeItem } from '../../types';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';
import '../common/skeleton-loader';
import '../common/error-message';
import '../forms/scope-item-form';

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
      position: relative;
    }

    .form-header {
      display: flex;
      justify-content: between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .form-title {
      font-size: var(--sl-font-size-large);
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0;
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
      position: relative;
    }

    .item-card:hover {
      box-shadow: var(--sl-shadow-medium);
      border-color: var(--sl-color-primary-300);
    }

    .item-card.editing {
      border-color: var(--sl-color-warning-400);
      background-color: var(--sl-color-warning-50);
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
      flex: 1;
    }

    .item-status {
      margin-left: 1rem;
    }

    .item-content {
      margin: 0.5rem 0;
      color: var(--sl-color-neutral-700);
      line-height: 1.5;
    }

    .item-url {
      margin: 0.5rem 0;
    }

    .item-url a {
      color: var(--sl-color-primary-600);
      text-decoration: none;
      font-size: var(--sl-font-size-small);
    }

    .item-url a:hover {
      text-decoration: underline;
    }

    .item-checklist {
      margin: 0.75rem 0;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.25rem 0;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
    }

    .checklist-item.completed {
      text-decoration: line-through;
      opacity: 0.7;
    }

    .item-meta {
      display: flex;
      gap: 1rem;
      font-size: var(--sl-font-size-small);
      color: var(--sl-color-neutral-600);
      margin: 0.75rem 0;
      flex-wrap: wrap;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--sl-color-neutral-200);
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

    .notification {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      max-width: 400px;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        padding: 1rem;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .item-actions {
        flex-wrap: wrap;
      }

      .item-meta {
        flex-direction: column;
        gap: 0.5rem;
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

    :host(.sl-theme-dark) .form-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .create-item-form,
    :host(.sl-theme-dark) .item-card {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .item-card.editing {
      background-color: var(--sl-color-warning-950);
      border-color: var(--sl-color-warning-600);
    }

    :host(.sl-theme-dark) .item-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .item-content {
      color: var(--sl-color-neutral-300);
    }

    :host(.sl-theme-dark) .item-meta {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .form-header {
      border-bottom-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .item-actions {
      border-top-color: var(--sl-color-neutral-700);
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
  @state() private editingItem: ScopeItem | null = null;
  @state() private notification: { type: 'success' | 'error'; message: string } | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  async updated(changedProperties: Map<string, any>) {
    const scopeId = this.context?.params?.scopeId;
    const accountId = this.stateController.state.currentAccount?.id;
    if (changedProperties.has('context') || changedProperties.has('stateController')) {
      await this.loadData();
    }
  }

  private async loadData() {
    const scopeId = this.context.params.scopeId;
    const accountId = this.stateController.state.currentAccount?.id;
    
    console.log(`[ScopeItemsPage] Loading data for scope ${scopeId}, account ${accountId}`);
    
    if (!scopeId || !accountId) {
      console.log(`[ScopeItemsPage] Missing required data: scopeId=${scopeId}, accountId=${accountId}`);
      return;
    }

    // Don't reload if we already have the correct scope loaded
    if (this.scope?.id === scopeId && this.items.length > 0 && !this.loading) {
      console.log(`[ScopeItemsPage] Data already loaded for scope ${scopeId}, skipping reload`);
      return;
    }

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
      console.log(`[ScopeItemsPage] Loaded ${this.items.length} items for scope ${scopeId}`);
    } catch (error) {
      console.error('Failed to load scope data:', error);
      this.error = error instanceof Error ? error.message : 'Failed to load data';
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
            <skeleton-loader type="text" count="3"></skeleton-loader>
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
              @retry=${this.loadData}
              showHome
              @go-home=${() => this.routerController.goToTeam(this.context.params.teamSlug)}
            ></error-message>
          </div>
        </div>
      `;
    }

    return html`
      <div class="main-content">
        <div class="page-header">
          <h1 class="page-title">${this.scope?.name || 'Scope Items'}</h1>
          <p class="page-subtitle">${this.scope?.description || 'Manage items in this scope'}</p>
        </div>

        <div class="page-content">
          <div class="content-section">
            <div class="section-header">
              <h2 class="section-title">
                ${this.editingItem ? 'Edit Item' : 'Create New Item'}
              </h2>
              <sl-button 
                variant=${this.showCreateForm || this.editingItem ? 'default' : 'primary'}
                @click=${this.toggleCreateForm}
              >
                <sl-icon slot="prefix" name=${this.showCreateForm || this.editingItem ? 'x' : 'plus'}></sl-icon>
                ${this.showCreateForm || this.editingItem ? 'Cancel' : 'Add Item'}
              </sl-button>
            </div>

            ${this.showCreateForm || this.editingItem ? this.renderForm() : ''}
          </div>

          <div class="content-section">
            <div class="section-header">
              <h2 class="section-title">Items (${this.items.length})</h2>
              ${this.items.length > 0 ? html`
                <sl-button variant="default" size="small" @click=${this.refreshItems}>
                  <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                  Refresh
                </sl-button>
              ` : ''}
            </div>

            ${this.items.length === 0 ? this.renderEmptyState() : this.renderItems()}
          </div>
        </div>
      </div>

      ${this.notification ? html`
        <div class="notification">
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
      ` : ''}
    `;
  }

  private renderForm() {
    const accountId = this.stateController.state.currentAccount?.id;
    const scopeId = this.scope?.id;
    const scopeType = this.scope?.metadata?.scope_type || 'todo';

    if (!accountId || !scopeId) {
      return html`
        <div class="create-item-form">
          <error-message 
            message="Missing required data for form"
            title="Configuration Error"
            .showRetry=${false}
          ></error-message>
        </div>
      `;
    }

    return html`
      <div class="create-item-form">
        <div class="form-header">
          <h3 class="form-title">
            ${this.editingItem ? `Edit "${this.editingItem.title}"` : 'Create New Item'}
          </h3>
        </div>
        
        <scope-item-form
          .scopeType=${scopeType}
          .accountId=${accountId}
          .scopeId=${scopeId}
          .editItem=${this.editingItem}
          @item-created=${this.handleItemCreated}
          @item-updated=${this.handleItemUpdated}
          @form-cancelled=${this.handleFormCancelled}
        ></scope-item-form>
      </div>
    `;
  }

  private renderItems() {
    return html`
      <div class="items-grid">
        ${this.items.map(item => html`
          <div class="item-card ${this.editingItem?.id === item.id ? 'editing' : ''}">
            <div class="item-header">
              <h3 class="item-title">${item.title}</h3>
              <sl-badge 
                variant=${this.getStatusVariant(item.status)} 
                class="item-status"
              >
                ${item.status.replace('_', ' ')}
              </sl-badge>
            </div>
            
            ${item.metadata?.content ? html`
              <div class="item-content">${item.metadata.content}</div>
            ` : ''}

            ${item.metadata?.url ? html`
              <div class="item-url">
                <a href="${item.metadata.url}" target="_blank" rel="noopener noreferrer">
                  <sl-icon name="link-45deg"></sl-icon>
                  ${item.metadata.url}
                </a>
              </div>
            ` : ''}

            ${item.checklist_items && item.checklist_items.length > 0 ? html`
              <div class="item-checklist">
                <strong>Checklist (${this.getCompletedCount(item.checklist_items)}/${item.checklist_items.length}):</strong>
                ${item.checklist_items.slice(0, 3).map(checklistItem => html`
                  <div class="checklist-item ${checklistItem.completed ? 'completed' : ''}">
                    <sl-icon name=${checklistItem.completed ? 'check-square' : 'square'}></sl-icon>
                    ${checklistItem.text}
                  </div>
                `)}
                ${item.checklist_items.length > 3 ? html`
                  <div class="checklist-item">
                    <sl-icon name="three-dots"></sl-icon>
                    +${item.checklist_items.length - 3} more items
                  </div>
                ` : ''}
              </div>
            ` : ''}
            
            ${item.notes ? html`<p><strong>Notes:</strong> ${item.notes}</p>` : ''}
            
            <div class="item-meta">
              ${item.priority_level ? html`
                <span>
                  <sl-icon name="flag"></sl-icon>
                  Priority: ${item.priority_level}
                </span>
              ` : ''}
              ${item.due_at ? html`
                <span>
                  <sl-icon name="calendar"></sl-icon>
                  Due: ${new Date(item.due_at).toLocaleDateString()}
                </span>
              ` : ''}
              <span>
                <sl-icon name="clock"></sl-icon>
                Created: ${new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>

            <div class="item-actions">
              <sl-button 
                size="small" 
                variant="default"
                @click=${() => this.editItem(item)}
                ?disabled=${!!this.editingItem}
              >
                <sl-icon slot="prefix" name="pencil"></sl-icon>
                Edit
              </sl-button>
              <sl-button 
                size="small" 
                variant=${item.completed ? 'warning' : 'success'}
                @click=${() => this.toggleItemStatus(item)}
              >
                <sl-icon slot="prefix" name=${item.completed ? 'arrow-counterclockwise' : 'check'}></sl-icon>
                ${item.completed ? 'Reopen' : 'Complete'}
              </sl-button>
              <sl-button 
                size="small" 
                variant="danger"
                @click=${() => this.confirmDeleteItem(item)}
              >
                <sl-icon slot="prefix" name="trash"></sl-icon>
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
        <sl-button variant="primary" @click=${() => this.showCreateForm = true}>
          <sl-icon slot="prefix" name="plus"></sl-icon>
          Create First Item
        </sl-button>
      </div>
    `;
  }

  // Helper methods
  private getStatusVariant(status: string): string {
    switch (status) {
      case 'done': return 'success';
      case 'in_progress': return 'warning';
      case 'not_started': return 'neutral';
      default: return 'neutral';
    }
  }

  private getCompletedCount(items: any[]): number {
    return items.filter(item => item.completed).length;
  }

  private showNotification(type: 'success' | 'error', message: string) {
    this.notification = { type, message };
    // Auto-hide success notifications
    if (type === 'success') {
      setTimeout(() => {
        this.notification = null;
      }, 5000);
    }
  }

  // Event handlers
  private toggleCreateForm() {
    if (this.editingItem) {
      this.editingItem = null;
    } else {
      this.showCreateForm = !this.showCreateForm;
    }
  }

  private handleItemCreated(event: CustomEvent) {
    const newItem = event.detail.item;
    console.log('Item created:', newItem);
    
    // Add the new item to the beginning of the list
    this.items = [newItem, ...this.items];
    
    // Hide the form
    this.showCreateForm = false;
    
    // Show success notification
    this.showNotification('success', 'Item created successfully!');
  }

  private handleItemUpdated(event: CustomEvent) {
    const updatedItem = event.detail.item;
    console.log('Item updated:', updatedItem);
    
    // Update the item in the list
    this.items = this.items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    // Exit edit mode
    this.editingItem = null;
    
    // Show success notification
    this.showNotification('success', 'Item updated successfully!');
  }

  private handleFormCancelled() {
    this.showCreateForm = false;
    this.editingItem = null;
  }

  private editItem(item: ScopeItem) {
    this.editingItem = item;
    this.showCreateForm = false;
  }

  private async toggleItemStatus(item: ScopeItem) {
    try {
      const updatedStatus = item.completed ? 'not_started' : 'done';
      const { data, error } = await supabase.updateScopeItem(item.id, {
        status: updatedStatus,
        completed: !item.completed
      });
      
      if (error) throw new Error(error);
      
      // Update the item in the local array
      this.items = this.items.map(i => 
        i.id === item.id ? { ...i, status: updatedStatus, completed: !item.completed } : i
      );

      this.showNotification('success', `Item marked as ${item.completed ? 'incomplete' : 'complete'}!`);
    } catch (error) {
      console.error('Failed to update item:', error);
      this.showNotification('error', 'Failed to update item status. Please try again.');
    }
  }

  private async confirmDeleteItem(item: ScopeItem) {
    // Use a native confirm dialog for now - could be replaced with a Shoelace dialog
    if (!confirm(`Are you sure you want to delete "${item.title}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase.deleteScopeItem(item.id);
      if (error) throw new Error(error);
      
      // Remove the item from the local array
      this.items = this.items.filter(i => i.id !== item.id);
      
      // If we were editing this item, exit edit mode
      if (this.editingItem?.id === item.id) {
        this.editingItem = null;
      }

      this.showNotification('success', 'Item deleted successfully!');
    } catch (error) {
      console.error('Failed to delete item:', error);
      this.showNotification('error', 'Failed to delete item. Please try again.');
    }
  }

  private async refreshItems() {
    await this.loadData();
    this.showNotification('success', 'Items refreshed!');
  }
}

