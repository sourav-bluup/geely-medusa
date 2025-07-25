import { XMark } from '@medusajs/icons';
import {
  AdminInventoryItem,
  AdminInventoryItemListResponse,
  AdminInventoryLevel,
} from '@medusajs/types';
import { Badge, Input } from '@medusajs/ui';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { sdk } from '../../../../lib/skd';
import { useDebounce } from '../hooks/use-debounce';
import { ExtendedInventoryItem } from '../new/types';

interface InventorySearchProps {
  onSelect: (item: ExtendedInventoryItem) => void;
  selectedItem?: ExtendedInventoryItem;
  onRemove?: () => void;
}

export const InventorySearch = ({ onSelect, selectedItem, onRemove }: InventorySearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay

  const { data, isLoading } = useQuery<AdminInventoryItemListResponse>({
    queryKey: ['inventory-items', debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery) {
        return {
          inventory_items: [],
          limit: 0,
          offset: 0,
          count: 0,
        };
      }
      const response = await sdk.admin.inventoryItem.list({
        q: debouncedSearchQuery,
        limit: 10,
      });
      return response;
    },
    enabled: open && debouncedSearchQuery.length > 0,
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        {selectedItem ? (
          <div className="border-ui-border-base bg-ui-bg-base flex h-10 items-center gap-x-2 rounded-lg border px-3">
            <Badge className="-ml-2.5 flex items-center gap-x-2">
              <span>{selectedItem.sku}</span>
              <span className="text-ui-fg-subtle">({selectedItem.title})</span>
            </Badge>
            <button
              className="text-ui-fg-subtle hover:text-ui-fg-base ml-auto"
              onClick={() => {
                onRemove?.();
                setSearchQuery('');
              }}
            >
              <XMark className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Input
              placeholder="Search by SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpen(true);
              }}
              className="h-10"
            />
            {open && searchQuery && (
              <div className="border-ui-border-base bg-ui-bg-base absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border shadow-lg">
                <div className="max-h-[200px] overflow-y-auto">
                  {isLoading && (
                    <div className="text-ui-fg-subtle px-4 py-2.5 text-sm">Loading...</div>
                  )}
                  {!isLoading && (!data?.inventory_items || data.inventory_items.length === 0) && (
                    <div className="text-ui-fg-subtle px-4 py-2.5 text-sm">No items found</div>
                  )}
                  {!isLoading &&
                    data?.inventory_items?.map((item: AdminInventoryItem) => (
                      <button
                        key={item.id}
                        className="hover:bg-ui-bg-base-hover w-full px-4 py-2.5 text-left"
                        onClick={() => {
                          onSelect(item as ExtendedInventoryItem);
                          setSearchQuery('');
                          setOpen(false);
                        }}
                      >
                        <div className="flex flex-col gap-y-1">
                          <span className="text-ui-fg-base text-sm">{item.sku}</span>
                          <span className="text-ui-fg-subtle text-xs">{item.title}</span>
                          <span className="text-ui-fg-subtle text-xs">
                            Total Available:{' '}
                            {(item.location_levels as AdminInventoryLevel[])?.reduce(
                              (acc: number, level: AdminInventoryLevel) =>
                                acc + (level.available_quantity || 0),
                              0,
                            )}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <span className="text-ui-fg-subtle mt-1 text-xs">
        Search for inventory items by SKU. Results will show available quantities across all
        locations.
      </span>
    </div>
  );
};
