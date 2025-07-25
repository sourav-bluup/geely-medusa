import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Heading, Input, Text, toast } from '@medusajs/ui';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  VehicleProductSchema,
  VehicleProductSchemaType,
} from '../../../../../../api/admin/vehicle/product/validators';
import {
  RouteFocusModal,
  useRouteModal,
} from '../../../../../components/common/modals/route-focus-modal';
import Field from '../../../../../components/ui/field';
import SelectField from '../../../../../components/ui/select';
import { useVehicleProductCreate } from '../../../../../hooks/api/vehicle-products';
import VehicleProductTrimTable from './vehicle-product-trim-table';
import { useGetVehicles } from '../../../../../hooks/use-vehicle-model';

const listingTypeOptions = [
  { value: 'new', label: 'New' },
  { value: 'certified', label: 'Certified' },
];

export const VehicleProductForm = () => {
  const { handleSuccess } = useRouteModal();

  const { data: models } = useGetVehicles();

  const trimOptions = useMemo(() => {
    return models?.map((model) => ({
      value: model.id,
      label: model.title,
    }));
  }, [models]);

  const { mutateAsync } = useVehicleProductCreate();

  const form = useForm<VehicleProductSchemaType>({
    defaultValues: {
      model_id: '',
      listing_type: 'certified',
      title: '',
      options: [],
      variants: [],
    },
    resolver: zodResolver(VehicleProductSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await mutateAsync(data, {
        onSuccess: (response) => {
          const product = response?.product[0];
          handleSuccess(`../../${product?.id}`);
          toast.success(`Vehicle product ${product?.title} created successfully`);
        },
      });
    } catch (error) {
      // @ts-ignore
      toast.error(`Error creating vehicle product: ${error?.message}`);
    }
  });

  const modelId: string = form.watch('model_id');

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" variant="primary" type="submit" isLoading={false}>
              Create
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col items-center p-16">
          <div className="flex w-full flex-col gap-y-8">
            <div>
              <Heading>Create Vehicle Product</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                Create a new model
              </Text>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <Field name="title" label="Title" required className="md:col-span-2">
                {(field) => <Input placeholder="Geely" {...field} />}
              </Field>
              <Field name="handle" label="Handle" required className="md:col-span-2">
                {(field) => <Input placeholder="hello-world" {...field} />}
              </Field>
              <Field name="model_id" label="Model" required>
                {(field) => (
                  <SelectField
                    options={trimOptions || []}
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Model"
                  />
                )}
              </Field>
              <Field name="listing_type" label="Listing Type" required>
                {(field) => (
                  <SelectField
                    options={listingTypeOptions}
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Listing Type"
                  />
                )}
              </Field>
              <div className="col-span-full">
                {modelId && <VehicleProductTrimTable modelId={modelId} />}
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  );
};
