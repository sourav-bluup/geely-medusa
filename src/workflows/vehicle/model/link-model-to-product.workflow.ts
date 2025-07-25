import { createWorkflow, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { LinkModelToProductType } from '../../../api/admin/vehicle/model/validators';
import { associateProductWithModelStep } from '../product/steps/associate-product-with-model.step';

const linkModelToProductWorkflowId = 'link-model-to-product-workflow';

type WorkflowInput = LinkModelToProductType;

export const linkModelToProductWorkflow = createWorkflow(
  linkModelToProductWorkflowId,
  function ({ model_id, product_id }: WorkflowData<WorkflowInput>) {
    const response = associateProductWithModelStep([
      {
        product_id,
        model_id,
      },
    ]);
    return new WorkflowResponse(response);
  },
);
