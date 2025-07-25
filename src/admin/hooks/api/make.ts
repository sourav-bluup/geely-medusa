import { FetchError } from '@medusajs/js-sdk';
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { VehicleMakeInput } from '../../../api/admin/vehicle/make/validators';
import { VehicleMakeDto } from '../../../modules/vehicle/types/vehicle-make.type';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';
const makeQueryKeys = queryKeysFactory('make');
export const useDeleteVehicleMake = (
  id: string,
  options?: UseMutationOptions<Record<any, any>, FetchError, void>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      sdk.client.fetch<Record<any, any>>(`/admin/vehicle/make/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: makeQueryKeys.lists(),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateVehicleMake = (
  id: string,
  options?: UseMutationOptions<
    {
      make: VehicleMakeDto;
    },
    FetchError,
    VehicleMakeInput
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: VehicleMakeInput) =>
      sdk.client.fetch<{
        make: VehicleMakeDto;
      }>(`/admin/vehicle/make/${id}`, {
        method: 'PUT',
        body,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: makeQueryKeys.detail(id),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useVehicleMake = (id: string) => {
  const { data, ...rest } = useQuery({
    queryKey: makeQueryKeys.detail(id),
    queryFn: () =>
      sdk.client.fetch<{
        make: VehicleMakeDto;
      }>(`/admin/vehicle/make/${id}`),
  });
  return {
    make: data?.make,
    ...rest,
  };
};

export const useCreateVehicleMake = (
  options?: UseMutationOptions<
    {
      make: VehicleMakeDto;
    },
    FetchError,
    VehicleMakeInput
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: VehicleMakeInput) =>
      sdk.client.fetch<{
        make: VehicleMakeDto;
      }>(`/admin/vehicle/make`, {
        method: 'POST',
        body,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: makeQueryKeys.lists(),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useVehicleMakeList = () => {
  const { data, ...rest } = useQuery({
    queryKey: makeQueryKeys.lists(),
    queryFn: () => sdk.client.fetch<{ makes: VehicleMakeDto[] }>('/admin/vehicle/make'),
  });
  return {
    makes: data?.makes,
    ...rest,
  };
};
