import useSWRMutation from 'swr/mutation';
import { fetcherPost, fetcherPut, useSWRHook } from '../lib/fetcher';
import { VehicleModelDto } from '../../modules/vehicle/types/vehicle-model.type';
import { VehicleModelInput } from '../../modules/vehicle/schemas/model.schemas';

const useVehicleModels = () => useSWRHook<VehicleModelDto[]>(`/vehicle/model`);

const useGetVehicleModel = (id: string) => useSWRHook<VehicleModelDto>(`/vehicle/model/${id}`);

const useCreateVehicleModel = () => {
  const { trigger, isMutating, error, data } = useSWRMutation<
    VehicleModelDto,
    Error,
    string,
    VehicleModelInput
  >('/vehicle/model', fetcherPost);

  return { trigger, isMutating, error, data, isSuccess: !!data };
};

const useUpdateVehicleModel = (id: string) => {
  const { trigger, isMutating, error, data } = useSWRMutation<
    VehicleModelDto,
    Error,
    string,
    VehicleModelInput
  >(`/vehicle/model/${id}`, fetcherPut);

  return { trigger, isMutating, error, data, isSuccess: !!data };
};

const useGetVehicles = () => useSWRHook<VehicleModelDto[]>(`/vehicle/model`);

export {
  useCreateVehicleModel,
  useGetVehicleModel,
  useGetVehicles,
  useUpdateVehicleModel,
  useVehicleModels,
};
