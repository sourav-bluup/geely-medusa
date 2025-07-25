import { useParams } from 'react-router-dom';
import { RouteFocusModal } from '../../../../../components/common/modals/route-focus-modal';
import { ModelForm } from '../components/model-form';
import { useGetVehicleModel } from '../../../../../hooks/use-vehicle-model';

const ModelEditPage = () => {
  const { id } = useParams();
  const { data: model, isLoading } = useGetVehicleModel(id as string);
  const ready = !isLoading && !!model;
  return <RouteFocusModal>{ready && <ModelForm model_id={id} data={model} />}</RouteFocusModal>;
};

export default ModelEditPage;
