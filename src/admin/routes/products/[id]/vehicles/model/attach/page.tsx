import { Heading } from '@medusajs/ui';
import { useParams } from 'react-router-dom';
import { RouteDrawer } from '../../../../../../components/common/modals/route-focus-modal/route-drawer';
import { AttachModelToProductForm } from '../../components/attach-model-to-product-form';

const VehicleSpecificationCreatePage = () => {
  const { id } = useParams();

  const ready = !!id;
  return (
    <RouteDrawer prev={`/products/${id}`}>
      <RouteDrawer.Header>
        <Heading>Create</Heading>
      </RouteDrawer.Header>
      {ready && <AttachModelToProductForm product_id={id} />}
    </RouteDrawer>
  );
};

export default VehicleSpecificationCreatePage;
