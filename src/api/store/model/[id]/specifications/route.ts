import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { MedusaError } from '@medusajs/framework/utils';
import { VEHICLE_MODULE } from '../../../../../modules/vehicle';
import VehicleModuleService from '../../../../../modules/vehicle/service';

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);
  const modelId = req.params.id;
  const group = req.query.group as string | undefined;
  const trim_id = req.query.trim_id as string | undefined;
  if (!modelId) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Model ID is required');
  }

  try {
    const trimSpecifications = await vehicleModuleService.getModelSpecificationsByModelId({
      modelId,
      group,
      trim_id,
    });
    res.status(200).json({
      specifications: trimSpecifications,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
