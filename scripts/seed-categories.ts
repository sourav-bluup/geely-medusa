import { ExecArgs, IProductModuleService, ProductCategoryDTO } from '@medusajs/framework/types';
import { ModuleRegistrationName, toHandle } from '@medusajs/framework/utils';
import { CATEGORIES } from '../src/workflows/vehicle/constants';

const createOrGetCategory = async (
  productModuleService: IProductModuleService,
  input: { name: string; handle: string },
): Promise<ProductCategoryDTO | null> => {
  const category = await productModuleService.listProductCategories({
    handle: input.handle,
  });

  if (category.length === 0) {
    return (
      await productModuleService.createProductCategories([
        { name: input.name, handle: input.handle, is_active: true },
      ])
    )[0];
  }

  return category[0];
};

const addSufix = (name: string, type: string) => {
  if (type === 'door-count') return toHandle(`${name} Door`);
  if (type === 'seat-count') return toHandle(`${name} Seat`);
  return toHandle(name);
};

interface CategoryData {
  data: string[];
  parentId?: string;
}

const CATEGORIES_TO_CREATE: Record<string, CategoryData> = {
  [CATEGORIES.BODY_TYPE.handle]: {
    data: ['SUV', 'Sedan', 'Saloon'],
    parentId: '',
  },
  [CATEGORIES.DOOR_COUNT.handle]: {
    data: ['2', '4', '5', '6', '7', '8'],
    parentId: '',
  },
  [CATEGORIES.DRIVE_TYPE.handle]: {
    data: ['4WD', '2WD', 'AWD', 'RWD'],
    parentId: '',
  },
  [CATEGORIES.ENGINE_TYPE.handle]: {
    data: ['1.5', '1.5 Turbo', '2.0', '2.0 Turbo', '3.0', '3.0 Turbo'],
    parentId: '',
  },
  [CATEGORIES.FUEL_TYPE.handle]: {
    data: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    parentId: '',
  },
  [CATEGORIES.TRANSMISSION.handle]: {
    data: ['Automatic', 'Manual', '6AT', '7AT', '8AT', '9AT', 'CVT', 'DSG', 'AMT', 'SEMI_AUTO'],
    parentId: '',
  },
  [CATEGORIES.YEAR.handle]: {
    data: ['2025', '2024', '2023', '2022', '2021', '2020'],
    parentId: '',
  },
  [CATEGORIES.SEAT_COUNT.handle]: {
    data: ['2', '4', '5', '6', '7', '8', '9', '10'],
    parentId: '',
  },
};

export default async function seedCategories({ container }: ExecArgs) {
  const productModuleService: IProductModuleService = container.resolve(
    ModuleRegistrationName.PRODUCT,
  );

  for (const category of Object.values(CATEGORIES)) {
    const createdCategory = await createOrGetCategory(productModuleService, category);

    if (category.handle === 'model') {
      continue;
    }

    if (createdCategory) {
      const categoryData = CATEGORIES_TO_CREATE[category.handle];
      categoryData.parentId = createdCategory.id;
    }
  }

  for (const [key, value] of Object.entries(CATEGORIES_TO_CREATE)) {
    const categoryData = value;

    if (categoryData.parentId === '') {
      continue;
    }

    const category = await productModuleService.createProductCategories(
      categoryData.data.map((name) => ({
        name,
        handle: addSufix(name, key),
        parent_category_id: categoryData.parentId,
        is_active: true,
      })),
    );
    console.log(`Created category: ${category.map((c) => c.name).join(', ')}`);
  }
}
