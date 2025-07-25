import { RouteFocusModal } from '../../../../components/common/modals/route-focus-modal';
import { ModelForm } from '../[id]/components/model-form';

const ModelCreatePage = () => {
  return (
    <RouteFocusModal>
      <ModelForm />
    </RouteFocusModal>
  );
};

export default ModelCreatePage;
