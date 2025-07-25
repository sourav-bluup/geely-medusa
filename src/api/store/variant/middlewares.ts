import { MiddlewareRoute } from '@medusajs/medusa';

export const storeVariantMiddlewares: MiddlewareRoute[] = [
  {
    method: 'GET',
    matcher: '/store/variant/:id/media',
  },
];
