enum InstallmentTermEnum {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  YEARLY = 'yearly',
}

const installmentTermLabels: Record<InstallmentTermEnum, string> = {
  [InstallmentTermEnum.MONTHLY]: 'Monthly',
  [InstallmentTermEnum.WEEKLY]: 'Weekly',
  [InstallmentTermEnum.YEARLY]: 'Yearly',
};

const toInstallmentTermLabel = (term: InstallmentTermEnum) => installmentTermLabels[term];

const installmentTermOptions = Object.values(InstallmentTermEnum).map((value) => ({
  value,
  label: toInstallmentTermLabel(value),
}));

export {
  InstallmentTermEnum,
  installmentTermLabels,
  installmentTermOptions,
  toInstallmentTermLabel,
};
