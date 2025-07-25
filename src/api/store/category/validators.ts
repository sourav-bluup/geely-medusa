import z from 'zod';

export type GetCategoryFilterParamsType = z.infer<typeof GetCategoryFilterParams>;
export const GetCategoryFilterParams = z
  .object({
    collection_handle: z.string().min(1),
    parent_category_id: z.string().min(1),
  })
  .strict();
