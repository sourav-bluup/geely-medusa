import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';
import VehicleModuleService from '../../../../modules/vehicle/service';

const createVehicleTrimsStepId = 'create-vehicle-trims-step';

type CreateVehicleTrimsInput = {
  trims: string[];
  model_id: string;
};

const createVehicleTrimsStep = createStep(
  createVehicleTrimsStepId,
  async (input: CreateVehicleTrimsInput, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);

    const data = input.trims.map((trim, index) => ({
      title: trim,
      is_default: index === 0,
      model_id: input.model_id,
    }));

    const created = await vehicleModuleService.createVehicleTrims(data);

    return new StepResponse(
      created,
      created.map((trim) => trim.id),
    );
  },
  async (trims, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);
    vehicleModuleService.deleteVehicleTrims(trims);
  },
);

export { createVehicleTrimsStep, createVehicleTrimsStepId };
