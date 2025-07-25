import { Heading } from '@medusajs/ui';
import { useParams, useSearchParams } from 'react-router-dom';
import { RouteDrawer } from '../../../../../../../../components/common/modals/route-focus-modal/route-drawer';
import { AttachTrimToProductVariationForm } from '../../../../components/attach-trim-to-product-variation-form';

const ProductVehicleAttachPage = () => {
  const { id, model } = useParams();
  const [searchParams] = useSearchParams();

  const variant_id = searchParams.get('variant_id') as string;

  const ready = !!id && !!model && !!variant_id;

  return (
    <RouteDrawer prev={`/products/${id}`}>
      <RouteDrawer.Header>
        <Heading>Create</Heading>
      </RouteDrawer.Header>
      {ready && (
        <AttachTrimToProductVariationForm
          model_id={model}
          variant_id={variant_id}
          product_id={id}
        />
      )}
    </RouteDrawer>
  );
};

export default ProductVehicleAttachPage;
