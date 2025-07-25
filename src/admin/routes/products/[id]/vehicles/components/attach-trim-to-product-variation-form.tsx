import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@medusajs/ui';
import { useForm } from 'react-hook-form';
import Field from '../../../../../components/ui/field';
import SelectField from '../../../../../components/ui/select';

import { toast } from '@medusajs/ui';
import { useMemo } from 'react';
import {
  LinkTrimToVariantInput,
  LinkTrimToVariantType,
} from '../../../../../../api/admin/vehicle/trim/validators';
import { useRouteModal } from '../../../../../components/common/modals/route-focus-modal';
import { RouteDrawer } from '../../../../../components/common/modals/route-focus-modal/route-drawer';
import { useLinkVariant } from '../../../../../hooks/api/link-variant';
import { useTrimList } from '../../../../../hooks/api/trim';
import { useGetProductTrimVariants } from '../../../../../hooks/use-product/use-product';
type Props = {
  model_id: string;
  product_id: string;
  variant_id: string;
};

export const AttachTrimToProductVariationForm = ({ model_id, variant_id, product_id }: Props) => {
  const { handleSuccess } = useRouteModal();

  const { data: variants } = useGetProductTrimVariants(product_id);
  const { trims } = useTrimList(model_id);

  const { mutateAsync: trigger, isPending } = useLinkVariant({
    onSuccess: () => {
      handleSuccess();
      toast.success('Trim linked to variant', {
        description: 'Trim has been successfully linked to the variant',
      });
    },
  });

  const form = useForm<LinkTrimToVariantType>({
    defaultValues: {
      variant_id,
      trim_id: '',
      year: 0,
      mileage: 0,
    },
    resolver: zodResolver(LinkTrimToVariantInput),
  });

  const attachedVariants = useMemo(() => {
    return variants
      ?.filter((model) => model?.vehicle_trim)
      .map((model) => ({
        value: model.id,
        label: model.title,
      }));
  }, [variants]);

  const trimOptions = useMemo(() => {
    const attachedVariantIds = attachedVariants?.map((variant) => variant.value);
    return (
      trims
        ?.filter((model) => !attachedVariantIds?.includes(model.id)) // Remove attached variants
        .map((model) => ({
          value: model.id,
          label: model.title,
        })) || []
    );
  }, [trims, attachedVariants]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await trigger({
      ...values,
    });
  });

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
        <RouteDrawer.Body className="">
          <div className="flex flex-col gap-y-6">
            <Field name="trim_id" label="Model trim" required>
              {(field) => (
                <SelectField
                  options={trimOptions}
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Trim"
                />
              )}
            </Field>
            <Field name="year" label="Year" required>
              {(field) => <Input {...field} type="number" placeholder="Year" />}
            </Field>
            <Field name="mileage" label="Mileage" required>
              {(field) => <Input {...field} type="number" placeholder="Mileage" />}
            </Field>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              Save
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  );
};
