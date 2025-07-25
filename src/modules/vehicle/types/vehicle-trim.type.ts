import { MetadataType } from '@medusajs/framework/types';

export type VehicleTrimDto = {
  id: string;
  title: string;
  handle: string;
  sort_rank: number;
  model?: {
    id: string;
    title: string;
  };
  model_id: string;
  is_default: boolean;
  metadata?: MetadataType;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
