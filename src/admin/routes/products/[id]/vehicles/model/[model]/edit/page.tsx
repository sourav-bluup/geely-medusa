import { Heading } from '@medusajs/ui';
import { useParams } from 'react-router-dom';
import { RouteDrawer } from '../../../../../../../components/common/modals/route-focus-modal/route-drawer';
import { useProductModel } from '../../../../../../../hooks/api/products';
import { AttachModelToProductForm } from '../../../components/attach-model-to-product-form';

const VehicleProductModelEditPage = () => {
  const { id } = useParams();
  const { productModel } = useProductModel(id as string);

  const ready = !!productModel && !!id;

  return (
    <RouteDrawer prev={`/products/${id}`}>
      <RouteDrawer.Header>
        <Heading>Edit</Heading>
      </RouteDrawer.Header>
      {ready && <AttachModelToProductForm product_id={id} data={productModel} />}
    </RouteDrawer>
  );
};

export default VehicleProductModelEditPage;
