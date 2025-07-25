import z from 'zod';

export const LinkTrimToVariantInput = z
  .object({
    variant_id: z.string().min(1, {
      message: 'variant_id is required',
    }),
    trim_id: z.string().min(1, {
      message: 'trim_id is required',
    }),
    year: z.coerce.number().optional(),
    mileage: z.coerce.number().optional(),
  })
  .strict();

export const TrimSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  sort_rank: z.coerce.number().min(0),
  year: z.coerce.number().optional(),
  mileage: z.coerce.number().optional(),
  is_default: z.boolean().optional(),
  model_id: z.string().min(1, 'Model ID is required'),
});

export type TrimInput = z.infer<typeof TrimSchema>;

export type LinkTrimToVariantType = z.infer<typeof LinkTrimToVariantInput>;
