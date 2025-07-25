import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea } from '@medusajs/ui';
import { useForm } from 'react-hook-form';
import { useRouteModal } from '../../../../../../../components/common/modals/route-focus-modal';
import { RouteDrawer } from '../../../../../../../components/common/modals/route-focus-modal/route-drawer';
import Field from '../../../../../../../components/ui/field';
import SelectField from '../../../../../../../components/ui/select';
import { useUpdateVehicleVariantMedia } from '../../../../../../../hooks/api/variant-media';
import {
  EditVehicleVariantMediaInput,
  EditVehicleVariantMediaSchema,
  MediaType,
  mediaTypeOptions,
  VehicleVariantMediaDTO,
} from '../../../../../../../../modules/vehicle/types/vehicle-variant-media-type';

type Props = {
  media?: VehicleVariantMediaDTO;
};

const EditVariantMediaForm = ({ media }: Props) => {
  const { handleSuccess } = useRouteModal();

  const form = useForm<EditVehicleVariantMediaInput>({
    defaultValues: {
      title: media?.title ?? '',
      description: media?.description ?? '',
      media_type: media?.media_type ?? MediaType.OTHER,
    },
    resolver: zodResolver(EditVehicleVariantMediaSchema),
  });

  const { mutateAsync, isPending } = useUpdateVehicleVariantMedia(media?.id ?? '');

  const handleSubmit = form.handleSubmit(async (media) => {
    await mutateAsync(media, {
      onSuccess: () => {
        handleSuccess();
      },
    });
  });
  
  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-y-auto">
        <RouteDrawer.Body className="flex flex-1 flex-col space-y-4">
          <div className="flex flex-col gap-y-2">
            <Field name="title">{(field) => <Input {...field} placeholder="Title" />}</Field>
            <Field name="description">
              {(field) => <Textarea {...field} placeholder="Description" />}
            </Field>
            <Field name="media_type" required>
              {(field) => (
                <SelectField
                  options={mediaTypeOptions}
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Media Type"
                />
              )}
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

export default EditVariantMediaForm;
