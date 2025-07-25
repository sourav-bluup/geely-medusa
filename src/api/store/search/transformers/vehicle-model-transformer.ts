import { RemoteQueryEntryPointsTypes } from '.medusa/types';

export const vehicleModelTransformer = (
  model: RemoteQueryEntryPointsTypes.VehicleModel,
  categories: RemoteQueryEntryPointsTypes.ProductCategory[],
) => ({
  id: model.id,
  title: model.title,
  handle: model.handle,
  make: {
    id: model.make?.id,
    title: model.make?.name,
  },
  engine: categories.find((category) => category.id === model.engine)?.name,
  transmission: categories.find((category) => category.id === model.transmission)?.name,
  bodyType: categories.find((category) => category.id === model.body_type)?.name,
  fuelType: categories.find((category) => category.id === model.fuel_type)?.name,
  driveType: categories.find((category) => category.id === model.drive_type)?.name,
  year: categories.find((category) => category.id === model.introduction_year)?.name,
  doorCount: model.door_count,
  seatCount: model.seat_count,
});
