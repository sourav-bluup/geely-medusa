import { z } from 'zod';

const SanitySyncParamsSchema = z.object({
  product_id: z.string(),
});

type SanitySyncParams = z.infer<typeof SanitySyncParamsSchema>;

export { SanitySyncParamsSchema, type SanitySyncParams };
