import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { transformMedias } from './helpers/transform-media';

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: rawMedias } = await query.graph({
    entity: 'vehicle_variant_media',
    fields: ['id', 'title', 'description', 'url', 'mime_type', 'media_type', 'metadata'],
    filters: {
      variant_id: id,
    },
  });

  return res.status(200).json({
    medias: transformMedias(rawMedias),
  });
};
