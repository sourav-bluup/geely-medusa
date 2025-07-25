import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';
import VehicleModuleService from '../../../../modules/vehicle/service';
import { toHandle } from '@medusajs/framework/utils';

const updateVehicleTrimStepId = 'update-vehicle-trim-step';

type UpdateVehicleTrimInput = {
  id: string;
  title: string;
  sort_rank: number;
  is_default: boolean;
};

const updateVehicleTrimStep = createStep(
  updateVehicleTrimStepId,
  async (input: UpdateVehicleTrimInput, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);

    const retrievedTrim = await vehicleModuleService.retrieveVehicleTrim(input.id, {
      select: ['id', 'title', 'sort_rank', 'is_default', 'model.id', 'model.title'],
      relations: ['model'],
    });
    const model = await vehicleModuleService.retrieveVehicleModel(retrievedTrim.model.id);

    const trim = await vehicleModuleService.updateVehicleTrims({
      ...input,
      handle: [model.title, input.title].map(toHandle).join('-'),
    });

    return new StepResponse(trim, trim.id);
  },
  async (trimId, { container }) => {
    // Rollback logic if needed
  },
);

export { updateVehicleTrimStep, updateVehicleTrimStepId };
