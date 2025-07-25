import { PencilSquare, Trash } from '@medusajs/icons';
import { Badge, Text, usePrompt } from '@medusajs/ui';
import { FC } from 'react';
import { ActionMenu } from '../../../../../../components/common';
import {
  useDeleteVehicleVariantMedia,
  useVariantMedias,
} from '../../../../../../hooks/api/variant-media';
import {
  toMediaTypeLabel,
  VehicleVariantMediaDTO,
} from '../../../../../../../modules/vehicle/types/vehicle-variant-media-type';

type MediaActionProps = {
  media: VehicleVariantMediaDTO;
};

const MediaAction: FC<MediaActionProps> = ({ media }) => {
  const prompt = usePrompt();

  const { mutateAsync } = useDeleteVehicleVariantMedia(media.id);

  const handleDelete = async () => {
    const res = await prompt({
      title: 'Delete Media',
      description: `Are you sure you want to delete this media?`,
    });

    if (!res) {
      return;
    }

    await mutateAsync();
  };

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: 'Edit',
              to: `media/${media.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: 'Delete',
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  );
};

type Props = {
  variantId: string;
};

const MediaListSection = ({ variantId }: Props) => {
  const { medias } = useVariantMedias(variantId);

  if (!medias || medias.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <Text>No media found</Text>
      </div>
    );
  }

  return (
    <div className="">
      <div className="divide-y">
        {medias?.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <img src={m.url} alt={m.title} className="h-16 w-16 rounded-md object-cover" />
              <div className="space-y-1">
                <Text weight="plus" size="large">
                  {m.title}
                </Text>
                <Badge size="xsmall" color="green">
                  {toMediaTypeLabel(m.media_type)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MediaAction media={m} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaListSection;
