import { IProductModuleService } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';
import { sanityProductSyncWorkflow } from '../workflows/sanity/sanity-sync-products';
export default async function upsertSanityProduct({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);

  const product = await productModuleService.retrieveProduct(data.id, {
    select: ['type.value'],
  });

  if (product.type.value !== 'Vehicles') {
    return;
  }

  await sanityProductSyncWorkflow(container).run({
    input: {
      product_ids: [data.id],
    },
  });
}

export const config: SubscriberConfig = {
  event: ['product.created', 'product.updated'],
};
