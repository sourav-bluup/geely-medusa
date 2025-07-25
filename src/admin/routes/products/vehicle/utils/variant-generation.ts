import { GroupedVariant, VariantField, VariantValue } from '../components/create-form/types';

export const generateOptimizedVariations = (data: VariantField[]): GroupedVariant[] => {
  // Filter out fields that don't have values or have empty values
  const fields = data.filter((field) => field.values && field.values.length > 0);

  const combine = (
    index: number,
    current: Record<string, VariantValue>,
  ): Record<string, VariantValue>[] => {
    if (index === fields.length) {
      return [current];
    }

    const field = fields[index];
    if (!field.values || field.values.length === 0) {
      return [];
    }

    // FlatMap with less data duplication to ensure O(n) scaling
    return field.values.flatMap((value: VariantValue) =>
      combine(index + 1, { ...current, [field.title.toLowerCase().replace(' ', '_')]: value }),
    );
  };

  // Grouping by Trim in an optimized way to avoid additional iteration
  const variationsByTrim = fields
    .find((field) => field.title === 'Trim')
    ?.values.map((trim: VariantValue) => {
      const variants = combine(1, { trim }); // Start combination from 1 to skip Trim field in recursion
      return {
        title: trim.title,
        id: trim.id,
        variants: variants.map((variant) => ({
          enabled: true,
          trim: variant.trim,
          body_color: variant.body_color,
          interior_color: variant.interior_color,
        })),
      } as GroupedVariant;
    });

  return variationsByTrim || [];
};
