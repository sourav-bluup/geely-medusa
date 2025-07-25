import { model } from '@medusajs/utils';
import { MediaType } from '../types/vehicle-variant-media-type';

const VehicleVariantMedia = model.define('vehicle_variant_media', {
  id: model
    .id({
      prefix: 'vimg',
    })
    .primaryKey(),
  title: model.text(),
  description: model.text().nullable(),
  url: model.text(),
  file_id: model.text(),
  variant_id: model.text().index(),
  mime_type: model.text().index(),
  media_type: model.enum(MediaType).index(),
  metadata: model.json().nullable(),
});

export default VehicleVariantMedia;
