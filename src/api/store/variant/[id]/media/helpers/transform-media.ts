import { RemoteQueryEntryPointsTypes } from '.medusa/types';

export const transformMedias = (medias: RemoteQueryEntryPointsTypes.VehicleVariantMedia[]) => {
  return medias?.reduce((acc, media) => {
    if (!acc[media.media_type]) {
      acc[media.media_type] = [];
    }
    acc[media.media_type].push(media);
    return acc;
  }, {});
};
