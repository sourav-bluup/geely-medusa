import { Input, Switch, Tooltip } from '@medusajs/ui';
import { FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { VehicleProductSchemaType } from '../../../../../../api/admin/vehicle/product/validators';
import { cn } from '../../../../../../modules/vehicle/lib/utils';
import { default as Field } from '../../../../../components/ui/field';
import { TabInput, TabInputItem } from './tab-input';
import { Variant } from './types';

type Props = {
  children?: React.ReactNode;
  className?: string;
  name: `variants.${number}`;
  item?: Variant;
  stockItems?: TabInputItem[];
  currencyItems?: TabInputItem[];
  index: number;
};

export const VariantItem: FC<Props> = ({
  children,
  className,
  name,
  item,
  stockItems,
  currencyItems,
  index,
}) => {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<VehicleProductSchemaType>();

  const isEnabled = Boolean(watch(`${name}.is_enabled`));
  const isCertified = watch('listing_type') === 'certified';

  const title = [item?.trim?.title, item?.body_color?.title, item?.interior_color?.title]
    .filter(Boolean)
    .join(' / ');

  const error = errors?.variants?.[index]?.is_enabled;

  useEffect(() => {
    if (item) {
      setValue(`${name}.options`, {
        Trim: item.trim?.title,
        'Body Color': item.body_color?.title,
        'Interior Color': item.interior_color?.title,
      });
      setValue(`${name}.title`, title);
      setValue(`${name}.trim_id`, item.trim?.id);
    }
  }, [item, name, setValue, title]);

  return (
    <div className={cn('grid grid-cols-[30%_1fr_1rem] px-4 py-2', className)}>
      {error && <div className="text-ui-fg-error col-span-full text-xs">{error.message}</div>}
      <div className="flex w-full items-center gap-4">
        <Tooltip content="Enable/disable this variant">
          <Field name={`${name}.is_enabled`} showError={false}>
            {({ onChange, onBlur, ...field }) => (
              <Switch
                {...field}
                checked={isEnabled ?? false}
                size="small"
                className="relative z-10"
                onCheckedChange={onChange}
                onBlur={onBlur}
              />
            )}
          </Field>
        </Tooltip>
        {title && <span className="text-ui-fg-subtle text-sm">{title}</span>}
        {children}
      </div>
      <div
        className={cn('relative z-10 flex items-end justify-end gap-4 self-end', {
          'pointer-events-none opacity-20': !isEnabled,
        })}
      >
        <Field name={`${name}.stock`}>
          {(field) => <TabInput items={stockItems} field={field} />}
        </Field>
        <Field name={`${name}.prices`}>
          {(field) => <TabInput items={currencyItems} field={field} />}
        </Field>

        <Field name={`${name}.sku`}>
          {(field) => (
            <Input
              placeholder="SKU"
              size="small"
              className="min-w-10 max-w-40"
              {...field}
              onChange={(e) => {
                field.onChange(e);
                trigger('variants');
              }}
            />
          )}
        </Field>
        <Field name={`${name}.year`}>
          {(field) => (
            <Input
              size="small"
              type="number"
              placeholder="Year"
              className="min-w-10 max-w-20"
              {...field}
            />
          )}
        </Field>
        {isCertified && (
          <Field name={`${name}.mileage`}>
            {(field) => (
              <Input
                placeholder="Mileage (km)"
                size="small"
                className="min-w-10 max-w-20"
                type="number"
                {...field}
              />
            )}
          </Field>
        )}
      </div>
      <div></div>
    </div>
  );
};
