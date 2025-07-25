import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { revalidateNext } from '../../../../subscribers/revalidate-nextjs';
import { SanitySyncParams } from '../validators';

export async function POST(
  req: MedusaRequest<SanitySyncParams>,
  res: MedusaResponse,
): Promise<void> {
  await revalidateNext(['products', 'collections']);

  res.status(200).json({ message: 'Product synced successfully' });
}
