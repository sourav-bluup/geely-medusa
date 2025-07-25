import { createWorkflow, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { VehicleModelInput } from '../../../modules/vehicle/schemas/model.schemas';
import { createVehicleTrimsStep } from '../trim/steps/create-vehicle-trims.step';
import { createVehicleModelStep } from './steps/create-vehicle-model.step';

const createVehicleMakeWorkflowId = 'create-vehicle-model-workflow';

export const createVehicleModelWorkflow = createWorkflow(
  createVehicleMakeWorkflowId,
  function (input: WorkflowData<VehicleModelInput>) {
    const model = createVehicleModelStep(input);

    createVehicleTrimsStep({
      trims: input.trims,
      model_id: model.id,
    });

    return new WorkflowResponse(model);
  },
);
