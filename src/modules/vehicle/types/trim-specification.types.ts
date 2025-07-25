import { SpecificationCategoryEnum } from '../enums/specification-category.enum';
import { UnitEnum } from '../enums/unit.enum';

export type ModelSpecificationDto = {
  id: string;
  trim_title: string;
  trim_id: string;
  group: SpecificationCategoryEnum;
  group_value: string;
  unit: UnitEnum | null;
  value: string;
  type: string;
  is_active: boolean;
  order: number;
};

export type ModelSpecificationsResponse = {
  specifications: ModelSpecificationDto[];
};

export type ModelSpecificationGroupDto = {
  title: SpecificationCategoryEnum;
  count: number;
  trims: string;
};

export type ModelSpecificationGroupResponse = {
  groups: ModelSpecificationGroupDto[];
};
