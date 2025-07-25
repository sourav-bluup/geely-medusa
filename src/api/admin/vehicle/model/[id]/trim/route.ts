import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { MedusaError } from '@medusajs/utils';
import { VEHICLE_MODULE } from '../../../../../../modules/vehicle';
import VehicleModuleService from '../../../../../../modules/vehicle/service';
import { createVehicleTrimWorkflow } from '../../../../../../workflows/vehicle/trim/create-vehicle-trim.workflow';
import { TrimInput } from '../../../trim/validators';

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);
  const id = req.params.id;
  if (!id) {
    return MedusaError.Types.INVALID_DATA;
  }

  const data = await vehicleModuleService.listVehicleTrims(
    {
      model_id: id,
    },
    {
      select: [
        'id',
        'title',
        'handle',
        'sort_rank',
        'is_default',
        'model.id',
        'model.title',
        'metadata',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
      relations: ['model'],
      order: {
        sort_rank: 'ASC',
      },
    },
  );
  try {
    return res.status(200).json({ trims: data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function POST(req: AuthenticatedMedusaRequest<TrimInput>, res: MedusaResponse) {
  const { id: modelId } = req.params;
  const { title } = req.body;

  if (!modelId || !title) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Model ID and title are required');
  }

  try {
    const { result } = await createVehicleTrimWorkflow(req.scope).run({
      input: {
        model_id: modelId,
        title,
      },
    });

    res.status(201).json({ trim: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
