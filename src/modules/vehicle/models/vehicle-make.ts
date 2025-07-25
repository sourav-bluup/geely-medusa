import { model } from '@medusajs/utils';
import VehicleModel from './vehicle-model';

const VehicleMake = model.define('vehicle_make', {
  id: model
    .id({
      prefix: 'vmk',
    })
    .primaryKey(),
  name: model.text(),
  country: model.text().nullable(),
  mileage: model.number().nullable(),
  year_founded: model.number().nullable(),
  models: model.hasMany(() => VehicleModel, {
    mappedBy: 'make',
  }),
});

export default VehicleMake;
