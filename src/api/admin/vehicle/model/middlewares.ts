import { validateAndTransformBody } from '@medusajs/framework';
import { MiddlewareRoute } from '@medusajs/medusa';
import { vehicleModelSchema } from '../../../../modules/vehicle/schemas/model.schemas';
import { TrimSchema } from '../trim/validators';
import { SpecificationSchema } from './validators';

export const modelRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/admin/vehicle/model',
    method: 'POST',
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(vehicleModelSchema)],
  },
  {
    matcher: '/admin/vehicle/model/:id',
    method: 'PUT',
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(vehicleModelSchema)],
  },
  {
    matcher: '/admin/vehicle/model/:id',
    method: 'DELETE',
    middlewares: [],
  },
  {
    matcher: '/admin/vehicle/model/:id/trim-specifications',
    method: ['GET'],
    middlewares: [], // Add any necessary middlewares here
  },
  {
    matcher: '/admin/vehicle/model/:id/trim-specifications',
    method: ['POST'],
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(SpecificationSchema)],
  },
  {
    matcher: '/admin/vehicle/model/:id/trim',
    method: 'POST',
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(TrimSchema)],
  },
];
