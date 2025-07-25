import { useParams } from 'react-router-dom';
import { RouteDrawer } from '../../../../../../../components/common/modals/route-focus-modal/route-drawer';
import { useTrim } from '../../../../../../../hooks/api/trim';
import { TrimForm } from '../../components/trim-form';

const EditTrimPage = () => {
  const { id: trimId, id: model_id } = useParams();

  const { trim } = useTrim(trimId as string);
  const ready = !!trim;
  return (
    <RouteDrawer prev="../../../">
      {ready && <TrimForm trim={trim} model_id={model_id as string} />}
    </RouteDrawer>
  );
};

export default EditTrimPage;
