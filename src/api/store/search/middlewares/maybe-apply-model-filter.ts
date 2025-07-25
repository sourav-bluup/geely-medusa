import { MedusaNextFunction, MedusaRequest } from '@medusajs/framework';
import { ContainerRegistrationKeys } from '@medusajs/utils';

export function maybeApplyModelFilter() {
  return async function filter(req: MedusaRequest, _, next: MedusaNextFunction) {
    const filterableFields = req.filterableFields;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const productIds = Array.isArray(filterableFields.id)
      ? filterableFields.id
      : [filterableFields.id];

    const handle = filterableFields.model_handle;

    if (!handle) {
      return next();
    }

    if (productIds.length === 0) {
      return next();
    }

    const { data: models } = await query.graph({
      entity: 'vehicle_model',
      fields: ['products.id'],
      filters: {
        handle,
      },
    });

    req.filterableFields.id = models
      .map((id) =>
        id.products.filter((product) => productIds.includes(product.id)).map((p) => p.id),
      )
      .flat(1);

    return next();
  };
}
