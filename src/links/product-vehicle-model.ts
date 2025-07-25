import ProductModule from '@medusajs/product';
import { defineLink } from '@medusajs/utils';
import VehicleModule from '../modules/vehicle';
import { InstallmentTermEnum } from '../modules/vehicle/enums/installment.enum';

const InstallmentTermEnumArray = Object.values(InstallmentTermEnum);

export default defineLink(
  VehicleModule.linkable.vehicleModel,
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  {
    database: {
      extraColumns: {
        metadata: {
          type: 'json',
          nullable: true,
        },
        has_installment: {
          type: 'boolean',
          nullable: false,
          options: {
            default: false,
          },
        },
        installment_amount: {
          type: 'decimal',
          nullable: true,
          options: {
            default: 0,
            precision: 20,
            scale: 2,
          },
        },
        installment_term: {
          type: 'enumArray',
          nullable: true,
          options: {
            enum: InstallmentTermEnum,
            default: InstallmentTermEnum.MONTHLY,
            items: InstallmentTermEnumArray,
          },
        },
        installment_description: {
          type: 'text',
          nullable: true,
        },
        has_test_drive: {
          type: 'boolean',
          nullable: false,
          options: {
            default: false,
          },
        },
        test_drive_description: {
          type: 'text',
          nullable: true,
        },
        has_lease: {
          type: 'boolean',
          nullable: false,
          options: {
            default: false,
          },
        },
        lease_amount: {
          type: 'decimal',
          nullable: true,
          options: {
            default: 0,
            precision: 20,
            scale: 2,
          },
        },
        lease_term: {
          type: 'enumArray',
          nullable: true,
          options: {
            enum: InstallmentTermEnum,
            items: InstallmentTermEnumArray,
            default: InstallmentTermEnum.MONTHLY,
          },
        },
        lease_description: {
          type: 'text',
          nullable: true,
        },
      },
    },
  },
);
