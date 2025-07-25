import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { MedusaError } from '@medusajs/utils';
import { TrimSpecificationEnablerInput } from '../../../../../../modules/vehicle/schemas/trim-specification-value.schemas';
import VehicleModuleService from '../../../../../../modules/vehicle/service';

export async function POST(
  req: AuthenticatedMedusaRequest<TrimSpecificationEnablerInput>,
  res: MedusaResponse,
) {
  const id = req.params.id;
  if (!id) {
    return MedusaError.Types.INVALID_DATA;
  }

  const vehicleModuleService: VehicleModuleService = req.scope.resolve('vehicleModuleService');

  const { status } = req.body;

  res.status(200).json({});
}
