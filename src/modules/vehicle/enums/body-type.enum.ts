enum BodyTypeEnum {
  SALOON = 'saloon', // British term for Sedan
  SEDAN = 'sedan', // American term for Saloon
  SUV = 'suv',
  COUPE = 'coupe',
  HATCHBACK = 'hatchback',
  CONVERTIBLE = 'convertible',
  ESTATE = 'estate', // British term for Wagon
  WAGON = 'wagon', // American term for Estate
  PICKUP = 'pickup',
  MINIVAN = 'minivan',
  MPV = 'mpv', // British term for Minivan
  CROSSOVER = 'crossover',
  ROADSTER = 'roadster',
  VAN = 'van',
}

type BodyType = (typeof BodyTypeEnum)[keyof typeof BodyTypeEnum];

const BodyTypeEnumLabels = {
  [BodyTypeEnum.SALOON]: 'Saloon',
  [BodyTypeEnum.SEDAN]: 'Sedan',
  [BodyTypeEnum.SUV]: 'SUV',
  [BodyTypeEnum.COUPE]: 'Coupe',
  [BodyTypeEnum.HATCHBACK]: 'Hatchback',
  [BodyTypeEnum.CONVERTIBLE]: 'Convertible',
  [BodyTypeEnum.ESTATE]: 'Estate',
  [BodyTypeEnum.WAGON]: 'Wagon',
  [BodyTypeEnum.PICKUP]: 'Pickup',
  [BodyTypeEnum.MINIVAN]: 'Minivan',
  [BodyTypeEnum.MPV]: 'MPV',
  [BodyTypeEnum.CROSSOVER]: 'Crossover',
  [BodyTypeEnum.ROADSTER]: 'Roadster',
  [BodyTypeEnum.VAN]: 'Van',
};

const toBodyTypeLabel = (bodyType: BodyType) => BodyTypeEnumLabels[bodyType];

const bodyTypeOptions = Object.values(BodyTypeEnum).map((value) => ({
  value,
  label: BodyTypeEnumLabels[value as BodyType],
}));

export { BodyTypeEnum, BodyTypeEnumLabels, bodyTypeOptions, toBodyTypeLabel };
