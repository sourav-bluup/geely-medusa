import { createWorkflow, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { updateVehicleTrimStep } from './steps/update-vehicle-trim.step';

const updateVehicleTrimWorkflowId = 'update-vehicle-trim-workflow';

type WorkflowInput = {
  id: string;
  title: string;
  sort_rank: number;
  is_default: boolean;
};

export const updateVehicleTrimWorkflow = createWorkflow(
  updateVehicleTrimWorkflowId,
  function (input: WorkflowData<WorkflowInput>) {
    const trim = updateVehicleTrimStep(input);
    return new WorkflowResponse(trim);
  },
);
