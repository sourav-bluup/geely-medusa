import { model } from '@medusajs/utils';
import VehicleMake from './vehicle-make';
import VehicleTrim from './vehicle-trim';
import VehicleTrimSpecification from './vehicle-trim-specification';

const VehicleModel = model.define('vehicle_model', {
  id: model
    .id({
      prefix: 'vmdl',
    })
    .primaryKey(),
  title: model.text(),
  handle: model.text().index().nullable(),
  introduction_year: model.text().nullable(),
  discontinued_year: model.number().nullable(),
  trims: model.hasMany(() => VehicleTrim, {
    mappedBy: 'model',
  }),
  make: model.belongsTo(() => VehicleMake, {
    mappedBy: 'models',
  }),
  engine: model.text().index().index().nullable(),
  transmission: model.text().index().nullable(),
  body_type: model.text().index().nullable(),
  fuel_type: model.text().index().nullable(),
  drive_type: model.text().index().nullable(),
  door_count: model.number().index().nullable(),
  seat_count: model.number().index().nullable(),
  product_category_id: model.text().index().nullable(),
  metadata: model.json().nullable(),
  specifications: model.hasMany(() => VehicleTrimSpecification, {
    mappedBy: 'model',
  }),
});

export default VehicleModel;
