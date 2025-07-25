import { createSelectParams } from '@medusajs/medusa/api/utils/validators';
import { z } from 'zod';

export const GetLinkModelToProductParams = createSelectParams();

const optionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  values: z.array(z.string()).min(1, 'At least one value is required'),
});

const priceSchema = z.object({
  id: z.string().min(1, 'Currency code is required'),
  value: z.coerce.number().min(0, 'Amount must be non-negative'),
});

const stockSchema = z.object({
  id: z.string().min(1, 'Location ID is required'),
  value: z.coerce.number().min(0, 'Quantity must be non-negative'),
});

const variantSchema = z
  .object({
    is_enabled: z.boolean().optional(),
    title: z.string().min(1, 'Title is required').optional().nullable(),
    trim_id: z.string().min(1, 'Trim ID is required').optional().nullable(),
    options: z.record(z.string(), z.string()).optional().nullable(),
    sku: z.string().optional().nullable(),
    prices: z.array(priceSchema).optional().nullable(),
    stock: z.array(stockSchema).optional().nullable(),
    mileage: z.coerce.number().optional().nullable(),
    year: z.coerce.number().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.is_enabled) {
        return (
          data.prices &&
          data.prices.some((price) => price.value > 0) &&
          data.stock &&
          data.stock.some((stock) => stock.value > 0) &&
          data.sku
        );
      }
      return true;
    },
    {
      message: 'Stock, SKU, and Price are required',
      path: ['is_enabled'],
    },
  );

export const VehicleProductSchema = z
  .object({
    bodyColor: z.array(z.string()).min(1, 'At least one body color is required'),
    interiorColor: z.array(z.string()).min(1, 'At least one interior color is required'),
    title: z.string().min(1, 'Title is required'),
    handle: z.string().min(1, 'Handle is required'),
    model_id: z.string().min(1, 'Model ID is required'),
    options: z.array(optionSchema).min(1, 'At least one option is required'),
    variants: z
      .array(variantSchema)
      .min(1, 'At least one trim is required')
      .refine((variants) => variants.some((variant) => variant.is_enabled === true), {
        message: 'At least one variant must be enabled',
        path: ['root'],
      }),
    listing_type: z.enum(['new', 'certified'], {
      required_error: 'Listing type is required',
    }),
  })
  .strict();

export type VehicleProductSchemaType = z.infer<typeof VehicleProductSchema>;
