// src/controllers/state-controller.ts:

import { ReactiveController, ReactiveControllerHost } from 'lit';
import { User, Session } from '@supabase/supabase-js';
import { AppState, Account } from '../types';
import { supabase } from '../services/supabase';

export class StateController implements ReactiveController {
  private host: ReactiveControllerHost;
  private sessionCheckInterval?: number;
  private _state: AppState = {
    user: null,
    currentAccount: null,
    accounts: [],
    loading: true,
    error: null,
    isAuthenticated: false,
  };

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    console.log('[StateController] Initializing with real Supabase connection');
    host.addController(this);
  }

  hostConnected() {
    this.initializeAuth();
    this.startSessionMonitoring();
  }

  hostDisconnected() {
    this.stopSessionMonitoring();
  }

  get state(): AppState {
    return this._state;
  }

  private setState(updates: Partial<AppState>) {
    this._state = { ...this._state, ...updates };
    this.host.requestUpdate();
  }

  private async initializeAuth() {
    console.log('[StateController] Initializing auth...');
    
    try {
      // Set up auth state listener
      supabase.onAuthStateChange(async (event, session) => {
        console.log('[StateController] Auth state change:', event, !!session);
        if (event === 'SIGNED_IN' && session?.user) {
          await this.handleSignIn(session.user);
        } else if (event === 'SIGNED_OUT') {
          this.handleSignOut();
        }
      });

      // Check current session
      console.log('[StateController] Checking current session...');
      const session = await supabase.getSession();
      console.log('[StateController] Current session:', !!session);
      if (session?.user) {
        console.log('[StateController] Session found, handling sign in...');
        await this.handleSignIn(session.user);
      } else {
        console.log('[StateController] No session found, setting loading to false');
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.setState({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      });
    }
  }

  private async handleSignIn(user: User) {
    console.log('[StateController] Handling sign in for user:', user.id);
    try {
      this.setState({ 
        user: user as any, 
        isAuthenticated: true, 
        loading: true,
        error: null 
      });

      // Load user workspace and accounts
      console.log('[StateController] Loading user data...');
      await this.loadUserData();
    } catch (error) {
      console.error('Sign in error:', error);
      this.setState({ 
        error: error instanceof Error ? error.message : 'Failed to load user data',
        loading: false
      });
    }
  }

  private handleSignOut() {
    this.setState({
      user: null,
      currentAccount: null,
      accounts: [],
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }

  async loadUserData() {
    console.log('[StateController] loadUserData starting...');
    try {
      // Don't set loading to true if we already have user data
      // This prevents UI flickering during revalidation
      const shouldShowLoading = !this._state.user || this._state.accounts.length === 0;
      
      if (shouldShowLoading) {
        this.setState({ loading: true, error: null });
      } else {
        this.setState({ error: null }); // Clear any previous errors but keep data
      }

      // Load user accounts
      console.log('[StateController] Loading user accounts...');
      const { data: accounts, error: accountsError } = await supabase.getCurrentUserAccounts();
      if (accountsError) {
        console.error('[StateController] Accounts error:', accountsError);
        console.error('[StateController] Accounts error details:', JSON.stringify(accountsError, null, 2));
      }
      console.log('[StateController] Accounts loaded:', accounts?.length || 0);
      console.log('[StateController] Accounts data:', accounts);

      // Load user workspace (personal account)
      console.log('[StateController] Loading user workspace...');
      const { data: workspace, error: workspaceError } = await supabase.getCurrentUserWorkspace();
      if (workspaceError) {
        console.error('[StateController] Workspace error:', workspaceError);
        console.error('[StateController] Workspace error details:', JSON.stringify(workspaceError, null, 2));
      }
      console.log('[StateController] Workspace loaded:', !!workspace);
      console.log('[StateController] Workspace data:', workspace);

      this.setState({
        accounts: accounts || [],
        currentAccount: workspace || null,
        loading: false,
      });
      console.log('[StateController] loadUserData completed successfully');
    } catch (error) {
      console.error('Load user data error:', error);
      this.setState({ 
        error: error instanceof Error ? error.message : 'Failed to load user data',
        loading: false
      });
    }
  }

  async signUp(email: string, password: string, name: string) {
    try {
      this.setState({ loading: true, error: null });
      const { data, error } = await supabase.signUp(email, password, name);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      this.setState({ error: errorMessage, loading: false });
      return { data: null, error: errorMessage };
    }
  }

  async signIn(email: string, password: string) {
    try {
      this.setState({ loading: true, error: null });
      const { data, error } = await supabase.signIn(email, password);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      this.setState({ error: errorMessage, loading: false });
      return { data: null, error: errorMessage };
    }
  }

  async signOut() {
    try {
      this.setState({ loading: true, error: null });
      const { error } = await supabase.signOut();
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      this.setState({ error: errorMessage, loading: false });
      return { error: errorMessage };
    }
  }

  async resetPassword(email: string) {
    try {
      this.setState({ loading: true, error: null });
      const { data, error } = await supabase.resetPassword(email);
      
      if (error) throw error;
      
      this.setState({ loading: false });
      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      this.setState({ error: errorMessage, loading: false });
      return { data: null, error: errorMessage };
    }
  }

  async createTeamAccount(name: string) {
    try {
      this.setState({ loading: true, error: null });
      const { data, error } = await supabase.createTeamAccount(name);
      
      if (error) throw error;
      
      // Reload user data to get updated accounts
      await this.loadUserData();
      
      return { data, error: null };
    } catch (error) {
      console.error('Create team error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team';
      this.setState({ error: errorMessage, loading: false });
      return { data: null, error: errorMessage };
    }
  }

  async switchToAccount(accountSlug: string) {
    console.log('[StateController] Switching to account:', accountSlug);
    try {
      this.setState({ loading: true, error: null });
      
      // First check if we have this account in our loaded accounts
      const targetAccount = this.state.accounts.find(acc => 
        acc.slug === accountSlug || acc.id === accountSlug
      );
      
      if (!targetAccount) {
        throw new Error(`Account "${accountSlug}" not found in available accounts`);
      }
      
      // Load team workspace
      console.log('[StateController] Loading team workspace for:', accountSlug);
      const { data: workspace, error } = await supabase.getTeamWorkspace(accountSlug);
      if (error) throw error;

      console.log('[StateController] Team workspace loaded:', workspace);
      this.setState({
        currentAccount: workspace,
        loading: false,
      });

      return { data: workspace, error: null };
    } catch (error) {
      console.error('Switch account error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch account';
      this.setState({ error: errorMessage, loading: false });
      return { data: null, error: errorMessage };
    }
  }

  // Session management and recovery methods
  async validateSession(): Promise<boolean> {
    try {
      console.log('[StateController] Validating session...');
      const session = await supabase.getSession();
      if (!session?.user) {
        console.log('[StateController] No valid session found');
        this.handleSignOut();
        return false;
      }
      
      // Check if current user state matches session
      if (this._state.user?.id !== session.user.id) {
        console.log('[StateController] User state mismatch detected');
        console.log('[StateController] Current user ID:', this._state.user?.id);
        console.log('[StateController] Session user ID:', session.user.id);
        
        // If we don't have any user data at all, do a full reload
        if (!this._state.user) {
          console.log('[StateController] No user data found, triggering full reload...');
          await this.handleSignIn(session.user);
        } else if (this._state.accounts.length === 0) {
          // If we have user but no accounts, reload user data without showing loading
          console.log('[StateController] User exists but no accounts, reloading user data...');
          await this.loadUserData();
        } else {
          // Otherwise just update the user object
          console.log('[StateController] User data exists, just updating user object...');
          this.setState({ user: session.user as any });
        }
      }
      
      return true;
    } catch (error) {
      console.error('[StateController] Session validation failed:', error);
      // Don't immediately show error for session validation failures during visibility changes
      // Just log it and return false
      console.log('[StateController] Session validation failed, but keeping current state');
      return false;
    }
  }

  async recoverSession(): Promise<boolean> {
    console.log('[StateController] Attempting session recovery...');
    try {
      this.setState({ loading: true, error: null });
      
      // Force refresh the session
      const { data: { session }, error } = await supabase.refreshSession();
      if (error) throw error;
      
      if (session?.user) {
        console.log('[StateController] Session recovered successfully');
        await this.handleSignIn(session.user);
        return true;
      } else {
        console.log('[StateController] No session to recover');
        this.handleSignOut();
        return false;
      }
    } catch (error) {
      console.error('[StateController] Session recovery failed:', error);
      this.setState({ 
        error: 'Failed to recover session. Please sign in again.',
        loading: false 
      });
      return false;
    }
  }

  // Global app recovery - for when the app gets into a corrupted state
  async forceFullRecovery(): Promise<boolean> {
    console.log('[StateController] ⚠️  FORCE FULL RECOVERY - Resetting entire app state');
    
    try {
      // Stop any ongoing session monitoring
      this.stopSessionMonitoring();
      
      // Reset state to clean slate
      this._state = {
        user: null,
        currentAccount: null,
        accounts: [],
        loading: true,
        error: null,
        isAuthenticated: false,
      };
      this.host.requestUpdate();
      
      // Force a fresh session check
      console.log('[StateController] Getting fresh session...');
      const { data: { session }, error } = await supabase.refreshSession();
      
      if (error) {
        console.error('[StateController] Failed to get session during recovery:', error);
        this.setState({ 
          loading: false,
          error: 'Session recovery failed. Please refresh the page and sign in again.'
        });
        return false;
      }
      
      if (!session?.user) {
        console.log('[StateController] No session found during recovery, redirecting to sign in');
        this.setState({ loading: false });
        // Don't set isAuthenticated to true since there's no session
        return false;
      }
      
      // Re-initialize with fresh session
      console.log('[StateController] Re-initializing with fresh session...');
      await this.handleSignIn(session.user);
      
      // Restart session monitoring
      this.startSessionMonitoring();
      
      console.log('[StateController] ✅ Full recovery completed successfully');
      return true;
      
    } catch (error) {
      console.error('[StateController] Full recovery failed:', error);
      this.setState({ 
        loading: false,
        error: 'Recovery failed. Please refresh the page manually.'
      });
      return false;
    }
  }

  // Check if the app state is corrupted and needs recovery
  isStateCorrupted(): boolean {
    // Check for obvious signs of corruption
    const hasUser = !!this._state.user;
    const hasAccounts = this._state.accounts.length > 0;
    const isAuthenticated = this._state.isAuthenticated;
    
    // If we think we're authenticated but have no user or accounts, that's corruption
    if (isAuthenticated && !hasUser) {
      console.warn('[StateController] State corruption detected: authenticated but no user');
      return true;
    }
    
    if (isAuthenticated && hasUser && !hasAccounts) {
      console.warn('[StateController] State corruption detected: authenticated user but no accounts');
      return true;
    }
    
    return false;
  }

  // Method for components to refresh data when they encounter errors
  async refreshData(): Promise<boolean> {
    console.log('[StateController] Refreshing data...');
    
    // First check if state is corrupted
    if (this.isStateCorrupted()) {
      console.log('[StateController] State corruption detected, performing full recovery...');
      return await this.forceFullRecovery();
    }
    
    try {
      // First validate session
      const sessionValid = await this.validateSession();
      if (!sessionValid) {
        return false;
      }
      
      // Reload user data
      await this.loadUserData();
      return true;
    } catch (error) {
      console.error('[StateController] Data refresh failed:', error);
      
      // If refresh fails, try full recovery as last resort
      console.log('[StateController] Data refresh failed, attempting full recovery...');
      return await this.forceFullRecovery();
    }
  }

  // Method to check if we need to refresh data (e.g., after errors)
  shouldRefreshData(): boolean {
    return !this._state.isAuthenticated || 
           !this._state.user || 
           this._state.accounts.length === 0;
  }

  clearError() {
    this.setState({ error: null });
  }

  private startSessionMonitoring() {
    // Check session every 5 minutes
    this.sessionCheckInterval = window.setInterval(async () => {
      if (this._state.isAuthenticated) {
        const isValid = await this.validateSession();
        if (!isValid) {
          console.log('[StateController] Session validation failed, user will need to re-authenticate');
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Monitor for visibility changes but be less aggressive
    let visibilityTimeout: number | undefined;
    document.addEventListener('visibilitychange', () => {
      // Clear any pending validation
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }
      
      // Only validate if page became visible and we're authenticated
      if (!document.hidden && this._state.isAuthenticated) {
        // Debounce the validation to avoid rapid-fire calls
        visibilityTimeout = window.setTimeout(async () => {
          console.log('[StateController] Page became visible, checking session...');
          
          // Only validate if we don't have critical data missing
          if (!this._state.user || this._state.accounts.length === 0) {
            console.log('[StateController] Missing critical data, validating session...');
            const isValid = await this.validateSession();
            if (!isValid) {
              console.log('[StateController] Session invalid after visibility change');
            }
          } else {
            console.log('[StateController] User data intact, skipping aggressive validation');
          }
        }, 1000); // Wait 1 second before validating
      }
    });
    
    // Monitor for online/offline events
    window.addEventListener('online', async () => {
      console.log('[StateController] Network came back online, validating session...');
      if (this._state.isAuthenticated) {
        await this.validateSession();
      }
    });
  }

  private stopSessionMonitoring() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = undefined;
    }
  }

  // Method to automatically switch account based on current route
  async ensureCorrectAccountForRoute(teamSlug?: string): Promise<boolean> {
    console.log('[StateController] Ensuring correct account for route:', teamSlug);
    console.log('[StateController] Current state:', {
      isAuthenticated: this.state.isAuthenticated,
      hasUser: !!this.state.user,
      accountsCount: this.state.accounts.length,
      currentAccount: this.state.currentAccount?.slug || 'none'
    });
    console.log('[StateController] Available accounts:', this.state.accounts.map(acc => ({
      id: acc.id,
      slug: acc.slug,
      name: acc.name,
      type: acc.account_type
    })));
    
    // If we don't have accounts loaded yet, try to load them first
    if (this.state.isAuthenticated && this.state.user && this.state.accounts.length === 0) {
      console.log('[StateController] No accounts found but user is authenticated, loading user data...');
      await this.loadUserData();
      console.log('[StateController] After loading user data, accounts count:', this.state.accounts.length);
    }
    
    if (!teamSlug) {
      console.log('[StateController] No team slug provided, using personal workspace');
      // For routes without team slug, ensure we're on personal workspace
      if (this.state.currentAccount?.account_type === 'team') {
        // Switch back to personal workspace
        const personalAccount = this.state.accounts.find(acc => acc.account_type === 'personal');
        if (personalAccount) {
          console.log('[StateController] Switching to personal account:', personalAccount.slug);
          this.setState({ currentAccount: personalAccount });
        }
      }
      return true;
    }

    const currentAccount = this.state.currentAccount;
    console.log('[StateController] Current account:', currentAccount ? {
      id: currentAccount.id,
      slug: currentAccount.slug,
      name: currentAccount.name,
      type: currentAccount.account_type
    } : 'none');
    
    // Check if current account already matches the team slug
    if (currentAccount && (currentAccount.slug === teamSlug || currentAccount.id === teamSlug)) {
      console.log('[StateController] Current account already matches team slug');
      return true;
    }

    // Find the target team in available accounts
    const targetTeam = this.state.accounts.find(acc => 
      acc.slug === teamSlug || acc.id === teamSlug ||
      acc.name?.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') === teamSlug
    );

    if (!targetTeam) {
      console.error('[StateController] Target team not found:', teamSlug);
      console.error('[StateController] Available teams:', this.state.accounts.filter(acc => acc.account_type === 'team'));
      this.setState({ 
        error: `Team "${teamSlug}" not found or you don't have access to it.`,
        loading: false 
      });
      return false;
    }

    if (!targetTeam.slug) {
      console.error('[StateController] Target team has no slug:', targetTeam);
      this.setState({ 
        error: `Invalid team configuration for "${teamSlug}".`,
        loading: false 
      });
      return false;
    }

    console.log('[StateController] Found target team:', {
      id: targetTeam.id,
      slug: targetTeam.slug,
      name: targetTeam.name,
      type: targetTeam.account_type
    });

    console.log('[StateController] Switching to team account:', targetTeam.slug);
    try {
      const result = await this.switchToAccount(targetTeam.slug);
      if (result.error) {
        console.error('[StateController] Switch account returned error:', result.error);
        return false;
      }
      console.log('[StateController] Successfully switched to team account');
      return true;
    } catch (error) {
      console.error('[StateController] Failed to switch to team account:', error);
      return false;
    }
  }
}


