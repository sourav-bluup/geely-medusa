import { useParams, useSearchParams } from 'react-router-dom';
import { SpecificationCategoryEnum } from '../../../../../../../modules/vehicle/enums/specification-category.enum';
import { RouteFocusModal } from '../../../../../../components/common/modals/route-focus-modal';
import { useTrimSpecifications as useModelSpecifications } from '../../../../../../hooks/api';
import { useTrimList } from '../../../../../../hooks/api/trim';
import SpecsForm from '../components/specs-form';
import { ModelSpecificationTableProvider } from '../components/table/model-specification-table-provider';

const VariantPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const group = searchParams.get('group') as SpecificationCategoryEnum;

  const { specifications } = useModelSpecifications(id as string, {
    group: group,
  });
  const { trims } = useTrimList(id as string);

  const ready = specifications && trims && trims.length > 0;
  return (
    <RouteFocusModal prev={`/vehicle/model/${id}`}>
      {ready && (
        <ModelSpecificationTableProvider specifications={specifications} trims={trims}>
          <SpecsForm modelId={id as string} />
        </ModelSpecificationTableProvider>
      )}
    </RouteFocusModal>
  );
};

export default VariantPage;
