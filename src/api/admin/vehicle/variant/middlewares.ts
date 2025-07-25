import { validateAndTransformBody } from '@medusajs/framework/http';
import { MiddlewareRoute } from '@medusajs/medusa';
import {
  EditVehicleVariantMediaSchema,
  VehicleVariantMediaSchema,
} from '../../../../modules/vehicle/types/vehicle-variant-media-type';

export const vehicleVariantRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/admin/vehicle/variant/media/:id',
    method: ['PUT'],
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(EditVehicleVariantMediaSchema)],
  },
  {
    matcher: '/admin/vehicle/variant/media',
    method: ['POST'],
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(VehicleVariantMediaSchema)],
  },
];
