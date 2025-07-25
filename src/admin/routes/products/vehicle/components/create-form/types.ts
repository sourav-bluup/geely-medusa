type VariantValue = {
  title: string;
  id: string;
};

type VariantField = {
  title: string;
  values: VariantValue[];
};

type Variant = {
  enabled: boolean;
  trim: VariantValue;
  body_color: VariantValue;
  interior_color: VariantValue;
};

type GroupedVariant = {
  title: string;
  id: string;
  variants: Variant[];
};

export type { GroupedVariant, Variant, VariantField, VariantValue };
