import { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from '@medusajs/framework';
import VehicleModuleService from '../../../../modules/vehicle/service';
import { createVehicleMakeWorkflow } from '../../../../workflows/vehicle/make/create-vehicle-make.workflow';
import { VehicleMakeInput } from './validators';

export async function POST(
  req: AuthenticatedMedusaRequest<VehicleMakeInput>,
  res: MedusaResponse,
): Promise<void> {
  const { result } = await createVehicleMakeWorkflow(req.scope).run({
    input: {
      make: req.validatedBody,
    },
  });
  res.status(201).json({
    make: result,
  });
}

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const vehicleModuleService: VehicleModuleService = req.scope.resolve('vehicleModuleService');
  const makes = await vehicleModuleService.listVehicleMakes();

  res.status(200).json({ makes });
}
