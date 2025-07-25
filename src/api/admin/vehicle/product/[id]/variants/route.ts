import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { ContainerRegistrationKeys, MedusaError } from '@medusajs/utils';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const id = req.params.id;
  if (!id) {
    return MedusaError.Types.INVALID_DATA;
  }
  try {
    const {
      data: [result],
    } = await query.graph({
      entity: 'product',
      fields: [
        'variants.id',
        'variants.title',
        'variants.sku',
        'variants.vehicle_trim.id',
        'variants.vehicle_trim.title',
      ],
      filters: {
        id: id,
      },
    });
    return res.status(200).json(result.variants);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
