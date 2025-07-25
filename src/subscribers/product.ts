import type { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';
import { IProductModuleService } from '@medusajs/types';
import { ProductTypes } from '@medusajs/types/dist/bundles';
import { Modules } from '@medusajs/utils';

type Args = {
  id: string;
  product: ProductTypes.ProductDTO;
};

export default async function handleProductEvent({ event, container }: SubscriberArgs<Args>) {
  const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);


  switch (event.name) {
    case 'product.created':
    case 'product.updated':
      const product = await productModuleService.retrieveProduct(event.data.id, {
        relations: [
          'variants',
          'variants.options',
          'options',
          'options.values',
          'tags',
          'type',
          'collection',
          'images',
        ],
      });

      if (product) {
        console.log('Product with id', product.id, 'was created in Sanity');
      } else {
        console.error('No product data found in event');
      }
      break;
    case 'product.deleted':
      console.log('Product with id', event.data.id, 'was deleted in Sanity');
      break;
  }
}

export const config: SubscriberConfig = {
  event: ['product.created', 'product.updated', 'product.deleted'],
};
