import { Modules, toHandle } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { IProductModuleService } from '@medusajs/types/dist/product';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';
import { valueOrNull } from '../../../../modules/vehicle/lib/utils';
import { VehicleModelInput } from '../../../../modules/vehicle/schemas/model.schemas';
import VehicleModuleService from '../../../../modules/vehicle/service';
import { CATEGORIES } from '../../constants';

const createVehicleModelStepId = 'create-vehicle-model-step';

const createOrSelectCategory = async (
  productModuleService: IProductModuleService,
  categoryData: { name: string; handle?: string; parent_category_id?: string },
) => {
  let category = await productModuleService.listProductCategories({
    handle: categoryData.handle,
  });

  if (!category || category.length === 0) {
    category = await productModuleService.createProductCategories([
      {
        is_active: true,
        name: categoryData.name,
        ...(categoryData.handle && { handle: categoryData.handle }),
        ...(categoryData.parent_category_id && {
          parent_category_id: categoryData.parent_category_id,
        }),
      },
    ]);
  }

  return category[0];
};

const createVehicleModelStep = createStep(
  createVehicleModelStepId,
  async (input: VehicleModelInput, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);
    const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);

    const parentCategory = await createOrSelectCategory(productModuleService, CATEGORIES.MODEL);
    const parentId = parentCategory.id;

    const modelCategory = await createOrSelectCategory(productModuleService, {
      name: input.title,
      parent_category_id: parentId,
      handle: toHandle(input.title),
    });

    const model = await vehicleModuleService.createVehicleModels({
      ...input,
      discontinued_year: valueOrNull(input.discontinued_year),
      product_category_id: modelCategory.id,
    });

    return new StepResponse(model, {
      modelId: model.id,
      modelCategoryId: modelCategory.id,
    });
  },
  async ({ modelId, modelCategoryId }, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);
    const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);
    await vehicleModuleService.deleteVehicleModels([modelId]);
    await productModuleService.deleteProductCategories([modelCategoryId]);
  },
);

export { createVehicleModelStep, createVehicleModelStepId };
