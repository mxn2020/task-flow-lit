// src/components/forms/scope-item-form.ts
import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseForm } from '../base/base-form';
import { ScopeItemFormData, validateScopeItem, getScopeRequiredFields } from '../../types/scopes';
import { ScopeItemService } from '../../services/scope-item-service';
import { ScopeItem } from '../../types';

interface ScopeItemFormSubmitEvent extends CustomEvent {
  detail: { item: ScopeItem };
}

@customElement('scope-item-form')
export class ScopeItemForm extends BaseForm<ScopeItemFormData> {
  static styles = [
    BaseForm.styles,
    css`
      :host {
        display: block;
      }

      .form-container {
        max-width: 100%;
      }

      .form-grid {
        display: grid;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .form-grid.two-columns {
        grid-template-columns: 1fr 1fr;
      }

      .checklist-section {
        margin-bottom: 1rem;
      }

      .checklist-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .checklist-header h4 {
        margin: 0;
        font-size: var(--sl-font-size-medium);
        font-weight: var(--sl-font-weight-semibold);
        color: var(--sl-color-neutral-700);
      }

      .checklist-items {
        space-y: 0.5rem;
      }

      .checklist-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        background-color: var(--sl-color-neutral-50);
        border: 1px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-small);
        margin-bottom: 0.5rem;
      }

      .checklist-item sl-input {
        flex: 1;
      }

      .add-checklist-item {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.75rem;
        padding: 0.75rem;
        background-color: var(--sl-color-neutral-25);
        border: 1px dashed var(--sl-color-neutral-300);
        border-radius: var(--sl-border-radius-small);
      }

      .add-checklist-item sl-input {
        flex: 1;
      }

      .form-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--sl-color-neutral-200);
      }

      .error-message {
        color: var(--sl-color-danger-600);
        font-size: var(--sl-font-size-small);
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .success-message {
        color: var(--sl-color-success-600);
        font-size: var(--sl-font-size-small);
        margin-top: 0.5rem;
        padding: 0.5rem;
        background-color: var(--sl-color-success-50);
        border: 1px solid var(--sl-color-success-200);
        border-radius: var(--sl-border-radius-small);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* Mobile styles */
      @media (max-width: 768px) {
        .form-grid.two-columns {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column;
        }

        .add-checklist-item {
          flex-direction: column;
        }

        .checklist-item {
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
        }
      }

      /* Dark theme styles */
      :host(.sl-theme-dark) .checklist-item {
        background-color: var(--sl-color-neutral-800);
        border-color: var(--sl-color-neutral-700);
      }

      :host(.sl-theme-dark) .add-checklist-item {
        background-color: var(--sl-color-neutral-900);
        border-color: var(--sl-color-neutral-600);
      }

      :host(.sl-theme-dark) .checklist-header h4 {
        color: var(--sl-color-neutral-300);
      }

      :host(.sl-theme-dark) .form-actions {
        border-top-color: var(--sl-color-neutral-700);
      }

      :host(.sl-theme-dark) .success-message {
        background-color: var(--sl-color-success-950);
        border-color: var(--sl-color-success-800);
        color: var(--sl-color-success-400);
      }
    `
  ];

  @property() scopeType: string = 'todo';
  @property() accountId!: string;
  @property() scopeId!: string;
  @property() editItem?: ScopeItem; // For edit mode
  
  @state() private showSuccess = false;
  @state() private successMessage = '';

  private scopeItemService = new ScopeItemService();

  connectedCallback() {
    super.connectedCallback();
    
    // Pre-populate form if editing
    if (this.editItem) {
      this.formData = {
        title: this.editItem.title,
        content: this.editItem.metadata?.content || '',
        url: this.editItem.metadata?.url || '',
        notes: this.editItem.notes || '',
        priority_level: this.editItem.priority_level,
        due_at: this.editItem.due_at,
        items: this.editItem.checklist_items || this.editItem.metadata?.items || [],
        tags: this.editItem.tags || []
      };
    }
  }

  protected validate(): boolean {
    this.clearErrors();
    const requiredFields = getScopeRequiredFields(this.scopeType as any);
    let isValid = true;

    if (requiredFields.includes('title') && !this.formData.title?.trim()) {
      this.setError('title', 'Title is required');
      isValid = false;
    }

    if (requiredFields.includes('content') && !this.formData.content?.trim()) {
      this.setError('content', 'Content is required');
      isValid = false;
    }

    if (requiredFields.includes('url')) {
      const url = this.formData.url?.trim();
      if (!url) {
        this.setError('url', 'URL is required');
        isValid = false;
      } else {
        try {
          new URL(url);
        } catch {
          this.setError('url', 'Please enter a valid URL');
          isValid = false;
        }
      }
    }

    if (requiredFields.includes('items') && (!this.formData.items || this.formData.items.length === 0)) {
      this.setError('items', 'At least one checklist item is required');
      isValid = false;
    }

    return isValid;
  }

  protected async submit(): Promise<void> {
    try {
      const itemData = {
        account_id: this.accountId,
        scope_id: this.scopeId,
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

      let result;
      if (this.editItem) {
        // Update existing item
        result = await this.scopeItemService.updateScopeItem(this.editItem.id, itemData);
        this.successMessage = 'Item updated successfully!';
      } else {
        // Create new item
        result = await this.scopeItemService.createScopeItem(itemData);
        this.successMessage = 'Item created successfully!';
      }

      const { data, error } = result;
      
      if (error) {
        throw new Error(error);
      }
      
      if (data) {
        // Show success message briefly
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);

        // Emit custom event for parent component
        this.dispatchEvent(new CustomEvent(this.editItem ? 'item-updated' : 'item-created', {
          detail: { item: data },
          bubbles: true,
          composed: true
        }) as ScopeItemFormSubmitEvent);
        
        // Reset form if creating new item
        if (!this.editItem) {
          this.formData = {};
        }
      }
    } catch (error) {
      // Set a general error that will be displayed
      this.setError('general', error instanceof Error ? error.message : 'An unexpected error occurred');
      throw error; // Re-throw so BaseForm can handle the submission state
    }
  }

  render() {
    const requiredFields = getScopeRequiredFields(this.scopeType as any);
    const isEditMode = !!this.editItem;

    return html`
      <div class="form-container">
        ${this.showSuccess ? html`
          <div class="success-message">
            <sl-icon name="check-circle"></sl-icon>
            ${this.successMessage}
          </div>
        ` : ''}

        ${this.errors.general ? html`
          <sl-alert variant="danger" open>
            <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
            <strong>Error:</strong> ${this.errors.general}
          </sl-alert>
        ` : ''}

        <form @submit=${(e: Event) => { e.preventDefault(); this.handleSubmit(); }}>
          <div class="form-grid">
            ${requiredFields.includes('title') || !requiredFields.includes('content') ? html`
              <sl-input
                label="Title"
                placeholder="Enter item title"
                .value=${this.formData.title || ''}
                @sl-input=${(e: CustomEvent) => this.updateField('title', (e.target as any).value)}
                ?required=${requiredFields.includes('title')}
                help-text=${requiredFields.includes('title') ? 'Required field' : ''}
              ></sl-input>
              ${this.renderError('title')}
            ` : ''}

            ${requiredFields.includes('content') ? html`
              <sl-textarea
                label="Content"
                placeholder="Enter content"
                rows="3"
                .value=${this.formData.content || ''}
                @sl-input=${(e: CustomEvent) => this.updateField('content', (e.target as any).value)}
                required
                help-text="Required field"
              ></sl-textarea>
              ${this.renderError('content')}
            ` : ''}

            ${requiredFields.includes('url') ? html`
              <sl-input
                label="URL"
                type="url"
                placeholder="https://example.com"
                .value=${this.formData.url || ''}
                @sl-input=${(e: CustomEvent) => this.updateField('url', (e.target as any).value)}
                required
                help-text="Enter a valid URL (required)"
              ></sl-input>
              ${this.renderError('url')}
            ` : ''}
          </div>

          ${requiredFields.includes('items') ? html`
            <div class="checklist-section">
              <div class="checklist-header">
                <h4>Checklist Items</h4>
                <sl-badge variant="neutral" pill>${(this.formData.items || []).length} items</sl-badge>
              </div>
              
              <div class="checklist-items">
                ${(this.formData.items || []).map((item, index) => html`
                  <div class="checklist-item">
                    <sl-checkbox 
                      ?checked=${item.completed}
                      @sl-change=${(e: CustomEvent) => this.updateChecklistItem(index, 'completed', (e.target as any).checked)}
                    ></sl-checkbox>
                    <sl-input 
                      .value=${item.text}
                      @sl-input=${(e: CustomEvent) => this.updateChecklistItem(index, 'text', (e.target as any).value)}
                      placeholder="Checklist item"
                      size="small"
                    ></sl-input>
                    <sl-icon-button 
                      name="trash"
                      label="Remove item"
                      @click=${() => this.removeChecklistItem(index)}
                    ></sl-icon-button>
                  </div>
                `)}
              </div>
              
              <div class="add-checklist-item">
                <sl-input 
                  placeholder="Add checklist item and press Enter"
                  @keydown=${this.handleChecklistKeydown}
                  size="small"
                ></sl-input>
                <sl-button 
                  variant="default" 
                  size="small"
                  @click=${this.addChecklistItem}
                >
                  <sl-icon slot="prefix" name="plus"></sl-icon>
                  Add
                </sl-button>
              </div>
              ${this.renderError('items')}
            </div>
          ` : ''}

          <div class="form-grid two-columns">
            <sl-select
              label="Priority"
              placeholder="Select priority"
              .value=${this.formData.priority_level || ''}
              @sl-change=${(e: CustomEvent) => this.updateField('priority_level', (e.target as any).value)}
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
              @sl-input=${(e: CustomEvent) => this.updateField('due_at', (e.target as any).value)}
            ></sl-input>
          </div>

          <sl-textarea
            label="Notes"
            placeholder="Additional notes (optional)"
            rows="2"
            .value=${this.formData.notes || ''}
            @sl-input=${(e: CustomEvent) => this.updateField('notes', (e.target as any).value)}
          ></sl-textarea>

          <div class="form-actions">
            <sl-button variant="default" type="button" @click=${this.resetForm}>
              <sl-icon slot="prefix" name="x"></sl-icon>
              Cancel
            </sl-button>
            <sl-button 
              variant="primary" 
              type="submit"
              ?loading=${this.isSubmitting}
              ?disabled=${!this.validate()}
            >
              <sl-icon slot="prefix" name=${isEditMode ? "check" : "plus"}></sl-icon>
              ${isEditMode ? 'Update Item' : 'Create Item'}
            </sl-button>
          </div>
        </form>
      </div>
    `;
  }

  protected renderError(field: string) {
    return this.errors[field] ? html`
      <div class="error-message">
        <sl-icon name="exclamation-triangle"></sl-icon>
        ${this.errors[field]}
      </div>
    ` : '';
  }

  private updateChecklistItem(index: number, key: string, value: any) {
    const items = [...(this.formData.items || [])];
    items[index] = { ...items[index], [key]: value };
    this.updateField('items', items);
  }

  private addChecklistItem() {
    const input = this.shadowRoot?.querySelector('.add-checklist-item sl-input') as any;
    const text = input?.value?.trim();
    if (!text) return;
    
    const items = [...(this.formData.items || [])];
    items.push({
      id: crypto.randomUUID(),
      text: text,
      completed: false
    });
    
    this.updateField('items', items);
    input.value = '';
  }

  private removeChecklistItem(index: number) {
    const items = [...(this.formData.items || [])];
    items.splice(index, 1);
    this.updateField('items', items);
  }

  private handleChecklistKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addChecklistItem();
    }
  }

  private resetForm() {
    this.formData = {};
    this.clearErrors();
    this.showSuccess = false;
    this.dispatchEvent(new CustomEvent('form-cancelled', { 
      bubbles: true, 
      composed: true 
    }));
  }
}

