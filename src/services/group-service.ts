// src/services/group-service.ts
import { BaseService } from './base-service';
import { supabase } from './supabase';
import { Group } from '../types';

export class GroupService extends BaseService {
  async getGroups(accountId: string) {
    return this.handleRequest(() => supabase.getGroups(accountId));
  }

  async createGroup(group: Partial<Group>) {
    return this.handleRequest(() => supabase.createGroup(group));
  }

  async updateGroup(id: string, updates: Partial<Group>) {
    return this.handleRequest(() => supabase.updateGroup(id, updates));
  }

  async deleteGroup(id: string) {
    return this.handleRequest(() => supabase.deleteGroup(id));
  }
}
