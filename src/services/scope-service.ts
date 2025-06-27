// src/services/scope-service.ts
import { BaseService } from './base-service';
import { supabase } from './supabase';
import { Scope, ScopeItem } from '../types';

export class ScopeService extends BaseService {
  async getScopes(accountId: string) {
    return this.handleRequest(() => supabase.getScopes(accountId));
  }

  async createScope(scope: Partial<Scope>) {
    return this.handleRequest(() => supabase.createScope(scope));
  }

  async updateScope(id: string, updates: Partial<Scope>) {
    return this.handleRequest(() => supabase.updateScope(id, updates));
  }

  async deleteScope(id: string) {
    return this.handleRequest(() => supabase.deleteScope(id));
  }
}

