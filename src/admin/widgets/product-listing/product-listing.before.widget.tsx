import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { Button } from '@medusajs/ui';
import { Link } from 'react-router-dom';

const ProductListingBeforeWidget = () => {
  return (
    <div className="mb-4 flex gap-x-2">
      <Button variant="secondary" size="small" asChild>
        <Link to="/products/vehicle/create">Add Vehicle</Link>
      </Button>
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: 'product.list.before',
});

export default ProductListingBeforeWidget;
