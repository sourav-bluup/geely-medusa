import { validateAndTransformQuery } from '@medusajs/framework';
import {
  applyDefaultFilters,
  authenticate,
  clearFiltersByKey,
  maybeApplyLinkFilter,
  MiddlewareRoute,
} from '@medusajs/framework/http';

import { listProductQueryConfig } from './query-config';

import { isPresent, ProductStatus } from '@medusajs/framework/utils';
import { filterByValidSalesChannels } from '@medusajs/medusa/api/utils/middlewares/products/filter-by-valid-sales-channels';
import { normalizeDataForContext } from '@medusajs/medusa/api/utils/middlewares/products/normalize-data-for-context';
import { setPricingContext } from '@medusajs/medusa/api/utils/middlewares/products/set-pricing-context';
import { setTaxContext } from '@medusajs/medusa/api/utils/middlewares/products/set-tax-context';
import { maybeApplyModelFilter } from './middlewares/maybe-apply-model-filter';
import { maybeApplyVariantsYearFilter } from './middlewares/maybe-apply-variants-year-filter';
import { SearchSelectParams } from './validators';

export const storeSearchMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/store/search',
    middlewares: [
      authenticate('customer', ['session', 'bearer'], {
        allowUnauthenticated: true,
      }),
      validateAndTransformQuery(SearchSelectParams, listProductQueryConfig),
      filterByValidSalesChannels(),
      maybeApplyLinkFilter({
        entryPoint: 'product_sales_channel',
        resourceId: 'product_id',
        filterableField: 'sales_channel_id',
      }),
      maybeApplyModelFilter(),
      maybeApplyVariantsYearFilter(),
      applyDefaultFilters({
        status: ProductStatus.PUBLISHED,
        categories: (filters: any) => {
          const categoryIds = filters.category_id;
          delete filters.category_id;

          if (!isPresent(categoryIds)) {
            return;
          }

          return { id: categoryIds, is_internal: false, is_active: true };
        },
      }),
      normalizeDataForContext(),
      setPricingContext(),
      setTaxContext(),
      clearFiltersByKey([
        'region_id',
        'country_code',
        'province',
        'cart_id',
        'model_handle',
        'from_year',
        'to_year',
      ]),
    ],
  },
];
