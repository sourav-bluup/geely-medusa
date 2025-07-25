import { useParams } from 'react-router-dom';
import { RouteDrawer } from '../../../../../../components/common/modals/route-focus-modal/route-drawer';
import { TrimForm } from '../components/trim-form';

const EditTrimPage = () => {
  const { id: model_id } = useParams();

  const ready = !!model_id;

  return <RouteDrawer prev="../../">{ready && <TrimForm model_id={model_id} />}</RouteDrawer>;
};

export default EditTrimPage;
