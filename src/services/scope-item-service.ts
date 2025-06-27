import { ScopeItem } from "../types";
import { BaseService } from "./base-service";
import { supabase } from "./supabase";

// src/services/scope-item-service.ts
export class ScopeItemService extends BaseService {
  async getScopeItems(accountId: string, scopeId?: string) {
    return this.handleRequest(() => supabase.getScopeItems(accountId, scopeId));
  }

  async createScopeItem(item: Partial<ScopeItem>) {
    return this.handleRequest(() => supabase.createScopeItem(item));
  }

  async updateScopeItem(id: string, updates: Partial<ScopeItem>) {
    return this.handleRequest(() => supabase.updateScopeItem(id, updates));
  }

  async deleteScopeItem(id: string) {
    return this.handleRequest(() => supabase.deleteScopeItem(id));
  }
}

