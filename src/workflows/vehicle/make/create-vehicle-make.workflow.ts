import { createWorkflow, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { VehicleMakeInput } from 'src/api/admin/vehicle/make/validators';
import { createVehicleMakeStep } from './create-vehicle-make.step';

const createVehicleMakeWorkflowId = 'create-vehicle-make-workflow';

type WorkflowInput = {
  make: VehicleMakeInput;
};

export const createVehicleMakeWorkflow = createWorkflow(
  createVehicleMakeWorkflowId,
  function (input: WorkflowData<WorkflowInput>) {
    const make = createVehicleMakeStep(input.make);

    return new WorkflowResponse(make);
  },
);
