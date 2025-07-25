import { zodResolver } from '@hookform/resolvers/zod';
import { Input, toast } from '@medusajs/ui';
import { useForm } from 'react-hook-form';
import {
  VehicleMakeInput,
  VehicleMakeSchema,
} from '../../../../../../api/admin/vehicle/make/validators';
import { VehicleMakeDto } from '../../../../../../modules/vehicle/types/vehicle-make.type';
import { useRouteModal } from '../../../../../components/common/modals/route-focus-modal/use-route-modal';
import { DrawerFormLayout } from '../../../../../components/layouts';
import Field from '../../../../../components/ui/field';
import { useUpdateVehicleMake } from '../../../../../hooks/api/make';

type Props = {
  make: VehicleMakeDto;
};
export const EditMakeForm = ({ make }: Props) => {
  const { handleSuccess } = useRouteModal();
  const { mutateAsync, isPending } = useUpdateVehicleMake(make.id);

  const form = useForm<VehicleMakeInput>({
    defaultValues: {
      name: make.name,
    },
    resolver: zodResolver(VehicleMakeSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: ({ make }) => {
        handleSuccess();
        toast.success(`Updated: ${make.name}`, {
          description: `The vehicle make "${make.name}" has been successfully updated in the system.`,
        });
      },
    });
  });

  return (
    <DrawerFormLayout<VehicleMakeInput>
      form={form}
      isLoading={isPending}
      onSubmit={handleSubmit}
      title={`Edit ${make.name}`}
      description={`You can edit the make of the vehicle here.`}
    >
      <Field name="name" label="Title" required>
        {(field) => <Input placeholder="Geely" {...field} />}
      </Field>
    </DrawerFormLayout>
  );
};
