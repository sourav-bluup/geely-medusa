import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { linkTrimToProductVariationWorkflow } from '../../../../../workflows/vehicle/trim/link-trim-to-product-variant.workflow';
import { unlinkTrimToProductVariationWorkflow } from '../../../../../workflows/vehicle/trim/unlink-trim-from-product-variant.workflow';
import { LinkTrimToVariantType } from '../validators';

export async function POST(
  req: AuthenticatedMedusaRequest<LinkTrimToVariantType>,
  res: MedusaResponse,
): Promise<void> {
  const { result } = await linkTrimToProductVariationWorkflow(req.scope).run({
    input: {
      variant_id: req.body.variant_id,
      trim_id: req.body.trim_id,
      year: req.body.year,
      mileage: req.body.mileage,
    },
  });
  res.status(201).json(result);
}

export async function DELETE(
  req: AuthenticatedMedusaRequest<LinkTrimToVariantType>,
  res: MedusaResponse,
): Promise<void> {
  const { result } = await unlinkTrimToProductVariationWorkflow(req.scope).run({
    input: {
      variant_id: req.body.variant_id,
      trim_id: req.body.trim_id,
    },
  });
  res.status(201).json(result);
}
