// src/components/pages/data-settings-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { Group, Label, Category, Type } from '../../types';

// Mock services - replace with actual implementations
class GroupService {
  async getGroups(accountId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: [], error: null };
  }
  async createGroup(data: any) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { id: crypto.randomUUID(), ...data }, error: null };
  }
  async deleteGroup(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { error: null };
  }
}

class LabelService {
  async getLabels(accountId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: [], error: null };
  }
  async createLabel(data: any) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { id: crypto.randomUUID(), ...data }, error: null };
  }
  async deleteLabel(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { error: null };
  }
}

class CategoryService {
  async getCategories(accountId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: [], error: null };
  }
  async createCategory(data: any) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { id: crypto.randomUUID(), ...data }, error: null };
  }
  async deleteCategory(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { error: null };
  }
}

class TypeService {
  async getTypes(accountId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: [], error: null };
  }
  async createType(data: any) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { id: crypto.randomUUID(), ...data }, error: null };
  }
  async deleteType(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { error: null };
  }
}

interface FormData {
  groups: { name: string };
  labels: { name: string; color: string };
  categories: { name: string; color: string };
  types: { name: string; color: string };
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

      // Load all data in parallel
      const [groupsData, labelsData, categoriesData, typesData] = await Promise.all([
        this.groupService.getGroups(accountId),
        this.labelService.getLabels(accountId),
        this.categoryService.getCategories(accountId),
        this.typeService.getTypes(accountId)
      ]);

      if (groupsData?.data) this.groups = groupsData.data;
      if (labelsData?.data) this.labels = labelsData.data;
      if (categoriesData?.data) this.categories = categoriesData.data;
      if (typesData?.data) this.types = typesData.data;
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
      this.showNotification('error', 'Failed to create type');
    } finally {
      this.setLoading('add-type', false);
    }
  }

  private editItem(type: string, item: any) {
    // TODO: Implement edit functionality with modal or inline editing
    console.log(`Edit ${type}:`, item);
    this.showNotification('success', `Edit ${type} functionality coming soon!`);
  }

  private async deleteItem(type: string, item: any) {
    if (!confirm(`Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    const loadingKey = `delete-${type}`;
    this.setLoading(loadingKey, true);

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
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.showNotification('error', `Failed to delete ${type}`);
    } finally {
      this.setLoading(loadingKey, false);
    }
  }
}

