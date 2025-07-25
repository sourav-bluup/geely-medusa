import { z } from 'zod';

export const vehicleModelSchema = z
  .object({
    action: z.enum(['create', 'update']),
    title: z.string().min(1, { message: 'Model name is required' }),
    make_id: z.string().min(1, { message: 'Make is required' }),
    product_category_id: z.string().optional(),
    introduction_year: z.string().min(1, { message: 'Introduction year is required' }),
    discontinued_year: z.coerce
      .number()
      .max(new Date().getFullYear() + 40)
      .optional()
      .nullable(),
    trims: z.array(z.string().min(1)),
    engine: z.string(),
    transmission: z.string().min(1, { message: 'Transmission is required' }),
    body_type: z.string().min(1, { message: 'Body type is required' }),
    fuel_type: z.string().min(1, { message: 'Fuel type is required' }),
    drive_type: z.string().min(1, { message: 'Drive type is required' }),
    door_count: z.coerce.number().min(1, { message: 'Door count is required' }),
    seat_count: z.coerce.number().min(1, { message: 'Seat count is required' }),
  })
  .refine(
    (data) => {
      if (data.action == 'create') {
        return data.trims.length > 0;
      }
      return true;
    },
    {
      message: 'At least one trim is required for the model',
      path: ['trims'],
    },
  );

export type VehicleModelInput = z.infer<typeof vehicleModelSchema>;
