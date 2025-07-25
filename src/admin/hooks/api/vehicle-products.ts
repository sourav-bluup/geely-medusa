import { FetchError } from '@medusajs/js-sdk';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { VehicleProductSchemaType } from '../../../api/admin/vehicle/product/validators';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';

const PRODUCTS_QUERY_KEY = 'products' as const;
export const productsQueryKeys = queryKeysFactory(PRODUCTS_QUERY_KEY);
const PRODUCT_VARIANT_QUERY_KEY = 'product_variant' as const;
export const productVariantQueryKeys = queryKeysFactory(PRODUCT_VARIANT_QUERY_KEY);
export const useVehicleProductCreate = (
  options?: UseMutationOptions<Record<any, any>, FetchError, Record<any, any>>,
) => {
  const queryClient = useQueryClient();

  const createVehicleProduct = async (body: VehicleProductSchemaType) => {
    return sdk.client.fetch<{
      vechileProduct: Record<any, any>;
    }>(`/admin/vehicle/product`, {
      method: 'POST',
      body,
    });
  };

  return useMutation({
    //@ts-ignore
    mutationFn: (data: VehicleProductSchemaType) => createVehicleProduct(data),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.details(),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
