import { FetchError } from '@medusajs/js-sdk';
import { HttpTypes } from '@medusajs/types';
import { QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';

const STOCK_LOCATIONS_QUERY_KEY = 'stock-locations' as const;

export const stockLocationsQueryKeys = queryKeysFactory(STOCK_LOCATIONS_QUERY_KEY);

export const useStockLocations = (
  query?: HttpTypes.AdminStockLocationListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminStockLocationListResponse,
      FetchError,
      HttpTypes.AdminStockLocationListResponse,
      QueryKey
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.stockLocation.list(query),
    queryKey: stockLocationsQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};
