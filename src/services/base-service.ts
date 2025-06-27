// src/services/base-service.ts
export abstract class BaseService {
  protected async handleRequest<T>(
    request: () => Promise<{ data: T | null; error: any }>
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const result = await request();
      if (result.error) {
        throw new Error(result.error.message || 'Request failed');
      }
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Service error:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

