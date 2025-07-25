import { model } from '@medusajs/utils';
import { UnitEnum } from '../enums/unit.enum';
import VehicleModel from './vehicle-model';
import VehicleTrim from './vehicle-trim';

const VehicleTrimSpecification = model.define('vehicle_trim_specification', {
  id: model
    .id({
      prefix: 'vtspec',
    })
    .primaryKey(),
  group_value: model.text().nullable(),
  value: model.text().nullable(),
  group: model.text().index().nullable(),
  type: model.enum(['text', 'boolean', 'number']).default('text'),
  model: model.belongsTo(() => VehicleModel, {
    mappedBy: 'specifications',
  }),
  trim: model.belongsTo(() => VehicleTrim, {
    mappedBy: 'specifications',
  }),
  unit: model.enum(UnitEnum).nullable(),
  is_active: model.boolean().default(true),
  order: model.number().default(0),
  metadata: model.json().nullable(),
});

export default VehicleTrimSpecification;
