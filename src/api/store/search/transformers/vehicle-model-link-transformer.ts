import { RemoteQueryEntryPointsTypes } from '.medusa/types';

export const vehicleModelLinkTransformer = (
  link: RemoteQueryEntryPointsTypes.LinkVehicleModuleVehicleModelProductProduct,
) => ({
  financing: {
    installment: {
      available: link?.has_installment ?? false,
      amount: link.installment_amount ?? 0,
      term: link?.installment_term ?? '',
      description: link?.installment_description ?? '',
    },
    lease: {
      available: link?.has_lease ?? false,
      amount: link.lease_amount ?? 0,
      term: link?.lease_term ?? '',
      description: link?.lease_description ?? '',
    },
  },
  testDrive: {
    available: link?.has_test_drive ?? false,
    description: link?.test_drive_description ?? '',
  },
});
