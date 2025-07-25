import { useQuery } from '@tanstack/react-query';
import { VehicleTrimDto } from '../../../modules/vehicle/types/vehicle-trim.type';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';

const MODELS_QUERY_KEY = 'models' as const;
export const modelsQueryKeys = queryKeysFactory(MODELS_QUERY_KEY);

export const useModelTrims = (modelId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: modelsQueryKeys.detail(modelId),
    queryFn: () =>
      sdk.client.fetch<{ trims: VehicleTrimDto[] }>(`/admin/vehicle/model/${modelId}/trim`),
  });

  return { trims: data?.trims, ...rest };
};
