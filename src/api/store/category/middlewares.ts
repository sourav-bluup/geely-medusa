import { MiddlewareRoute, validateAndTransformQuery } from '@medusajs/framework';
import { GetCategoryFilterParams } from './validators';

export const storeCategoryMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/store/category/filter',
    method: 'GET',
    // @ts-ignore
    middlewares: [validateAndTransformQuery(GetCategoryFilterParams, {})],
  },
];
