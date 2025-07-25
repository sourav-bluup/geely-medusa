import { MedusaResponse } from '@medusajs/framework/http';
import { RequestWithContext } from '@medusajs/medusa/api/store/products/helpers';
import { wrapVariantsWithInventoryQuantityForSalesChannel } from '@medusajs/medusa/api/utils/middlewares/products/variant-inventory-quantity';
import { HttpTypes } from '@medusajs/types';
import { ContainerRegistrationKeys, QueryContext } from '@medusajs/utils';
import { withVariantMedia } from './helpers/with-variant-media';
import { defaultStoreProductFields } from './query-config';
import { productTransformer } from './transformers/product-transformer';

type Filters = {
  model_id?: string;
  year?: {
    from?: string;
    to?: string;
  };
  seats?: string[];
  engine?: string[];
  fuel_type?: string[];
  body_type?: string[];
};

export const GET = async (
  req: RequestWithContext<HttpTypes.StoreProductParams>,
  res: MedusaResponse,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { pagination } = req.queryConfig;

  const remove = ['model_id', 'year', 'seats', 'engine', 'fuel_type', 'body_type'];
  const filters: Filters = {};

  for (const key of remove) {
    if (req.query[key]) {
      filters[key] = req.query[key];
    }
    delete req.filterableFields[key];
  }

  const { data: products, metadata } = await query.graph({
    entity: 'product',
    fields: defaultStoreProductFields,
    filters: {
      ...req.filterableFields,
    },
    pagination: {
      ...pagination,
      skip: pagination.skip!,
    },
    context: {
      variants: {
        calculated_price: QueryContext({
          region_id: req.pricingContext.region_id!,
          currency_code: req.pricingContext.currency_code!,
        }),
      },
    },
  });

  const variants = products.map((product) => product.variants).flat(1);

  await wrapVariantsWithInventoryQuantityForSalesChannel(req, variants);
  await withVariantMedia(req, variants);
  return res.json({
    products: products.map(productTransformer),
    ...metadata,
  });
};
