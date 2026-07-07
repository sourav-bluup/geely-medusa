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

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const discountValue = discount ? Number(discount) : null;
      
      // Update the product metadata
      await sdk.admin.product.update(data.id, {
        metadata: {
          ...data.metadata,
          discount_percentage: discountValue,
        },
      });

      toast.success('Discount updated successfully');
    } catch (err) {
      toast.error(`Error updating discount: ${(err as Error).message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Container className="p-6 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2" className="mb-1">Vehicle Discount</Heading>
          <p className="text-ui-fg-subtle text-sm">
            Set a discount percentage for this vehicle to automatically strike through the original price.
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex items-end gap-4 max-w-sm">
        <div className="flex-1 space-y-2">
          <Label htmlFor="discount-input">Discount Percentage (%)</Label>
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
        <Button 
          variant="secondary" 
          onClick={handleSave} 
          isLoading={isUpdating}
        >
          Save Discount
        </Button>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: 'product.details.after',
});

export default ProductDiscountWidget;
