import { createWorkflow, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { SpecificationInput } from '../../../admin/routes/vehicle/model/[id]/specs/components/table/types';
import { saveVehicleTrimSpecificationStep } from './steps/save-vehicle-trim-specification.step';

const saveTrimSpecificationsWorkflowId = 'save-trim-specifications-workflow';

type WorkflowInput = {
  model_id: string;
  data: SpecificationInput['data'];
};

const saveTrimSpecificationsWorkflow = createWorkflow(
  saveTrimSpecificationsWorkflowId,
  function ({ model_id, data }: WorkflowData<WorkflowInput>) {
    return new WorkflowResponse(
      saveVehicleTrimSpecificationStep({
        data,
        model_id,
      }),
    );
  },
);

export { saveTrimSpecificationsWorkflow, saveTrimSpecificationsWorkflowId };
