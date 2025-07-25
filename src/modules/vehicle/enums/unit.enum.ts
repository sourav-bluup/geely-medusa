enum UnitEnum {
  KG = 'kg',
  KM = 'km',
  MM = 'mm',
  CM = 'cm',
  L = 'l',
  M = 'm',
  CM3 = 'cm3',
  BHP = 'bhp',
  NM = 'nm',
  RPM = 'rpm',
  HP = 'hp',
  KW = 'kw',
  CC = 'cc',
  PS = 'ps',
  KGM = 'kgm',
  LKM = 'lkm',
  KMPL = 'kmpl',
  KMHR = 'kmhr',
  KMPH = 'kmph',
}

type UnitType = (typeof UnitEnum)[keyof typeof UnitEnum];

const UnitEnumLabels = {
  [UnitEnum.KG]: 'Kilogram',
  [UnitEnum.KM]: 'Kilometer',
  [UnitEnum.MM]: 'Millimeter',
  [UnitEnum.CM]: 'Centimeter',
  [UnitEnum.L]: 'Liter',
  [UnitEnum.M]: 'Meter',
  [UnitEnum.CM3]: 'Cubic Centimeter',
  [UnitEnum.BHP]: 'Brake Horsepower',
  [UnitEnum.NM]: 'Newton Meter',
  [UnitEnum.RPM]: 'Revolutions Per Minute',
  [UnitEnum.HP]: 'Horsepower',
  [UnitEnum.KW]: 'Kilowatt',
  [UnitEnum.CC]: 'Cubic Centimeter',
  [UnitEnum.PS]: 'Pferdestärke',
  [UnitEnum.KGM]: 'Kilogram Meter',
  [UnitEnum.LKM]: 'Liters per Kilometer',
  [UnitEnum.KMPL]: 'Kilometers per Liter',
  [UnitEnum.KMHR]: 'Kilometers per Hour',
  [UnitEnum.KMPH]: 'Kilometers per Hour',
};

const toUnitLabel = (unit: UnitType) => UnitEnumLabels[unit];

const unitOptions = Object.values(UnitEnum).map((value) => ({
  value,
  label: UnitEnumLabels[value as UnitType],
}));

export { UnitEnum, UnitEnumLabels, toUnitLabel, unitOptions };
