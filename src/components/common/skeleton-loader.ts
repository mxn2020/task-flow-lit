import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('skeleton-loader')
export class SkeletonLoader extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .skeleton {
      background: linear-gradient(
        90deg,
        var(--sl-color-neutral-200) 25%,
        var(--sl-color-neutral-100) 50%,
        var(--sl-color-neutral-200) 75%
      );
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: var(--sl-border-radius-small);
    }

    .skeleton.text {
      height: 1rem;
      margin-bottom: 0.5rem;
    }

    .skeleton.title {
      height: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .skeleton.button {
      height: 2.25rem;
      width: 6rem;
    }

    .skeleton.avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }

    .skeleton.card {
      height: 8rem;
      margin-bottom: 1rem;
    }

    .skeleton.full-width {
      width: 100%;
    }

    .skeleton.half-width {
      width: 50%;
    }

    .skeleton.quarter-width {
      width: 25%;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    /* Dark theme styles */
    :host(.sl-theme-dark) .skeleton {
      background: linear-gradient(
        90deg,
        var(--sl-color-neutral-700) 25%,
        var(--sl-color-neutral-600) 50%,
        var(--sl-color-neutral-700) 75%
      );
    }
  `;

  @property() type: 'text' | 'title' | 'button' | 'avatar' | 'card' = 'text';
  @property() width: 'full' | 'half' | 'quarter' | string = 'full';
  @property() height?: string;
  @property({ type: Number }) count: number = 1;

  render() {
    const items = Array.from({ length: this.count }, (_, i) => i);
    
    return html`
      ${items.map(() => html`
        <div 
          class="skeleton ${this.type} ${this.getWidthClass()}"
          style=${this.getStyles()}
        ></div>
      `)}
    `;
  }

  private getWidthClass(): string {
    if (this.width === 'full') return 'full-width';
    if (this.width === 'half') return 'half-width';
    if (this.width === 'quarter') return 'quarter-width';
    return '';
  }

  private getStyles(): string {
    const styles: string[] = [];
    
    if (typeof this.width === 'string' && !['full', 'half', 'quarter'].includes(this.width)) {
      styles.push(`width: ${this.width}`);
    }
    
    if (this.height) {
      styles.push(`height: ${this.height}`);
    }
    
    return styles.join('; ');
  }
}

