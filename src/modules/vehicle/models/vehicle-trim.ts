import { model } from '@medusajs/utils';
import VehicleModel from './vehicle-model';
import VehicleTrimSpecification from './vehicle-trim-specification';

const VehicleTrim = model.define('vehicle_trim', {
  id: model
    .id({
      prefix: 'vtrm',
    })
    .primaryKey(),
  title: model.text(),
  handle: model.text().index().nullable(),
  is_default: model.boolean().default(false).index(),
  sort_rank: model.number().index().default(0),
  model: model.belongsTo(() => VehicleModel, {
    mappedBy: 'trims',
  }),
  specifications: model.hasMany(() => VehicleTrimSpecification, {
    mappedBy: 'trim',
  }),
  metadata: model.json().nullable(),
});

export default VehicleTrim;
