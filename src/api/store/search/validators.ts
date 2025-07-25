// @ts-nocheck
import { createFindParams } from '@medusajs/medusa/api/utils/validators';
import { z } from 'zod';
import { GetProductsParams } from '@medusajs/medusa/api/utils/common-validators/products/index';

export type SearchSelectParamsType = z.infer<typeof SearchSelectParams>;

export const SearchSelectParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(
    z.object({
      model_handle: z.string().optional(),
      from_year: z.string().optional(),
      to_year: z.string().optional(),
      seats: z.array(z.string()).optional(),
      engine: z.array(z.string()).optional(),
      fuel_type: z.array(z.string()).optional(),
      body_type: z.array(z.string()).optional(),
      region_id: z.string().optional(),
      collection_id: z.string().optional(),
    }),
  )
  .merge(GetProductsParams)
  .strict();
