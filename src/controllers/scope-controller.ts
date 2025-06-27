// src/controllers/scope-controller.ts
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { ScopeService } from '../services/scope-service';
import { Scope } from '../types';

export class ScopeController implements ReactiveController {
  private host: ReactiveControllerHost;
  private scopeService = new ScopeService();
  private _scopes: Scope[] = [];
  private _loading = false;
  private _error: string | null = null;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {}
  hostDisconnected() {}

  get scopes() { return this._scopes; }
  get loading() { return this._loading; }
  get error() { return this._error; }

  async loadScopes(accountId: string) {
    this._loading = true;
    this._error = null;
    this.host.requestUpdate();

    const { data, error } = await this.scopeService.getScopes(accountId);
    
    this._loading = false;
    this._error = error;
    this._scopes = data || [];
    this.host.requestUpdate();
  }

  async createScope(scope: Partial<Scope>) {
    const { data, error } = await this.scopeService.createScope(scope);
    if (data) {
      this._scopes = [...this._scopes, data];
      this.host.requestUpdate();
    }
    return { data, error };
  }
}

// Usage in component:
// @customElement('scopes-page')
// export class ScopesPage extends LitElement {
//   private scopeController = new ScopeController(this);
//   
//   async connectedCallback() {
//     super.connectedCallback();
//     const accountId = this.stateController.state.currentAccount?.id;
//     if (accountId) {
//       await this.scopeController.loadScopes(accountId);
//     }
//   }
// }

