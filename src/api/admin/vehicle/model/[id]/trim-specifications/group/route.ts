import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { MedusaError } from '@medusajs/framework/utils';
import { VEHICLE_MODULE } from '../../../../../../../modules/vehicle';
import VehicleModuleService from '../../../../../../../modules/vehicle/service';

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  if (!id) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Model ID is required');
  }

  const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);

  const groups = await vehicleModuleService.getModelSpecificationGroups(id);

  res.json({ groups });
};
