import { RemoteQueryEntryPointsTypes } from '.medusa/types';

export const calculatedPriceTransformer = (
  price: RemoteQueryEntryPointsTypes.CalculatedPriceSet,
) => {
  if (!price?.id) {
    return null;
  }

  return {
    id: price?.id,
    isCalculatedPricePriceList: price.is_calculated_price_price_list,
    isCalculatedPriceTaxInclusive: price.is_calculated_price_tax_inclusive,
    calculatedAmount: price.calculated_amount,
    isOriginalPricePriceList: price.is_original_price_price_list,
    isOriginalPriceTaxInclusive: price.is_original_price_tax_inclusive,
    originalAmount: price.original_amount,
    currencyCode: price.currency_code,
    calculatedPrice: {
      id: price.calculated_price.id,
      priceListId: price.calculated_price.price_list_id,
      priceListType: price.calculated_price.price_list_type,
      minQuantity: price.calculated_price.min_quantity,
      maxQuantity: price.calculated_price.max_quantity,
    },
    originalPrice: {
      id: price.original_price.id,
      priceListId: price.original_price.price_list_id,
      priceListType: price.original_price.price_list_type,
      minQuantity: price.original_price.min_quantity,
      maxQuantity: price.original_price.max_quantity,
    },
  };
};
