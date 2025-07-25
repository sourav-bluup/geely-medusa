import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { MedusaError } from '@medusajs/utils';
import VehicleModuleService from '../../../../../modules/vehicle/service';
import { VehicleMakeInput } from '../validators';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleModuleService: VehicleModuleService = req.scope.resolve('vehicleModuleService');
  const id = req.params.id;
  if (!id) {
    return MedusaError.Types.INVALID_DATA;
  }
  try {
    const make = await vehicleModuleService.retrieveVehicleMake(id);
    return res.status(200).json({ make });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function PUT(req: MedusaRequest<VehicleMakeInput>, res: MedusaResponse) {
  const id = req.params.id;
  const data = req.validatedBody;

  if (!id || !data) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Vehicle make id and data are required');
  }

  const vehicleModuleService: VehicleModuleService = req.scope.resolve('vehicleModuleService');

  try {
    const make = await vehicleModuleService.updateVehicleMakes({
      id,
      ...data,
    });
    return res.status(200).json({ make });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const id = req.params.id;

  if (!id) {
    return MedusaError.Types.INVALID_DATA;
  }

  const vehicleModuleService: VehicleModuleService = req.scope.resolve('vehicleModuleService');

  try {
    await vehicleModuleService.deleteVehicleMakes([id]);
    return res.status(200).json({ message: 'Vehicle make deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
