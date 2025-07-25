import { HttpTypes } from '@medusajs/framework/types';
import { FetchError } from '@medusajs/js-sdk';
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { LinkModelToProductType } from '../../../api/admin/vehicle/model/validators';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';
import { MediaType } from '../../../modules/vehicle/types/vehicle-variant-media-type';
import { ProductModelDto } from '../use-product/types';

const VARIANTS_QUERY_KEY = 'product_variants' as const;
const PRODUCT_MODEL_QUERY_KEY = 'product_model' as const;

export const variantsQueryKeys = queryKeysFactory(VARIANTS_QUERY_KEY);
export const productModelQueryKeys = queryKeysFactory(PRODUCT_MODEL_QUERY_KEY);
export type AdminProductVariant = HttpTypes.AdminProductVariant & {
  vehicle_variant_media?:
    | Array<{
        id: string;
        url: string;
        media_type: MediaType;
        title: string;
        description: string;
      }>
    | {
        id: string;
        url: string;
        media_type: MediaType;
        title: string;
        description: string;
      };
};

export const useProductVariants = (
  productId: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<Record<any, any>, FetchError, { variants: Record<any, any>[] }, QueryKey>,
    'queryFn' | 'queryKey'
  >,
) => {
  const { data, ...rest } = useQuery({
    queryFn: () =>
      sdk.admin.product.listVariants(productId, query).then(({ variants, ...rest }) => {
        return {
          ...rest,
          variants,
        };
      }),
    queryKey: variantsQueryKeys.list({ productId, ...query }),
    ...options,
  });

  return { ...data, ...rest };
};

export const useProductModel = (productId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: productModelQueryKeys.detail(productId),
    queryFn: () =>
      sdk.client.fetch<{ product_model: ProductModelDto }>(`/admin/vehicle/product/${productId}`),
  });

  return { productModel: data?.product_model, ...rest };
};

export const useUpdateVehicleModelProduct = () => {
  const queryClient = useQueryClient();

  const { data: productModel, ...rest } = useMutation({
    mutationFn: (data: LinkModelToProductType) =>
      sdk.client.fetch<{ product_model: { product_id: string; vehicle_model_id: string } }>(
        `/admin/vehicle/product/${data.product_id}`,
        {
          method: 'POST',
          body: data,
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productModelQueryKeys.details(),
      });
    },
  });

  return { productModel, ...rest };
};
