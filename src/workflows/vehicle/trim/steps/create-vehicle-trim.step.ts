import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';
import VehicleModuleService from '../../../../modules/vehicle/service';
import { toHandle } from '@medusajs/framework/utils';

const createVehicleTrimStepId = 'create-vehicle-trim-step';

type CreateVehicleTrimInput = {
  model_id: string;
  title: string;
};

const createVehicleTrimStep = createStep(
  createVehicleTrimStepId,
  async (input: CreateVehicleTrimInput, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);

    const model = await vehicleModuleService.retrieveVehicleModel(input.model_id);

    if (!model) {
      throw new Error('Model not found');
    }

    const trim = await vehicleModuleService.createVehicleTrims([
      {
        title: input.title,
        model_id: input.model_id,
        handle: [model.title, input.title].map(toHandle).join('-'),
      },
    ]);

    return new StepResponse(trim[0], trim[0].id);
  },
  async (trimId, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);
    await vehicleModuleService.deleteVehicleTrims([trimId]);
  },
);

export { createVehicleTrimStep, createVehicleTrimStepId };
