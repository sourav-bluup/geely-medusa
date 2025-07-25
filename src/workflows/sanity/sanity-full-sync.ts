import {
  parallelize,
  createWorkflow as wf,
  WorkflowResponse,
} from '@medusajs/framework/workflows-sdk';
import { sanityCollectionSyncWorkflow } from './sanity-sync-collections';
import { sanityProductSyncWorkflow } from './sanity-sync-products';

type Input = {
  category_ids?: string[];
  product_ids?: string[];
  collection_ids?: string[];
};

const id = 'sanity-full-sync';

export const sanityFullSyncWorkflow = wf(
  { name: id, retentionTime: 10000 },
  function (input: Input) {
    const [product_total, collection_total] = parallelize(
      sanityProductSyncWorkflow.runAsStep({
        input: { product_ids: input.product_ids },
      }),
      sanityCollectionSyncWorkflow.runAsStep({
        input: { collection_ids: input.collection_ids },
      }),
    );
    return new WorkflowResponse({
      product_total,
      collection_total,
    });
  },
);
