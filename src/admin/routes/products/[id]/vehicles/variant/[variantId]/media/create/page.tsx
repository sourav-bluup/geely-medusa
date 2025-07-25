import { Heading } from '@medusajs/ui';
import { useParams } from 'react-router-dom';
import { RouteDrawer } from '../../../../../../../../components/common/modals/route-focus-modal/route-drawer';
import CreateVariantMediaForm from '../../../components/forms/create-variant-media-form';

const VehicleProductVariantMediaPage = () => {
  const { id, variantId } = useParams();

  const ready = id && variantId;

  return (
    <RouteDrawer prev={`/products/${id}/vehicles/variant/${variantId}`}>
      <RouteDrawer.Header>
        <Heading>Edit</Heading>
      </RouteDrawer.Header>
      {ready && <CreateVariantMediaForm variantId={variantId} />}
    </RouteDrawer>
  );
};

export default VehicleProductVariantMediaPage;
