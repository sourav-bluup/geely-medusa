import { Pencil, Plus, Trash } from '@medusajs/icons';
import { toast, usePrompt } from '@medusajs/ui';
import { ActionMenu } from '../../../components/common';
import { useUnlinkVariant } from '../../../hooks/api/link-variant';
import { VehicleProductTrimVariantsDto } from '../../../hooks/use-product/types';
type VariantActionsProps = {
  variant: VehicleProductTrimVariantsDto;
  modelId?: string;
};

const VariantActions = ({ variant, modelId }: VariantActionsProps) => {
  const prompt = usePrompt();
  const { mutate: unlinkVariant } = useUnlinkVariant();

  const handleUnlink = async () => {
    const confirmed = await prompt({
      title: 'Unlink Variant',
      description: 'Are you sure you want to unlink this variant from the trim?',
    });

    if (confirmed) {
      await unlinkVariant(
        {
          trim_id: variant.vehicle_trim?.id,
          variant_id: variant.id,
        },
        {
          onSuccess: () => toast.success('Variant unlinked from trim'),
        },
      );
    }
  };

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            ...(!variant.vehicle_trim && modelId
              ? [
                  {
                    icon: <Plus />,
                    label: 'Attach',
                    to: `vehicles/model/${modelId}/variant/attach?variant_id=${variant?.id}`,
                  },
                ]
              : []),
            ...(variant.vehicle_trim
              ? [
                  {
                    icon: <Pencil />,
                    label: 'Edit',
                    to: `vehicles/variant/${variant.id}`,
                  },
                  {
                    icon: <Trash />,
                    label: 'Unlink',
                    onClick: handleUnlink,
                  },
                ]
              : []),
          ],
        },
      ]}
    />
  );
};

export default VariantActions;
