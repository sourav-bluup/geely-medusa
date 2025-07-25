import { createWorkflow, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { unlinkTrimFromProductVariantStep } from './steps/unlink-trim-from-product-variation';

const unlinkTrimToProductVariantWorkflowId = 'unlink-trim-to-product-variant-workflow';

type WorkflowInput = {
  trim_id: string;
  variant_id: string;
};

export const unlinkTrimToProductVariationWorkflow = createWorkflow(
  unlinkTrimToProductVariantWorkflowId,
  function ({ trim_id, variant_id }: WorkflowData<WorkflowInput>) {
    const response = unlinkTrimFromProductVariantStep({
      trim_id,
      variant_id,
    });
    return new WorkflowResponse(response);
  },
);
