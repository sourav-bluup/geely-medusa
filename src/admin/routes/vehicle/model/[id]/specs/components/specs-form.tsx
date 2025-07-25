import { Alert, toast } from '@medusajs/ui';
import { useRouteModal } from '../../../../../../components/common/modals/route-focus-modal';
import { ModalFormLayout } from '../../../../../../components/layouts';
import { useSaveModelSpecifications } from '../../../../../../hooks/api';
import { useModelSpecificationTable } from './table/model-specification-table-provider';
import { VehicleSpecificationTable } from './table/vehicle-specification-table';

type Props = {
  modelId: string;
};

const SpecsForm: React.FC<Props> = ({ modelId }) => {
  const { form } = useModelSpecificationTable();
  const { handleSuccess } = useRouteModal();

  const { mutateAsync } = useSaveModelSpecifications();

  const handleSubmit = form.handleSubmit(async (formData) => {
    await mutateAsync(
      { modelId, data: formData },
      {
        onSuccess: () => {
          toast.success('Specifications saved', {
            description: 'The vehicle model specifications have been successfully updated.',
          });
          handleSuccess();
        },
      },
    );
  });

  const error = form.formState.errors;

  return (
    <ModalFormLayout
      onSubmit={handleSubmit}
      description="Edit Specs"
      form={form}
      title="Edit Specs"
    >
      {error && error.data?.rows?.message && (
        <Alert variant="error">{error.data.rows.message}</Alert>
      )}
      <VehicleSpecificationTable />
    </ModalFormLayout>
  );
};

export default SpecsForm;
