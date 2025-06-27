// src/components/pages/data-settings-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { LoadingController } from '../../controllers/loading-controller';
import { GroupService, LabelService, CategoryService, TypeService } from '../../services';
import { Group, Label, Category, Type } from '../../types';
import '../layout/app-sidebar';
import '../common/skeleton-loader';
import '../common/error-message';

interface FormData {
  groups: { name: string };
  labels: { name: string; color: string };
  categories: { name: string; color: string };
  types: { name: string; color: string };
}

@customElement('data-settings-page')
export class DataSettingsPage extends BasePage {
  static styles = css`
    ${BasePage.styles}
    
    /* Da    try {
      const result = await this.loadingController.withLoading('add-type', () =>
        this.typeService.createType({
          account_id: this.currentAccount!.id,
          name: this.formData.types.name.trim(),
          color: this.formData.types.color,
        })
      );

      if (data && !error) {
        this.types = [...this.types, data];
        this.formData = { ...this.formData, types: { name: '', color: '#f59e0b' } };
        this.showNotification('success', 'Type created successfully');
      } else {
        throw new Error(result?.error || 'Failed to create type');
      } specific styles */
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

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .settings-section {
      background: var(--sl-color-neutral-0);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      padding: 0;
      overflow: hidden;
    }

    .section-header {
      padding: 1.5rem;
      background: var(--sl-color-neutral-50);
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .section-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-description {
      margin: 0;
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
    }

    .section-content {
      padding: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--sl-color-neutral-500);
    }

    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .empty-state-text {
      margin: 0;
      font-size: var(--sl-font-size-medium);
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

    .form-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .stats-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: var(--sl-color-primary-50);
      border-radius: var(--sl-border-radius-medium);
      border: 1px solid var(--sl-color-primary-200);
    }

    .stats-label {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-primary-700);
    }

    .stats-value {
      font-size: var(--sl-font-size-large);
      font-weight: var(--sl-font-weight-bold);
      color: var(--sl-color-primary-800);
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

      .form-actions {
        justify-content: stretch;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .page-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .page-subtitle {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .settings-section {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .section-header {
      background: var(--sl-color-neutral-700);
      border-bottom-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .section-description {
      color: var(--sl-color-neutral-400);
    }

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

    :host(.sl-theme-dark) .stats-row {
      background: var(--sl-color-primary-900);
      border-color: var(--sl-color-primary-700);
    }

    :host(.sl-theme-dark) .stats-label {
      color: var(--sl-color-primary-300);
    }

    :host(.sl-theme-dark) .stats-value {
      color: var(--sl-color-primary-200);
    }
  `;

  private loadingController = new LoadingController(this);
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
    if (!this.currentAccount?.id) return;

    const accountId = this.currentAccount.id;

    try {
      // Load all data in parallel using the service layer
      const [groupsData, labelsData, categoriesData, typesData] = await Promise.all([
        this.loadingController.withLoading('groups', () => this.groupService.getGroups(accountId)),
        this.loadingController.withLoading('labels', () => this.labelService.getLabels(accountId)),
        this.loadingController.withLoading('categories', () => this.categoryService.getCategories(accountId)),
        this.loadingController.withLoading('types', () => this.typeService.getTypes(accountId)),
      ]);

      if (groupsData?.data) this.groups = groupsData.data;
      if (labelsData?.data) this.labels = labelsData.data;
      if (categoriesData?.data) this.categories = categoriesData.data;
      if (typesData?.data) this.types = typesData.data;
    } catch (error) {
      this.showNotification('error', 'Failed to load data settings');
    }
  }

  render() {
    const isLoading = this.loadingController.isLoading('groups') || 
                     this.loadingController.isLoading('labels') ||
                     this.loadingController.isLoading('categories') ||
                     this.loadingController.isLoading('types');

    if (isLoading) {
      return html`
        <div class="page-layout">
          <app-sidebar 
            .stateController=${this.stateController}
            .routerController=${this.routerController}
            .themeController=${this.themeController}
            .currentTeamSlug=${this.teamSlug}
          ></app-sidebar>
          <div class="main-content">
            <div class="page-content">
              <skeleton-loader type="title"></skeleton-loader>
              <skeleton-loader type="card" count="4"></skeleton-loader>
            </div>
          </div>
        </div>
      `;
    }

    const error = this.loadingController.getError('groups') ||
                  this.loadingController.getError('labels') ||
                  this.loadingController.getError('categories') ||
                  this.loadingController.getError('types');

    if (error) {
      return html`
        <div class="page-layout">
          <app-sidebar 
            .stateController=${this.stateController}
            .routerController=${this.routerController}
            .themeController=${this.themeController}
            .currentTeamSlug=${this.teamSlug}
          ></app-sidebar>
          <div class="main-content">
            <div class="page-content">
              <error-message 
                .message=${error}
                @retry=${this.loadData}
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
          .currentTeamSlug=${this.teamSlug}
        ></app-sidebar>
        
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">Data Settings</h1>
            <p class="page-subtitle">Manage groups, labels, categories, and types for your workspace</p>
          </div>

          <div class="page-content">
            <div class="settings-grid">
              ${this.renderGroupsSection()}
              ${this.renderLabelsSection()}
              ${this.renderCategoriesSection()}
              ${this.renderTypesSection()}
            </div>
          </div>
        </div>
      </div>

      ${this.renderNotifications()}
    `;
  }

  private renderGroupsSection() {
    return html`
      <sl-card class="settings-section">
        <div class="section-header">
          <h2 class="section-title">
            <sl-icon name="folder"></sl-icon>
            Groups
          </h2>
          <p class="section-description">Organize scope items into logical groups</p>
        </div>
        
        <div class="section-content">
          <div class="stats-row">
            <span class="stats-label">Total Groups</span>
            <span class="stats-value">${this.groups.length}</span>
          </div>

          ${this.groups.length === 0 ? html`
            <div class="empty-state">
              <sl-icon name="folder" class="empty-state-icon"></sl-icon>
              <p class="empty-state-text">No groups created yet</p>
            </div>
          ` : html`
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

          <div class="add-form">
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
                ?loading=${this.loadingController.isLoading('add-group')}
              >
                <sl-icon slot="prefix" name="plus"></sl-icon>
                Add Group
              </sl-button>
            </div>
          </div>
        </div>
      </sl-card>
    `;
  }

  private renderLabelsSection() {
    return html`
      <sl-card class="settings-section">
        <div class="section-header">
          <h2 class="section-title">
            <sl-icon name="tag"></sl-icon>
            Labels
          </h2>
          <p class="section-description">Create colorful labels for organizing scope items</p>
        </div>
        
        <div class="section-content">
          <div class="stats-row">
            <span class="stats-label">Total Labels</span>
            <span class="stats-value">${this.labels.length}</span>
          </div>

          ${this.labels.length === 0 ? html`
            <div class="empty-state">
              <sl-icon name="tag" class="empty-state-icon"></sl-icon>
              <p class="empty-state-text">No labels created yet</p>
            </div>
          ` : html`
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

          <div class="add-form">
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
                ?loading=${this.loadingController.isLoading('add-label')}
              >
                <sl-icon slot="prefix" name="plus"></sl-icon>
                Add Label
              </sl-button>
            </div>
          </div>
        </div>
      </sl-card>
    `;
  }

  private renderCategoriesSection() {
    return html`
      <sl-card class="settings-section">
        <div class="section-header">
          <h2 class="section-title">
            <sl-icon name="folder2"></sl-icon>
            Categories
          </h2>
          <p class="section-description">Categorize scope items by type or purpose</p>
        </div>
        
        <div class="section-content">
          <div class="stats-row">
            <span class="stats-label">Total Categories</span>
            <span class="stats-value">${this.categories.length}</span>
          </div>

          ${this.categories.length === 0 ? html`
            <div class="empty-state">
              <sl-icon name="folder2" class="empty-state-icon"></sl-icon>
              <p class="empty-state-text">No categories created yet</p>
            </div>
          ` : html`
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

          <div class="add-form">
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
                ?loading=${this.loadingController.isLoading('add-category')}
              >
                <sl-icon slot="prefix" name="plus"></sl-icon>
                Add Category
              </sl-button>
            </div>
          </div>
        </div>
      </sl-card>
    `;
  }

  private renderTypesSection() {
    return html`
      <sl-card class="settings-section">
        <div class="section-header">
          <h2 class="section-title">
            <sl-icon name="lightning"></sl-icon>
            Types
          </h2>
          <p class="section-description">Define different types of scope items</p>
        </div>
        
        <div class="section-content">
          <div class="stats-row">
            <span class="stats-label">Total Types</span>
            <span class="stats-value">${this.types.length}</span>
          </div>

          ${this.types.length === 0 ? html`
            <div class="empty-state">
              <sl-icon name="lightning" class="empty-state-icon"></sl-icon>
              <p class="empty-state-text">No types created yet</p>
            </div>
          ` : html`
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

          <div class="add-form">
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
                ?loading=${this.loadingController.isLoading('add-type')}
              >
                <sl-icon slot="prefix" name="plus"></sl-icon>
                Add Type
              </sl-button>
            </div>
          </div>
        </div>
      </sl-card>
    `;
  }

  private renderNotifications() {
    return html`
      <div style="position: fixed; top: 1rem; right: 1rem; z-index: 1000; display: grid; gap: 0.5rem;">
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

  // CRUD operations
  private async addGroup() {
    if (!this.formData.groups.name.trim() || !this.currentAccount?.id) return;

    try {
      const result = await this.loadingController.withLoading('add-group', () =>
        this.groupService.createGroup({
          account_id: this.currentAccount!.id,
          name: this.formData.groups.name.trim(),
        })
      );

      if (result?.data && !result?.error) {
        this.groups = [...this.groups, result.data];
        this.formData = { ...this.formData, groups: { name: '' } };
        this.showNotification('success', 'Group created successfully');
      } else {
        throw new Error(result?.error || 'Failed to create group');
      }
    } catch (error) {
      this.showNotification('error', 'Failed to create group');
    }
  }

  private async addLabel() {
    if (!this.formData.labels.name.trim() || !this.currentAccount?.id) return;

    try {
      const result = await this.loadingController.withLoading('add-label', () =>
        this.labelService.createLabel({
          account_id: this.currentAccount!.id,
          name: this.formData.labels.name.trim(),
          color: this.formData.labels.color,
        })
      );

      if (result?.data && !result?.error) {
        this.labels = [...this.labels, result.data];
        this.formData = { ...this.formData, labels: { name: '', color: '#3b82f6' } };
        this.showNotification('success', 'Label created successfully');
      } else {
        throw new Error(result?.error || 'Failed to create label');
      }
    } catch (error) {
      this.showNotification('error', 'Failed to create label');
    }
  }

  private async addCategory() {
    if (!this.formData.categories.name.trim() || !this.currentAccount?.id) return;

    try {
      const result = await this.loadingController.withLoading('add-category', () =>
        this.categoryService.createCategory({
          account_id: this.currentAccount!.id,
          name: this.formData.categories.name.trim(),
          color: this.formData.categories.color,
        })
      );

      if (result?.data && !result?.error) {
        this.categories = [...this.categories, result.data];
        this.formData = { ...this.formData, categories: { name: '', color: '#10b981' } };
        this.showNotification('success', 'Category created successfully');
      } else {
        throw new Error(result?.error || 'Failed to create category');
      }
    } catch (error) {
      this.showNotification('error', 'Failed to create category');
    }
  }

  private async addType() {
    if (!this.formData.types.name.trim() || !this.currentAccount?.id) return;

    try {
      const result = await this.loadingController.withLoading('add-type', () =>
        this.typeService.createType({
          account_id: this.currentAccount!.id,
          name: this.formData.types.name.trim(),
          color: this.formData.types.color,
        })
      );

      if (result?.data && !result?.error) {
        this.types = [...this.types, result.data];
        this.formData = { ...this.formData, types: { name: '', color: '#f59e0b' } };
        this.showNotification('success', 'Type created successfully');
      } else {
        throw new Error(result?.error || 'Failed to create type');
      }
    } catch (error) {
      this.showNotification('error', 'Failed to create type');
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

      const result = await this.loadingController.withLoading(`delete-${type}`, () => deletePromise);

      if (!result?.error) {
        updateArray();
        this.showNotification('success', `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.showNotification('error', `Failed to delete ${type}`);
    }
  }
}

