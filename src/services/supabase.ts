import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Account, Scope, ScopeItem, Group, Label, Category, Type } from '../types';

class SupabaseService {
  private client: SupabaseClient;
  private static instance: SupabaseService;

  private constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  get supabaseClient(): SupabaseClient {
    return this.client;
  }

  // Auth methods
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    return { error };
  }

  async resetPassword(email: string) {
    const { data, error } = await this.client.auth.resetPasswordForEmail(email);
    return { data, error };
  }

  async updatePassword(password: string) {
    const { data, error } = await this.client.auth.updateUser({
      password,
    });
    return { data, error };
  }

  getUser(): User | null {
    return this.client.auth.getUser().then(({ data }) => data.user);
  }

  getSession(): Session | null {
    return this.client.auth.getSession().then(({ data }) => data.session);
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback);
  }

  // Account methods
  async getCurrentUserAccounts(): Promise<{ data: Account[] | null; error: any }> {
    const { data, error } = await this.client
      .from('user_accounts')
      .select('*');
    return { data, error };
  }

  async getCurrentUserWorkspace(): Promise<{ data: any; error: any }> {
    const { data, error } = await this.client
      .from('user_account_workspace')
      .select('*')
      .single();
    return { data, error };
  }

  async getTeamWorkspace(slug: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.client
      .rpc('team_account_workspace', { account_slug: slug })
      .single();
    return { data, error };
  }

  async createTeamAccount(name: string): Promise<{ data: Account | null; error: any }> {
    const { data, error } = await this.client
      .rpc('create_team_account', { account_name: name })
      .single();
    return { data, error };
  }

  async updateAccount(id: string, updates: Partial<Account>): Promise<{ data: Account | null; error: any }> {
    const { data, error } = await this.client
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  // Scope methods
  async getScopes(accountId: string): Promise<{ data: Scope[] | null; error: any }> {
    const { data, error } = await this.client
      .from('scopes')
      .select('*')
      .eq('account_id', accountId)
      .is('deleted_at', null)
      .order('position', { ascending: true });
    return { data, error };
  }

  async createScope(scope: Partial<Scope>): Promise<{ data: Scope | null; error: any }> {
    const { data, error } = await this.client
      .from('scopes')
      .insert(scope)
      .select()
      .single();
    return { data, error };
  }

  async updateScope(id: string, updates: Partial<Scope>): Promise<{ data: Scope | null; error: any }> {
    const { data, error } = await this.client
      .from('scopes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  async deleteScope(id: string): Promise<{ error: any }> {
    const { error } = await this.client
      .from('scopes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return { error };
  }

  // Scope Items methods
  async getScopeItems(accountId: string, scopeId?: string): Promise<{ data: ScopeItem[] | null; error: any }> {
    let query = this.client
      .from('scope_items')
      .select('*')
      .eq('account_id', accountId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (scopeId) {
      query = query.eq('scope_id', scopeId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  async createScopeItem(item: Partial<ScopeItem>): Promise<{ data: ScopeItem | null; error: any }> {
    const { data, error } = await this.client
      .from('scope_items')
      .insert(item)
      .select()
      .single();
    return { data, error };
  }

  async updateScopeItem(id: string, updates: Partial<ScopeItem>): Promise<{ data: ScopeItem | null; error: any }> {
    const { data, error } = await this.client
      .from('scope_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  async deleteScopeItem(id: string): Promise<{ error: any }> {
    const { error } = await this.client
      .from('scope_items')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return { error };
  }

  // Data Settings methods
  async getGroups(accountId: string): Promise<{ data: Group[] | null; error: any }> {
    const { data, error } = await this.client
      .from('groups')
      .select('*')
      .eq('account_id', accountId)
      .order('name');
    return { data, error };
  }

  async createGroup(group: Partial<Group>): Promise<{ data: Group | null; error: any }> {
    const { data, error } = await this.client
      .from('groups')
      .insert(group)
      .select()
      .single();
    return { data, error };
  }

  async getLabels(accountId: string): Promise<{ data: Label[] | null; error: any }> {
    const { data, error } = await this.client
      .from('labels')
      .select('*')
      .eq('account_id', accountId)
      .order('name');
    return { data, error };
  }

  async createLabel(label: Partial<Label>): Promise<{ data: Label | null; error: any }> {
    const { data, error } = await this.client
      .from('labels')
      .insert(label)
      .select()
      .single();
    return { data, error };
  }

  async getCategories(accountId: string): Promise<{ data: Category[] | null; error: any }> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('account_id', accountId)
      .order('name');
    return { data, error };
  }

  async createCategory(category: Partial<Category>): Promise<{ data: Category | null; error: any }> {
    const { data, error } = await this.client
      .from('categories')
      .insert(category)
      .select()
      .single();
    return { data, error };
  }

  async getTypes(accountId: string): Promise<{ data: Type[] | null; error: any }> {
    const { data, error } = await this.client
      .from('types')
      .select('*')
      .eq('account_id', accountId)
      .order('name');
    return { data, error };
  }

  async createType(type: Partial<Type>): Promise<{ data: Type | null; error: any }> {
    const { data, error } = await this.client
      .from('types')
      .insert(type)
      .select()
      .single();
    return { data, error };
  }

  // Onboarding methods
  async getOnboarding(accountId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.client
      .from('onboarding')
      .select('*')
      .eq('account_id', accountId)
      .single();
    return { data, error };
  }

  async updateOnboarding(accountId: string, updates: any): Promise<{ data: any; error: any }> {
    const { data, error } = await this.client
      .from('onboarding')
      .upsert({
        account_id: accountId,
        ...updates,
      })
      .select()
      .single();
    return { data, error };
  }

  async completeOnboarding(accountId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.client
      .from('onboarding')
      .upsert({
        account_id: accountId,
        completed: true,
        data: {},
      })
      .select()
      .single();
    return { data, error };
  }
}

export const supabase = SupabaseService.getInstance();

