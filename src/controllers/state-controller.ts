// src/controllers/state-controller.ts:

import { ReactiveController, ReactiveControllerHost } from 'lit';
import { User, Session } from '@supabase/supabase-js';
import { AppState, Account } from '../types';
import { supabase } from '../services/supabase';

export class StateController implements ReactiveController {
  private host: ReactiveControllerHost;
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
    host.addController(this);
  }

  hostConnected() {
    this.initializeAuth();
  }

  hostDisconnected() {
    // Cleanup if needed
  }

  get state(): AppState {
    return this._state;
  }

  private setState(updates: Partial<AppState>) {
    this._state = { ...this._state, ...updates };
    this.host.requestUpdate();
  }

  private async initializeAuth() {
    try {
      // Set up auth state listener
      const { data: { subscription } } = supabase.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await this.handleSignIn(session.user);
        } else if (event === 'SIGNED_OUT') {
          this.handleSignOut();
        }
      });

      // Check current session
      const session = await supabase.getSession();
      if (session?.user) {
        await this.handleSignIn(session.user);
      } else {
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
    try {
      this.setState({ 
        user: user as any, 
        isAuthenticated: true, 
        loading: true,
        error: null 
      });

      // Load user workspace and accounts
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
    try {
      this.setState({ loading: true, error: null });

      // Load user accounts
      const { data: accounts, error: accountsError } = await supabase.getCurrentUserAccounts();
      if (accountsError) throw accountsError;

      // Load user workspace (personal account)
      const { data: workspace, error: workspaceError } = await supabase.getCurrentUserWorkspace();
      if (workspaceError) throw workspaceError;

      this.setState({
        accounts: accounts || [],
        currentAccount: workspace || null,
        loading: false,
      });
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
    try {
      this.setState({ loading: true, error: null });
      
      // Load team workspace
      const { data: workspace, error } = await supabase.getTeamWorkspace(accountSlug);
      if (error) throw error;

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

  clearError() {
    this.setState({ error: null });
  }
}


