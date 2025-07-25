import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@medusajs/ui';
import { useForm } from 'react-hook-form';
import { TrimInput, TrimSchema } from '../../../../../../../api/admin/vehicle/trim/validators';
import { VehicleTrimDto } from '../../../../../../../modules/vehicle/types/vehicle-trim.type';
import { useRouteModal } from '../../../../../../components/common/modals/route-focus-modal';
import { DrawerFormLayout } from '../../../../../../components/layouts';
import Field from '../../../../../../components/ui/field';
import { useCreateTrim, useUpdateTrim } from '../../../../../../hooks/api/trim';

type TrimFormProps = {
  trim?: VehicleTrimDto;
  model_id: string;
};

export const TrimForm = ({ trim, model_id }: TrimFormProps) => {
  const { mutate: createTrim, isPending: isCreating } = useCreateTrim();
  const { mutate: updateTrim, isPending: isUpdating } = useUpdateTrim();

  const isEdit = !!trim;

  const { handleSuccess } = useRouteModal();
  const form = useForm<TrimInput>({
    resolver: zodResolver(TrimSchema),
    defaultValues: {
      title: trim?.title || '',
      sort_rank: trim?.sort_rank || 0,
      is_default: trim?.is_default || false,
      model_id,
      ...trim,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: TrimInput) => {
    const payload = { ...data, model_id };

    if (trim) {
      updateTrim(
        { id: trim.id, ...payload },
        {
          onSuccess: () => handleSuccess(),
        },
      );
    } else {
      createTrim(payload, {
        onSuccess: () => handleSuccess(),
      });
    }
  };

  return (
    <DrawerFormLayout
      form={form}
      isLoading={isCreating || isUpdating}
      onSubmit={handleSubmit(onSubmit)}
      title={isEdit ? 'Edit Trim' : 'Create Trim'}
      description={isEdit ? 'Edit the details of this trim' : 'Create a new trim'}
    >
      <div className="flex flex-col gap-y-4">
        <Field name="title" label="Title" required className="col-span-2">
          {(field) => <Input placeholder="Tugella, 911, etc" {...field} />}
        </Field>
        <Field name="sort_rank" label="Sort Rank" className="col-span-2">
          {(field) => <Input type="number" {...field} />}
        </Field>
      </div>
    </DrawerFormLayout>
  );
};
