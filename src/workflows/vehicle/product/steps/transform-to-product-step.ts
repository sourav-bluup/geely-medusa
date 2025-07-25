import { IProductModuleService, ProductTypes } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { VehicleProductSchemaType } from '../../../../api/admin/vehicle/product/validators';
import toProductTransformer from '../transformers/to-product-transformer';

export const transformToProductStepId = 'transform-to-product';
export const VEHICLE_PRODUCT_TYPE = 'Vehicles';

export const transformToProductStep = createStep(
  transformToProductStepId,
  async (input: VehicleProductSchemaType, { container }) => {
    const productService: IProductModuleService = container.resolve(Modules.PRODUCT);
    const transformedProduct = toProductTransformer(input);

    let productTypes = await productService.listProductTypes({
      value: VEHICLE_PRODUCT_TYPE,
    });

    if (!productTypes.length) {
      productTypes = await productService.createProductTypes([
        {
          value: VEHICLE_PRODUCT_TYPE,
        },
      ]);
    }

    const listing_type = input.listing_type;
    let collections = await productService.listProductCollections({
      handle: listing_type,
    });

    if (!collections.length) {
      collections = await productService.createProductCollections([
        {
          title: listing_type.charAt(0).toUpperCase() + listing_type.slice(1),
          handle: listing_type,
        },
      ]);
    }
    const typeId = productTypes[0].id;
    const collectionId = collections[0].id;

    const productWithTypeAndCollection: ProductTypes.CreateProductDTO = {
      ...transformedProduct,
      type_id: typeId,
      collection_id: collectionId,
    };

    return new StepResponse({
      product: productWithTypeAndCollection,
    });
  },
);
