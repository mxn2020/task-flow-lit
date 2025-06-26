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
  }

  hostConnected() {
    this.setupRouter();
  }

  hostDisconnected() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  private setupRouter() {
    // Handle initial route
    this.updateRoute();
    
    // Listen for back/forward navigation
    window.addEventListener('popstate', this.handlePopState);
    
    // Intercept link clicks
    document.addEventListener('click', this.handleLinkClick);
  }

  private handlePopState = () => {
    this.updateRoute();
  };

  private handleLinkClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (!link) return;
    
    // Skip external links
    if (link.hostname !== window.location.hostname) return;
    
    // Skip links with target="_blank"
    if (link.target === '_blank') return;
    
    // Skip if modifier keys are pressed
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    
    event.preventDefault();
    this.navigate(link.pathname + link.search + link.hash);
  };

  private updateRoute() {
    const path = window.location.pathname;
    const search = window.location.search;
    
    this._currentRoute = path;
    this._query = new URLSearchParams(search);
    this._params = this.extractParams(path);
    
    // Update document title
    const route = this.findRoute(path);
    if (route?.title) {
      document.title = route.title;
    }
    
    this.host.requestUpdate();
  }

  private findRoute(path: string): Route | undefined {
    // Try exact match first
    const exactMatch = this.routes.find(route => route.path === path);
    if (exactMatch) return exactMatch;
    
    // Try pattern matching
    for (const route of this.routes) {
      if (this.matchRoute(route.path, path)) {
        return route;
      }
    }
    
    // Return 404 route
    return this.routes.find(route => route.path === '*');
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
    
    return params;
  }

  navigate(path: string, replace: boolean = false) {
    if (replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
    this.updateRoute();
  }

  replace(path: string) {
    this.navigate(path, true);
  }

  back() {
    window.history.back();
  }

  forward() {
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
    return {
      params: this._params,
      query: this._query,
    };
  }

  getCurrentComponent(): string {
    const route = this.findRoute(this._currentRoute);
    return route?.component || 'not-found-page';
  }

  requiresAuth(): boolean {
    const route = this.findRoute(this._currentRoute);
    return route?.requiresAuth || false;
  }

  // Helper methods for common navigation patterns
  goHome() {
    this.navigate('/');
  }

  goToSignIn() {
    this.navigate('/auth/sign-in');
  }

  goToSignUp() {
    this.navigate('/auth/sign-up');
  }

  goToOnboarding() {
    this.navigate('/onboarding');
  }

  goToDashboard() {
    this.navigate('/app');
  }

  goToTeam(teamSlug: string) {
    this.navigate(`/app/${teamSlug}`);
  }

  goToScopes(teamSlug: string) {
    this.navigate(`/app/${teamSlug}/scopes`);
  }

  goToScopeItems(teamSlug: string, scopeId: string) {
    this.navigate(`/app/${teamSlug}/scopes/${scopeId}`);
  }
}

