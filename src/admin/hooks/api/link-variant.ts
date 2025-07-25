import { FetchError } from '@medusajs/js-sdk';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { LinkTrimToVariantType } from '../../../api/admin/vehicle/trim/validators';
import { sdk } from '../../lib/skd';
import { productsQueryKeys } from './vehicle-products';

export const useLinkVariant = (
  options?: UseMutationOptions<
    {
      result: any;
    },
    FetchError,
    LinkTrimToVariantType
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LinkTrimToVariantType) =>
      sdk.client.fetch<{
        result: any;
      }>('/admin/vehicle/trim/link-variant', {
        method: 'POST',
        body: data,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.all,
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUnlinkVariant = (
  options?: UseMutationOptions<
    {
      result: any;
    },
    FetchError,
    LinkTrimToVariantType
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LinkTrimToVariantType) =>
      sdk.client.fetch<{
        result: any;
      }>('/admin/vehicle/trim/link-variant', {
        method: 'DELETE',
        body: data,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.all,
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
