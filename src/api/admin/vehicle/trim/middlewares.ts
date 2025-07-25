import { validateAndTransformBody } from '@medusajs/framework';
import { MiddlewareRoute } from '@medusajs/medusa';
import { LinkTrimToVariantInput, TrimSchema } from './validators';

export const trimRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/admin/vehicle/trim/link-variant',
    method: 'POST',
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(LinkTrimToVariantInput)],
  },
  {
    matcher: '/admin/vehicle/trim/link-variant',
    method: 'DELETE',
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(LinkTrimToVariantInput)],
  },
  {
    matcher: '/admin/vehicle/trim/:id',
    method: 'PUT',
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(TrimSchema)],
  },
  {
    matcher: '/admin/vehicle/trim/:id',
    method: 'DELETE',
    middlewares: [],
  },
];
