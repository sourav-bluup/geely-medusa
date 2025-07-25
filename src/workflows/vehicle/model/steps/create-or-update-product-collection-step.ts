import { IProductModuleService } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';

type StepInput = {
  name: string;
};

const getModelCollectionIdStepId = 'get-model-collection-id-step';

const getModelCollectionIdStep = createStep(
  getModelCollectionIdStepId,
  async ({ name }: StepInput, { container }) => {
    const productService: IProductModuleService = container.resolve(Modules.PRODUCT);

    const existingCollections = await productService.listProductCollections(
      { title: name },
      { take: 1 },
    );

    let collectionId: string;

    if (existingCollections.length === 0) {
      const [newCollection] = await productService.createProductCollections([
        {
          title: name,
        },
      ]);
      collectionId = newCollection.id;
    } else {
      collectionId = existingCollections[0].id;
    }

    return new StepResponse({
      collectionId: collectionId,
    });
  },
);

export { getModelCollectionIdStep };
