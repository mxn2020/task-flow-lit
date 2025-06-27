// src/components/base/base-form.ts
import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export abstract class BaseForm<T = any> extends LitElement {
  @state() protected formData: Partial<T> = {};
  @state() protected isSubmitting = false;
  @state() protected errors: Record<string, string> = {};

  static styles = css`
    .form-grid {
      display: grid;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .error-message {
      color: var(--sl-color-danger-600);
      font-size: var(--sl-font-size-small);
      margin-top: 0.25rem;
    }

    @media (max-width: 768px) {
      .form-actions {
        flex-direction: column;
      }
    }
  `;

  protected updateField(field: keyof T, value: any) {
    this.formData = { ...this.formData, [field]: value };
    // Clear error when field is updated
    if (this.errors[field as string]) {
      const { [field as string]: _, ...rest } = this.errors;
      this.errors = rest;
    }
  }

  protected setError(field: string, message: string) {
    this.errors = { ...this.errors, [field]: message };
  }

  protected clearErrors() {
    this.errors = {};
  }

  protected abstract validate(): boolean;
  protected abstract submit(): Promise<void>;

  protected async handleSubmit() {
    this.clearErrors();
    
    if (!this.validate()) {
      return;
    }

    this.isSubmitting = true;
    try {
      await this.submit();
    } finally {
      this.isSubmitting = false;
    }
  }

  protected renderError(field: string) {
    return this.errors[field] ? html`
      <div class="error-message">${this.errors[field]}</div>
    ` : '';
  }
}

// Usage example:
// @customElement('scope-item-form')
// export class ScopeItemForm extends BaseForm<ScopeItem> {
//   @property() scopeType: string = 'todo';
//   
//   protected validate(): boolean {
//     if (!this.formData.title?.trim()) {
//       this.setError('title', 'Title is required');
//       return false;
//     }
//     return true;
//   }
//   
//   protected async submit(): Promise<void> {
//     // Submit logic here
//   }
// }

