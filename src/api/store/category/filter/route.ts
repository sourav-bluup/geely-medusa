import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';
import VehicleModuleService from '../../../../modules/vehicle/service';
import { GetCategoryFilterParamsType } from '../validators';

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { collection_handle, parent_category_id } =
    req.validatedQuery as GetCategoryFilterParamsType;

  const vehicleModule: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);

  const categories = await vehicleModule.filterCategoriesByCollection(
    collection_handle,
    parent_category_id,
  );

  res.json(categories);
};
