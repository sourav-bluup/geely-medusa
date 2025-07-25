import { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { MedusaError } from '@medusajs/utils';
import { VEHICLE_MODULE } from '../../../../../modules/vehicle';
import VehicleModuleService from '../../../../../modules/vehicle/service';
import { updateVehicleTrimWorkflow } from '../../../../../workflows/vehicle/trim/update-vehicle-trim.workflow';
import { TrimInput } from '../validators';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleModuleService: VehicleModuleService = req.scope.resolve('vehicleModuleService');
  const id = req.params.id;
  if (!id) {
    return MedusaError.Types.INVALID_DATA;
  }
  try {
    const data = await vehicleModuleService.retrieveVehicleTrim(id, {
      select: ['*', 'model.id', 'model.title'],
      relations: ['model'],
      order: { sort_rank: 'ASC' },
    });
    return res.status(200).json({
      trim: data,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function PUT(req: AuthenticatedMedusaRequest<TrimInput>, res: MedusaResponse) {
  const { id } = req.params;
  const { title, sort_rank, is_default } = req.validatedBody;

  if (!id || !title) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Trim ID and title are required');
  }

  try {
    const { result } = await updateVehicleTrimWorkflow(req.scope).run({
      input: {
        id,
        title,
        sort_rank,
        is_default,
      },
    });

    res.status(200).json({ trim: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { id } = req.params;

  if (!id) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Trim ID is required');
  }

  try {
    const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);
    await vehicleModuleService.deleteVehicleTrims([id]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
