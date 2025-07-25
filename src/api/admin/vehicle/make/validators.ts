import { z } from 'zod';

export const AdminMakeIdParams = z
  .object({
    id: z.string(),
  })
  .strict();

export const VehicleMakeSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

export type AdminMakeIdParamsType = z.infer<typeof AdminMakeIdParams>;
export type VehicleMakeInput = z.infer<typeof VehicleMakeSchema>;
