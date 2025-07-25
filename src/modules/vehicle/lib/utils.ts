import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ProductTypes } from '@medusajs/types/dist/bundles';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getVariantPermutations = (
  data: ProductTypes.CreateProductOptionDTO[],
): Record<string, string>[] => {
  if (data.length === 0) {
    return [];
  }

  if (data.length === 1) {
    return data[0].values.map((value) => ({ [data[0].title]: value }));
  }

  const toProcess = data[0];
  const rest = data.slice(1);

  return toProcess.values.flatMap((value) => {
    return getVariantPermutations(rest).map((permutation) => {
      return {
        [toProcess.title]: value,
        ...permutation,
      };
    });
  });
};

export const getVariantName = (options: Record<string, string>) => {
  return Object.values(options).join(' / ');
};

export const generateVariants = (
  options: ProductTypes.CreateProductOptionDTO[],
): ProductTypes.CreateProductVariantDTO[] => {
  const permutations = getVariantPermutations(options);
  return permutations.map((optionSet) => ({
    title: getVariantName(optionSet),
    options: optionSet,
  }));
};

export const valueOrNull = (value: string | undefined | number) => {
  return value || null;
};

export const valueOrDefault = (
  value: string | undefined | number,
  defaultValue: string | number,
) => {
  return value || defaultValue;
};

export const valueOrEmpty = (value: string | undefined) => {
  return value || '';
};
