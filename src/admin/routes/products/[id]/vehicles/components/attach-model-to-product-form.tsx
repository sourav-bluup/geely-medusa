import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Heading, Input, Switch, toast } from '@medusajs/ui';
import { useForm } from 'react-hook-form';
import Field from '../../../../../components/ui/field';
import SelectField from '../../../../../components/ui/select';

import { useMemo } from 'react';
import {
  LinkModelToProductInput,
  LinkModelToProductType,
} from '../../../../../../api/admin/vehicle/model/validators';
import {
  InstallmentTermEnum,
  installmentTermOptions,
} from '../../../../../../modules/vehicle/enums';
import { RouteDrawer } from '../../../../../components/common/modals/route-focus-modal/route-drawer';
import { useRouteModal } from '../../../../../components/common/modals/route-focus-modal';
import { PercentageInput } from '../../../../../components/inputs';
import { useUpdateVehicleModelProduct } from '../../../../../hooks/api/products';
import { ProductModelDto } from '../../../../../hooks/use-product/types';
import { useGetVehicles } from '../../../../../hooks/use-vehicle-model';

type Props = {
  product_id: string;
  data?: ProductModelDto;
};

export const AttachModelToProductForm = ({ product_id, data }: Props) => {
  const { handleSuccess } = useRouteModal();

  const { data: models } = useGetVehicles();

  const isEdit = Boolean(data?.id);

  const { mutateAsync, isPending } = useUpdateVehicleModelProduct();

  const form = useForm<LinkModelToProductType>({
    defaultValues: {
      product_id,
      data: {
        has_installment: data?.has_installment || false,
        installment_amount: data?.installment_amount
          ? {
              value: data.installment_amount.toString(),
              float: parseFloat(data.installment_amount.toString()),
            }
          : { value: '', float: 0 },
        installment_term: data?.installment_term || InstallmentTermEnum.MONTHLY,
        installment_description: data?.installment_description || '',
        has_test_drive: data?.has_test_drive || false,
        test_drive_description: data?.test_drive_description || '',
        has_lease: data?.has_lease || false,
        lease_amount: data?.lease_amount
          ? { value: data.lease_amount.toString(), float: parseFloat(data.lease_amount.toString()) }
          : { value: '', float: 0 },
        lease_term: data?.lease_term || InstallmentTermEnum.MONTHLY,
        lease_description: data?.lease_description || '',
      },
      model_id: data?.vehicle_model_id || '',
    },
    resolver: zodResolver(LinkModelToProductInput),
  });

  const options = useMemo(() => {
    return (
      models?.map((model) => ({
        value: model.id,
        label: model.title,
      })) || []
    );
  }, [models]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        handleSuccess();
        toast.success('Model updated', {
          description: 'Vehicle model has been successfully updated',
        });
      },
    });
  });

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
        <RouteDrawer.Body className="">
          <div className="flex flex-col gap-y-6">
            {!isEdit ? (
              <Field name="model_id" label="Model" required>
                {(field) => (
                  <SelectField
                    disabled={Boolean(data?.id)}
                    options={options}
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Model"
                  />
                )}
              </Field>
            ) : (
              <Heading>Model: {data?.title}</Heading>
            )}
            <div className="border-t pt-4">
              <Heading className="mb-4">Installment Details</Heading>
              <Field name="data.has_installment" label="Has Installment">
                {(field) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
              </Field>
              {form.watch('data.has_installment') && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field name="data.installment_amount" label="Installment Amount">
                    {({ value, onChange, ...field }) => (
                      <PercentageInput
                        maxLength={20}
                        onValueChange={(value, _name, values) =>
                          onChange({
                            value: value,
                            float: values?.float,
                          })
                        }
                        {...field}
                        value={value?.value}
                        prefix="AED"
                        placeholder="Enter amount"
                      />
                    )}
                  </Field>
                  <Field name="data.installment_term" label="Installment Term">
                    {(field) => (
                      <SelectField
                        {...field}
                        options={installmentTermOptions}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      />
                    )}
                  </Field>
                  <Field
                    name="data.installment_description"
                    label="Description"
                    className="col-span-full"
                  >
                    {(field) => <Input placeholder="Enter description" {...field} />}
                  </Field>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <Heading className="mb-4">Test Drive Details</Heading>
              <Field name="data.has_test_drive" label="Has Test Drive">
                {(field) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
              </Field>
              {form.watch('data.has_test_drive') && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    name="data.test_drive_description"
                    label="Description"
                    className="col-span-full"
                  >
                    {(field) => <Input placeholder="Enter description" {...field} />}
                  </Field>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <Heading className="mb-4">Leasing Details</Heading>
              <Field name="data.has_lease" label="Has Lease">
                {(field) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
              </Field>
              {form.watch('data.has_lease') && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field name="data.lease_amount" label="Lease Amount">
                    {({ value, onChange, ...field }) => (
                      <PercentageInput
                        maxLength={20}
                        value={value?.value}
                        onValueChange={(value, _name, values) =>
                          onChange({
                            value: value,
                            float: values?.float,
                          })
                        }
                        prefix="AED"
                        placeholder="Enter amount"
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="data.lease_term" label="Lease Term">
                    {(field) => (
                      <SelectField
                        {...field}
                        options={installmentTermOptions}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      />
                    )}
                  </Field>
                  <Field
                    name="data.lease_description"
                    label="Description"
                    className="col-span-full"
                  >
                    {(field) => <Input placeholder="Enter description" {...field} />}
                  </Field>
                </div>
              )}
            </div>
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
