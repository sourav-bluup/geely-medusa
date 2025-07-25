import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';

type StepInput = Array<{
  product_id: string;
  model_id: string;
}>;

export const associateProductWithModelStepId = 'associate-product-with-model-step';

export const associateProductWithModelStep = createStep(
  associateProductWithModelStepId,
  async (input: StepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    const linkDefinitions = input?.map(({ product_id, model_id }) => ({
      [VEHICLE_MODULE]: {
        vehicle_model_id: model_id,
      },
      [Modules.PRODUCT]: {
        product_id,
      },
    }));

    const links = await remoteLink.create(linkDefinitions);

    return new StepResponse(links, linkDefinitions);
  },
  async (linkDefinitions, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);
    await remoteLink.dismiss(linkDefinitions);
  },
);
