enum SpecificationCategoryEnum {
  Overview = 'overview',
  Performance = 'performance',
  Technical = 'technical',
  AVAndConvenience = 'av_and_convenience',
  Interior = 'interior',
  Exterior = 'exterior',
  Safety = 'safety',
  Other = 'other',
}

type SpecificationCategoryType =
  (typeof SpecificationCategoryEnum)[keyof typeof SpecificationCategoryEnum];

const specificationCategoryLabels: Record<SpecificationCategoryType, string> = {
  [SpecificationCategoryEnum.Overview]: 'Overview',
  [SpecificationCategoryEnum.Performance]: 'Performance Features',
  [SpecificationCategoryEnum.Technical]: 'Technical Features',
  [SpecificationCategoryEnum.AVAndConvenience]: 'AV & Convenience Features',
  [SpecificationCategoryEnum.Interior]: 'Interior Features',
  [SpecificationCategoryEnum.Exterior]: 'Exterior Features',
  [SpecificationCategoryEnum.Safety]: 'Safety Features',
  [SpecificationCategoryEnum.Other]: 'Other',
};

const specificationCategoryOptions = Object.values(SpecificationCategoryEnum).map((value) => ({
  value,
  label: specificationCategoryLabels[value],
}));

const toSpecificationCategoryLabel = (specificationCategory: SpecificationCategoryType) =>
  specificationCategoryLabels[specificationCategory];

export {
  SpecificationCategoryEnum,
  specificationCategoryLabels,
  specificationCategoryOptions,
  toSpecificationCategoryLabel,
};
