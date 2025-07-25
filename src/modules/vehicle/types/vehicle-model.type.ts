export type VehicleModelDto = {
  id: string;
  title: string;
  handle: string;
  product_category_id: string | null;
  introduction_year: string;
  discontinued_year: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  trims: Array<{
    id: string;
    title: string;
    is_default: boolean;
  }>;
  make: {
    id: string;
    name: string;
  };
  engine: string | null;
  transmission: string | null;
  body_type: string | null;
  fuel_type: string | null;
  drive_type: string | null;
  door_count: number;
  seat_count: number;
  engine_category: {
    id: string;
    name: string;
  };
  transmission_category: {
    id: string;
    name: string;
  };
  fuel_type_category: {
    id: string;
    name: string;
  };
  body_type_category: {
    id: string;
    name: string;
  };
  drive_type_category: {
    id: string;
    name: string;
  };
  year_category: {
    id: string;
    name: string;
  };
  model_category: {
    id: string;
    name: string;
  };
};
