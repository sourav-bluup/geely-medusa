import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Heading, Input, Text } from '@medusajs/ui';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  VehicleModelInput,
  vehicleModelSchema,
} from '../../../../../../modules/vehicle/schemas/model.schemas';
import { VehicleModelDto } from '../../../../../../modules/vehicle/types/vehicle-model.type';
import {
  RouteFocusModal,
  useRouteModal,
} from '../../../../../components/common/modals/route-focus-modal';
import { ChipInput } from '../../../../../components/inputs';
import Field from '../../../../../components/ui/field';
import SelectField from '../../../../../components/ui/select';
import { useVehicleMakeList } from '../../../../../hooks/api/make';
import useGetCategoryOptions from '../../../../../hooks/use-category';
import { CATEGORIES } from '../../../../../../workflows/vehicle/constants';
import {
  useCreateVehicleModel,
  useUpdateVehicleModel,
} from '../../../../../hooks/use-vehicle-model';

type Props = {
  model_id?: string;
  data?: VehicleModelDto;
};

export const ModelForm = ({ model_id, data }: Props) => {
  const { handleSuccess } = useRouteModal();

  const engineOptions = useGetCategoryOptions(CATEGORIES.ENGINE_TYPE.handle);
  const transmissionOptions = useGetCategoryOptions(CATEGORIES.TRANSMISSION.handle);
  const fuelTypeOptions = useGetCategoryOptions(CATEGORIES.FUEL_TYPE.handle);
  const bodyTypeOptions = useGetCategoryOptions(CATEGORIES.BODY_TYPE.handle);
  const driveTypeOptions = useGetCategoryOptions(CATEGORIES.DRIVE_TYPE.handle);
  const categoryOptions = useGetCategoryOptions(CATEGORIES.MODEL.handle);
  const yearOptions = useGetCategoryOptions(CATEGORIES.YEAR.handle);
  const { trigger: createTrigger, isSuccess: createIsSuccess } = useCreateVehicleModel();
  const { trigger: updateTrigger, isSuccess: updateIsSuccess } = useUpdateVehicleModel(
    model_id as string,
  );
  const { makes } = useVehicleMakeList();

  const action = data ? 'update' : 'create';

  const isSuccess = createIsSuccess || updateIsSuccess;
  const trigger = data ? updateTrigger : createTrigger;

  const makeOptions = useMemo(() => {
    return (
      makes?.map((make) => ({
        value: make.id,
        label: make.name,
      })) || []
    );
  }, [makes]);

  const form = useForm<VehicleModelInput>({
    defaultValues: {
      title: data?.title || '',
      product_category_id: '',
      introduction_year: data?.introduction_year || '',
      discontinued_year: data?.discontinued_year || 0,
      trims: [],
      make_id: data?.make?.id || '',
      engine: data?.engine || '',
      transmission: data?.transmission || '',
      body_type: data?.body_type || '',
      fuel_type: data?.fuel_type || '',
      drive_type: data?.drive_type || '',
      door_count: data?.door_count || 4,
      seat_count: data?.seat_count || 5,
      action,
    },
    resolver: zodResolver(vehicleModelSchema),
  });

  const handleSubmit = form.handleSubmit(async ({ product_category_id, ...rest }) => {
    // Only include product_category_id in the update if it wasn't previously set
    // This prevents overwriting an existing product_category_id with an empty value
    const dataToSubmit =
      action === 'update' && !data?.product_category_id && product_category_id
        ? { ...rest, product_category_id }
        : rest;
    await trigger(dataToSubmit);
  });

  useEffect(() => {
    if (isSuccess) {
      handleSuccess();
    }
  }, [handleSuccess, isSuccess]);

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="h-full">
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" variant="primary" type="submit" isLoading={false}>
              Save
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full flex-1 flex-grow flex-col items-center overflow-y-auto p-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>Create Model</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                Create a new model
              </Text>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Display category selection field only when updating an existing model with a category */}
              {action === 'update' && !data?.product_category_id && (
                <Field name="product_category_id" label="Category" required className="col-span-2">
                  {(field) => (
                    <SelectField
                      {...field}
                      options={categoryOptions.options || []}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select a category"
                    />
                  )}
                </Field>
              )}
              <Field name="title" label="Title" required className="col-span-2">
                {(field) => <Input placeholder="Tugella, 911, etc" {...field} />}
              </Field>
              <Field name="make_id" label="Make" required className="col-span-1">
                {(field) => (
                  <SelectField
                    {...field}
                    options={makeOptions}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Toyota, Ford, etc"
                  />
                )}
              </Field>
              <Field name="introduction_year" label="Year" required>
                {(field) => (
                  <SelectField
                    {...field}
                    options={yearOptions.options || []}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  />
                )}
              </Field>

              <Field name="engine" label="Engine" required>
                {(field) => (
                  <SelectField
                    {...field}
                    options={engineOptions.options || []}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  />
                )}
              </Field>

              <Field name="transmission" label="Transmission" required>
                {(field) => (
                  <SelectField
                    {...field}
                    options={transmissionOptions.options || []}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  />
                )}
              </Field>
              <Field name="fuel_type" label="Fuel Type" required>
                {(field) => (
                  <SelectField
                    {...field}
                    options={fuelTypeOptions.options || []}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Petrol, Diesel, etc"
                  />
                )}
              </Field>
              <Field name="body_type" label="Body Type" required>
                {(field) => (
                  <SelectField
                    {...field}
                    options={bodyTypeOptions.options || []}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="SUV, Sedan, etc"
                  />
                )}
              </Field>
              <Field name="drive_type" label="Drive Type" required>
                {(field) => (
                  <SelectField
                    {...field}
                    options={driveTypeOptions.options || []}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="AWD, RWD, etc"
                  />
                )}
              </Field>
              <Field name="seat_count" label="Seat Count" required>
                {(field) => <Input placeholder="4" type="number" {...field} />}
              </Field>
              <Field name="door_count" label="Door Count" required>
                {(field) => <Input placeholder="4" type="number" {...field} />}
              </Field>
              <Field name="discontinued_year" label="Discontinued Year">
                {(field) => <Input placeholder="2025" type="number" {...field} />}
              </Field>
              {action === 'create' && (
                <Field name="trims" label="Trim" required className="col-span-full">
                  {(field) => <ChipInput placeholder="GTS, Turbo, etc" {...field} />}
                </Field>
              )}
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  );
};
