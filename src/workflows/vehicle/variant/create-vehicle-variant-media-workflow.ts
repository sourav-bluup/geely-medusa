import { createWorkflow, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import createVehicleVariantMediaStep from './steps/create-vehicle-variant-media-step';
import { VehicleVariantMediaInput } from '../../../modules/vehicle/types/vehicle-variant-media-type';

const createVehicleVariantMediaWorkflowId = 'create-vehicle-variant-media-workflow';

const createVehicleVariantMediaWorkflow = createWorkflow(
  createVehicleVariantMediaWorkflowId,
  function (input: WorkflowData<VehicleVariantMediaInput>) {
    return new WorkflowResponse(createVehicleVariantMediaStep(input.media));
  },
);

export default createVehicleVariantMediaWorkflow;
