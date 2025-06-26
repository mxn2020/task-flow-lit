// src/types/scopes.ts:
import { Scope, ScopeItem } from './index';

export type BaseScopeFormItem = Omit<ScopeItem, 'id' | 'account_id' | 'scope_id'>;

export interface TodoScope extends Omit<Scope, 'metadata'> {
  metadata: {
    fields?: any;
  };
}

export interface BrainstormScope extends Omit<Scope, 'metadata'> {
  metadata: {
    content: string;
    fields?: any;
  };
}

export interface NoteScope extends Omit<Scope, 'metadata'> {
  metadata: {
    content: string;
    fields?: any;
  };
}

export interface ChecklistScope extends Omit<Scope, 'metadata'> {
  metadata: {
    items: Array<{
      id: string;
      text: string;
      completed: boolean;
      completedAt?: string;
    }>;
    fields?: any;
  };
}

export interface Dependency {
  itemId: string;
  dependencyType: string;
  condition?: Record<string, any>;
}

export interface FlowScope extends Omit<Scope, 'metadata'> {
  metadata: {
    dependencies: Array<{
      itemId: string;
      dependencyType: string;
      condition?: Record<string, any>;
    }>;
    flowStatus: 'pending' | 'ready' | 'blocked' | 'completed';
    completionCriteria?: string;
    subDependencies?: Record<string, any>;
    fields?: any;
  };
}

export interface MilestoneScope extends Omit<Scope, 'metadata'> {
  metadata: {
    targetDate?: string;
    successCriteria: string[];
    progress: number;
    impact?: string;
    fields?: any;
  };
}

export interface ResourceScope extends Omit<Scope, 'metadata'> {
  metadata: {
    url?: string;
    source?: string;
    format: 'article' | 'video' | 'book' | 'course';
    resourceTags: string[];
    fields?: any;
  };
}

export interface TimeblockScope extends Omit<Scope, 'metadata'> {
  metadata: {
    startTime: string;
    endTime: string;
    recurrence?: string;
    energyLevel?: number;
    fields?: any;
  };
}

export interface EventScope extends Omit<Scope, 'metadata'> {
  metadata: {
    start: string;
    end: string;
    location?: string;
    attendees: string[];
    recurring: boolean;
    fields?: any;
  };
}

export interface BookmarkScope extends Omit<Scope, 'metadata'> {
  metadata: {
    url: string;
    favicon?: string;
    description?: string;
    bookmarkTags: string[];
    lastVisited?: string;
    fields?: any;
  };
}

export type TypedScope =
  | TodoScope
  | BrainstormScope
  | NoteScope
  | ChecklistScope
  | FlowScope
  | MilestoneScope
  | ResourceScope
  | TimeblockScope
  | EventScope
  | BookmarkScope;

export interface ScopeItemFormData {
  title?: string;
  content?: string;
  url?: string;
  items?: Array<{ id: string; text: string; completed: boolean }>;
  metadata?: any;
  notes?: string;
  priority_level?: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  due_at?: string;
  tags?: string[];
}

export function getScopeRequiredFields(scopeType: string): string[] {
  switch (scopeType) {
    case 'todo':
      return ['title'];
    case 'brainstorm':
      return ['content'];
    case 'note':
      return ['title', 'content'];
    case 'checklist':
      return ['title', 'items'];
    case 'bookmark':
    case 'resource':
      return ['url'];
    case 'flow':
      return [];
    default:
      return ['title'];
  }
}

export function validateScopeItem(scopeType: string, data: ScopeItemFormData): boolean {
  const requiredFields = getScopeRequiredFields(scopeType);
  
  for (const field of requiredFields) {
    switch (field) {
      case 'title':
        if (!data.title?.trim()) return false;
        break;
      case 'content':
        if (!data.content?.trim()) return false;
        break;
      case 'url':
        if (!data.url?.trim()) return false;
        break;
      case 'items':
        if (!data.items || data.items.length === 0) return false;
        break;
    }
  }
  
  return true;
}


