import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import createVehicleVariantMediaWorkflow from '../../../../../workflows/vehicle/variant/create-vehicle-variant-media-workflow';
import { VehicleVariantMediaInput } from '../../../../../modules/vehicle/types/vehicle-variant-media-type';

export const POST = async (
  req: AuthenticatedMedusaRequest<VehicleVariantMediaInput>,
  res: MedusaResponse,
) => {
  const data = req.validatedBody;

  const { result: createdMedias } = await createVehicleVariantMediaWorkflow(req.scope).run({
    input: data,
  });

  return res.status(201).json({
    medias: createdMedias,
  });
};
