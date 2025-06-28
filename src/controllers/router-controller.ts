// src/controllers/router-controller.ts
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { RouteParams, RouteContext } from '../types';

export interface Route {
  path: string;
  component: string;
  requiresAuth?: boolean;
  title?: string;
  preload?: () => Promise<void>;
}

export interface NavigationState {
  isNavigating: boolean;
  from?: string;
  to?: string;
  startTime?: number;
  type?: 'initial' | 'navigation' | 'account-switch'; // Added type to distinguish loading states
}

export class RouterController implements ReactiveController {
  private host: ReactiveControllerHost;
  private _currentRoute: string = '/';
  private _params: RouteParams = {};
  private _query: URLSearchParams = new URLSearchParams();
  private _context: RouteContext | null = null;
  private _navigationState: NavigationState = { isNavigating: false };
  
  // Route transition cache
  private componentCache = new Map<string, any>();
  private dataCache = new Map<string, any>();
  
  // Preloading
  private preloadedRoutes = new Set<string>();

  private routes: Route[] = [
    // Public routes
    { path: '/', component: 'landing-page', title: 'Task Flow' },
    { path: '/auth/sign-in', component: 'sign-in-page', title: 'Sign In' },
    { path: '/auth/sign-up', component: 'sign-up-page', title: 'Sign Up' },
    { path: '/auth/forgot-password', component: 'forgot-password-page', title: 'Forgot Password' },
    { path: '/auth/reset-password', component: 'reset-password-page', title: 'Reset Password' },
    { path: '/auth/confirm', component: 'confirm-page', title: 'Email Confirmation' },
    { path: '/auth/email-confirmation', component: 'email-confirmation-page', title: 'Check Your Email' },
    
    // Protected routes with preloading
    { 
      path: '/onboarding', 
      component: 'onboarding-page', 
      requiresAuth: true, 
      title: 'Get Started',
      preload: () => this.preloadUserData()
    },
    { 
      path: '/app', 
      component: 'dashboard-page', 
      requiresAuth: true, 
      title: 'Dashboard',
      preload: () => this.preloadDashboardData()
    },
    { 
      path: '/app/:teamSlug', 
      component: 'team-dashboard-page', 
      requiresAuth: true, 
      title: 'Team Dashboard',
      preload: () => this.preloadTeamData()
    },
    { 
      path: '/app/:teamSlug/scopes', 
      component: 'scopes-page', 
      requiresAuth: true, 
      title: 'Scopes',
      preload: () => this.preloadScopesData()
    },
    { 
      path: '/app/:teamSlug/scopes/:scopeId', 
      component: 'scope-items-page', 
      requiresAuth: true, 
      title: 'Scope Items',
      preload: () => this.preloadScopeItemsData()
    },
    { path: '/app/:teamSlug/data-settings', component: 'data-settings-page', requiresAuth: true, title: 'Data Settings' },
    { path: '/app/:teamSlug/profile', component: 'profile-page', requiresAuth: true, title: 'Profile' },
    { path: '/app/:teamSlug/team', component: 'team-page', requiresAuth: true, title: 'Team Settings' },
    { path: '/app/:teamSlug/team/members', component: 'team-members-page', requiresAuth: true, title: 'Team Members' },
    { path: '/app/:teamSlug/billing', component: 'billing-page', requiresAuth: true, title: 'Billing' },
    { path: '/docs', component: 'documentation-page', requiresAuth: false, title: 'Documentation' },
    
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
    document.removeEventListener('click', this.handleLinkClick);
  }

  private setupRouter() {
    // Handle initial route
    this.updateRoute('initial');
    
    // Listen for back/forward navigation
    window.addEventListener('popstate', this.handlePopState);
    
    // Intercept ALL link clicks globally with better targeting
    document.addEventListener('click', this.handleLinkClick, true);
  }

  private handlePopState = () => {
    this.updateRoute('navigation');
  };

  private handleLinkClick = (event: MouseEvent) => {
    // Find the closest link element with better logic
    let target = event.target as HTMLElement;
    let link: HTMLAnchorElement | null = null;
    
    // Walk up the DOM tree to find a link
    while (target && target !== document.body) {
      if (target instanceof HTMLAnchorElement && target.href) {
        link = target;
        break;
      }
      // Check for Shoelace menu items or other elements with href
      if (target.hasAttribute('href')) {
        link = target as any;
        break;
      }
      // Check for data-href attribute (custom routing)
      if (target.hasAttribute('data-href')) {
        const href = target.getAttribute('data-href');
        if (href) {
          event.preventDefault();
          event.stopPropagation();
          this.navigate(href);
          return;
        }
      }
      target = target.parentElement!;
    }
    
    if (!link?.href) return;
    
    // Skip external links
    try {
      const linkUrl = new URL(link.href);
      if (linkUrl.hostname !== window.location.hostname) {
        return;
      }
    } catch {
      return; // Invalid URL
    }
    
    // Skip links with target="_blank"
    if (link.target === '_blank') {
      return;
    }
    
    // Skip if modifier keys are pressed
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    
    // Skip download links
    if (link.hasAttribute('download')) {
      return;
    }
    
    // Skip mailto, tel, etc.
    if (link.protocol !== 'http:' && link.protocol !== 'https:') {
      return;
    }
    
    console.log(`[Router] Intercepting navigation to: ${link.href}`);
    event.preventDefault();
    event.stopPropagation();
    
    const url = new URL(link.href);
    this.navigate(url.pathname + url.search + url.hash);
  };

  public async updateRoute(navigationType: 'initial' | 'navigation' | 'account-switch' = 'navigation') {
    const path = window.location.pathname;
    const search = window.location.search;
    
    console.log(`[Router] Updating route from ${this._currentRoute} to ${path} (type: ${navigationType})`);
    
    // Only show loading for significant navigation changes, not within same team
    const shouldShowLoading = this.shouldShowLoadingForNavigation(this._currentRoute, path, navigationType);
    
    if (shouldShowLoading) {
      this._navigationState = {
        isNavigating: true,
        from: this._currentRoute,
        to: path,
        startTime: Date.now(),
        type: navigationType
      };
      this.host.requestUpdate();
    }
    
    this._currentRoute = path;
    this._query = new URLSearchParams(search);
    this._params = this.extractParams(path);
    this._context = null; // Invalidate cached context
    
    // Update document title
    const route = this.findRoute(path);
    if (route?.title) {
      document.title = route.title;
    }
    
    // Preload route data if available and not already preloaded
    if (route?.preload && !this.preloadedRoutes.has(path)) {
      try {
        await route.preload();
        this.preloadedRoutes.add(path);
      } catch (error) {
        console.warn(`[Router] Failed to preload data for ${path}:`, error);
      }
    }
    
    // End navigation state
    this._navigationState = {
      isNavigating: false,
      from: this._navigationState.from,
      to: path,
      startTime: this._navigationState.startTime,
      type: navigationType
    };
    
    this.host.requestUpdate();
    window.dispatchEvent(new CustomEvent('route-changed'));
  }

  // Determine if we should show loading spinner for this navigation
  private shouldShowLoadingForNavigation(fromPath: string, toPath: string, type: 'initial' | 'navigation' | 'account-switch'): boolean {
    // Always show loading for initial load and account switches
    if (type === 'initial' || type === 'account-switch') {
      return true;
    }
    
    // Parse team slugs from paths
    const fromTeamSlug = this.extractTeamSlug(fromPath);
    const toTeamSlug = this.extractTeamSlug(toPath);
    
    // If navigating within the same team, don't show loading
    if (fromTeamSlug && toTeamSlug && fromTeamSlug === toTeamSlug) {
      console.log(`[Router] Same team navigation (${fromTeamSlug}), skipping loading state`);
      return false;
    }
    
    // If going from personal to team or vice versa, show loading
    if ((!fromTeamSlug && toTeamSlug) || (fromTeamSlug && !toTeamSlug)) {
      return true;
    }
    
    // If switching between different teams, show loading
    if (fromTeamSlug && toTeamSlug && fromTeamSlug !== toTeamSlug) {
      return true;
    }
    
    // For public route navigation, don't show loading
    const fromRequiresAuth = this.findRoute(fromPath)?.requiresAuth;
    const toRequiresAuth = this.findRoute(toPath)?.requiresAuth;
    
    if (!fromRequiresAuth && !toRequiresAuth) {
      return false;
    }
    
    // Default to showing loading for auth-related transitions
    return fromRequiresAuth !== toRequiresAuth;
  }

  private extractTeamSlug(path: string): string | null {
    const match = path.match(/^\/app\/([^\/]+)/);
    return match ? match[1] : null;
  }

  private findRoute(path: string): Route | undefined {
    // Try exact match first
    const exactMatch = this.routes.find(route => route.path === path);
    if (exactMatch) {
      return exactMatch;
    }
    
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

  //  navigation with better loading state management
  navigate(path: string, replace: boolean = false) {
    console.log(`[Router] Navigate called: ${path} (replace: ${replace})`);
    
    // Determine navigation type
    const currentTeamSlug = this.extractTeamSlug(this._currentRoute);
    const newTeamSlug = this.extractTeamSlug(path);
    const navigationType = (currentTeamSlug !== newTeamSlug) ? 'account-switch' : 'navigation';
    
    if (replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
    
    this.updateRoute(navigationType);
  }

  // Preload methods for data fetching
  private async preloadUserData() {
    console.log('[Router] Preloading user data');
  }

  private async preloadDashboardData() {
    console.log('[Router] Preloading dashboard data');
  }

  private async preloadTeamData() {
    console.log('[Router] Preloading team data');
  }

  private async preloadScopesData() {
    console.log('[Router] Preloading scopes data');
  }

  private async preloadScopeItemsData() {
    console.log('[Router] Preloading scope items data');
  }

  // Public API
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
    if (!this._context) {
      this._context = {
        params: this._params,
        query: this._query,
      };
    }
    return this._context;
  }

  get navigationState(): NavigationState {
    return this._navigationState;
  }

  getCurrentComponent(): string {
    const route = this.findRoute(this._currentRoute);
    return route?.component || 'not-found-page';
  }

  requiresAuth(): boolean {
    const route = this.findRoute(this._currentRoute);
    return route?.requiresAuth || false;
  }

  // Check if we're navigating within the same team (to avoid unnecessary loading)
  isSameTeamNavigation(fromPath?: string, toPath?: string): boolean {
    const from = fromPath || this._navigationState.from || this._currentRoute;
    const to = toPath || this._navigationState.to || this._currentRoute;
    
    const fromTeamSlug = this.extractTeamSlug(from);
    const toTeamSlug = this.extractTeamSlug(to);
    
    return !!(fromTeamSlug && toTeamSlug && fromTeamSlug === toTeamSlug);
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

  goToProfile(teamSlug: string) {
    this.navigate(`/app/${teamSlug}/profile`);
  }

  goToTeamSettings(teamSlug: string) {
    this.navigate(`/app/${teamSlug}/team`);
  }

  goToTeamMembers(teamSlug: string) {
    this.navigate(`/app/${teamSlug}/team/members`);
  }

  goToBilling(teamSlug: string) {
    this.navigate(`/app/${teamSlug}/billing`);
  }

  goToDataSettings(teamSlug: string) {
    this.navigate(`/app/${teamSlug}/data-settings`);
  }

  goToDocumentation(teamSlug: string) {
    this.navigate(`/app/${teamSlug}/documentation`);
  }

  goToResetPassword() {
    this.navigate('/auth/reset-password');
  }

  goToForgotPassword() {
    this.navigate('/auth/forgot-password');
  }

  goToConfirm() {
    this.navigate('/auth/confirm');
  }

  goToEmailConfirmation(email?: string) {
    const path = email ? `/auth/email-confirmation?email=${encodeURIComponent(email)}` : '/auth/email-confirmation';
    this.navigate(path);
  }

  // Prefetch route (for hover effects)
  prefetchRoute(path: string) {
    const route = this.findRoute(path);
    if (route?.preload && !this.preloadedRoutes.has(path)) {
      route.preload().then(() => {
        this.preloadedRoutes.add(path);
        console.log(`[Router] Prefetched route: ${path}`);
      }).catch(error => {
        console.warn(`[Router] Failed to prefetch route ${path}:`, error);
      });
    }
  }

  // Add event listener support for compatibility with LitElement usage
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    // For now, just forward to window (or could use an internal EventTarget if needed)
    window.addEventListener(type, listener, options);
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
    window.removeEventListener(type, listener, options);
  }
}

