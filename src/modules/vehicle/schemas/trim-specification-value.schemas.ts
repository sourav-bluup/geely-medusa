import z from 'zod';

export const trimSpecificationEnablerSchema = z.object({
  status: z.union([z.literal('enabled'), z.literal('disabled')]),
});

export type TrimSpecificationEnablerInput = z.infer<typeof trimSpecificationEnablerSchema>;

export const trimSpecificationValueSchema = z.object({
  status: z.union([z.literal('enabled'), z.literal('disabled')]),
  specification_id: z.string(),
  specification_value_id: z.string(),
  trim_id: z.string(),
});

export type TrimSpecificationInput = z.infer<typeof trimSpecificationValueSchema>;
