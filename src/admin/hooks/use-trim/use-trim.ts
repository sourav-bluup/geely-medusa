import useSWRMutation from 'swr/mutation';
import { LinkTrimToVariantType } from '../../../api/admin/vehicle/trim/validators';
import { VehicleTrimDto } from '../../../modules/vehicle/types/vehicle-trim.type';
import { fetcherPost, useSWRHook } from '../../lib/fetcher';

const useGetVehicleTrim = (id: string) => useSWRHook<VehicleTrimDto>(`/vehicle/trim/${id}`);

const useAttachTrimToVariant = () => {
  const { trigger, isMutating, error, data } = useSWRMutation<
    {},
    Error,
    string,
    LinkTrimToVariantType
  >('/vehicle/trim/link-variant', fetcherPost);
  return { trigger, isMutating, error, data, isSuccess: !!data };
};

export { useAttachTrimToVariant, useGetVehicleTrim };
