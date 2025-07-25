import { AdminStockLocationListResponse } from '@medusajs/types';
import { useQuery } from '@tanstack/react-query';
import { sdk } from '../../../../lib/skd';

export interface StockLocation {
  id: string;
  name: string;
}

export const useStockLocations = () => {
  const { data, isLoading } = useQuery<AdminStockLocationListResponse>({
    queryKey: ['stock-locations'],
    queryFn: async () => {
      return await sdk.admin.stockLocation.list();
    },
  });

  const locationMap = new Map<string, string>();
  data?.stock_locations?.forEach((location) => {
    locationMap.set(location.id, location.name);
  });

  return {
    locations: data?.stock_locations || [],
    locationMap,
    isLoading,
  };
};
