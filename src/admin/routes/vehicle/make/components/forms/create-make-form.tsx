import { zodResolver } from '@hookform/resolvers/zod';
import { Input, toast } from '@medusajs/ui';
import { useForm } from 'react-hook-form';
import {
  VehicleMakeInput,
  VehicleMakeSchema,
} from '../../../../../../api/admin/vehicle/make/validators';
import { useRouteModal } from '../../../../../components/common/modals/route-focus-modal/use-route-modal';
import { DrawerFormLayout } from '../../../../../components/layouts';
import Field from '../../../../../components/ui/field';
import { useCreateVehicleMake } from '../../../../../hooks/api/make';

export const CreateMakeForm = () => {
  const { handleSuccess } = useRouteModal();

  const { mutateAsync, isPending } = useCreateVehicleMake();
  const form = useForm<VehicleMakeInput>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(VehicleMakeSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: () => {
        handleSuccess();
        toast.success('Make created', {
          description: `Make ${data.name} created successfully`,
        });
      },
    });
  });

  return (
    <DrawerFormLayout<VehicleMakeInput>
      form={form}
      isLoading={isPending}
      onSubmit={handleSubmit}
      title="Create Make"
      description="Create a new make for your vehicle"
    >
      <Field name="name" label="Title" required>
        {(field) => <Input placeholder="Geely" {...field} />}
      </Field>
    </DrawerFormLayout>
  );
};
