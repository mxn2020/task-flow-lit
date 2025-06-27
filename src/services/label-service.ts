// src/services/label-service.ts
import { BaseService } from './base-service';
import { supabase } from './supabase';
import { Label } from '../types';

export class LabelService extends BaseService {
  async getLabels(accountId: string) {
    return this.handleRequest(() => supabase.getLabels(accountId));
  }

  async createLabel(label: Partial<Label>) {
    return this.handleRequest(() => supabase.createLabel(label));
  }

  async updateLabel(id: string, updates: Partial<Label>) {
    return this.handleRequest(() => supabase.updateLabel(id, updates));
  }

  async deleteLabel(id: string) {
    return this.handleRequest(() => supabase.deleteLabel(id));
  }
}
