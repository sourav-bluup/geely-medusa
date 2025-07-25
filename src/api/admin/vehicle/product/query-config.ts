export const productVehicleModelFields = [
  'has_installment',
  'installment_amount',
  'installment_term',
  'installment_description',
  'has_test_drive',
  'test_drive_description',
  'has_lease',
  'lease_amount',
  'lease_term',
  'lease_description',
  'vehicle_model.title',
  'vehicle_model.id',
  'product.id',
  'product.title',
];

export const retrieveProductVehicleModelQueryConfig = {
  defaults: productVehicleModelFields,
  isList: false,
};
