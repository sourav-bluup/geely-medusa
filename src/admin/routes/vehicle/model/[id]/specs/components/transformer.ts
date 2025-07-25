import { SpecificationCategoryEnum } from '../../../../../../../modules/vehicle/enums/specification-category.enum';
import { VehicleTrimDto } from '../../../../../../../modules/vehicle/types/vehicle-trim.type';
import { ModelSpecificationDto } from '../../../../../../../modules/vehicle/types/trim-specification.types';
import { SpecificationInput } from './table/types';

export function mapSpecificationsToTableData({
  specifications,
  trims,
  defaultGroup,
}: {
  specifications?: ModelSpecificationDto[];
  trims: VehicleTrimDto[];
  defaultGroup: SpecificationCategoryEnum;
}): SpecificationInput {
  // Prepare header values from trims
  const headerValues = trims.map((trim) => ({
    value: trim.id,
  }));

  // Group specifications by group_value
  const groupedSpecifications =
    specifications?.reduce(
      (acc, spec) => {
        if (!acc[spec.group_value]) {
          acc[spec.group_value] = [];
        }
        acc[spec.group_value].push(spec);
        return acc;
      },
      {} as Record<string, ModelSpecificationDto[]>,
    ) ?? {};

  // Map grouped specifications to rows
  const rows = Object.entries(groupedSpecifications).map(([groupValue, specs], index) => {
    const firstSpec = specs[0];
    return {
      group: groupValue, // Header group
      type: firstSpec.type as 'text' | 'boolean' | 'number',
      id: `row-${index}`,
      values: trims.map((trim) => {
        const specForTrim = specs.find((spec) => spec.trim_id === trim.id);
        return {
          value: specForTrim ? specForTrim.value : '',
          id: specForTrim ? specForTrim.id : '',
        };
      }),
      is_active: firstSpec.is_active,
      unit: firstSpec.unit,
      order: firstSpec.order,
    };
  });

  return {
    data: {
      header: {
        group: { value: specifications?.[0]?.group ?? defaultGroup }, // Default category
        values: headerValues,
      },
      rows: rows,
    },
  };
}
