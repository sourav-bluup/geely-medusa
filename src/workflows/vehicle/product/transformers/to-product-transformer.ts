import { ProductTypes } from '@medusajs/framework/types';
import { toHandle } from '@medusajs/framework/utils';
import { VehicleProductSchemaType } from '../../../../api/admin/vehicle/product/validators';

export const toProductTransformer = (
  input: VehicleProductSchemaType,
): ProductTypes.CreateProductDTO => {
  const enabledVariants = input.variants.filter((variant) => variant.is_enabled);
  const trimValues = new Set(enabledVariants.map((variant) => variant.options.Trim));
  return {
    title: input.title,
    handle: toHandle(input.handle || input.title),
    options: input.options.map((option) => ({
      title: option.title,
      values: option.title === 'Trim' ? Array.from(trimValues) : option.values,
    })),
    variants: enabledVariants.map((variant) => ({
      title: variant.title || '',
      sku: variant.sku,
      manage_inventory: true,
      prices:
        variant.prices?.map((price) => ({
          amount: price.value,
          currency_code: price.id,
        })) || [],
      options: variant.options,
      metadata: {
        trim_id: variant.trim_id,
      },
    })),
    metadata: {
      vehicle_model_id: input.model_id,
      body_colors: input.bodyColor,
      interior_colors: input.interiorColor,
    },
  };
};

export default toProductTransformer;
