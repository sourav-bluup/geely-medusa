import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { AdminProduct, DetailWidgetProps } from '@medusajs/framework/types';
import { Button, Container, Heading, Input, Label, toast } from '@medusajs/ui';
import { useState } from 'react';
import { sdk } from '../lib/skd';

const ProductDiscountWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [discount, setDiscount] = useState<string>(
    data.metadata?.discount_percentage ? String(data.metadata.discount_percentage) : ''
  );
  const [displayOrder, setDisplayOrder] = useState<string>(
    data.metadata?.display_order ? String(data.metadata.display_order) : ''
  );

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await sdk.admin.product.update(data.id, {
        metadata: {
          ...data.metadata,
          discount_percentage: discount ? Number(discount) : null,
          display_order: displayOrder ? Number(displayOrder) : null,
        },
      });

      toast.success('Vehicle settings updated successfully');
    } catch (err) {
      toast.error(`Error updating: ${(err as Error).message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Container className="p-6 mt-4">
      <div className="mb-6">
        <Heading level="h2" className="mb-1">Vehicle Display Settings</Heading>
        <p className="text-ui-fg-subtle text-sm">
          Configure the discount and grid position for this vehicle on the storefront.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-lg">
        {/* Discount Percentage */}
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="discount-input">Discount Percentage (%)</Label>
            <p className="text-ui-fg-muted text-xs">
              Strikes through the original price and shows the discounted price in red.
            </p>
            <Input
              id="discount-input"
              placeholder="e.g. 10"
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Position */}
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="display-order-input">Grid Position</Label>
            <p className="text-ui-fg-muted text-xs">
              Controls the position of this card in the vehicle grid (1 = first). Leave empty for default order.
            </p>
            <Input
              id="display-order-input"
              placeholder="e.g. 1"
              type="number"
              min="1"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Button
            variant="secondary"
            onClick={handleSave}
            isLoading={isUpdating}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: 'product.details.after',
});

export default ProductDiscountWidget;
