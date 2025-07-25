import { MiddlewareRoute, validateAndTransformBody } from '@medusajs/framework/http';
import { VehicleMakeSchema } from './validators';
export const adminMakeRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/admin/vehicle/make/:id',
    middlewares: [],
  },
  {
    method: ['PUT'],
    matcher: '/admin/vehicle/make/:id',
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(VehicleMakeSchema)],
  },
  {
    method: ['DELETE'],
    matcher: '/admin/vehicle/make/:id',
  },
  {
    method: ['POST'],
    matcher: '/admin/vehicle/make',
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(VehicleMakeSchema)],
  },
];
