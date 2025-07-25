import { MiddlewareRoute } from '@medusajs/medusa';

export const storeNgeniusPaymentCaptureMiddlewares: MiddlewareRoute[] = [
  {
    method: 'POST',
    matcher: '/store/ngenius-payments/:id/capture',
    middlewares: [],
  },
];
