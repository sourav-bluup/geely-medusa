enum FuelTypeEnum {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
}

type EngineType = (typeof FuelTypeEnum)[keyof typeof FuelTypeEnum];

const fuelTypeLabels: Record<EngineType, string> = {
  [FuelTypeEnum.PETROL]: 'Petrol',
  [FuelTypeEnum.DIESEL]: 'Diesel',
  [FuelTypeEnum.ELECTRIC]: 'Electric',
  [FuelTypeEnum.HYBRID]: 'Hybrid',
};

const fuelTypeOptions = Object.values(FuelTypeEnum).map((value) => ({
  value,
  label: fuelTypeLabels[value],
}));

const toFuelTypeLabel = (fuelType: EngineType) => fuelTypeLabels[fuelType];

export { FuelTypeEnum, fuelTypeLabels, fuelTypeOptions, toFuelTypeLabel };
