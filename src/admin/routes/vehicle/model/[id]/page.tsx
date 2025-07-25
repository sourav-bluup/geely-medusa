import { useParams } from 'react-router-dom';
import { TwoColumnPage } from '../../../../components/layouts';
import ModelDetailsSection from './components/model-details-section';
import ModelSpecificationList from './components/model-specification-list';
import ModelTrimList from './components/model-trim-list';
import { useGetVehicleModel } from '../../../../hooks/use-vehicle-model';

const VehicleSpecificationCreatePage = () => {
  const { id } = useParams();

  const { data: model, isLoading } = useGetVehicleModel(id as string);

  const ready = !isLoading && !!model;

  return (
    <TwoColumnPage hasOutlet>
      <TwoColumnPage.Main>
        {ready && (
          <>
            <ModelTrimList model={model} />
            <ModelSpecificationList model={model} />
          </>
        )}
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        {ready && <ModelDetailsSection model={model} />}
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  );
};

export default VehicleSpecificationCreatePage;
