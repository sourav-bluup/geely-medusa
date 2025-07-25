import { Switch, Text, Tooltip } from '@medusajs/ui';
import * as Accordion from '@radix-ui/react-accordion';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { VehicleProductSchemaType } from '../../../../../../api/admin/vehicle/product/validators';
import { cn } from '../../../../../../modules/vehicle/lib/utils';
import { AllColorLabels, StackedLabels } from '../stack';
import { useCreateFormContext } from './create-form-provider';
import { GroupedVariant } from './types';
import { getColorLabels } from './utils/color-labels';
import { VariantItem } from './variant-item';
type Props = {
  variant: GroupedVariant;
  title: string;
  index: number;
};

export const VariantGroup: FC<Props> = ({ variant, title, index }) => {
  const {
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext<VehicleProductSchemaType>();
  const { stockItems, currencyItems } = useCreateFormContext();

  const allColorLabesl = useMemo<AllColorLabels>(
    () => getColorLabels(variant.variants),
    [variant.variants],
  );

  const watchVariants = watch('variants');
  const isCertified = watch('listing_type') === 'certified';
  const hasErrors = Boolean(errors?.variants?.[index]?.is_enabled);

  const isAnyVariantEnabled = watchVariants
    .filter((v) => v.trim_id === variant.id)
    .some((v) => v.is_enabled);

  const handleToggleVariant = async (variantId: string, checked: boolean) => {
    const variants = watchVariants.map((v) => {
      if (v.trim_id === variantId) {
        return { ...v, is_enabled: checked };
      }
      return v;
    });
    setValue('variants', variants, { shouldValidate: true });
    await trigger('variants');
  };

  return (
    <Accordion.Item
      value={variant.title}
      className={cn(
        'bg-ui-bg-base border-ui-border-base relative overflow-hidden rounded-lg border',
        !isAnyVariantEnabled && 'opacity-40',
      )}
    >
      <Accordion.Header className="text-ui-fg-base bg-ui-bg-field-component-hover dark:bg-ui-bg-field-component-hover-dark">
        <div className="grid grid-cols-[30%_1fr_1rem] px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="relative z-10">
              <Switch
                checked={isAnyVariantEnabled}
                size="small"
                onCheckedChange={(checked) => handleToggleVariant(variant.id, checked)}
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block max-w-20 overflow-hidden text-ellipsis whitespace-nowrap opacity-70">
                {title}
              </span>
              / <span className="font-semibold">{variant.title}</span>
            </div>
            <StackedLabels labels={allColorLabesl} className="relative z-10" />
            {hasErrors && (
              <div className="relative z-10">
                <Tooltip content={errors?.variants?.[index]?.is_enabled?.message as string}>
                  <AlertTriangle className="text-ui-fg-error size-4" />
                </Tooltip>
              </div>
            )}
          </div>
          <div className="mr-2 flex items-end justify-end gap-4 self-end">
            <Text size="xsmall">Stock</Text>
            <Text size="xsmall">Price</Text>
            <Text size="xsmall">SKU</Text>
            <Text size="xsmall">Year</Text>
            {isCertified && <Text size="xsmall">Mileage (km)</Text>}
          </div>
          <Accordion.Trigger className="[&[data-state=open]>svg]:rotate-180">
            <div className="absolute inset-0" />
            <ChevronDown className="mr-3 size-4 shrink-0 transition-transform duration-200" />
          </Accordion.Trigger>
        </div>
      </Accordion.Header>
      <Accordion.Content
        forceMount
        className="divide-ui-border-subtle divide-y data-[state=closed]:hidden"
      >
        {variant?.variants?.map((item, itemIndex) => {
          const variantIndex = index * variant.variants.length + itemIndex;
          return (
            <VariantItem
              stockItems={stockItems}
              currencyItems={currencyItems}
              item={item}
              index={variantIndex}
              name={`variants.${variantIndex}`}
              key={itemIndex}
            />
          );
        })}
      </Accordion.Content>
    </Accordion.Item>
  );
};
