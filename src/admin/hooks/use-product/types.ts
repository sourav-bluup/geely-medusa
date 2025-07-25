import { InstallmentTermEnum } from '../../../modules/vehicle/enums';

type ProductModelDto = {
  product_id: string;
  id: string;
  title: string;
  make: {
    id: string;
    name: string;
  };
  mileage?: number;
  has_installment: boolean;
  installment_amount: string;
  installment_term: InstallmentTermEnum;
  installment_description: string;
  has_test_drive: boolean;
  test_drive_description: string;
  test_drive_down_payment_amount?: number;
  has_lease: boolean;
  lease_amount: string;
  lease_term: InstallmentTermEnum;
  lease_description: string;
  vehicle_model_id: string;
  vehicle_model: {
    title: string;
    id: string;
  };
  product: {
    id: string;
    title: string;
  };
};

type VehicleProductTrimVariantsDto = {
  id: string;
  title: string;
  vehicle_trim: {
    id: string;
    title: string;
  };
};

export { type VehicleProductTrimVariantsDto, type ProductModelDto };
