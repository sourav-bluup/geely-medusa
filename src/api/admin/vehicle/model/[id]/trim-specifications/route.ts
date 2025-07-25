import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { MedusaError } from '@medusajs/utils';
import { SpecificationInput } from '../../../../../../admin/routes/vehicle/model/[id]/specs/components/table/types';
import { VEHICLE_MODULE } from '../../../../../../modules/vehicle';
import VehicleModuleService from '../../../../../../modules/vehicle/service';
import { saveTrimSpecificationsWorkflow } from '../../../../../../workflows/vehicle/model/save-trim-specifications.workflow';

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);
  const modelId = req.params.id;
  const group = req.query.group as string | undefined;
  if (!modelId) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Model ID is required');
  }

  try {
    const trimSpecifications = await vehicleModuleService.getModelSpecificationsByModelId({
      modelId,
      group,
    });
    res.status(200).json({
      specifications: trimSpecifications,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function POST(
  req: AuthenticatedMedusaRequest<SpecificationInput>,
  res: MedusaResponse,
) {
  const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);
  const model_id = req.params.id;
  const { data } = req.validatedBody;

  try {
    const { result } = await saveTrimSpecificationsWorkflow(req.scope).run({
      input: {
        model_id,
        data,
      },
    });
    res.status(200).json({
      specifications: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
