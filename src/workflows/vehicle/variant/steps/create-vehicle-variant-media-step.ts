import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';
import VehicleModuleService from '../../../../modules/vehicle/service';
import { VehicleVariantMediaInput } from '../../../../modules/vehicle/types/vehicle-variant-media-type';

type StepInput = VehicleVariantMediaInput['media'];

const createVehicleProductVariantMediaId = 'create-vehicle-product-variant-media';

const createVehicleProductVariantMediaStep = createStep(
  createVehicleProductVariantMediaId,
  async (input: StepInput, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);

    const medias = await vehicleModuleService.createVehicleVariantMedias(input);

    return new StepResponse(
      medias,
      medias.map((media) => media.id),
    );
  },
  async (ids, { container }) => {
    const vehicleModuleService: VehicleModuleService = container.resolve(VEHICLE_MODULE);
    await vehicleModuleService.deleteVehicleVariantMedias(ids);
  },
);

export default createVehicleProductVariantMediaStep;
