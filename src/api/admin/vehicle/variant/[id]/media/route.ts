import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: medias } = await query.graph({
    entity: 'vehicle_variant_media',
    fields: ['*'],
    filters: {
      variant_id: id,
    },
  });

  return res.status(200).json({
    medias,
  });
};
