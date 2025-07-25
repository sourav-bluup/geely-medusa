import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const paymentModuleService = req.scope.resolve(Modules.PAYMENT);

  try {
    await paymentModuleService.authorizePaymentSession(req.params.id, {});
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
