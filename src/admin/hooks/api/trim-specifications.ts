import { FetchError } from '@medusajs/js-sdk';
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';
import { SpecificationInput } from '../../routes/vehicle/model/[id]/specs/components/table/types';
import {
  ModelSpecificationDto,
  ModelSpecificationGroupResponse,
  ModelSpecificationsResponse,
} from '../../../modules/vehicle/types/trim-specification.types';

const TRIM_SPECIFICATIONS_QUERY_KEY = 'trim_specifications' as const;
export const trimSpecificationsQueryKeys = queryKeysFactory(TRIM_SPECIFICATIONS_QUERY_KEY);

export const useTrimSpecifications = (modelId: string, query?: Record<string, string>) => {
  const { data, ...rest } = useQuery({
    queryKey: trimSpecificationsQueryKeys.list({ modelId, ...query }),
    queryFn: () =>
      sdk.client.fetch<ModelSpecificationsResponse>(
        `/admin/vehicle/model/${modelId}/trim-specifications`,
        {
          query,
        },
      ),
  });

  return { specifications: data?.specifications, ...rest };
};

export const useSaveModelSpecifications = (
  options?: UseMutationOptions<
    { specifications: ModelSpecificationDto[] },
    FetchError,
    { modelId: string; data: SpecificationInput }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ modelId, data: body }: { modelId: string; data: SpecificationInput }) =>
      sdk.client.fetch<{ specifications: ModelSpecificationDto[] }>(
        `/admin/vehicle/model/${modelId}/trim-specifications`,
        {
          method: 'POST',
          body,
        },
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: trimSpecificationsQueryKeys.lists(),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useTrimSpecificationGroups = (modelId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: trimSpecificationsQueryKeys.list({ modelId, group: 'group' }),
    queryFn: () =>
      sdk.client.fetch<ModelSpecificationGroupResponse>(
        `/admin/vehicle/model/${modelId}/trim-specifications/group`,
      ),
  });

  return { groups: data?.groups, ...rest };
};
