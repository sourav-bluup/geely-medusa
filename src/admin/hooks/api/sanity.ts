import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeysFactory } from '../../lib/query-key-factory';
import { sdk } from '../../lib/skd';

const SANITY_QUERY_KEY = 'sanity' as const;
export const sanityQueryKeys = queryKeysFactory(SANITY_QUERY_KEY);

type SanitySyncParams = {
  product_id: string;
};

type SanitySyncResponse = {
  message: string;
};

export const useSanitySync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product_id }: SanitySyncParams) =>
      sdk.client.fetch<SanitySyncResponse>(`/admin/sanity/revalidate`, {
        method: 'POST',
        body: { product_id },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sanityQueryKeys.details(),
      });
    },
  });
};

export const useSanityRevalidateAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      sdk.client.fetch<SanitySyncResponse>(`/admin/sanity/revalidate-all`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sanityQueryKeys.all,
      });
    },
  });
};
