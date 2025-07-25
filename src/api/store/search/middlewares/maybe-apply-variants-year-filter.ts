import { MedusaNextFunction, MedusaRequest } from '@medusajs/framework';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';
import VehicleModuleService from '../../../../modules/vehicle/service';

export function maybeApplyVariantsYearFilter() {
  return async function linkFilter(req: MedusaRequest, _, next: MedusaNextFunction) {
    const filterableFields = req.filterableFields;

    const productIds = Array.isArray(filterableFields.id)
      ? filterableFields.id
      : [filterableFields.id];

    const from_year = Number(filterableFields.from_year);
    const to_year = Number(filterableFields.to_year);

    if (!from_year && !to_year) {
      return next();
    }

    if (productIds.length === 0) {
      return next();
    }

    const vehicleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);

    req.filterableFields.id = await vehicleService.getProductIdsFromYear({
      fromYear: from_year,
      toYear: to_year,
      productIds,
    });
    return next();
  };
}
