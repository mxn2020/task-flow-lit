// src/controllers/loading-controller.ts
import { ReactiveController, ReactiveControllerHost } from 'lit';

export class LoadingController implements ReactiveController {
  private host: ReactiveControllerHost;
  private loadingStates = new Map<string, boolean>();
  private errors = new Map<string, string>();

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {}
  hostDisconnected() {}

  isLoading(key: string = 'default'): boolean {
    return this.loadingStates.get(key) || false;
  }

  getError(key: string = 'default'): string | null {
    return this.errors.get(key) || null;
  }

  async withLoading<T>(
    key: string,
    operation: () => Promise<T>
  ): Promise<T | null> {
    try {
      this.setLoading(key, true);
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

  private setLoading(key: string, loading: boolean) {
    this.loadingStates.set(key, loading);
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
}

// Usage in component:
// private loadingController = new LoadingController(this);
//
// async loadData() {
//   const data = await this.loadingController.withLoading('data', async () => {
//     return await this.dataService.fetchData();
//   });
//   
//   if (data) {
//     this.data = data;
//   }
// }

