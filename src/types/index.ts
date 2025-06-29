// src/types/index.ts:

import { User } from "@supabase/supabase-js";

export interface Account {
  id: string;
  name: string;
  slug?: string;
  email?: string;
  account_type: 'personal' | 'member' | 'team' | 'enterprise' | 'region' | 'client';
  primary_owner_user_id: string;
  picture_url?: string;
  account_settings?: any;
  account_info?: any;
  public_data?: any;
  created_at: string;
  updated_at: string;
}

export interface AccountMembership {
  user_id: string;
  account_id: string;
  account_role: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  account_id: string;
  status: 'free' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused';
  active: boolean;
  billing_provider: string;
  cancel_at_period_end: boolean;
  currency: string;
  period_starts_at: string;
  period_ends_at: string;
  trial_starts_at?: string;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Scope {
  id: string;
  account_id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  position?: number;
  metadata: any;
  is_system: boolean;
  show_in_sidebar: boolean;
  allows_children: boolean;
  created_at: string;
  updated_at: string;
  archived_at?: string;
  deleted_at?: string;
}

export interface ScopeItem {
  id: string;
  account_id: string;
  scope_id: string;
  group_id?: string;
  parent_id?: string;
  title: string;
  completed: boolean;
  type_id?: string;
  category_id?: string;
  color_display?: string;
  metadata: any;
  priority_level?: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  is_urgent: boolean;
  importance_score?: number;
  due_at?: string;
  started_at?: string;
  paused_at?: string;
  completed_at?: string;
  total_time_spent?: string;
  estimated_duration?: string;
  progress_percentage?: number;
  status: 'not_started' | 'in_progress' | 'blocked' | 'review' | 'done';
  blocked_reason?: string;
  checklist_items: any[];
  dependent_on?: string[];
  blocked_by?: string[];
  related_to?: string[];
  notes?: string;
  attachments: any[];
  tags: string[];
  custom_fields: any;
  repeat_pattern?: string;
  location?: string;
  is_private: boolean;
  is_favorite: boolean;
  shared_with?: string[];
  visibility_level: 'private' | 'shared' | 'public';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  archived_at?: string;
}

export interface Group {
  id: string;
  account_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: string;
  account_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  account_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Type {
  id: string;
  account_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export type SystemScopeType = 'todo' | 'brainstorm' | 'note' | 'checklist' | 'milestone' | 'resource' | 'timeblock' | 'event' | 'bookmark' | 'flow';

export interface AppState {
  user: User | null;
  currentAccount: Account | null;
  accounts: Account[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface TeamState {
  currentTeam: Account | null;
  teams: Account[];
  loading: boolean;
  error: string | null;
}

export type RouteParams = Record<string, string>;

export interface RouteContext {
  params: RouteParams;
  query: URLSearchParams;
}


