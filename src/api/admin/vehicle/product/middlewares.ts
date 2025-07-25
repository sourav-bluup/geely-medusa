import { validateAndTransformBody, validateAndTransformQuery } from '@medusajs/framework/http';
import { authenticate, MiddlewareRoute } from '@medusajs/medusa';
import { LinkModelToProductInput } from '../model/validators';
import { retrieveProductVehicleModelQueryConfig } from './query-config';
import { GetLinkModelToProductParams, VehicleProductSchema } from './validators';

export const vehicleProductRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/admin/vehicle/product/:id',
    method: ['GET'],
    middlewares: [
      authenticate('user', ['session', 'bearer', 'api-key']),
      validateAndTransformQuery(
        GetLinkModelToProductParams,
        retrieveProductVehicleModelQueryConfig,
      ),
    ],
  },
  {
    matcher: '/admin/vehicle/product',
    method: ['POST'],
    middlewares: [
      authenticate('user', ['session', 'bearer', 'api-key']),
      // @ts-expect-error // TODO: fix type
      validateAndTransformBody(VehicleProductSchema),
    ],
  },
  {
    matcher: '/admin/vehicle/product/:id',
    method: ['POST'],
    middlewares: [
      authenticate('user', ['session', 'bearer', 'api-key']),
      validateAndTransformQuery(
        GetLinkModelToProductParams,
        retrieveProductVehicleModelQueryConfig,
      ),
      // @ts-expect-error // TODO: fix type
      validateAndTransformBody(LinkModelToProductInput),
    ],
  },
];
