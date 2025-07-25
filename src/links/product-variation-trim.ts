import ProductModule from '@medusajs/product';
import { defineLink } from '@medusajs/utils';
import VehicleModule from '../modules/vehicle';

export default defineLink(
  VehicleModule.linkable.vehicleTrim,
  ProductModule.linkable.productVariant,
  {
    database: {
      extraColumns: {
        metadata: {
          type: 'json',
          nullable: true,
        },
        mileage: {
          type: 'integer',
          nullable: true,
        },
        year: {
          type: 'integer',
          nullable: true,
        },
      },
    },
  },
);
