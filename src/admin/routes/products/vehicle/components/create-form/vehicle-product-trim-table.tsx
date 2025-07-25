import { Alert, Heading } from '@medusajs/ui';
import * as Accordion from '@radix-ui/react-accordion';
import { FC, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { generateOptimizedVariations } from '../../utils/variant-generation';
import { ColorInputs } from './color-inputs';
import { VariantGroup } from './variant-group';

import { VehicleProductSchemaType } from '../../../../../../api/admin/vehicle/product/validators';
import { useTrimList } from '../../../../../hooks/api/trim';
import { useCreateFormContext } from './create-form-provider';
type Props = {
  modelId: string;
};

const VehicleProductTrimTable: FC<Props> = ({ modelId }) => {
  const { trims } = useTrimList(modelId);
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<VehicleProductSchemaType>();

  const { isReady } = useCreateFormContext();

  const bodyColor = watch('bodyColor');
  const interiorColor = watch('interiorColor');
  const title = watch('title');
  const variants = useMemo(
    () =>
      generateOptimizedVariations([
        {
          title: 'Trim',
          values: trims?.map((trim) => ({ title: trim.title, id: trim.id })) || [],
        },
        {
          title: 'Body Color',
          values: bodyColor?.map((color) => ({ title: color, id: color })) || [],
        },
        {
          title: 'Interior Color',
          values: interiorColor?.map((color) => ({ title: color, id: color })) || [],
        },
      ]),
    [bodyColor, interiorColor, trims],
  );

  useEffect(() => {
    setValue('options', [
      { title: 'Trim', values: trims?.map((option) => option.title) || [] },
      { title: 'Body Color', values: bodyColor || [] },
      { title: 'Interior Color', values: interiorColor || [] },
    ]);
  }, [setValue, trims, bodyColor, interiorColor]);

  return (
    <div className="space-y-4">
      <ColorInputs />
      {errors?.variants?.root?.message && (
        <Alert variant="error">{errors.variants.root.message as string}</Alert>
      )}
      {isReady && (
        <div className="space-y-1">
          <Heading level="h2">Trims</Heading>
          <Accordion.Root
            type="multiple"
            className="space-y-1"
            defaultValue={variants?.map((variant) => variant.title) || []}
          >
            {variants?.map((variant, index) => (
              <VariantGroup key={index} variant={variant} title={title} index={index} />
            ))}
          </Accordion.Root>
        </div>
      )}
    </div>
  );
};

export default VehicleProductTrimTable;
