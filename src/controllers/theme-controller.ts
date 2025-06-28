// src/controllers/theme-controller.ts:
import { ReactiveController, ReactiveControllerHost } from 'lit';

export type Theme = 'light' | 'dark' | 'system';

export class ThemeController implements ReactiveController {
  private host: ReactiveControllerHost;
  private _theme: Theme = 'system';
  private _resolvedTheme: 'light' | 'dark' = 'light';
  private mediaQuery: MediaQueryList;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
    
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', this.handleMediaChange);
  }

  hostConnected() {
    this.loadTheme();
    this.applyTheme();
  }

  hostDisconnected() {
    this.mediaQuery.removeEventListener('change', this.handleMediaChange);
  }

  private handleMediaChange = () => {
    if (this._theme === 'system') {
      this.updateResolvedTheme();
      this.applyTheme();
    }
  };

  private loadTheme() {
    const savedTheme = localStorage.getItem('task-flow-theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this._theme = savedTheme;
    }
    this.updateResolvedTheme();
  }

  private updateResolvedTheme() {
    if (this._theme === 'system') {
      this._resolvedTheme = this.mediaQuery.matches ? 'dark' : 'light';
    } else {
      this._resolvedTheme = this._theme;
    }
  }

  private applyTheme() {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('sl-theme-light', 'sl-theme-dark');
    
    // Apply new theme
    if (this._resolvedTheme === 'dark') {
      root.classList.add('sl-theme-dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('sl-theme-light');
      root.style.colorScheme = 'light';
    }
    
    this.host.requestUpdate();
  }

  get theme(): Theme {
    return this._theme;
  }

  get resolvedTheme(): 'light' | 'dark' {
    return this._resolvedTheme;
  }

  get isDark(): boolean {
    return this._resolvedTheme === 'dark';
  }

  setTheme(theme: Theme) {
    this._theme = theme;
    this.updateResolvedTheme();
    this.applyTheme();
    localStorage.setItem('task-flow-theme', theme);
  }

  toggleTheme() {
    // Only toggle between 'light' and 'dark'
    const nextTheme: Theme = this._resolvedTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }
}

