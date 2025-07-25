import { Alert, Button, Label } from '@medusajs/ui';
import { useMemo } from 'react';
import { useReservationForm } from '../hooks/use-reservation-form';
import { useStockLocations } from '../hooks/use-stock-locations';
import { ExtendedInventoryItem } from '../new/types';
import { DescriptionInput } from './description-input';
import { InventorySearch } from './inventory-search';
import { LocationSelector } from './location-selector';
import { QuantityInput } from './quantity-input';
import { StageSelector } from './stage-selector';

interface ReservationFormProps {
  onCancel: () => void;
}

export const ReservationForm = ({ onCancel }: ReservationFormProps) => {
  const { locationMap, isLoading: isLoadingLocations } = useStockLocations();
  const {
    form,
    selectedItem,
    isLoading,
    handleSubmit,
    handleItemSelect,
    handleLocationChange,
    handleQuantityChange,
    handleDescriptionChange,
    handleStageChange,
    handleRemoveItem,
  } = useReservationForm();

  const {
    watch,
    formState: { errors },
    clearErrors,
  } = form;

  const selectedLocationId = watch('location_id');
  const quantity = watch('quantity');
  const description = watch('description') || '';
  const stage = watch('metadata.stage');

  // Get available location IDs from selected item
  const availableLocationIds = useMemo(
    () =>
      selectedItem?.location_levels
        .filter((level) => (level.available_quantity || 0) > 0)
        .map((level) => level.location_id) || [],
    [selectedItem],
  );

  // Check if selected item has any available quantity
  const hasAvailableQuantity = useMemo(
    () =>
      selectedItem?.location_levels.some((level) => (level.available_quantity || 0) > 0) ?? false,
    [selectedItem],
  );

  // Get max quantity for selected location
  const locationLevel = useMemo(
    () =>
      selectedItem && selectedLocationId
        ? selectedItem.location_levels.find((level) => level.location_id === selectedLocationId)
        : null,
    [selectedItem, selectedLocationId],
  );

  const maxQuantity = locationLevel?.available_quantity || 0;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-8 py-4">
        <div className="flex flex-col gap-y-4 px-6">
          <div>
            <Label>Inventory Item</Label>
            <div className="flex flex-col gap-y-4">
              <InventorySearch
                onSelect={(item: ExtendedInventoryItem) => {
                  handleItemSelect(item);
                  clearErrors('inventory_item_id');
                }}
                selectedItem={selectedItem || undefined}
                onRemove={handleRemoveItem}
              />
              {errors.inventory_item_id && (
                <span className="text-ui-fg-error text-xs">{errors.inventory_item_id.message}</span>
              )}
              {selectedItem && !hasAvailableQuantity && (
                <Alert variant="error">No available quantity for this item in any location</Alert>
              )}
            </div>
          </div>

          <div>
            <LocationSelector
              selectedLocationId={selectedLocationId}
              onLocationChange={(locationId) => {
                handleLocationChange(locationId);
                handleQuantityChange(1);
                clearErrors('location_id');
              }}
              availableLocationIds={availableLocationIds}
              locationMap={locationMap}
              isLoading={isLoadingLocations}
              disabled={!selectedItem || !hasAvailableQuantity}
              showAvailableOnly={true}
              error={errors.location_id?.message}
            />
          </div>

          <div>
            <QuantityInput
              quantity={quantity}
              maxQuantity={maxQuantity}
              onQuantityChange={(qty) => {
                handleQuantityChange(qty);
                clearErrors('quantity');
              }}
              disabled={!selectedLocationId}
              error={errors.quantity?.message}
            />
          </div>

          <div>
            <DescriptionInput
              value={description}
              onChange={(value) => {
                handleDescriptionChange(value);
                clearErrors('description');
              }}
              error={errors.description?.message}
            />
          </div>

          <div>
            <StageSelector
              value={stage}
              onChange={(value) => {
                handleStageChange(value);
                clearErrors('metadata.stage');
              }}
            />
            {errors.metadata?.stage && (
              <span className="text-ui-fg-error text-xs">{errors.metadata.stage.message}</span>
            )}
          </div>
        </div>
      </div>
      <div className="border-ui-border-base flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-x-2">
          <Button variant="danger" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isLoading}
            disabled={!selectedItem || !selectedLocationId || !quantity || isLoading}
          >
            Reserve
          </Button>
        </div>
      </div>
    </form>
  );
};
