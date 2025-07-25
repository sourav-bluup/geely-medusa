import { useParams, useSearchParams } from 'react-router-dom';
import { SpecificationCategoryEnum } from '../../../../../../../modules/vehicle/enums/specification-category.enum';
import { RouteFocusModal } from '../../../../../../components/common/modals/route-focus-modal';
import { useTrimList } from '../../../../../../hooks/api/trim';
import SpecsForm from '../components/specs-form';
import { ModelSpecificationTableProvider } from '../components/table/model-specification-table-provider';

const VariantPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const defaultGroup = searchParams.get('group') as SpecificationCategoryEnum;

  const { trims } = useTrimList(id as string);

  const ready = trims && trims.length > 0;

  return (
    <RouteFocusModal prev={`/vehicle/model/${id}`}>
      {ready && defaultGroup && (
        <ModelSpecificationTableProvider defaultGroup={defaultGroup} trims={trims}>
          <SpecsForm modelId={id as string} />
        </ModelSpecificationTableProvider>
      )}
    </RouteFocusModal>
  );
};

export default VariantPage;
