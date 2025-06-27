// src/services/account-service.ts
import { BaseService } from './base-service';
import { supabase } from './supabase';
import { Account } from '../types';

export class AccountService extends BaseService {
  async getCurrentUserAccounts() {
    return this.handleRequest(() => supabase.getCurrentUserAccounts());
  }

  async getCurrentUserWorkspace() {
    return this.handleRequest(() => supabase.getCurrentUserWorkspace());
  }

  async getTeamWorkspace(slug: string) {
    return this.handleRequest(() => supabase.getTeamWorkspace(slug));
  }

  async createTeamAccount(name: string) {
    return this.handleRequest(() => supabase.createTeamAccount(name));
  }

  async updateAccount(id: string, updates: Partial<Account>) {
    return this.handleRequest(() => supabase.updateAccount(id, updates));
  }
}

