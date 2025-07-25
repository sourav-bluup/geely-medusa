import { MiddlewareRoute } from '@medusajs/medusa';
import { storeCategoryMiddlewares } from './category/middlewares';
import { storeModelMiddlewares } from './model/middlewares';

import { storeNgeniusPaymentCaptureMiddlewares } from './ngenius-payments/middlewares';
import { storeVariantMiddlewares } from './variant/middlewares';
import { storeSearchMiddlewares } from './search/middlewares';

export const storeMiddlewares: MiddlewareRoute[] = [
  ...storeModelMiddlewares,
  ...storeVariantMiddlewares,
  ...storeCategoryMiddlewares,
  ...storeNgeniusPaymentCaptureMiddlewares,
  ...storeSearchMiddlewares,
];
