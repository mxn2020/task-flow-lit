// src/services/data-settings-service.ts
import { BaseService } from './base-service';
import { Group, Label, Category, Type } from '../types';
import { GroupService } from './group-service';
import { LabelService } from './label-service';
import { CategoryService } from './category-service';
import { TypeService } from './type-service';

export class DataSettingsService extends BaseService {
  private groupService = new GroupService();
  private labelService = new LabelService();
  private categoryService = new CategoryService();
  private typeService = new TypeService();

  async getAllDataSettings(accountId: string) {
    const [groups, labels, categories, types] = await Promise.all([
      this.groupService.getGroups(accountId),
      this.labelService.getLabels(accountId),
      this.categoryService.getCategories(accountId),
      this.typeService.getTypes(accountId)
    ]);

    return {
      groups: groups.data || [],
      labels: labels.data || [],
      categories: categories.data || [],
      types: types.data || [],
      errors: {
        groups: groups.error,
        labels: labels.error,
        categories: categories.error,
        types: types.error
      }
    };
  }

  async createDataSetting(
    type: 'group' | 'label' | 'category' | 'type',
    data: Partial<Group | Label | Category | Type>
  ) {
    switch (type) {
      case 'group':
        return this.groupService.createGroup(data as Partial<Group>);
      case 'label':
        return this.labelService.createLabel(data as Partial<Label>);
      case 'category':
        return this.categoryService.createCategory(data as Partial<Category>);
      case 'type':
        return this.typeService.createType(data as Partial<Type>);
      default:
        return { data: null, error: 'Invalid data setting type' };
    }
  }
}

