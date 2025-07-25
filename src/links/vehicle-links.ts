/**
 * @file vehicle-links.ts
 * @description This file defines custom links between the Vehicle module and other Medusa modules.
 */

import { Modules } from '@medusajs/framework/utils';
import { MedusaModule } from '@medusajs/modules-sdk';
import { VEHICLE_MODULE } from '../modules/vehicle';

/**
 * Sets up custom links for the Vehicle module.
 * These links define relationships between the Vehicle module and other Medusa modules,
 * particularly the Product module.
 */
MedusaModule.setCustomLink(() => {
  return {
    isLink: true,
    isReadOnlyLink: true,
    extends: [
      /**
       * Links Vehicle module to ProductVariant entity.
       * This relationship allows associating vehicle media with product variants.
       */
      {
        serviceName: VEHICLE_MODULE,
        relationship: {
          serviceName: Modules.PRODUCT,
          entity: 'ProductVariant',
          primaryKey: 'id',
          foreignKey: 'variant_id',
          alias: 'media_variant',
          args: {
            methodSuffix: 'ProductVariants',
          },
        },
      },
      /**
       * Links Vehicle module to ProductCategory entity for body type.
       * This relationship allows categorizing vehicles by body type.
       */
      {
        serviceName: VEHICLE_MODULE,
        relationship: {
          serviceName: Modules.PRODUCT,
          entity: 'ProductCategory',
          primaryKey: 'id',
          foreignKey: 'body_type',
          alias: 'body_type_category',
          args: {
            methodSuffix: 'ProductCategories',
          },
        },
      },
      /**
       * Links Vehicle module to ProductCategory entity for model.
       * This relationship allows categorizing vehicles by model.
       */
      {
        serviceName: VEHICLE_MODULE,
        relationship: {
          serviceName: Modules.PRODUCT,
          entity: 'ProductCategory',
          primaryKey: 'id',
          foreignKey: 'product_category_id',
          alias: 'model_category',
          args: {
            methodSuffix: 'ProductCategories',
          },
        },
      },
      /**
       * Links Vehicle module to ProductCategory entity for fuel type.
       * This relationship allows categorizing vehicles by fuel type.
       */
      {
        serviceName: VEHICLE_MODULE,
        relationship: {
          serviceName: Modules.PRODUCT,
          entity: 'ProductCategory',
          primaryKey: 'id',
          foreignKey: 'fuel_type',
          alias: 'fuel_type_category',
          args: {
            methodSuffix: 'ProductCategories',
          },
        },
      },
      /**
       * Links Vehicle module to ProductCategory entity for engine.
       * This relationship allows categorizing vehicles by engine type.
       */
      {
        serviceName: VEHICLE_MODULE,
        relationship: {
          serviceName: Modules.PRODUCT,
          entity: 'ProductCategory',
          primaryKey: 'id',
          foreignKey: 'engine',
          alias: 'engine_category',
          args: {
            methodSuffix: 'ProductCategories',
          },
        },
      },
      /**
       * Links Vehicle module to ProductCategory entity for introduction year.
       * This relationship allows categorizing vehicles by their introduction year.
       */
      {
        serviceName: VEHICLE_MODULE,
        relationship: {
          serviceName: Modules.PRODUCT,
          entity: 'ProductCategory',
          primaryKey: 'id',
          foreignKey: 'introduction_year',
          alias: 'year_category',
          args: {
            methodSuffix: 'ProductCategories',
          },
        },
      },
      /**
       * Links Vehicle module to ProductCategory entity for drive type.
       * This relationship allows categorizing vehicles by drive type.
       */
      {
        serviceName: VEHICLE_MODULE,
        relationship: {
          serviceName: Modules.PRODUCT,
          entity: 'ProductCategory',
          primaryKey: 'id',
          foreignKey: 'drive_type',
          alias: 'drive_type_category',
          args: {
            methodSuffix: 'ProductCategories',
          },
        },
      },
      /**
       * Links Vehicle module to ProductCategory entity for transmission.
       * This relationship allows categorizing vehicles by transmission type.
       */
      {
        serviceName: VEHICLE_MODULE,
        relationship: {
          serviceName: Modules.PRODUCT,
          entity: 'ProductCategory',
          primaryKey: 'id',
          foreignKey: 'transmission',
          alias: 'transmission_category',
          args: {
            methodSuffix: 'ProductCategories',
          },
        },
      },
    ],
  };
});
