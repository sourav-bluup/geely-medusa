import { MedusaRequest } from '@medusajs/framework';
import { ContainerRegistrationKeys } from '@medusajs/utils';
import { transformMedias } from '../../variant/[id]/media/helpers/transform-media';

export const withVariantMedia = async (
  req: MedusaRequest,
  variants: {
    id: string;
    medias?: [];
  }[],
) => {
  variants ??= [];

  const variantIds = variants.map((variant) => variant.id).flat(1);

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: variantMedia } = await query.graph({
    entity: 'vehicle_variant_media',
    fields: ['id', 'title', 'description', 'url', 'mime_type', 'media_type', 'variant_id'],
    filters: {
      variant_id: variantIds,
    },
  });

  const mediaMap = variantMedia?.reduce((acc, media) => {
    if (!acc[media.variant_id]) {
      acc[media.variant_id] = [];
    }

    acc[media.variant_id].push(media);

    return acc;
  }, {});

  for (let variant of variants) {
    // @ts-expect-error - valid media
    variant.media = transformMedias(mediaMap[variant.id]);
  }
};
