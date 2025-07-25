import * as z from 'zod';
import { ReservationStage } from '../types';

export const reservationSchema = z.object({
  inventory_item_id: z.string({
    required_error: 'Inventory item is required',
    invalid_type_error: 'Invalid inventory item',
  }),
  location_id: z.string({
    required_error: 'Location is required',
    invalid_type_error: 'Invalid location',
  }),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int()
    .positive('Quantity must be greater than 0')
    .max(9999, 'Quantity cannot exceed 9999'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  metadata: z.object({
    stage: z.nativeEnum(ReservationStage, {
      required_error: 'Stage is required',
      invalid_type_error: 'Invalid stage',
    }),
  }),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;
