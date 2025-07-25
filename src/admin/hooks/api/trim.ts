import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TrimInput } from '../../../api/admin/vehicle/trim/validators';
import { VehicleTrimDto } from '../../../modules/vehicle/types/vehicle-trim.type';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';
import { modelsQueryKeys } from './models';

const TRIMS_QUERY_KEY = 'trims' as const;
export const trimQueryKeys = queryKeysFactory(TRIMS_QUERY_KEY);

export const useTrimList = (modelId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: trimQueryKeys.list(modelId),
    queryFn: () =>
      sdk.client.fetch<{ trims: VehicleTrimDto[] }>(`/admin/vehicle/model/${modelId}/trim`),
  });

  return { trims: data?.trims, ...rest };
};

export const useTrim = (trimId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: trimQueryKeys.detail(trimId),
    queryFn: () => sdk.client.fetch<{ trim: VehicleTrimDto }>(`/admin/vehicle/trim/${trimId}`),
  });

  return { trim: data?.trim, ...rest };
};

export const useCreateTrim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TrimInput & { model_id: string }) =>
      sdk.client.fetch<{ trim: VehicleTrimDto }>(`/admin/vehicle/model/${data.model_id}/trim`, {
        method: 'POST',
        body: data,
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: trimQueryKeys.list(variables.model_id),
      });
      queryClient.invalidateQueries({
        queryKey: modelsQueryKeys.detail(data.trim.model_id),
      });
    },
  });
};

export const useUpdateTrim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...rest }: TrimInput & { id: string }) =>
      sdk.client.fetch<{ trim: VehicleTrimDto }>(`/admin/vehicle/trim/${id}`, {
        method: 'PUT',
        body: rest,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trimQueryKeys.detail(data.trim.id),
      });
      queryClient.invalidateQueries({
        queryKey: modelsQueryKeys.detail(data.trim.model_id),
      });
    },
  });
};

export const useDeleteTrim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trimId: string) =>
      sdk.client.fetch(`/admin/vehicle/trim/${trimId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, trimId) => {
      queryClient.invalidateQueries({
        queryKey: trimQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: trimQueryKeys.detail(trimId),
      });
      queryClient.invalidateQueries({
        queryKey: modelsQueryKeys.details(),
      });
    },
  });
};
