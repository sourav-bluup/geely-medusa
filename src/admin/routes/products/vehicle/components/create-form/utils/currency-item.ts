import { AdminStoreCurrency } from '@medusajs/types';
import { TabInputItem } from '../tab-input';

export const toCurrencyItem = (currency: AdminStoreCurrency): TabInputItem => {
  return {
    id: currency.currency_code,
    name: currency.currency.symbol,
    tooltip: currency.currency.name,
    placeholder: currency.currency.symbol,
  };
};
