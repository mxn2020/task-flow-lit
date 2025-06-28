// src/controllers/loading-controller.ts
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { RouterController } from './router-controller';

export interface LoadingOptions {
  showSkeleton?: boolean;
  skeletonType?: 'page' | 'card' | 'list' | 'title';
  skeletonCount?: number;
  message?: string;
}

export class LoadingController implements ReactiveController {
  private host: ReactiveControllerHost;
  private router?: RouterController;
  private loadingStates = new Map<string, boolean>();
  private errors = new Map<string, string>();
  private loadingOptions = new Map<string, LoadingOptions>();

  constructor(host: ReactiveControllerHost, router?: RouterController) {
    this.host = host;
    this.router = router;
    host.addController(this);
  }

  setRouter(router: RouterController) {
    this.router = router;
  }

  hostConnected() {}
  hostDisconnected() {}

  isLoading(key: string = 'default'): boolean {
    return this.loadingStates.get(key) || false;
  }

  getError(key: string = 'default'): string | null {
    return this.errors.get(key) || null;
  }

  getLoadingOptions(key: string = 'default'): LoadingOptions {
    return this.loadingOptions.get(key) || this.getDefaultLoadingOptions();
  }

  private getDefaultLoadingOptions(): LoadingOptions {
    const requiresAuth = this.router?.requiresAuth() || false;
    
    return {
      showSkeleton: requiresAuth,
      skeletonType: 'page',
      skeletonCount: 1,
      message: requiresAuth ? undefined : 'Loading...'
    };
  }

  async withLoading<T>(
    key: string,
    operation: () => Promise<T>,
    options?: LoadingOptions
  ): Promise<T | null> {
    try {
      this.setLoading(key, true, options);
      this.clearError(key);
      const result = await operation();
      return result;
    } catch (error) {
      this.setError(key, error instanceof Error ? error.message : 'Operation failed');
      return null;
    } finally {
      this.setLoading(key, false);
    }
  }

  // Convenience methods for common loading patterns
  async withPageLoading<T>(operation: () => Promise<T>): Promise<T | null> {
    const requiresAuth = this.router?.requiresAuth() || false;
    
    return this.withLoading('page', operation, {
      showSkeleton: requiresAuth,
      skeletonType: 'page',
      message: requiresAuth ? undefined : 'Loading page...'
    });
  }

  async withDataLoading<T>(operation: () => Promise<T>, message?: string): Promise<T | null> {
    const requiresAuth = this.router?.requiresAuth() || false;
    
    return this.withLoading('data', operation, {
      showSkeleton: requiresAuth,
      skeletonType: 'card',
      skeletonCount: 3,
      message: requiresAuth ? undefined : (message || 'Loading data...')
    });
  }

  async withAuthLoading<T>(operation: () => Promise<T>, message?: string): Promise<T | null> {
    return this.withLoading('auth', operation, {
      showSkeleton: false,
      message: message || 'Authenticating...'
    });
  }

  async withNavigationLoading<T>(operation: () => Promise<T>): Promise<T | null> {
    const requiresAuth = this.router?.requiresAuth() || false;
    
    return this.withLoading('navigation', operation, {
      showSkeleton: requiresAuth,
      skeletonType: 'page',
      message: requiresAuth ? undefined : 'Navigating...'
    });
  }

  private setLoading(key: string, loading: boolean, options?: LoadingOptions) {
    this.loadingStates.set(key, loading);
    
    if (loading && options) {
      this.loadingOptions.set(key, {
        ...this.getDefaultLoadingOptions(),
        ...options
      });
    } else if (!loading) {
      this.loadingOptions.delete(key);
    }
    
    this.host.requestUpdate();
  }

  private setError(key: string, error: string) {
    this.errors.set(key, error);
    this.host.requestUpdate();
  }

  private clearError(key: string) {
    this.errors.delete(key);
    this.host.requestUpdate();
  }

  // Helper method to determine if we should show skeleton vs spinner
  shouldShowSkeleton(key: string = 'default'): boolean {
    const options = this.getLoadingOptions(key);
    return options.showSkeleton || false;
  }

  // Clear all loading states (useful for page transitions)
  clearAll() {
    this.loadingStates.clear();
    this.errors.clear();
    this.loadingOptions.clear();
    this.host.requestUpdate();
  }
}

