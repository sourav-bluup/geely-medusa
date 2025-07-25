import { RouteFocusModal } from '../../../../components/common/modals/route-focus-modal';
import { CreateFormProvider } from '../components/create-form/create-form-provider';
import { VehicleProductForm } from '../components/create-form/vehicle-product-form';

const ProductVehicleCreatePage = () => {
  return (
    <RouteFocusModal prev="/products">
      <CreateFormProvider>
        <VehicleProductForm />
      </CreateFormProvider>
    </RouteFocusModal>
  );
};

export default ProductVehicleCreatePage;
