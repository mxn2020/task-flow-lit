import { ReactiveController, ReactiveControllerHost } from 'lit';
import { RouteParams, RouteContext } from '../types';

export interface Route {
  path: string;
  component: string;
  requiresAuth?: boolean;
  title?: string;
}

export class RouterController implements ReactiveController {
  private host: ReactiveControllerHost;
  private _currentRoute: string = '/';
  private _params: RouteParams = {};
  private _query: URLSearchParams = new URLSearchParams();
  private _context: RouteContext | null = null; // Cache the context object
  private debugLogs: string[] = [];

  private routes: Route[] = [
    // Public routes
    { path: '/', component: 'landing-page', title: 'Task Flow' },
    { path: '/auth/sign-in', component: 'sign-in-page', title: 'Sign In' },
    { path: '/auth/sign-up', component: 'sign-up-page', title: 'Sign Up' },
    { path: '/auth/forgot-password', component: 'forgot-password-page', title: 'Forgot Password' },
    { path: '/auth/reset-password', component: 'reset-password-page', title: 'Reset Password' },
    { path: '/auth/confirm', component: 'confirm-page', title: 'Email Confirmation' },
    
    // Protected routes
    { path: '/onboarding', component: 'onboarding-page', requiresAuth: true, title: 'Get Started' },
    { path: '/app', component: 'dashboard-page', requiresAuth: true, title: 'Dashboard' },
    { path: '/app/:teamSlug', component: 'team-dashboard-page', requiresAuth: true, title: 'Team Dashboard' },
    { path: '/app/:teamSlug/scopes', component: 'scopes-page', requiresAuth: true, title: 'Scopes' },
    { path: '/app/:teamSlug/scopes/:scopeId', component: 'scope-items-page', requiresAuth: true, title: 'Scope Items' },
    { path: '/app/:teamSlug/data-settings', component: 'data-settings-page', requiresAuth: true, title: 'Data Settings' },
    { path: '/app/:teamSlug/profile', component: 'profile-page', requiresAuth: true, title: 'Profile' },
    { path: '/app/:teamSlug/team', component: 'team-page', requiresAuth: true, title: 'Team Settings' },
    { path: '/app/:teamSlug/team/members', component: 'team-members-page', requiresAuth: true, title: 'Team Members' },
    { path: '/app/:teamSlug/billing', component: 'billing-page', requiresAuth: true, title: 'Billing' },
    { path: '/app/:teamSlug/documentation', component: 'documentation-page', requiresAuth: true, title: 'Documentation' },
    
    // 404
    { path: '*', component: 'not-found-page', title: 'Page Not Found' },
  ];

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
    this.addDebugLog('🚀 RouterController created');
  }

  private addDebugLog(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    console.log(`[RouterController] ${logMessage}`);
    this.debugLogs = [...this.debugLogs.slice(-10), logMessage]; // Keep last 10 logs
  }

  hostConnected() {
    this.addDebugLog('🔌 RouterController connected');
    this.setupRouter();
  }

  hostDisconnected() {
    this.addDebugLog('🔌 RouterController disconnected');
    window.removeEventListener('popstate', this.handlePopState);
    document.removeEventListener('click', this.handleLinkClick);
  }

  private setupRouter() {
    this.addDebugLog('⚙️ Setting up router');
    // Handle initial route
    this.updateRoute();
    
    // Listen for back/forward navigation
    window.addEventListener('popstate', this.handlePopState);
    
    // Intercept link clicks
    document.addEventListener('click', this.handleLinkClick);
    this.addDebugLog('✅ Router setup complete');
  }

  private handlePopState = () => {
    this.addDebugLog('⬅️ PopState event detected');
    this.updateRoute();
  };

  private handleLinkClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (!link) return;
    
    // Skip external links
    if (link.hostname !== window.location.hostname) {
      this.addDebugLog(`🔗 Skipping external link: ${link.href}`);
      return;
    }
    
    // Skip links with target="_blank"
    if (link.target === '_blank') {
      this.addDebugLog(`🔗 Skipping blank target link: ${link.href}`);
      return;
    }
    
    // Skip if modifier keys are pressed
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      this.addDebugLog(`🔗 Skipping modified click: ${link.href}`);
      return;
    }
    
    this.addDebugLog(`🔗 Intercepting link click: ${link.href}`);
    event.preventDefault();
    this.navigate(link.pathname + link.search + link.hash);
  };

  private updateRoute() {
    const path = window.location.pathname;
    const search = window.location.search;
    
    this.addDebugLog(`📍 Updating route from ${this._currentRoute} to ${path}`);
    
    this._currentRoute = path;
    this._query = new URLSearchParams(search);
    this._params = this.extractParams(path);
    this._context = null; // Invalidate cached context
    
    // Update document title
    const route = this.findRoute(path);
    if (route?.title) {
      document.title = route.title;
      this.addDebugLog(`📄 Updated document title: ${route.title}`);
    }
    
    this.addDebugLog(`📊 Route updated - path: ${path}, component: ${route?.component}, requiresAuth: ${route?.requiresAuth}`);
    this.host.requestUpdate();
  }

  private findRoute(path: string): Route | undefined {
    this.addDebugLog(`🔍 Finding route for path: ${path}`);
    
    // Try exact match first
    const exactMatch = this.routes.find(route => route.path === path);
    if (exactMatch) {
      this.addDebugLog(`✅ Found exact match: ${exactMatch.component}`);
      return exactMatch;
    }
    
    // Try pattern matching
    for (const route of this.routes) {
      if (this.matchRoute(route.path, path)) {
        this.addDebugLog(`✅ Found pattern match: ${route.component} (pattern: ${route.path})`);
        return route;
      }
    }
    
    // Return 404 route
    const notFoundRoute = this.routes.find(route => route.path === '*');
    this.addDebugLog(`❌ No route found, returning 404: ${notFoundRoute?.component}`);
    return notFoundRoute;
  }

  private matchRoute(pattern: string, path: string): boolean {
    if (pattern === '*') return true;
    if (pattern === path) return true;
    
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    
    if (patternParts.length !== pathParts.length) return false;
    
    return patternParts.every((part, index) => {
      if (part.startsWith(':')) return true;
      return part === pathParts[index];
    });
  }

  private extractParams(path: string): RouteParams {
    const route = this.findRoute(path);
    if (!route || route.path === '*') return {};
    
    const patternParts = route.path.split('/');
    const pathParts = path.split('/');
    const params: RouteParams = {};
    
    patternParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        params[paramName] = pathParts[index];
      }
    });
    
    this.addDebugLog(`📋 Extracted params: ${JSON.stringify(params)}`);
    return params;
  }

  navigate(path: string, replace: boolean = false) {
    this.addDebugLog(`🧭 Navigate called: ${path} (replace: ${replace})`);
    this.addDebugLog(`📍 Current location before navigate: ${window.location.pathname}`);
    
    if (replace) {
      window.history.replaceState(null, '', path);
      this.addDebugLog(`🔄 Replaced history state with: ${path}`);
    } else {
      window.history.pushState(null, '', path);
      this.addDebugLog(`➕ Pushed history state with: ${path}`);
    }
    
    this.addDebugLog(`📍 Location after history update: ${window.location.pathname}`);
    this.updateRoute();
  }

  replace(path: string) {
    this.addDebugLog(`🔄 Replace called: ${path}`);
    this.navigate(path, true);
  }

  back() {
    this.addDebugLog('⬅️ Back called');
    window.history.back();
  }

  forward() {
    this.addDebugLog('➡️ Forward called');
    window.history.forward();
  }

  get currentRoute(): string {
    return this._currentRoute;
  }

  get params(): RouteParams {
    return this._params;
  }

  get query(): URLSearchParams {
    return this._query;
  }

  get context(): RouteContext {
    if (!this._context) {
      this._context = {
        params: this._params,
        query: this._query,
      };
    }
    return this._context;
  }

  getCurrentComponent(): string {
    const route = this.findRoute(this._currentRoute);
    const component = route?.component || 'not-found-page';
    this.addDebugLog(`🎯 Getting current component: ${component} for route: ${this._currentRoute}`);
    return component;
  }

  requiresAuth(): boolean {
    const route = this.findRoute(this._currentRoute);
    const requiresAuth = route?.requiresAuth || false;
    this.addDebugLog(`🔐 Route requires auth: ${requiresAuth} for route: ${this._currentRoute}`);
    return requiresAuth;
  }

  // Helper methods for common navigation patterns
  goHome() {
    this.addDebugLog('🏠 Going home');
    this.navigate('/');
  }

  goToSignIn() {
    this.addDebugLog('🔑 Going to sign in');
    this.navigate('/auth/sign-in');
  }

  goToSignUp() {
    this.addDebugLog('📝 Going to sign up');
    this.navigate('/auth/sign-up');
  }

  goToOnboarding() {
    this.addDebugLog('🚀 Going to onboarding');
    this.navigate('/onboarding');
  }

  goToDashboard() {
    this.addDebugLog('📊 Going to dashboard');
    this.navigate('/app');
  }

  goToTeam(teamSlug: string) {
    this.addDebugLog(`👥 Going to team: ${teamSlug}`);
    this.navigate(`/app/${teamSlug}`);
  }

  goToScopes(teamSlug: string) {
    this.addDebugLog(`📋 Going to scopes for team: ${teamSlug}`);
    this.navigate(`/app/${teamSlug}/scopes`);
  }

  goToScopeItems(teamSlug: string, scopeId: string) {
    this.addDebugLog(`📝 Going to scope items for team: ${teamSlug}, scope: ${scopeId}`);
    this.navigate(`/app/${teamSlug}/scopes/${scopeId}`);
  }

  goToProfile(teamSlug: string) {
    this.addDebugLog(`👤 Going to profile for team: ${teamSlug}`);
    this.navigate(`/app/${teamSlug}/profile`);
  }

  goToTeamSettings(teamSlug: string) {
    this.addDebugLog(`⚙️ Going to team settings for team: ${teamSlug}`);
    this.navigate(`/app/${teamSlug}/team`);
  }

  goToTeamMembers(teamSlug: string) {
    this.addDebugLog(`👥 Going to team members for team: ${teamSlug}`);
    this.navigate(`/app/${teamSlug}/team/members`);
  }

  goToBilling(teamSlug: string) {
    this.addDebugLog(`💳 Going to billing for team: ${teamSlug}`);
    this.navigate(`/app/${teamSlug}/billing`);
  }

  goToDataSettings(teamSlug: string) {
    this.addDebugLog(`📊 Going to data settings for team: ${teamSlug}`);
    this.navigate(`/app/${teamSlug}/data-settings`);
  }

  goToDocumentation(teamSlug: string) {
    this.addDebugLog(`📚 Going to documentation for team: ${teamSlug}`);
    this.navigate(`/app/${teamSlug}/documentation`);
  }

  goToResetPassword() {
    this.addDebugLog('🔐 Going to reset password');
    this.navigate('/auth/reset-password');
  }

  goToForgotPassword() {
    this.addDebugLog('❓ Going to forgot password');
    this.navigate('/auth/forgot-password');
  }

  goToConfirm() {
    this.addDebugLog('✅ Going to email confirmation');
    this.navigate('/auth/confirm');
  }
}

