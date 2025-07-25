import { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { ContainerRegistrationKeys, MedusaError } from '@medusajs/utils';
import { VEHICLE_MODULE } from '../../../../../modules/vehicle';
import { valueOrNull } from '../../../../../modules/vehicle/lib/utils';
import { VehicleModelInput } from '../../../../../modules/vehicle/schemas/model.schemas';
import VehicleModuleService from '../../../../../modules/vehicle/service';
import { getVehicleModelQuery } from '../../data/get-vehicle-model.query';
import { toHandle } from '@medusajs/framework/utils';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const id = req.params.id;
  if (!id) {
    return MedusaError.Types.INVALID_DATA;
  }
  try {
    const model = await getVehicleModelQuery({ query, id });
    return res.status(200).json(model);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function PUT(req: AuthenticatedMedusaRequest<VehicleModelInput>, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const vehicleModelService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);

  const id = req.params.id;
  if (!id) {
    return MedusaError.Types.INVALID_DATA;
  }

  const input = req.validatedBody;
  try {
    await vehicleModelService.updateVehicleModels({
      id,
      ...input,
      handle: toHandle(input.title),
      discontinued_year: valueOrNull(input.discontinued_year),
    });

    const model = await getVehicleModelQuery({ query, id });
    return res.status(200).json(model);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
