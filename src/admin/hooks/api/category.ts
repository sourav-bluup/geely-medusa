import { HttpTypes } from '@medusajs/framework/types';
import { FetchError } from '@medusajs/js-sdk';
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';

const CATEGORIES_QUERY_KEY = 'categories' as const;
export const categoriesQueryKeys = queryKeysFactory(CATEGORIES_QUERY_KEY);

export const useProductCategories = (
  query?: HttpTypes.AdminProductCategoryListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductCategoryListResponse,
      FetchError,
      HttpTypes.AdminProductCategoryListResponse,
      QueryKey
    >,
    'queryFn' | 'queryKey'
  >,
) => {
  const { data, ...rest } = useQuery({
    queryKey: categoriesQueryKeys.list(query),
    queryFn: () => sdk.admin.productCategory.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useProductCategory = (
  id: string,
  query?: HttpTypes.AdminProductCategoryParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductCategoryResponse,
      FetchError,
      HttpTypes.AdminProductCategoryResponse,
      QueryKey
    >,
    'queryFn' | 'queryKey'
  >,
) => {
  const { data, ...rest } = useQuery({
    queryKey: categoriesQueryKeys.detail(id, query),
    queryFn: () => sdk.admin.productCategory.retrieve(id, query),
    ...options,
  });

  return { ...data, ...rest };
};
