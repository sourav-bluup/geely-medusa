import { validateAndTransformBody } from '@medusajs/framework';
import { MiddlewareRoute } from '@medusajs/medusa';
import { SanitySyncParamsSchema } from './validators';

export const sanityRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/admin/sanity/revalidate',
    method: 'POST',
    // @ts-expect-error // TODO: fix type
    middlewares: [validateAndTransformBody(SanitySyncParamsSchema)],
  },
];
