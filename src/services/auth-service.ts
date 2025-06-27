// src/services/auth-service.ts
import { BaseService } from './base-service';
import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export class AuthService extends BaseService {
  async signUp(email: string, password: string, name: string) {
    return this.handleRequest(() => supabase.signUp(email, password, name));
  }

  async signIn(email: string, password: string) {
    return this.handleRequest(() => supabase.signIn(email, password));
  }

  async signOut() {
    return this.handleRequest(() => supabase.signOut());
  }

  async resetPassword(email: string) {
    return this.handleRequest(() => supabase.resetPassword(email));
  }

  async updatePassword(password: string) {
    return this.handleRequest(() => supabase.updatePassword(password));
  }

  async getCurrentUser(): Promise<{ data: User | null; error: string | null }> {
    return this.handleRequest(() => 
      supabase.getUser().then(user => ({ data: user, error: null }))
    );
  }

  async getCurrentSession(): Promise<{ data: Session | null; error: string | null }> {
    return this.handleRequest(() => 
      supabase.getSession().then(session => ({ data: session, error: null }))
    );
  }

  async refreshSession() {
    return this.handleRequest(() => supabase.refreshSession());
  }

  async verifyOtp(params: { token_hash: string; type: any }) {
    return this.handleRequest(() => supabase.verifyOtp(params));
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.onAuthStateChange(callback);
  }
}

