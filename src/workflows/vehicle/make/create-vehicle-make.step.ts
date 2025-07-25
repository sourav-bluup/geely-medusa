import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { VehicleMakeInput } from 'src/api/admin/vehicle/make/validators';
import { VEHICLE_MODULE } from '../../../modules/vehicle';
import VehicleModuleService from '../../../modules/vehicle/service';

const createVehicleMakeStepId = 'create-vehicle-make-step';
const createVehicleMakeStep = createStep(
  createVehicleMakeStepId,
  async (input: VehicleMakeInput, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);

    const make = await vehicleModuleService.createVehicleMakes(input);

    return new StepResponse(make, make.id);
  },
  async (make, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);

    vehicleModuleService.deleteVehicleMakes(make.id);
  },
);

export { createVehicleMakeStep, createVehicleMakeStepId };
