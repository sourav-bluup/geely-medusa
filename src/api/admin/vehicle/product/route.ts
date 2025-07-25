import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { createVehicleProductWorkflow } from '../../../../workflows/vehicle/product/workflows/create-vehicle-product.workflow';
import { VehicleProductSchemaType } from './validators';

export async function POST(
  req: AuthenticatedMedusaRequest<VehicleProductSchemaType>,
  res: MedusaResponse,
): Promise<void> {
  try {
    const { result } = await createVehicleProductWorkflow(req.scope).run({
      input: req.validatedBody,
    });

    res.status(201).json({
      product: result.product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
