import { useSWRHook } from '../../lib/fetcher';
import { VehicleProductTrimVariantsDto } from './types';

const useGetProductTrimVariants = (productId: string) =>
  useSWRHook<VehicleProductTrimVariantsDto[]>(`/vehicle/product/${productId}/variants`);

export { useGetProductTrimVariants };
