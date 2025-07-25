import { RemoteQueryEntryPointsTypes } from '.medusa/types';
import { calculatedPriceTransformer } from './calculated-price-transformer';

export const variantTransformer = (variant: RemoteQueryEntryPointsTypes.ProductVariant) => ({
  id: variant.id,
  title: variant.title,
  sku: variant.sku,
  variantRank: variant.variant_rank,
  // @ts-expect-error - valid
  inventoryQuantity: variant?.inventory_quantity ?? 0,
  options: variant?.options?.map((option) => ({
    id: option?.id,
    optionId: option?.option_id,
    value: option?.value,
  })),
  // @ts-expect-error - valid media
  media: variant?.media,
  trim: variant?.vehicle_trim
    ? {
        id: variant.vehicle_trim.id,
        title: variant.vehicle_trim.title,
        sortRank: variant.vehicle_trim.sort_rank,
        mileage: variant?.vehicle_trim_link?.mileage,
        year: variant?.vehicle_trim_link?.year,
        handle: variant?.vehicle_trim?.handle,
      }
    : null,
  // @ts-expect-error - valid id
  inventoryQuantity: variant.inventory_quantity,
  // @ts-expect-error - valid prices
  prices: calculatedPriceTransformer(variant?.calculated_price) || null,
});
