import { AdminInventoryItem, AdminInventoryLevel } from '@medusajs/types';

export enum ReservationStage {
  TEST_DRIVE = 'test_drive',
  PURCHASE = 'purchase',
  CANCELLED = 'cancelled',
}

export interface ExtendedInventoryItem extends AdminInventoryItem {
  location_levels: AdminInventoryLevel[];
}

export interface ReservationCreateData {
  location_id: string;
  inventory_item_id: string;
  quantity: number;
  description?: string;
  metadata: {
    stage: ReservationStage;
  };
}

export interface LocationOption {
  id: string;
  label: string;
  availableQuantity: number;
}
