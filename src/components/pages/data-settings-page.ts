// src/components/pages/data-settings-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { Group, Label, Category, Type } from '../../types';
import { GroupService, LabelService, CategoryService, TypeService } from '../../services';

interface FormData {
  groups: { name: string };
  labels: { name: string; color: string };
  categories: { name: string; color: string };
  types: { name: string; color: string };
}

interface EditState {
  isOpen: boolean;
  type: 'group' | 'label' | 'category' | 'type' | null;
  item: any;
}

interface DeleteState {
  isOpen: boolean;
  type: 'group' | 'label' | 'category' | 'type' | null;
  item: any;
}

@customElement('data-settings-page')
export class UpdatedDataSettingsPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Data settings specific styles */
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .section-icon {
      font-size: 1.25rem;
      margin-right: 0.5rem;
    }

    .items-list {
      margin-bottom: 2rem;
      display: grid;
      gap: 0.75rem;
    }

    .item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: var(--sl-color-neutral-50);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      transition: all 0.2s ease;
    }

    .item-row:hover {
      background: var(--sl-color-neutral-100);
      border-color: var(--sl-color-primary-300);
      transform: translateX(2px);
    }

    .item-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .item-name {
      margin: 0;
      font-size: var(--sl-font-size-medium);
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
    }

    .color-preview {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: var(--sl-border-radius-circle);
      border: 2px solid var(--sl-color-neutral-300);
      flex-shrink: 0;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
    }

    .add-form {
      border-top: 1px solid var(--sl-color-neutral-200);
      padding-top: 1.5rem;
      margin-top: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 0.75rem;
      align-items: end;
    }

    .form-row.with-color {
      grid-template-columns: 1fr auto auto auto;
    }

    .stats-badge {
      background: var(--sl-color-primary-50);
      border: 1px solid var(--sl-color-primary-200);
      color: var(--sl-color-primary-700);
      padding: 0.5rem 1rem;
      border-radius: var(--sl-border-radius-medium);
      font-weight: var(--sl-font-weight-medium);
      font-size: var(--sl-font-size-small);
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

    .form-loading {
      opacity: 0.7;
      pointer-events: none;
    }

    /* Modal styles */
    .modal-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
    }

    .modal-form {
      display: grid;
      gap: 1rem;
    }

    .form-grid {
      display: grid;
      gap: 1rem;
    }

    .form-grid.two-col {
      grid-template-columns: 1fr auto;
      align-items: end;
    }

    /* Delete confirmation styles */
    .delete-content {
      text-align: center;
      padding: 1rem 0;
    }

    .delete-icon {
      font-size: 3rem;
      color: var(--sl-color-danger-500);
      margin-bottom: 1rem;
    }

    .delete-title {
      font-size: 1.25rem;
      font-weight: var(--sl-font-weight-semibold);
      margin-bottom: 0.5rem;
      color: var(--sl-color-neutral-900);
    }

    .delete-message {
      color: var(--sl-color-neutral-600);
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .item-name-highlight {
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .item-row {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .item-actions {
        justify-content: stretch;
      }

      .form-row,
      .form-row.with-color {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .item-row {
      background: var(--sl-color-neutral-700);
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .item-row:hover {
      background: var(--sl-color-neutral-600);
      border-color: var(--sl-color-primary-600);
    }

    :host(.sl-theme-dark) .item-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .add-form {
      border-top-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .stats-badge {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-700);
      color: var(--sl-color-primary-300);
    }
  `;

  private groupService = new GroupService();
  private labelService = new LabelService();
  private categoryService = new CategoryService();
  private typeService = new TypeService();

  @state() private groups: Group[] = [];
  @state() private labels: Label[] = [];
  @state() private categories: Category[] = [];
  @state() private types: Type[] = [];

  @state() private formData: FormData = {
    groups: { name: '' },
    labels: { name: '', color: '#3b82f6' },
    categories: { name: '', color: '#10b981' },
    types: { name: '', color: '#f59e0b' }
  };

  @state() private editState: EditState = {
    isOpen: false,
    type: null,
    item: null
  };

  @state() private deleteState: DeleteState = {
    isOpen: false,
    type: null,
    item: null
  };

  @state() private notifications: Array<{ type: 'success' | 'error'; message: string; id: string }> = [];
  @state() private loadingStates: Record<string, boolean> = {};

  async connectedCallback() {
    super.connectedCallback();
    await this.loadPageData();
  }

  protected async loadPageData(): Promise<void> {
    await this.withPageLoading(async () => {
      if (!this.currentAccount?.id) {
        throw new Error('No account selected');
      }

      const accountId = this.currentAccount.id;

      try {
        // Load all data in parallel
        const [groupsData, labelsData, categoriesData, typesData] = await Promise.all([
          this.groupService.getGroups(accountId),
          this.labelService.getLabels(accountId),
          this.categoryService.getCategories(accountId),
          this.typeService.getTypes(accountId)
        ]);

        // Handle successful responses
        if (groupsData?.data && !groupsData?.error) {
          this.groups = groupsData.data;
        } else if (groupsData?.error) {
          console.error('Failed to load groups:', groupsData.error);
        }

        if (labelsData?.data && !labelsData?.error) {
          this.labels = labelsData.data;
        } else if (labelsData?.error) {
          console.error('Failed to load labels:', labelsData.error);
        }

        if (categoriesData?.data && !categoriesData?.error) {
          this.categories = categoriesData.data;
        } else if (categoriesData?.error) {
          console.error('Failed to load categories:', categoriesData.error);
        }

        if (typesData?.data && !typesData?.error) {
          this.types = typesData.data;
        } else if (typesData?.error) {
          console.error('Failed to load types:', typesData.error);
        }

        console.log('[DataSettings] Data loaded:', {
          groups: this.groups.length,
          labels: this.labels.length,
          categories: this.categories.length,
          types: this.types.length
        });

      } catch (error) {
        console.error('[DataSettings] Error loading data:', error);
        throw new Error('Failed to load data settings');
      }
    });
  }

  protected renderPageContent() {
    if (this.pageError) {
      return this.renderError(this.pageError, () => this.refreshPageData());
    }

    if (this.isLoading) {
      return this.renderLoading('Loading data settings...');
    }

    const totalItems = this.groups.length + this.labels.length + this.categories.length + this.types.length;
    
    return html`
      ${this.renderPageHeader(
        'Data Settings',
        'Manage groups, labels, categories, and types for your workspace'
      )}

      <div class="page-content">
        ${this.renderStats([
          { label: 'Total Items', value: totalItems, icon: 'collection' },
          { label: 'Groups', value: this.groups.length, icon: 'folder' },
          { label: 'Labels', value: this.labels.length, icon: 'tag' },
          { label: 'Categories', value: this.categories.length, icon: 'folder2' }
        ])}

        <div class="settings-grid">
          ${this.renderGroupsSection()}
          ${this.renderLabelsSection()}
          ${this.renderCategoriesSection()}
          ${this.renderTypesSection()}
        </div>
      </div>

      ${this.renderEditModal()}
      ${this.renderDeleteModal()}
      ${this.renderNotifications()}
    `;
  }

  private renderGroupsSection() {
    return html`
      <div class="content-section">
        ${this.renderSectionHeader(
          'Groups',
          'Organize scope items into logical groups',
          html`<div class="stats-badge">${this.groups.length} groups</div>`
        )}
        
        <div class="content-card">
          ${this.groups.length === 0 ? this.renderEmptyState(
            'folder',
            'No groups created yet',
            'Groups help organize your scope items into logical collections.'
          ) : html`
            <div class="items-list">
              ${this.groups.map(group => html`
                <div class="item-row">
                  <div class="item-info">
                    <sl-icon name="folder"></sl-icon>
                    <h4 class="item-name">${group.name}</h4>
                  </div>
                  <div class="item-actions">
                    <sl-button size="small" variant="default" @click=${() => this.editItem('group', group)}>
                      <sl-icon slot="prefix" name="pencil"></sl-icon>
                      Edit
                    </sl-button>
                    <sl-button size="small" variant="danger" @click=${() => this.deleteItem('group', group)}>
                      <sl-icon slot="prefix" name="trash"></sl-icon>
                      Delete
                    </sl-button>
                  </div>
                </div>
              `)}
            </div>
          `}

          <div class="add-form ${this.loadingStates['add-group'] ? 'form-loading' : ''}">
            <div class="form-row">
              <sl-input
                label="Group Name"
                placeholder="Enter group name"
                .value=${this.formData.groups.name}
                @sl-input=${(e: CustomEvent) => this.updateFormData('groups', 'name', (e.target as any).value)}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addGroup()}
              ></sl-input>
              <sl-button 
                variant="primary" 
                @click=${this.addGroup}
                ?disabled=${!this.formData.groups.name.trim()}
                ?loading=${this.loadingStates['add-group']}
              >
                <sl-icon slot="prefix" name="plus"></sl-icon>
                Add Group
              </sl-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderLabelsSection() {
    return html`
      <div class="content-section">
        ${this.renderSectionHeader(
          'Labels',
          'Create colorful labels for organizing scope items',
          html`<div class="stats-badge">${this.labels.length} labels</div>`
        )}
        
        <div class="content-card">
          ${this.labels.length === 0 ? this.renderEmptyState(
            'tag',
            'No labels created yet',
            'Labels provide colorful ways to categorize and filter your scope items.'
          ) : html`
            <div class="items-list">
              ${this.labels.map(label => html`
                <div class="item-row">
                  <div class="item-info">
                    <div class="color-preview" style="background-color: ${label.color}"></div>
                    <h4 class="item-name">${label.name}</h4>
                  </div>
                  <div class="item-actions">
                    <sl-button size="small" variant="default" @click=${() => this.editItem('label', label)}>
                      <sl-icon slot="prefix" name="pencil"></sl-icon>
                      Edit
                    </sl-button>
                    <sl-button size="small" variant="danger" @click=${() => this.deleteItem('label', label)}>
                      <sl-icon slot="prefix" name="trash"></sl-icon>
                      Delete
                    </sl-button>
                  </div>
                </div>
              `)}
            </div>
          `}

          <div class="add-form ${this.loadingStates['add-label'] ? 'form-loading' : ''}">
            <div class="form-row with-color">
              <sl-input
                label="Label Name"
                placeholder="Enter label name"
                .value=${this.formData.labels.name}
                @sl-input=${(e: CustomEvent) => this.updateFormData('labels', 'name', (e.target as any).value)}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addLabel()}
              ></sl-input>
              <sl-color-picker
                label="Color"
                .value=${this.formData.labels.color}
                @sl-change=${(e: CustomEvent) => this.updateFormData('labels', 'color', (e.target as any).value)}
                format="hex"
                size="small"
              ></sl-color-picker>
              <sl-button 
                variant="primary" 
                @click=${this.addLabel}
                ?disabled=${!this.formData.labels.name.trim()}
                ?loading=${this.loadingStates['add-label']}
              >
                <sl-icon slot="prefix" name="plus"></sl-icon>
                Add Label
              </sl-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderCategoriesSection() {
    return html`
      <div class="content-section">
        ${this.renderSectionHeader(
          'Categories',
          'Categorize scope items by type or purpose',
          html`<div class="stats-badge">${this.categories.length} categories</div>`
        )}
        
        <div class="content-card">
          ${this.categories.length === 0 ? this.renderEmptyState(
            'folder2',
            'No categories created yet',
            'Categories help you group scope items by their type or purpose.'
          ) : html`
            <div class="items-list">
              ${this.categories.map(category => html`
                <div class="item-row">
                  <div class="item-info">
                    <div class="color-preview" style="background-color: ${category.color}"></div>
                    <h4 class="item-name">${category.name}</h4>
                  </div>
                  <div class="item-actions">
                    <sl-button size="small" variant="default" @click=${() => this.editItem('category', category)}>
                      <sl-icon slot="prefix" name="pencil"></sl-icon>
                      Edit
                    </sl-button>
                    <sl-button size="small" variant="danger" @click=${() => this.deleteItem('category', category)}>
                      <sl-icon slot="prefix" name="trash"></sl-icon>
                      Delete
                    </sl-button>
                  </div>
                </div>
              `)}
            </div>
          `}

          <div class="add-form ${this.loadingStates['add-category'] ? 'form-loading' : ''}">
            <div class="form-row with-color">
              <sl-input
                label="Category Name"
                placeholder="Enter category name"
                .value=${this.formData.categories.name}
                @sl-input=${(e: CustomEvent) => this.updateFormData('categories', 'name', (e.target as any).value)}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addCategory()}
              ></sl-input>
              <sl-color-picker
                label="Color"
                .value=${this.formData.categories.color}
                @sl-change=${(e: CustomEvent) => this.updateFormData('categories', 'color', (e.target as any).value)}
                format="hex"
                size="small"
              ></sl-color-picker>
              <sl-button 
                variant="primary" 
                @click=${this.addCategory}
                ?disabled=${!this.formData.categories.name.trim()}
                ?loading=${this.loadingStates['add-category']}
              >
                <sl-icon slot="prefix" name="plus"></sl-icon>
                Add Category
              </sl-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderTypesSection() {
    return html`
      <div class="content-section">
        ${this.renderSectionHeader(
          'Types',
          'Define different types of scope items',
          html`<div class="stats-badge">${this.types.length} types</div>`
        )}
        
        <div class="content-card">
          ${this.types.length === 0 ? this.renderEmptyState(
            'lightning',
            'No types created yet',
            'Types let you define different kinds of scope items with unique properties.'
          ) : html`
            <div class="items-list">
              ${this.types.map(type => html`
                <div class="item-row">
                  <div class="item-info">
                    <div class="color-preview" style="background-color: ${type.color}"></div>
                    <h4 class="item-name">${type.name}</h4>
                  </div>
                  <div class="item-actions">
                    <sl-button size="small" variant="default" @click=${() => this.editItem('type', type)}>
                      <sl-icon slot="prefix" name="pencil"></sl-icon>
                      Edit
                    </sl-button>
                    <sl-button size="small" variant="danger" @click=${() => this.deleteItem('type', type)}>
                      <sl-icon slot="prefix" name="trash"></sl-icon>
                      Delete
                    </sl-button>
                  </div>
                </div>
              `)}
            </div>
          `}

          <div class="add-form ${this.loadingStates['add-type'] ? 'form-loading' : ''}">
            <div class="form-row with-color">
              <sl-input
                label="Type Name"
                placeholder="Enter type name"
                .value=${this.formData.types.name}
                @sl-input=${(e: CustomEvent) => this.updateFormData('types', 'name', (e.target as any).value)}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addType()}
              ></sl-input>
              <sl-color-picker
                label="Color"
                .value=${this.formData.types.color}
                @sl-change=${(e: CustomEvent) => this.updateFormData('types', 'color', (e.target as any).value)}
                format="hex"
                size="small"
              ></sl-color-picker>
              <sl-button 
                variant="primary" 
                @click=${this.addType}
                ?disabled=${!this.formData.types.name.trim()}
                ?loading=${this.loadingStates['add-type']}
              >
                <sl-icon slot="prefix" name="plus"></sl-icon>
                Add Type
              </sl-button>
            </div>
          </div>
        </div>
      </div>
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

  private renderEditModal() {
    if (!this.editState.isOpen || !this.editState.type || !this.editState.item) {
      return html``;
    }

    const item = this.editState.item;
    const type = this.editState.type;
    const hasColor = type !== 'group';

    return html`
      <sl-dialog 
        label="Edit ${type.charAt(0).toUpperCase() + type.slice(1)}"
        ?open=${this.editState.isOpen}
        @sl-hide=${this.closeEditModal}
      >
        <div class="modal-header">
          <sl-icon name=${this.getTypeIcon(type)}></sl-icon>
          <h3 class="modal-title">Edit ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        </div>

        <div class="modal-form">
          <div class="form-grid ${hasColor ? 'two-col' : ''}">
            <sl-input
              label="${type.charAt(0).toUpperCase() + type.slice(1)} Name"
              .value=${item.name}
              @sl-input=${(e: CustomEvent) => this.updateEditForm('name', (e.target as any).value)}
              @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.saveEdit()}
            ></sl-input>
            
            ${hasColor ? html`
              <sl-color-picker
                label="Color"
                .value=${item.color}
                @sl-change=${(e: CustomEvent) => this.updateEditForm('color', (e.target as any).value)}
                format="hex"
                size="small"
              ></sl-color-picker>
            ` : ''}
          </div>
        </div>

        <div slot="footer">
          <sl-button variant="default" @click=${this.closeEditModal}>
            Cancel
          </sl-button>
          <sl-button 
            variant="primary" 
            @click=${this.saveEdit}
            ?disabled=${!item.name?.trim()}
            ?loading=${this.loadingStates['edit-item']}
          >
            <sl-icon slot="prefix" name="check"></sl-icon>
            Save Changes
          </sl-button>
        </div>
      </sl-dialog>
    `;
  }

  private renderDeleteModal() {
    if (!this.deleteState.isOpen || !this.deleteState.type || !this.deleteState.item) {
      return html``;
    }

    const item = this.deleteState.item;
    const type = this.deleteState.type;

    return html`
      <sl-dialog 
        label="Confirm Delete"
        ?open=${this.deleteState.isOpen}
        @sl-hide=${this.closeDeleteModal}
      >
        <div class="delete-content">
          <sl-icon name="exclamation-triangle" class="delete-icon"></sl-icon>
          <h3 class="delete-title">Delete ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          <div class="delete-message">
            Are you sure you want to delete 
            <span class="item-name-highlight">"${item.name}"</span>?
            <br><br>
            This action cannot be undone and may affect existing scope items.
          </div>
        </div>

        <div slot="footer">
          <sl-button variant="default" @click=${this.closeDeleteModal}>
            Cancel
          </sl-button>
          <sl-button 
            variant="danger" 
            @click=${this.confirmDelete}
            ?loading=${this.loadingStates['delete-item']}
          >
            <sl-icon slot="prefix" name="trash"></sl-icon>
            Delete ${type.charAt(0).toUpperCase() + type.slice(1)}
          </sl-button>
        </div>
      </sl-dialog>
    `;
  }

  private getTypeIcon(type: string): string {
    switch (type) {
      case 'group': return 'folder';
      case 'label': return 'tag';
      case 'category': return 'folder2';
      case 'type': return 'lightning';
      default: return 'gear';
    }
  }

  // Helper methods
  private updateFormData(section: keyof FormData, field: string, value: any) {
    this.formData = {
      ...this.formData,
      [section]: {
        ...this.formData[section],
        [field]: value
      }
    };
  }

  private updateEditForm(field: string, value: any) {
    if (this.editState.item) {
      this.editState = {
        ...this.editState,
        item: {
          ...this.editState.item,
          [field]: value
        }
      };
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

  private setLoading(key: string, loading: boolean) {
    this.loadingStates = { ...this.loadingStates, [key]: loading };
  }

  // CRUD operations
  private async addGroup() {
    if (!this.formData.groups.name.trim() || !this.currentAccount?.id) return;

    this.setLoading('add-group', true);
    try {
      const result = await this.groupService.createGroup({
        account_id: this.currentAccount.id,
        name: this.formData.groups.name.trim(),
      });

      if (result?.data && !result?.error) {
        this.groups = [...this.groups, result.data];
        this.formData = { ...this.formData, groups: { name: '' } };
        this.showNotification('success', 'Group created successfully');
      } else {
        throw new Error(result?.error || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      this.showNotification('error', 'Failed to create group');
    } finally {
      this.setLoading('add-group', false);
    }
  }

  private async addLabel() {
    if (!this.formData.labels.name.trim() || !this.currentAccount?.id) return;

    this.setLoading('add-label', true);
    try {
      const result = await this.labelService.createLabel({
        account_id: this.currentAccount.id,
        name: this.formData.labels.name.trim(),
        color: this.formData.labels.color,
      });

if (result?.data && !result?.error) {
        this.labels = [...this.labels, result.data];
        this.formData = { ...this.formData, labels: { name: '', color: '#3b82f6' } };
        this.showNotification('success', 'Label created successfully');
      } else {
        throw new Error(result?.error || 'Failed to create label');
      }
    } catch (error) {
      console.error('Error creating label:', error);
      this.showNotification('error', 'Failed to create label');
    } finally {
      this.setLoading('add-label', false);
    }
  }

  private async addCategory() {
    if (!this.formData.categories.name.trim() || !this.currentAccount?.id) return;

    this.setLoading('add-category', true);
    try {
      const result = await this.categoryService.createCategory({
        account_id: this.currentAccount.id,
        name: this.formData.categories.name.trim(),
        color: this.formData.categories.color,
      });

      if (result?.data && !result?.error) {
        this.categories = [...this.categories, result.data];
        this.formData = { ...this.formData, categories: { name: '', color: '#10b981' } };
        this.showNotification('success', 'Category created successfully');
      } else {
        throw new Error(result?.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      this.showNotification('error', 'Failed to create category');
    } finally {
      this.setLoading('add-category', false);
    }
  }

  private async addType() {
    if (!this.formData.types.name.trim() || !this.currentAccount?.id) return;

    this.setLoading('add-type', true);
    try {
      const result = await this.typeService.createType({
        account_id: this.currentAccount.id,
        name: this.formData.types.name.trim(),
        color: this.formData.types.color,
      });

      if (result?.data && !result?.error) {
        this.types = [...this.types, result.data];
        this.formData = { ...this.formData, types: { name: '', color: '#f59e0b' } };
        this.showNotification('success', 'Type created successfully');
      } else {
        throw new Error(result?.error || 'Failed to create type');
      }
    } catch (error) {
      console.error('Error creating type:', error);
      this.showNotification('error', 'Failed to create type');
    } finally {
      this.setLoading('add-type', false);
    }
  }

  private editItem(type: string, item: any) {
    this.editState = { 
      isOpen: true, 
      type: type as any, 
      item: { ...item } // Create a copy to avoid mutating original
    };
  }

  private closeEditModal = () => {
    this.editState = { isOpen: false, type: null, item: null };
  }

  private deleteItem(type: string, item: any) {
    this.deleteState = { 
      isOpen: true, 
      type: type as any, 
      item 
    };
  }

  private closeDeleteModal = () => {
    this.deleteState = { isOpen: false, type: null, item: null };
  }

  private async saveEdit() {
    if (!this.editState.item || !this.currentAccount?.id || !this.editState.type) return;

    this.setLoading('edit-item', true);
    try {
      let result;

      switch (this.editState.type) {
        case 'group':
          result = await this.groupService.updateGroup(this.editState.item.id, {
            name: this.editState.item.name,
          });
          break;
        case 'label':
          result = await this.labelService.updateLabel(this.editState.item.id, {
            name: this.editState.item.name,
            color: this.editState.item.color,
          });
          break;
        case 'category':
          result = await this.categoryService.updateCategory(this.editState.item.id, {
            name: this.editState.item.name,
            color: this.editState.item.color,
          });
          break;
        case 'type':
          result = await this.typeService.updateType(this.editState.item.id, {
            name: this.editState.item.name,
            color: this.editState.item.color,
          });
          break;
        default:
          throw new Error('Unknown type');
      }

      if (result?.data && !result?.error) {
        // Update local state
        const updatedItem = result.data;
        switch (this.editState.type) {
          case 'group':
            this.groups = this.groups.map(g => g.id === updatedItem.id ? updatedItem : g);
            break;
          case 'label':
            this.labels = this.labels.map(l => l.id === updatedItem.id ? updatedItem : l) as Label[];
            break;
          case 'category':
            this.categories = this.categories.map(c => c.id === updatedItem.id ? updatedItem : c) as Category[];
            break;
          case 'type':
            this.types = this.types.map(t => t.id === updatedItem.id ? updatedItem : t) as Type[];
            break;
        }

        this.showNotification('success', `${this.editState.type.charAt(0).toUpperCase() + this.editState.type.slice(1)} updated successfully`);
        this.closeEditModal();
      } else {
        throw new Error(result?.error || 'Failed to update item');
      }
    } catch (error) {
      console.error(`Error updating ${this.editState.type}:`, error);
      this.showNotification('error', `Failed to update ${this.editState.type}`);
    } finally {
      this.setLoading('edit-item', false);
    }
  }

  private async confirmDelete() {
    if (!this.deleteState.item || !this.deleteState.type) return;

    const item = this.deleteState.item;
    const type = this.deleteState.type;

    this.setLoading('delete-item', true);

    try {
      let deletePromise;
      let updateArray: () => void;

      switch (type) {
        case 'group':
          deletePromise = this.groupService.deleteGroup(item.id);
          updateArray = () => this.groups = this.groups.filter(g => g.id !== item.id);
          break;
        case 'label':
          deletePromise = this.labelService.deleteLabel(item.id);
          updateArray = () => this.labels = this.labels.filter(l => l.id !== item.id);
          break;
        case 'category':
          deletePromise = this.categoryService.deleteCategory(item.id);
          updateArray = () => this.categories = this.categories.filter(c => c.id !== item.id);
          break;
        case 'type':
          deletePromise = this.typeService.deleteType(item.id);
          updateArray = () => this.types = this.types.filter(t => t.id !== item.id);
          break;
        default:
          throw new Error(`Unknown type: ${type}`);
      }

      const result = await deletePromise;

      if (!result?.error) {
        updateArray();
        this.showNotification('success', `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
        this.closeDeleteModal();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      this.showNotification('error', `Failed to delete ${type}`);
    } finally {
      this.setLoading('delete-item', false);
    }
  }
}