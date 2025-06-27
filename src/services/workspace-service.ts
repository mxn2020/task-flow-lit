// src/services/workspace-service.ts
import { BaseService } from './base-service';
import { AccountService } from './account-service';
import { DataSettingsService } from './data-settings-service';
import { ScopeService } from './scope-service';

export class WorkspaceService extends BaseService {
  private accountService = new AccountService();
  private dataSettingsService = new DataSettingsService();
  private scopeService = new ScopeService();

  async getWorkspaceData(accountId: string, isPersonal: boolean = false) {
    const [workspace, dataSettings, scopes] = await Promise.all([
      isPersonal 
        ? this.accountService.getCurrentUserWorkspace()
        : this.accountService.getTeamWorkspace(accountId),
      this.dataSettingsService.getAllDataSettings(accountId),
      this.scopeService.getScopes(accountId)
    ]);

    return {
      workspace: workspace.data,
      dataSettings,
      scopes: scopes.data || [],
      errors: {
        workspace: workspace.error,
        scopes: scopes.error
      }
    };
  }

  async initializeWorkspace(accountId: string, workspaceData: any) {
    // Initialize workspace with default data
    const defaultSettings = await this.dataSettingsService.getAllDataSettings(accountId);
    
    // Create default scopes, groups, etc. if needed
    // This is where you'd put workspace initialization logic
    
    return {
      success: true,
      data: {
        ...workspaceData,
        ...defaultSettings
      }
    };
  }
}

