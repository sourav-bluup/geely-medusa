import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { deleteFilesWorkflow } from '@medusajs/medusa/core-flows';
import { VEHICLE_MODULE } from '../../../../../../modules/vehicle';
import VehicleModuleService from '../../../../../../modules/vehicle/service';
import { VehicleVariantMediaInput } from '../../../../../../modules/vehicle/types/vehicle-variant-media-type';

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);

  const media = await vehicleModuleService.retrieveVehicleVariantMedia(id);

  if (!media) {
    return res.status(404).json({
      message: 'Media not found',
    });
  }

  await vehicleModuleService.deleteVehicleVariantMedias(id);

  await deleteFilesWorkflow(req.scope).run({
    input: {
      ids: [media.file_id],
    },
  });

  res.status(200).json({
    id,
    object: 'variant_media',
    deleted: true,
  });
};

export const PUT = async (
  req: AuthenticatedMedusaRequest<VehicleVariantMediaInput>,
  res: MedusaResponse,
) => {
  const { id } = req.params;
  const data = req.validatedBody;

  const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);

  const media = await vehicleModuleService.updateVehicleVariantMedias({
    id,
    ...data,
  });

  return res.status(200).json({
    media,
  });
};

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Media id is required',
    });
  }

  const vehicleModuleService: VehicleModuleService = req.scope.resolve(VEHICLE_MODULE);

  const media = await vehicleModuleService.retrieveVehicleVariantMedia(id);

  return res.status(200).json({
    media,
  });
};
