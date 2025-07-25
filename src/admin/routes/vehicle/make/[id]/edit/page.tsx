import { useParams } from 'react-router-dom';
import { RouteDrawer } from '../../../../../components/common/modals/route-focus-modal/route-drawer';
import { useVehicleMake } from '../../../../../hooks/api/make';
import { EditMakeForm } from '../../components/forms/edit-make-form';
const MakeEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { make, isLoading } = useVehicleMake(id ?? '');

  const ready = make && !isLoading;

  return <RouteDrawer prev="/vehicle/make">{ready && <EditMakeForm make={make} />}</RouteDrawer>;
};

export default MakeEditPage;
