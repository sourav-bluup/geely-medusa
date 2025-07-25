import { container, MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { IProductModuleService } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';
import { revalidateNext } from '../../../../subscribers/revalidate-nextjs';
import { SanitySyncParams } from '../validators';

export async function POST(
  req: MedusaRequest<SanitySyncParams>,
  res: MedusaResponse,
): Promise<void> {
  const { product_id } = req.validatedBody as SanitySyncParams;

  const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);

  const product = await productModuleService.retrieveProduct(product_id);

  await revalidateNext([
    `product:${product.id}`,
    `product:${product.handle}`,
    'products',
    'collections',
  ]);

  res.status(200).json({ message: 'Product synced successfully' });
}
