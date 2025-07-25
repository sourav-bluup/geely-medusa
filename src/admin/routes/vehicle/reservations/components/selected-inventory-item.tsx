import { XMark } from '@medusajs/icons';
import { Badge, IconButton } from '@medusajs/ui';
import { ExtendedInventoryItem } from '../new/types';

interface SelectedInventoryItemProps {
  item: ExtendedInventoryItem;
  onRemove: () => void;
}

export const SelectedInventoryItem = ({ item, onRemove }: SelectedInventoryItemProps) => {
  return (
    <div className="bg-ui-bg-subtle flex flex-col gap-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <Badge className="flex items-center gap-x-2">
          <span>{item.sku}</span>
          <span className="text-ui-fg-subtle">({item.title})</span>
        </Badge>
        <IconButton onClick={onRemove}>
          <XMark className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
};
