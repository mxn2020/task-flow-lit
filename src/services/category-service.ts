// src/services/category-service.ts
import { BaseService } from './base-service';
import { supabase } from './supabase';
import { Category } from '../types';

export class CategoryService extends BaseService {
  async getCategories(accountId: string) {
    return this.handleRequest(() => supabase.getCategories(accountId));
  }

  async createCategory(category: Partial<Category>) {
    return this.handleRequest(() => supabase.createCategory(category));
  }

  async updateCategory(id: string, updates: Partial<Category>) {
    return this.handleRequest(() => supabase.updateCategory(id, updates));
  }

  async deleteCategory(id: string) {
    return this.handleRequest(() => supabase.deleteCategory(id));
  }
}
