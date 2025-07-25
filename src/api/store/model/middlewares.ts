import { MiddlewareRoute } from '@medusajs/medusa';

export const storeModelMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/store/model/:id/specifications',
  },
  {
    method: ['GET'],
    matcher: '/store/model',
  },
];
