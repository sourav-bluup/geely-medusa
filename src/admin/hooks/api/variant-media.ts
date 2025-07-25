import { FetchError } from '@medusajs/js-sdk';
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';
import {
  EditVehicleVariantMediaInput,
  VehicleVariantMediaDTO,
  VehicleVariantMediaInput,
} from '../../../modules/vehicle/types/vehicle-variant-media-type';

const variantMediasQueryKeys = queryKeysFactory('variant_media');

export const useVariantMedias = (variantId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: variantMediasQueryKeys.list(variantId),
    queryFn: () =>
      sdk.client.fetch<{
        medias: VehicleVariantMediaDTO[];
      }>(`/admin/vehicle/variant/${variantId}/media`),
  });
  return {
    medias: data?.medias,
    ...rest,
  };
};

export const useVariantMedia = (id: string) => {
  const { data, ...rest } = useQuery({
    queryKey: variantMediasQueryKeys.detail(id),
    queryFn: () =>
      sdk.client.fetch<{
        media: VehicleVariantMediaDTO;
      }>(`/admin/vehicle/variant/media/${id}`),
  });
  return {
    media: data?.media,
    ...rest,
  };
};

export const useDeleteVehicleVariantMedia = (
  id: string,
  options?: UseMutationOptions<Record<any, any>, FetchError, void>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      sdk.client.fetch<Record<any, any>>(`/admin/vehicle/variant/media/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: variantMediasQueryKeys.lists(),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateVehicleVariantMedia = (
  id: string,
  options?: UseMutationOptions<
    {
      media: VehicleVariantMediaDTO;
    },
    FetchError,
    EditVehicleVariantMediaInput
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: EditVehicleVariantMediaInput) =>
      sdk.client.fetch<{
        media: VehicleVariantMediaDTO;
      }>(`/admin/vehicle/variant/media/${id}`, {
        method: 'PUT',
        body,
      }),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: variantMediasQueryKeys.detail(id),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
export const useCreateVehicleMedia = (
  options?: UseMutationOptions<
    {
      medias: VehicleVariantMediaDTO[];
    },
    FetchError,
    VehicleVariantMediaInput
  >,
) => {
  const queryClient = useQueryClient();

  const createVehicleProductVariant = async (body: VehicleVariantMediaInput) => {
    return sdk.client.fetch<{
      medias: VehicleVariantMediaDTO[];
    }>(`/admin/vehicle/variant/media`, {
      method: 'POST',
      body,
    });
  };

  return useMutation({
    mutationFn: (data: VehicleVariantMediaInput) => createVehicleProductVariant(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: variantMediasQueryKeys.list(variables.media[0].variant_id),
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
};
