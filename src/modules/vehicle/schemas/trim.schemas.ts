import z from 'zod';

export const vehicleTrimSchema = z.object({
  name: z.string(),
  model_id: z.string(),
});

export type VehicleTrimInput = z.infer<typeof vehicleTrimSchema>;
