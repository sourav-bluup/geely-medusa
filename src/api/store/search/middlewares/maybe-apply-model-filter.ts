import { MedusaNextFunction, MedusaRequest } from '@medusajs/framework';
import { ContainerRegistrationKeys } from '@medusajs/utils';

export function maybeApplyModelFilter() {
  return async function filter(req: MedusaRequest, _, next: MedusaNextFunction) {
    const filterableFields = req.filterableFields;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const productIds = Array.isArray(filterableFields.id)
      ? filterableFields.id
      : filterableFields.id
      ? [filterableFields.id]
      : [];

    const rawHandle = filterableFields.model_handle;

    if (!rawHandle) {
      return next();
    }

    // Normalise: the frontend sends a comma-separated string OR an array
    const handles: string[] = Array.isArray(rawHandle)
      ? rawHandle
      : (rawHandle as string).split(',').map((h) => h.trim()).filter(Boolean);

    if (handles.length === 0) {
      return next();
    }

    console.log('maybeApplyModelFilter: handles=', handles);
    
    // Query vehicle_model and fetch their associated product IDs
    const { data: models } = await query.graph({
      entity: 'vehicle_model',
      fields: ['products.id'],
      filters: {
        handle: { $in: handles } as any,
      },
    });

    const matchingProductIds = models.flatMap((m) => m.products?.map((p) => p.id) || []);
    console.log('maybeApplyModelFilter: matchingProductIds=', matchingProductIds);

    // If productIds list is pre-populated (e.g. from a previous middleware) intersect,
    // otherwise use all matched ids.
    if (productIds.length > 0) {
      req.filterableFields.id = matchingProductIds.filter((id) => productIds.includes(id));
    } else {
      req.filterableFields.id = matchingProductIds;
    }
    console.log('maybeApplyModelFilter: final req.filterableFields.id=', req.filterableFields.id);

    return next();
  };
}
