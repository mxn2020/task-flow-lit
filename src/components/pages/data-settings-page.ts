import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateController } from '../../controllers/state-controller';
import { RouterController } from '../../controllers/router-controller';
import { ThemeController } from '../../controllers/theme-controller';
import { RouteContext, Group, Label, Category, Type } from '../../types';
import { supabase } from '../../services/supabase';
import '../layout/app-sidebar';

@customElement('data-settings-page')
export class DataSettingsPage extends LitElement {
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

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .settings-section {
      background: white;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      overflow: hidden;
    }

    .section-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      background-color: var(--sl-color-neutral-50);
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: var(--sl-font-weight-semibold);
      color: var(--sl-color-neutral-900);
      margin: 0 0 0.25rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-description {
      color: var(--sl-color-neutral-600);
      font-size: var(--sl-font-size-small);
      margin: 0;
    }

    .section-content {
      padding: 1.5rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-small);
      transition: all 0.2s;
    }

    .item-row:hover {
      background-color: var(--sl-color-neutral-50);
      border-color: var(--sl-color-neutral-300);
    }

    .item-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      min-width: 0;
    }

    .item-color {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: 1px solid var(--sl-color-neutral-300);
      flex-shrink: 0;
    }

    .item-name {
      font-weight: var(--sl-font-weight-medium);
      color: var(--sl-color-neutral-900);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .add-item-form {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--sl-color-neutral-200);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.75rem;
      align-items: end;
    }

    .form-grid.with-color {
      grid-template-columns: 1fr auto auto;
    }

    .color-input {
      width: 3rem;
      height: 2.25rem;
      border: 1px solid var(--sl-color-neutral-300);
      border-radius: var(--sl-border-radius-small);
      cursor: pointer;
    }

    .empty-state {
      text-align: center;
      padding: 2rem 1rem;
      color: var(--sl-color-neutral-600);
    }

    .empty-state-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .empty-state-text {
      font-size: var(--sl-font-size-small);
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .page-layout {
        flex-direction: column;
      }

      .page-content {
        padding: 1rem;
      }

      .settings-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-grid.with-color {
        grid-template-columns: 1fr;
      }

      .item-row {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .item-actions {
        justify-content: flex-end;
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

    :host(.sl-theme-dark) .settings-section {
      background: var(--sl-color-neutral-800);
      border-color: var(--sl-color-neutral-700);
    }

    :host(.sl-theme-dark) .section-header {
      background-color: var(--sl-color-neutral-700);
      border-bottom-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .section-title {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .section-description {
      color: var(--sl-color-neutral-400);
    }

    :host(.sl-theme-dark) .item-row {
      border-color: var(--sl-color-neutral-600);
    }

    :host(.sl-theme-dark) .item-row:hover {
      background-color: var(--sl-color-neutral-700);
      border-color: var(--sl-color-neutral-500);
    }

    :host(.sl-theme-dark) .item-name {
      color: var(--sl-color-neutral-100);
    }

    :host(.sl-theme-dark) .add-item-form {
      border-top-color: var(--sl-color-neutral-600);
    }
  `;

  @property({ type: Object }) stateController!: StateController;
  @property({ type: Object }) routerController!: RouterController;
  @property({ type: Object }) themeController!: ThemeController;
  @property({ type: Object }) context!: RouteContext;

  @state() private groups: Group[] = [];
  @state() private labels: Label[] = [];
  @state() private categories: Category[] = [];
  @state() private types: Type[] = [];
  @state() private loading = true;
  @state() private error = '';

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
    const accountId = this.stateController.state.currentAccount?.id;
    if (!accountId) return;

    try {
      this.loading = true;
      this.error = '';

      const [groupsResult, labelsResult, categoriesResult, typesResult] = await Promise.all([
        supabase.getGroups(accountId),
        supabase.getLabels(accountId),
        supabase.getCategories(accountId),
        supabase.getTypes(accountId),
      ]);

      if (groupsResult.error) throw groupsResult.error;
      if (labelsResult.error) throw labelsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      if (typesResult.error) throw typesResult.error;

      this.groups = groupsResult.data || [];
      this.labels = labelsResult.data || [];
      this.categories = categoriesResult.data || [];
      this.types = typesResult.data || [];

    } catch (error) {
      console.error('Failed to load data settings:', error);
      this.error = error instanceof Error ? error.message : 'Failed to load data';
    } finally {
      this.loading = false;
    }
  }

  render() {
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
              <skeleton-loader type="card" count="4"></skeleton-loader>
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

  private renderGroupsSection() {
    return html`
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">
            📁 Groups
          </h2>
          <p class="section-description">
            Organize scope items into logical groups
          </p>
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
                @sl-input=${(e: CustomEvent) => this.newGroupName = e.target.value}
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

  private renderLabelsSection() {
    return html`
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">
            🏷️ Labels
          </h2>
          <p class="section-description">
            Color-coded labels for tagging items
          </p>
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
                    <div class="item-color" style="background-color: ${label.color}"></div>
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
            <div class="form-grid with-color">
              <sl-input
                placeholder="Label name"
                .value=${this.newLabelName}
                @sl-input=${(e: CustomEvent) => this.newLabelName = e.target.value}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addLabel()}
              ></sl-input>
              <input
                type="color"
                class="color-input"
                .value=${this.newLabelColor}
                @input=${(e: Event) => this.newLabelColor = (e.target as HTMLInputElement).value}
              >
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
          <h2 class="section-title">
            📂 Categories
          </h2>
          <p class="section-description">
            Categorize items by type or purpose
          </p>
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
                    <div class="item-color" style="background-color: ${category.color}"></div>
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
            <div class="form-grid with-color">
              <sl-input
                placeholder="Category name"
                .value=${this.newCategoryName}
                @sl-input=${(e: CustomEvent) => this.newCategoryName = e.target.value}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addCategory()}
              ></sl-input>
              <input
                type="color"
                class="color-input"
                .value=${this.newCategoryColor}
                @input=${(e: Event) => this.newCategoryColor = (e.target as HTMLInputElement).value}
              >
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
          <h2 class="section-title">
            🎨 Types
          </h2>
          <p class="section-description">
            Custom types for specialized workflows
          </p>
        </div>
        <div class="section-content">
          ${this.types.length === 0 ? html`
            <div class="empty-state">
              <div class="empty-state-icon">🎨</div>
              <p class="empty-state-text">No types created yet</p>
            </div>
          ` : html`
            <div class="items-list">
              ${this.types.map(type => html`
                <div class="item-row">
                  <div class="item-info">
                    <div class="item-color" style="background-color: ${type.color}"></div>
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
            <div class="form-grid with-color">
              <sl-input
                placeholder="Type name"
                .value=${this.newTypeName}
                @sl-input=${(e: CustomEvent) => this.newTypeName = e.target.value}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this.addType()}
              ></sl-input>
              <input
                type="color"
                class="color-input"
                .value=${this.newTypeColor}
                @input=${(e: Event) => this.newTypeColor = (e.target as HTMLInputElement).value}
              >
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

  private async addGroup() {
    if (!this.newGroupName.trim()) return;

    const accountId = this.stateController.state.currentAccount?.id;
    if (!accountId) return;

    try {
      const { data, error } = await supabase.createGroup({
        account_id: accountId,
        name: this.newGroupName.trim(),
      });

      if (error) throw error;
      if (data) {
        this.groups = [...this.groups, data];
        this.newGroupName = '';
      }
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  }

  private async addLabel() {
    if (!this.newLabelName.trim()) return;

    const accountId = this.stateController.state.currentAccount?.id;
    if (!accountId) return;

    try {
      const { data, error } = await supabase.createLabel({
        account_id: accountId,
        name: this.newLabelName.trim(),
        color: this.newLabelColor,
      });

      if (error) throw error;
      if (data) {
        this.labels = [...this.labels, data];
        this.newLabelName = '';
        this.newLabelColor = '#3b82f6';
      }
    } catch (error) {
      console.error('Failed to create label:', error);
    }
  }

  private async addCategory() {
    if (!this.newCategoryName.trim()) return;

    const accountId = this.stateController.state.currentAccount?.id;
    if (!accountId) return;

    try {
      const { data, error } = await supabase.createCategory({
        account_id: accountId,
        name: this.newCategoryName.trim(),
        color: this.newCategoryColor,
      });

      if (error) throw error;
      if (data) {
        this.categories = [...this.categories, data];
        this.newCategoryName = '';
        this.newCategoryColor = '#10b981';
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  }

  private async addType() {
    if (!this.newTypeName.trim()) return;

    const accountId = this.stateController.state.currentAccount?.id;
    if (!accountId) return;

    try {
      const { data, error } = await supabase.createType({
        account_id: accountId,
        name: this.newTypeName.trim(),
        color: this.newTypeColor,
      });

      if (error) throw error;
      if (data) {
        this.types = [...this.types, data];
        this.newTypeName = '';
        this.newTypeColor = '#f59e0b';
      }
    } catch (error) {
      console.error('Failed to create type:', error);
    }
  }
}