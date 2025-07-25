import { FetchError } from '@medusajs/js-sdk';
import { HttpTypes, PaginatedResponse } from '@medusajs/types';
import { QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';

const REGIONS_QUERY_KEY = 'regions' as const;
export const regionsQueryKeys = queryKeysFactory(REGIONS_QUERY_KEY);

export const useRegion = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      { region: HttpTypes.AdminRegion },
      FetchError,
      { region: HttpTypes.AdminRegion },
      QueryKey
    >,
    'queryFn' | 'queryKey'
  >,
) => {
  const { data, ...rest } = useQuery({
    queryKey: regionsQueryKeys.detail(id, query),
    queryFn: async () => sdk.admin.region.retrieve(id, query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useRegions = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>,
      FetchError,
      PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>,
      QueryKey
    >,
    'queryFn' | 'queryKey'
  >,
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.region.list(query),
    queryKey: regionsQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};
