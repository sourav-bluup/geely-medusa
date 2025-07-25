import { zodResolver } from '@hookform/resolvers/zod';
import { HttpTypes } from '@medusajs/framework/types';
import { Button } from '@medusajs/ui';
import { useFieldArray, useForm } from 'react-hook-form';
import { UploadMediaFormItem } from '../../../../../../../components/common';
import { useRouteModal } from '../../../../../../../components/common/modals/route-focus-modal';
import { RouteDrawer } from '../../../../../../../components/common/modals/route-focus-modal/route-drawer';
import { useCreateVehicleMedia as useCreateVehicleProductVariantMedia } from '../../../../../../../hooks/api/variant-media';
import { sdk } from '../../../../../../../lib/skd';

import MediaGrid from '../media-grid';
import {
  VehicleVariantMediaInput,
  VehicleVariantMediaSchema,
} from '../../../../../../../../modules/vehicle/types/vehicle-variant-media-type';

type Props = {
  variantId: string;
};

const CreateVariantMediaForm = ({ variantId }: Props) => {
  const { handleSuccess } = useRouteModal();

  const form = useForm<VehicleVariantMediaInput>({
    defaultValues: {
      media: [],
    },
    resolver: zodResolver(VehicleVariantMediaSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'media',
    control: form.control,
    keyName: 'field_id',
  });

  const media = form.watch('media');

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...media[index],
      variant_id: variantId,
    };
  });

  const { mutateAsync: createVehicleProductVariantMedia, isPending } =
    useCreateVehicleProductVariantMedia();

  const handleSubmit = form.handleSubmit(async ({ media }) => {
    const filesToUpload = media.map((m, i) => ({ file: m.file, index: i })).filter((m) => !!m.file);
    let uploaded: HttpTypes.AdminFile[] = [];

    if (filesToUpload.length) {
      const { files: uploads } = await sdk.admin.upload
        .create({ files: filesToUpload.map((m) => m.file!) })
        .catch(() => {
          form.setError('media', {
            type: 'invalid_file',
            message: 'Failed to upload',
          });
          return { files: [] };
        });
      uploaded = uploads;
    }

    const withUpdatedUrls: VehicleVariantMediaInput['media'] = media.map((entry, i) => {
      const toUploadIndex = filesToUpload.findIndex((m) => m.index === i);
      if (toUploadIndex > -1) {
        const file = uploaded[toUploadIndex];
        return {
          url: file?.url,
          file: undefined,
          variant_id: variantId,
          file_id: file?.id,
          title: entry.title,
          mime_type: entry.mime_type,
          media_type: entry.media_type,
          description: entry.description,
        };
      }
      return entry;
    });

    await createVehicleProductVariantMedia(
      {
        media: withUpdatedUrls,
      },
      {
        onSuccess: () => {
          handleSuccess();
        },
      },
    );
  });

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-y-auto">
        <RouteDrawer.Body className="flex flex-1 flex-col space-y-4">
          <UploadMediaFormItem form={form} append={append} />
          <MediaGrid media={controlledFields} remove={remove} />
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

export default CreateVariantMediaForm;
