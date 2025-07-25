import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { VEHICLE_MODULE } from '../../../modules/vehicle';
import VehicleModuleService from '../../../modules/vehicle/service';

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);

  const models = await vehicleModuleService.listVehicleModels();

  res.status(200).json({
    models: models
      .filter((model) => Boolean(model.handle))
      .map((model) => ({
        id: model.id,
        title: model.title,
        handle: model.handle,
      })),
  });
}
