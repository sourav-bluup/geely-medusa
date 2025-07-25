import { createWorkflow, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { linkTrimToProductVariantStep } from './steps/link-trim-to-product-variation';

const linkTrimToProductVariantWorkflowId = 'link-trim-to-product-variant-workflow';

type WorkflowInput = {
  trim_id: string;
  variant_id: string;
  year?: number;
  mileage?: number;
};

export const linkTrimToProductVariationWorkflow = createWorkflow(
  linkTrimToProductVariantWorkflowId,
  function ({ trim_id, variant_id, year, mileage }: WorkflowData<WorkflowInput>) {
    const response = linkTrimToProductVariantStep([
      {
        trim_id,
        variant_id,
        data: {
          year,
          mileage,
        },
      },
    ]);
    return new WorkflowResponse(response);
  },
);
