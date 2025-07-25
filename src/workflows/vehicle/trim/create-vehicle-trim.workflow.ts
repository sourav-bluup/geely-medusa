import { createWorkflow, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { createVehicleTrimStep } from './steps/create-vehicle-trim.step';

const createVehicleTrimWorkflowId = 'create-vehicle-trim-workflow';

type WorkflowInput = {
  model_id: string;
  title: string;
};

export const createVehicleTrimWorkflow = createWorkflow(
  createVehicleTrimWorkflowId,
  function (input: WorkflowData<WorkflowInput>) {
    const trim = createVehicleTrimStep(input);
    return new WorkflowResponse(trim);
  },
);
