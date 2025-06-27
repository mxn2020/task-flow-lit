// src/services/onboarding-service.ts
import { BaseService } from './base-service';
import { supabase } from './supabase';

export class OnboardingService extends BaseService {
  async getOnboarding(accountId: string) {
    return this.handleRequest(() => supabase.getOnboarding(accountId));
  }

  async updateOnboarding(accountId: string, updates: any) {
    return this.handleRequest(() => supabase.updateOnboarding(accountId, updates));
  }

  async completeOnboarding(accountId: string) {
    return this.handleRequest(() => supabase.completeOnboarding(accountId));
  }
}

