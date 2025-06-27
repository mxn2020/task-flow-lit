// src/services/type-service.ts
import { BaseService } from './base-service';
import { supabase } from './supabase';
import { Type } from '../types';

export class TypeService extends BaseService {
  async getTypes(accountId: string) {
    return this.handleRequest(() => supabase.getTypes(accountId));
  }

  async createType(type: Partial<Type>) {
    return this.handleRequest(() => supabase.createType(type));
  }

  async updateType(id: string, updates: Partial<Type>) {
    return this.handleRequest(() => supabase.updateType(id, updates));
  }

  async deleteType(id: string) {
    return this.handleRequest(() => supabase.deleteType(id));
  }
}
