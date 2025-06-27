// src/components/pages/data-settings-page.ts
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BasePage } from '../base/base-page';
import { LoadingController } from '../../controllers/loading-controller';
import { GroupService, LabelService, CategoryService, TypeService } from '../../services';
import { Group, Label, Category, Type } from '../../types';
import '../layout/app-sidebar';
import '../common/skeleton-loader';

@customElement('data-settings-page')
export class DataSettingsPage extends BasePage {
  private loadingController = new LoadingController(this);
  private groupService = new GroupService();
  private labelService = new LabelService();
  private categoryService = new CategoryService();
  private typeService = new TypeService();

  @state() private groups: Group[] = [];
  @state() private labels: Label[] = [];
  @state() private categories: Category[] = [];
  @state() private types: Type[] = [];

  // Form states
  @state() private newGroupName = '';
  @state() private newLabelName = '';
  @state() private newLabelColor = '#3b82f6';
  @state() private newCategoryName = '';
  @state() private newCategoryColor = '#10b981';
  @state() private newTypeName = '';
  @state() private newTypeColor = '#f59e0b';

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
    `;
  }

  // Keep your existing render methods...
  private renderGroupsSection() {
    return html`
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">📁 Groups</h2>
          <p class="section-description">Organize scope items into logical groups</p>
        </div>
        <div class="section-content">
          ${this.groups.length === 0 ? html`
            <div class="empty-state">
              <div class="empty-state-icon">📁</div>
              <p class="empty-state-text">No groups created yet</p>
            </div>
          ` : html`
            <div class="items-list">
              ${this.groups.map(group => html`
                <div class="item-row">
                  <div class="item-info">
                    <h4 class="item-name">${group.name}</h4>
                  </div>
                  <div class="item-actions">
                    <sl-button size="small" variant="default">Edit</sl-button>
                    <sl-button size="small" variant="danger">Delete</sl-button>
                  </div>
                </div>
              `)}
            </div>
          `}

          <div class="add-item-form">
            <div class="form-grid">
              <sl-input
                placeholder="Group name"
                .value=${this.newGroupName}
                @sl-input=${(e: CustomEvent) => this.newGroupName = (e.target as any).value}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addGroup()}
              ></sl-input>
              <sl-button 
                variant="primary" 
                @click=${this.addGroup}
                ?disabled=${!this.newGroupName.trim()}
              >
                Add Group
              </sl-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Update the add methods to use services
  private async addGroup() {
    if (!this.newGroupName.trim() || !this.currentAccount?.id) return;

    const { data, error } = await this.groupService.createGroup({
      account_id: this.currentAccount.id,
      name: this.newGroupName.trim(),
    });

    if (data && !error) {
      this.groups = [...this.groups, data];
      this.newGroupName = '';
    }
  }

  private async addLabel() {
    if (!this.newLabelName.trim() || !this.currentAccount?.id) return;

    const { data, error } = await this.labelService.createLabel({
      account_id: this.currentAccount.id,
      name: this.newLabelName.trim(),
      color: this.newLabelColor,
    });

    if (data && !error) {
      this.labels = [...this.labels, data];
      this.newLabelName = '';
      this.newLabelColor = '#3b82f6';
    }
  }

  private renderLabelsSection() {
    return html`
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">🏷️ Labels</h2>
          <p class="section-description">Create colorful labels for organizing scope items</p>
        </div>
        <div class="section-content">
          ${this.labels.length === 0 ? html`
            <div class="empty-state">
              <div class="empty-state-icon">🏷️</div>
              <p class="empty-state-text">No labels created yet</p>
            </div>
          ` : html`
            <div class="items-list">
              ${this.labels.map(label => html`
                <div class="item-row">
                  <div class="item-info">
                    <div class="label-preview" style="background-color: ${label.color}"></div>
                    <h4 class="item-name">${label.name}</h4>
                  </div>
                  <div class="item-actions">
                    <sl-button size="small" variant="default">Edit</sl-button>
                    <sl-button size="small" variant="danger">Delete</sl-button>
                  </div>
                </div>
              `)}
            </div>
          `}

          <div class="add-item-form">
            <div class="form-grid">
              <sl-input
                placeholder="Label name"
                .value=${this.newLabelName}
                @sl-input=${(e: CustomEvent) => this.newLabelName = (e.target as any).value}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addLabel()}
              ></sl-input>
              <sl-color-picker
                .value=${this.newLabelColor}
                @sl-change=${(e: CustomEvent) => this.newLabelColor = (e.target as any).value}
                format="hex"
                size="small"
              ></sl-color-picker>
              <sl-button 
                variant="primary" 
                @click=${this.addLabel}
                ?disabled=${!this.newLabelName.trim()}
              >
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
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">📂 Categories</h2>
          <p class="section-description">Categorize scope items by type or purpose</p>
        </div>
        <div class="section-content">
          ${this.categories.length === 0 ? html`
            <div class="empty-state">
              <div class="empty-state-icon">📂</div>
              <p class="empty-state-text">No categories created yet</p>
            </div>
          ` : html`
            <div class="items-list">
              ${this.categories.map(category => html`
                <div class="item-row">
                  <div class="item-info">
                    <div class="label-preview" style="background-color: ${category.color}"></div>
                    <h4 class="item-name">${category.name}</h4>
                  </div>
                  <div class="item-actions">
                    <sl-button size="small" variant="default">Edit</sl-button>
                    <sl-button size="small" variant="danger">Delete</sl-button>
                  </div>
                </div>
              `)}
            </div>
          `}

          <div class="add-item-form">
            <div class="form-grid">
              <sl-input
                placeholder="Category name"
                .value=${this.newCategoryName}
                @sl-input=${(e: CustomEvent) => this.newCategoryName = (e.target as any).value}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addCategory()}
              ></sl-input>
              <sl-color-picker
                .value=${this.newCategoryColor}
                @sl-change=${(e: CustomEvent) => this.newCategoryColor = (e.target as any).value}
                format="hex"
                size="small"
              ></sl-color-picker>
              <sl-button 
                variant="primary" 
                @click=${this.addCategory}
                ?disabled=${!this.newCategoryName.trim()}
              >
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
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">⚡ Types</h2>
          <p class="section-description">Define different types of scope items</p>
        </div>
        <div class="section-content">
          ${this.types.length === 0 ? html`
            <div class="empty-state">
              <div class="empty-state-icon">⚡</div>
              <p class="empty-state-text">No types created yet</p>
            </div>
          ` : html`
            <div class="items-list">
              ${this.types.map(type => html`
                <div class="item-row">
                  <div class="item-info">
                    <div class="label-preview" style="background-color: ${type.color}"></div>
                    <h4 class="item-name">${type.name}</h4>
                  </div>
                  <div class="item-actions">
                    <sl-button size="small" variant="default">Edit</sl-button>
                    <sl-button size="small" variant="danger">Delete</sl-button>
                  </div>
                </div>
              `)}
            </div>
          `}

          <div class="add-item-form">
            <div class="form-grid">
              <sl-input
                placeholder="Type name"
                .value=${this.newTypeName}
                @sl-input=${(e: CustomEvent) => this.newTypeName = (e.target as any).value}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addType()}
              ></sl-input>
              <sl-color-picker
                .value=${this.newTypeColor}
                @sl-change=${(e: CustomEvent) => this.newTypeColor = (e.target as any).value}
                format="hex"
                size="small"
              ></sl-color-picker>
              <sl-button 
                variant="primary" 
                @click=${this.addType}
                ?disabled=${!this.newTypeName.trim()}
              >
                Add Type
              </sl-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private async addCategory() {
    if (!this.newCategoryName.trim() || !this.currentAccount?.id) return;

    const { data, error } = await this.categoryService.createCategory({
      account_id: this.currentAccount.id,
      name: this.newCategoryName.trim(),
      color: this.newCategoryColor,
    });

    if (data && !error) {
      this.categories = [...this.categories, data];
      this.newCategoryName = '';
      this.newCategoryColor = '#10b981';
    }
  }

  private async addType() {
    if (!this.newTypeName.trim() || !this.currentAccount?.id) return;

    const { data, error } = await this.typeService.createType({
      account_id: this.currentAccount.id,
      name: this.newTypeName.trim(),
      color: this.newTypeColor,
    });

    if (data && !error) {
      this.types = [...this.types, data];
      this.newTypeName = '';
      this.newTypeColor = '#f59e0b';
    }
  }

  static styles = css`
    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .settings-section {
      background: var(--sl-color-neutral-0);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-large);
      padding: 1.5rem;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--sl-color-neutral-900);
    }

    .section-description {
      margin: 0;
      color: var(--sl-color-neutral-600);
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--sl-color-neutral-500);
    }

    .empty-state-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .empty-state-text {
      margin: 0;
    }

    .items-list {
      margin-bottom: 1.5rem;
    }

    .item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      margin-bottom: 0.5rem;
    }

    .item-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .item-name {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .label-preview {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: 1px solid var(--sl-color-neutral-200);
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
    }

    .add-item-form {
      border-top: 1px solid var(--sl-color-neutral-200);
      padding-top: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 0.75rem;
      align-items: center;
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}

