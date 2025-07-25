import { AdminStockLocation } from '@medusajs/types';
import { titleToId } from '../../../utils/title-to-id';
import { TabInputItem } from '../tab-input';

export const toStockItem = (stockLocation: AdminStockLocation): TabInputItem => {
  return {
    id: stockLocation.id,
    name: titleToId(stockLocation.name),
    tooltip: stockLocation.name,
    placeholder: stockLocation.name,
  };
};
