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
        account_type,
        role,
        account_settings,
        parent_account_id
      `);

      console.log('[Supabase] getCurrentUserAccounts result:', {
        dataLength: data?.length || 0,
        error: error,
        rawData: data
      });

      return { data: data as any, error };
    } catch (error) {
      console.error('[Supabase] getCurrentUserAccounts exception:', error);
      return { data: null, error };
    }
  }

async getCurrentUserWorkspace() {
  try {
    const { data: { user }, error: userError } = await this.client.auth.getUser();
    
    if (userError || !user) {
      return { data: null, error: userError?.message || 'No authenticated user' };
    }

    console.log('[SupabaseService] Loading current user workspace with details...');
    
    const { data, error } = await this.client
      .from('accounts')
      .select(`
        *,
        account_info,
        account_settings
      `)
      .eq('primary_owner_user_id', user.id)
      .eq('account_type', 'personal')
      .single();

    if (error) {
      console.error('[SupabaseService] Error loading user workspace:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };

  } catch (error) {
    console.error('[SupabaseService] Get current user workspace exception:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to load workspace'
    };
  }
}

  async getTeamWorkspace(slug: string): Promise<{ data: any; error: any }> {
    console.log('[Supabase] getTeamWorkspace called with slug:', slug);
    try {
      // First get the team account details
      const { data: teamAccount, error: teamError } = await this.client
        .from('accounts')
        .select(`
        id,
        name,
        email,
        picture_url,
        account_type,
        account_info,
        account_settings,
        public_data,
        slug,
        created_at,
        updated_at
      `)
        .eq('slug', slug)
        .neq('account_type', 'personal')
        .neq('account_type', 'member')
        .single();

      if (teamError) {
        console.error('[Supabase] Error fetching team account:', teamError);
        return { data: null, error: teamError };
      }

      // Now get the user's role in this team from user_accounts view
      const { data: userMembership, error: membershipError } = await this.client
        .from('user_accounts')
        .select('role')
        .eq('id', teamAccount.id)
        .single();

      if (membershipError) {
        console.error('[Supabase] Error fetching user membership:', membershipError);
        // Still return the team account even if we can't get the role
      }

      const result = {
        ...teamAccount,
        user_role: userMembership?.role || null
      };

      console.log('[Supabase] getTeamWorkspace result:', {
        hasData: !!result,
        slug: slug,
        teamId: result.id,
        userRole: result.user_role,
        rawData: result
      });

      return { data: result, error: null };
    } catch (error) {
      console.error('[Supabase] getTeamWorkspace exception:', error);
      return { data: null, error };
    }
  }


  async createScope(scope: Partial<Scope>): Promise<{ data: Scope | null; error: any }> {
    console.log('[Supabase] createScope called with:', scope);
    try {
      const { data, error } = await this.client
        .from('scopes')
        .insert(scope)
        .select()
        .single();

      console.log('[Supabase] createScope result:', {
        hasData: !!data,
        error: error,
        rawData: data
      });

      return { data, error };
    } catch (error) {
      console.error('[Supabase] createScope exception:', error);
      return { data: null, error };
    }
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
      .eq('account_id', accountId)
      .is('deleted_at', null);

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
      .is('deleted_at', null)
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
      .is('deleted_at', null)
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
      .is('deleted_at', null)
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

  async isOnboardingComplete(accountId: string): Promise<{ data: boolean; error: any }> {
    const { data, error } = await this.client
      .from('onboarding')
      .select('completed')
      .eq('account_id', accountId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Record not found, onboarding not completed
      return { data: false, error: null };
    }

    return { data: data?.completed || false, error };
  }

  // Type methods
  async getTypes(accountId: string): Promise<{ data: Type[] | null; error: any }> {
    const { data, error } = await this.client
      .from('types')
      .select('*')
      .eq('account_id', accountId)
      .is('deleted_at', null)
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

  async updateUserMetadata(metadata: Record<string, any>) {
    const { data, error } = await this.client.auth.updateUser({
      data: metadata
    });
    return { data, error };
  }

  async confirmSignUp(token: string, type: string) {
    const { data, error } = await this.client.auth.verifyOtp({
      token_hash: token,
      type: type as any
    });
    return { data, error };
  }

  // Add these methods to your SupabaseService class

  async createTeamAccount(name: string): Promise<{ data: Account | null; error: any }> {
    console.log('[Supabase] createTeamAccount called with name:', name);
    try {
      const { data, error } = await this.client
        .from('accounts')
        .insert({
          name: name,
          account_type: 'team',
          // The slug will be auto-generated by the trigger set_slug_from_account_name
          // primary_owner_user_id will be set to auth.uid() by default
          // created_at, updated_at, etc. will be handled by triggers
        })
        .select(`
        id,
        name,
        slug,
        email,
        picture_url,
        account_type,
        account_info,
        account_settings,
        public_data,
        created_at,
        updated_at,
        primary_owner_user_id
      `)
        .single();

      console.log('[Supabase] createTeamAccount result:', {
        hasData: !!data,
        error: error,
        teamName: name,
        rawData: data
      });

      return { data: data as Account, error };
    } catch (error) {
      console.error('[Supabase] createTeamAccount exception:', error);
      return { data: null, error };
    }
  }

  async getScopes(accountId: string): Promise<{ data: Scope[] | null; error: any }> {
    console.log('[Supabase] getScopes called for account:', accountId);
    try {
      const { data, error } = await this.client
        .from('scopes')
        .select('*')
        .eq('account_id', accountId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      console.log('[Supabase] getScopes result:', {
        dataLength: data?.length || 0,
        error: error,
        accountId: accountId,
        rawData: data
      });

      return { data: data as Scope[], error };
    } catch (error) {
      console.error('[Supabase] getScopes exception:', error);
      return { data: null, error };
    }
  }

  async updateAccount(id: string, updates: Partial<Account>): Promise<{ data: Account | null; error: any }> {
    console.log('[Supabase] updateAccount called for account:', id, 'with updates:', updates);
    try {
      const { data, error } = await this.client
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select(`
        id,
        name,
        slug,
        email,
        picture_url,
        account_type,
        account_info,
        account_settings,
        public_data,
        created_at,
        updated_at,
        primary_owner_user_id
      `)
        .single();

      console.log('[Supabase] updateAccount result:', {
        hasData: !!data,
        error: error,
        accountId: id,
        rawData: data
      });

      return { data, error };
    } catch (error) {
      console.error('[Supabase] updateAccount exception:', error);
      return { data: null, error };
    }
  }

  async syncUserToPersonalAccount(): Promise<{ error: any }> {
    try {
      const { data: { user }, error: userError } = await this.client.auth.getUser();
      if (userError || !user) {
        return { error: userError || new Error('No authenticated user') };
      }

      const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

      const { error } = await this.client
        .from('accounts')
        .update({
          name: userName,
          email: user.email
        })
        .eq('account_type', 'personal')
        .eq('id', user.id);

      return { error };
    } catch (error) {
      console.error('[Supabase] syncUserToPersonalAccount exception:', error);
      return { error };
    }
  }

  // Add these methods to your Supabase service class

async updatePersonalAccount(userId: string, updates: {
  name?: string;
  account_info?: Record<string, any>;
  account_settings?: Record<string, any>;
}) {
  try {
    console.log('[SupabaseService] Updating personal account for user:', userId);
    
    // Build the update object dynamically
    const updateData: any = {
      updated_at: new Date().toISOString(),
      updated_by: userId
    };

    if (updates.name) {
      updateData.name = updates.name;
    }

    if (updates.account_info) {
      updateData.account_info = updates.account_info;
    }

    if (updates.account_settings) {
      updateData.account_settings = updates.account_settings;
    }

    const { data, error } = await this.client
      .from('accounts')
      .update(updateData)
      .eq('primary_owner_user_id', userId)
      .eq('account_type', 'personal')
      .select('*')
      .single();

    if (error) {
      console.error('[SupabaseService] Error updating personal account:', error);
      return { data: null, error: error.message };
    }

    console.log('[SupabaseService] Personal account updated successfully');
    return { data, error: null };

  } catch (error) {
    console.error('[SupabaseService] Update personal account exception:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to update personal account'
    };
  }
}

async getPersonalAccountWithDetails(userId: string) {
  try {
    console.log('[SupabaseService] Loading personal account with details for user:', userId);
    
    const { data, error } = await this.client
      .from('accounts')
      .select(`
        *,
        account_info,
        account_settings
      `)
      .eq('primary_owner_user_id', userId)
      .eq('account_type', 'personal')
      .single();

    if (error) {
      console.error('[SupabaseService] Error loading personal account details:', error);
      return { data: null, error: error.message };
    }

    console.log('[SupabaseService] Personal account details loaded successfully');
    return { data, error: null };

  } catch (error) {
    console.error('[SupabaseService] Get personal account details exception:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to load personal account details'
    };
  }
}

// Method to check if user has completed profile information
async hasCompletedProfile(userId: string): Promise<{ completed: boolean; error: string | null }> {
  try {
    const { data, error } = await this.client
      .from('accounts')
      .select('account_info')
      .eq('primary_owner_user_id', userId)
      .eq('account_type', 'personal')
      .single();

    if (error) {
      return { completed: false, error: error.message };
    }

    const accountInfo = data?.account_info as any;
    const hasBasicInfo = accountInfo?.full_name && accountInfo?.usage_type;
    const hasCompletedProfile = accountInfo?.profile_completed_at;

    return { 
      completed: !!(hasBasicInfo && hasCompletedProfile), 
      error: null 
    };

  } catch (error) {
    return { 
      completed: false, 
      error: error instanceof Error ? error.message : 'Failed to check profile completion' 
    };
  }
}

// Method to get user preferences from account_settings
async getUserPreferences(userId: string) {
  try {
    const { data, error } = await this.client
      .from('accounts')
      .select('account_settings')
      .eq('primary_owner_user_id', userId)
      .eq('account_type', 'personal')
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data?.account_settings || {}, error: null };

  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to load user preferences'
    };
  }
}

}

export const supabase = SupabaseService.getInstance();

