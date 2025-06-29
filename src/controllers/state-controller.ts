// src/controllers/state-controller.ts:

import { ReactiveController, ReactiveControllerHost } from 'lit';
import { User, Session } from '@supabase/supabase-js';
import { AppState, Account } from '../types';
import { supabase } from '../services/supabase';
import { RouterController } from './router-controller';
import { UserPreferences, UserProfileData } from '../components/pages/onboarding-page';

export class StateController implements ReactiveController {
  private host: ReactiveControllerHost;
  private router?: RouterController;
  private sessionCheckInterval?: number;
  private _state: AppState = {
    user: null,
    currentAccount: null,
    accounts: [],
    loading: true,
    error: null,
    isAuthenticated: false,
  };

  constructor(host: ReactiveControllerHost, router?: RouterController) {
    this.host = host;
    this.router = router;
    console.log('[StateController] Initializing with real Supabase connection');
    host.addController(this);
  }

  setRouter(router: RouterController) {
    this.router = router;
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

      // Check if user needs onboarding after loading data
      await this.checkAndRedirectToOnboarding();
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

      // Load user workspace (personal account)
      console.log('[StateController] Loading user workspace...');
      const { data: workspace, error: workspaceError } = await supabase.getCurrentUserWorkspace();
      if (workspaceError) {
        console.error('[StateController] Workspace error:', workspaceError);
        console.error('[StateController] Workspace error details:', JSON.stringify(workspaceError, null, 2));
      }
      console.log('[StateController] Workspace loaded:', !!workspace);

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

      // Reset loading state after successful signup
      // Don't set isAuthenticated since user needs to confirm email first
      this.setState({ loading: false });

      // Navigate to email confirmation page
      if (this.router) {
        this.router.goToEmailConfirmation(email);
      }

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

      // Don't set loading: false here since onAuthStateChange will handle the authentication flow
      // The loading state will be managed by handleSignIn method

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

      if (accountSlug === 'personal') {
        // Switch to personal account
        const personalAccount = this.state.accounts.find(acc => acc.account_type === 'personal');
        if (!personalAccount) {
          throw new Error('Personal account not found');
        }

        this.setState({
          currentAccount: personalAccount,
          loading: false,
        });

        return { data: personalAccount, error: null };
      } else {
        // Switch to team account
        // First check if we have this account in our loaded accounts
        const targetAccount = this.state.accounts.find(acc =>
          acc.slug === accountSlug || acc.id === accountSlug
        );

        if (!targetAccount) {
          throw new Error(`Account "${accountSlug}" not found in available accounts`);
        }

        // Load full team workspace details
        console.log('[StateController] Loading team workspace for:', accountSlug);
        const { data: workspace, error } = await supabase.getTeamWorkspace(accountSlug);
        if (error) throw error;

        console.log('[StateController] Team workspace loaded:', workspace);
        this.setState({
          currentAccount: workspace,
          loading: false,
        });

        return { data: workspace, error: null };
      }
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

    if (!teamSlug || teamSlug === 'personal') {
      console.log('[StateController] No team slug or personal route, using personal workspace');
      // For routes without team slug or explicit personal routes, ensure we're on personal workspace
      const personalAccount = this.state.accounts.find(acc => acc.account_type === 'personal');
      if (personalAccount && this.state.currentAccount?.id !== personalAccount.id) {
        console.log('[StateController] Switching to personal account:', personalAccount.id);
        this.setState({ currentAccount: personalAccount });
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

    // Find the target team in available accounts (from user_accounts view)
    const targetTeam = this.state.accounts.find(acc =>
      acc.slug === teamSlug || acc.id === teamSlug
    );

    if (!targetTeam) {
      console.error('[StateController] Target team not found:', teamSlug);
      console.error('[StateController] Available teams:', this.state.accounts.filter(acc => acc.account_type !== 'personal'));
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
      type: targetTeam.account_type,
      role: (targetTeam as any).role
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

  private async checkAndRedirectToOnboarding() {
    console.log('[StateController] Checking if user needs onboarding...');

    // Don't redirect if we're already on the onboarding page
    if (window.location.pathname === '/onboarding') {
      console.log('[StateController] Already on onboarding page, skipping redirect');
      return;
    }

    // Don't redirect if we're on other auth-related pages that shouldn't be interrupted
    const currentPath = window.location.pathname;
    const skipPaths = [
      '/auth/confirm',
      '/auth/email-confirmation',
      '/auth/reset-password',
      '/auth/forgot-password'
    ];
    if (skipPaths.some(path => currentPath.startsWith(path))) {
      console.log('[StateController] On auth flow page, skipping onboarding check');
      return;
    }

    const user = this.state.user;
    const accounts = this.state.accounts;
    const currentAccount = this.state.currentAccount;

    if (!user || !accounts) {
      console.log('[StateController] User or accounts not loaded yet, skipping onboarding check');
      return;
    }

    // Check if user has any team accounts (indicating they've completed team creation)
    const hasTeamAccounts = accounts.some(account => account.account_type === 'team');
    console.log('[StateController] User has team accounts:', hasTeamAccounts);

    // Check if user was created recently (within last 24 hours for better UX)
    const isRecentUser = user && new Date(user.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000;
    console.log('[StateController] User is recent (created within 24 hours):', isRecentUser);

    // Enhanced logic: Check profile completion from account_info
    let hasCompletedProfile = false;
    let hasCompletedPreferences = false;

    if (currentAccount && currentAccount.account_type === 'personal') {
      const accountInfo = currentAccount.account_info as any;
      const accountSettings = currentAccount.account_settings as any;

      hasCompletedProfile = !!(
        accountInfo?.full_name &&
        accountInfo?.usage_type &&
        accountInfo?.profile_completed_at
      );

      hasCompletedPreferences = !!(
        accountSettings?.language &&
        accountSettings?.preferences_completed_at
      );
    }

    // Also check user metadata as fallback
    const userMetadata = user.user_metadata || {};
    const hasMetadataProfile = userMetadata.full_name || userMetadata.onboarding_completed;

    console.log('[StateController] Profile completion status:', {
      hasTeamAccounts,
      isRecentUser,
      hasCompletedProfile,
      hasCompletedPreferences,
      hasMetadataProfile,
      accountInfoExists: !!currentAccount?.account_info,
      accountSettingsExists: !!currentAccount?.account_settings
    });

    // Decision logic: User needs onboarding if:
    // 1. They have no team accounts AND
    // 2. (They are a recent user OR haven't completed profile OR haven't completed preferences)
    // 3. OR they haven't completed the full onboarding flow
    const needsOnboarding = !hasTeamAccounts &&
      (isRecentUser || !hasCompletedProfile || !hasCompletedPreferences || !hasMetadataProfile);

    console.log('[StateController] Onboarding decision:', {
      needsOnboarding,
      reason: needsOnboarding ?
        `Missing: ${[
          !hasTeamAccounts ? 'team accounts' : null,
          isRecentUser ? 'recent user' : null,
          !hasCompletedProfile ? 'profile' : null,
          !hasCompletedPreferences ? 'preferences' : null,
          !hasMetadataProfile ? 'metadata' : null
        ].filter(Boolean).join(', ')}` :
        'All requirements met'
    });

    if (needsOnboarding) {
      console.log('[StateController] User needs onboarding, redirecting...');
      if (this.router) {
        // Add a small delay to ensure the auth state is fully settled
        setTimeout(() => {
          if (this.router) {
            this.router.goToOnboarding();
          }
        }, 100);
      }
    } else {
      console.log('[StateController] User does not need onboarding');
    }
  }

  getOnboardingStatus() {
    const user = this.state.user;
    const accounts = this.state.accounts;
    const currentAccount = this.state.currentAccount;

    if (!user || !currentAccount) {
      return {
        profileCompleted: false,
        preferencesCompleted: false,
        teamCreated: false,
        overallCompleted: false
      };
    }

    const accountInfo = currentAccount.account_info as any;
    const accountSettings = currentAccount.account_settings as any;

    const profileCompleted = !!(
      accountInfo?.full_name &&
      accountInfo?.usage_type &&
      accountInfo?.profile_completed_at
    );

    const preferencesCompleted = !!(
      accountSettings?.language &&
      accountSettings?.preferences_completed_at
    );

    const teamCreated = accounts.some(account => account.account_type === 'team');

    const overallCompleted = profileCompleted && preferencesCompleted && teamCreated;

    return {
      profileCompleted,
      preferencesCompleted,
      teamCreated,
      overallCompleted
    };
  }

  async completeOnboarding(additionalMetadata: Record<string, any> = {}) {
    console.log('[StateController] Marking onboarding as completed...');

    try {
      // Update user metadata to indicate onboarding is complete
      const updateData = {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        ...additionalMetadata
      };

      const { error } = await supabase.updateUserMetadata(updateData);

      if (error) {
        console.error('[StateController] Error updating onboarding status:', error);
        return { error: error.message };
      }

      // Update local state
      if (this.state.user) {
        this.setState({
          user: {
            ...this.state.user,
            user_metadata: {
              ...this.state.user.user_metadata,
              ...updateData
            }
          }
        });
      }

      // Also update the personal account to mark onboarding as completed
      const user = this.state.user;
      if (user) {
        await supabase.updatePersonalAccount(user.id, {
          account_info: {
            ...this.state.currentAccount?.account_info,
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString()
          }
        });
      }

      console.log('[StateController] Onboarding marked as completed');
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete onboarding';
      console.error('[StateController] Complete onboarding exception:', error);
      return { error: errorMessage };
    }
  }

  async handleEmailConfirmation(token: string, type: string) {
    console.log('[StateController] Handling email confirmation...');
    this.setState({ loading: true, error: null });

    try {
      // Confirm the user's email
      const { error } = await supabase.confirmSignUp(token, type);

      if (error) {
        console.error('[StateController] Email confirmation error:', error);
        this.setState({ loading: false, error: error.message });
        return { error: error.message };
      }

      console.log('[StateController] Email confirmation successful');
      // Don't set loading: false here - let the auth state change handler do it
      // The onboarding check will happen in handleSignIn when the user gets authenticated

      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email confirmation failed';
      console.error('[StateController] Email confirmation exception:', error);
      this.setState({ loading: false, error: errorMessage });
      return { error: errorMessage };
    }
  }

  async skipOnboarding() {
    console.log('[StateController] User is skipping onboarding...');

    try {
      const updateData = {
        onboarding_skipped: true,
        onboarding_skipped_at: new Date().toISOString()
      };

      const { error } = await supabase.updateUserMetadata(updateData);

      if (error) {
        console.error('[StateController] Error updating onboarding skip status:', error);
        return { error: error.message };
      }

      // Update local state
      if (this.state.user) {
        this.setState({
          user: {
            ...this.state.user,
            user_metadata: {
              ...this.state.user.user_metadata,
              ...updateData
            }
          }
        });
      }

      console.log('[StateController] Onboarding marked as skipped');
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to skip onboarding';
      console.error('[StateController] Skip onboarding exception:', error);
      return { error: errorMessage };
    }
  }




  async resendConfirmation(email: string) {
    try {
      const { error } = await supabase.resendConfirmation(email);
      return { error: error?.message };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to resend confirmation' };
    }
  }

  // Add these methods to your StateController class

  // Method to update personal account info (account_info field)
  async updatePersonalAccountInfo(profileData: UserProfileData) {
    console.log('[StateController] Updating personal account info...');

    try {
      this.setState({ loading: true, error: null });

      const user = this.state.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare account_info data
      const accountInfo = {
        full_name: profileData.fullName,
        company: profileData.company || null,
        role: profileData.role || null,
        usage_type: profileData.usageType,
        team_size: profileData.teamSize || null,
        industry: profileData.industry || null,
        phone_number: profileData.phoneNumber || null,
        profile_completed_at: new Date().toISOString()
      };

      // Update the personal account
      const { data, error } = await supabase.updatePersonalAccount(user.id, {
        name: profileData.fullName, // Update account name too
        account_info: accountInfo
      });

      if (error) {
        console.error('[StateController] Error updating personal account info:', error);
        this.setState({ loading: false, error: error });
        return { error };
      }

      // Update local state if we have the current account
      if (this.state.currentAccount && this.state.currentAccount.account_type === 'personal') {
        this.setState({
          currentAccount: {
            ...this.state.currentAccount,
            name: profileData.fullName,
            account_info: accountInfo
          }
        });
      }

      // Also update user metadata in auth
      await supabase.updateUserMetadata({
        full_name: profileData.fullName,
        profile_completed: true
      });

      this.setState({ loading: false });
      console.log('[StateController] Personal account info updated successfully');
      return { error: null };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      console.error('[StateController] Update personal account info exception:', error);
      this.setState({ loading: false, error: errorMessage });
      return { error: errorMessage };
    }
  }

  // Method to update personal account settings (account_settings field)
  async updatePersonalAccountSettings(preferences: UserPreferences) {
    console.log('[StateController] Updating personal account settings...');

    try {
      this.setState({ loading: true, error: null });

      const user = this.state.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare account_settings data
      const accountSettings = {
        language: preferences.language,
        date_format: preferences.dateFormat,
        time_format: preferences.timeFormat,
        week_start: preferences.weekStart,
        timezone: preferences.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications: {
          email: preferences.notifications.email,
          desktop: preferences.notifications.desktop,
          mobile: preferences.notifications.mobile,
          email_frequency: preferences.emailFrequency
        },
        theme: preferences.theme,
        preferences_completed_at: new Date().toISOString()
      };

      // Update the personal account settings
      const { data, error } = await supabase.updatePersonalAccount(user.id, {
        account_settings: accountSettings
      });

      if (error) {
        console.error('[StateController] Error updating personal account settings:', error);
        this.setState({ loading: false, error: error });
        return { error };
      }

      // Update local state if we have the current account
      if (this.state.currentAccount && this.state.currentAccount.account_type === 'personal') {
        this.setState({
          currentAccount: {
            ...this.state.currentAccount,
            account_settings: accountSettings
          }
        });
      }

      this.setState({ loading: false });
      console.log('[StateController] Personal account settings updated successfully');
      return { error: null };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences';
      console.error('[StateController] Update personal account settings exception:', error);
      this.setState({ loading: false, error: errorMessage });
      return { error: errorMessage };
    }
  }

  // Enhanced method to load personal account data including info and settings
  async loadPersonalAccountData() {
    console.log('[StateController] Loading personal account data...');

    try {
      const user = this.state.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Load personal account with full details
      const { data: personalAccount, error } = await supabase.getPersonalAccountWithDetails(user.id);

      if (error) {
        console.error('[StateController] Error loading personal account data:', error);
        return { data: null, error: error };
      }

      console.log('[StateController] Personal account data loaded:', personalAccount);
      return { data: personalAccount, error: null };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load personal account data';
      console.error('[StateController] Load personal account data exception:', error);
      return { data: null, error: errorMessage };
    }
  }

  // In state-controller.ts, add this getter:
  get userDisplayName(): string {
    // First try to get name from personal account
    const personalAccount = this.state.accounts.find(acc => acc.account_type === 'personal');
    if (personalAccount?.name) {
      return personalAccount.name;
    }

    // Fallback to auth user metadata name
    if (this.state.user?.user_metadata?.name) {
      return this.state.user.user_metadata.name;
    }

    // Final fallback to email
    return this.state.user?.email || 'User';
  }

  get userEmail(): string {
    return this.state.user?.email || '';
  }

  get userInitials(): string {
    const name = this.userDisplayName;
    if (name && name !== 'User') {
      return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
    }
    return this.userEmail.charAt(0).toUpperCase();
  }

}


