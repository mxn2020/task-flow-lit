import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Account, Scope, ScopeItem, Group, Label, Category, Type } from '../types';

class SupabaseService {
  private client: SupabaseClient;
  private static instance: SupabaseService;

  private constructor() {
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
    const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

    console.log('[Supabase] Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing'
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[Supabase] Missing environment variables');
      console.error('Please create a .env file with:');
      console.error('VITE_SUPABASE_URL=your_supabase_project_url');
      console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
      throw new Error('Missing Supabase environment variables. Please check your .env file.');
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey);
    console.log('[Supabase] Client initialized successfully');
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

  async resendConfirmation(email: string) {
    const { data, error } = await this.client.auth.resend({
      type: 'signup',
      email: email,
    });
    return { data, error };
  }

  async updatePassword(password: string) {
    const { data, error } = await this.client.auth.updateUser({
      password,
    });
    return { data, error };
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.client.auth.getUser();
    return data.user;
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.client.auth.getSession();
    return data.session;
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  async refreshSession() {
    const { data, error } = await this.client.auth.refreshSession();
    return { data, error };
  }

  async verifyOtp(params: { token_hash: string; type: any }) {
    const { data, error } = await this.client.auth.verifyOtp(params);
    return { data, error };
  }

  // Account methods
  async getCurrentUserAccounts(): Promise<{ data: Account[] | null; error: any }> {
    console.log('[Supabase] getCurrentUserAccounts called');
    try {
      const { data, error } = await this.client
        .from('user_accounts')
        .select(`
          id,
          name,
          picture_url,
          slug,
          role
        `);
      
      console.log('[Supabase] getCurrentUserAccounts result:', { 
        dataLength: data?.length || 0, 
        error: error,
        rawData: data 
      });
      
      // Add account_type for consistency
      if (data) {
        data.forEach((account: any) => {
          account.account_type = 'team'; // These are team accounts from user_accounts view
        });
      }
      
      return { data: data as any, error };
    } catch (error) {
      console.error('[Supabase] getCurrentUserAccounts exception:', error);
      return { data: null, error };
    }
  }

  async getCurrentUserWorkspace(): Promise<{ data: any; error: any }> {
    console.log('[Supabase] getCurrentUserWorkspace called');
    try {
      const { data, error } = await this.client
        .from('user_account_workspace')
        .select(`
          id,
          name,
          picture_url,
          subscription_status
        `)
        .single();
      
      console.log('[Supabase] getCurrentUserWorkspace result:', { 
        hasData: !!data, 
        error: error,
        rawData: data 
      });
      
      // Add account_type and slug for consistency with team accounts
      if (data) {
        (data as any).account_type = 'personal';
        (data as any).slug = 'personal'; // Personal accounts use 'personal' as slug
      }
      
      return { data, error };
    } catch (error) {
      console.error('[Supabase] getCurrentUserWorkspace exception:', error);
      return { data: null, error };
    }
  }

  async getTeamWorkspace(slug: string): Promise<{ data: any; error: any }> {
    console.log('[Supabase] getTeamWorkspace called with slug:', slug);
    try {
      const { data, error } = await this.client
        .rpc('team_account_workspace', { account_slug: slug })
        .single();
      
      console.log('[Supabase] getTeamWorkspace result:', { 
        hasData: !!data, 
        error: error,
        rawData: data 
      });
      
      // Add account_type for consistency
      if (data) {
        (data as any).account_type = 'team';
      }
      
      return { data, error };
    } catch (error) {
      console.error('[Supabase] getTeamWorkspace exception:', error);
      return { data: null, error };
    }
  }

  async createTeamAccount(name: string): Promise<{ data: Account | null; error: any }> {
    const { data, error } = await this.client
      .rpc('create_team_account', { account_name: name })
      .single();
    return { data: data as Account, error };
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
      .order('created_at', { ascending: false });
    return { data: data as Scope[], error };
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

  async deleteScope(id: string): Promise<{ data: null; error: any }> {
    const { error } = await this.client
      .from('scopes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return { data: null, error };
  }

  // Scope Items methods
  async getScopeItems(accountId: string, scopeId?: string): Promise<{ data: ScopeItem[] | null; error: any }> {
    let query = this.client
      .from('scope_items')
      .select('*')
      .eq('account_id', accountId);
    
    if (scopeId) {
      query = query.eq('scope_id', scopeId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data: data as ScopeItem[], error };
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

  async deleteScopeItem(id: string): Promise<{ data: null; error: any }> {
    const { error } = await this.client
      .from('scope_items')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return { data: null, error };
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

  async updateGroup(id: string, updates: Partial<Group>): Promise<{ data: Group | null; error: any }> {
    const { data, error } = await this.client
      .from('groups')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  async deleteGroup(id: string): Promise<{ data: null; error: any }> {
    const { error } = await this.client
      .from('groups')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return { data: null, error };
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

  async updateLabel(id: string, updates: Partial<Label>): Promise<{ data: Label | null; error: any }> {
    const { data, error } = await this.client
      .from('labels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  async deleteLabel(id: string): Promise<{ data: null; error: any }> {
    const { error } = await this.client
      .from('labels')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return { data: null, error };
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

  async updateCategory(id: string, updates: Partial<Category>): Promise<{ data: Category | null; error: any }> {
    const { data, error } = await this.client
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  async deleteCategory(id: string): Promise<{ data: null; error: any }> {
    const { error } = await this.client
      .from('categories')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return { data: null, error };
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

  // Type methods
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

  async updateType(id: string, updates: Partial<Type>): Promise<{ data: Type | null; error: any }> {
    const { data, error } = await this.client
      .from('types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  async deleteType(id: string): Promise<{ data: null; error: any }> {
    const { error } = await this.client
      .from('types')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return { data: null, error };
  }
}

export const supabase = SupabaseService.getInstance();

