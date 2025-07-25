import { Heading } from '@medusajs/ui';
import { useParams } from 'react-router-dom';
import { RouteDrawer } from '../../../../../../../../../components/common/modals/route-focus-modal/route-drawer';
import { useVariantMedia } from '../../../../../../../../../hooks/api/variant-media';
import EditVariantMediaForm from '../../../../components/forms/edit-variant-media-form';

const VehicleProductVariantMediaPage = () => {
  const { id, variantId, mediaId } = useParams();
  const { media, isLoading } = useVariantMedia(mediaId as string);

  const ready = id && variantId && mediaId && !isLoading;

  return (
    <RouteDrawer prev={`/products/${id}/vehicles/variant/${variantId}`}>
      <RouteDrawer.Header>
        <Heading>Edit</Heading>
      </RouteDrawer.Header>
      {ready && <EditVariantMediaForm media={media} />}
    </RouteDrawer>
  );
};

export default VehicleProductVariantMediaPage;
