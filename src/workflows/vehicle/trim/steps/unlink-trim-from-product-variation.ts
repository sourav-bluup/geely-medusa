import { Link } from '@medusajs/framework/modules-sdk';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';

const unlinkTrimFromProductVariantStepId = 'unlink-trim-from-product-variant-step';

/// props for the step
type StepInput = {
  trim_id: string;
  variant_id: string;
};

const unlinkTrimFromProductVariantStep = createStep(
  unlinkTrimFromProductVariantStepId,
  async ({ trim_id, variant_id }: StepInput, { container }) => {
    const remoteLink: Link = container.resolve(ContainerRegistrationKeys.LINK);

    await remoteLink.dismiss({
      [VEHICLE_MODULE]: {
        vehicle_trim_id: trim_id,
      },
      [Modules.PRODUCT]: {
        product_variant_id: variant_id,
      },
    });

    return new StepResponse({}, { trim_id, variant_id });
  },
  async ({ trim_id, variant_id }: StepInput, { container }) => {
    const remoteLink: Link = container.resolve(ContainerRegistrationKeys.LINK);
    await remoteLink.restore({
      [VEHICLE_MODULE]: {
        vehicle_trim_id: trim_id,
      },
      [Modules.PRODUCT]: {
        product_variant_id: variant_id,
      },
    });
  },
);

export { unlinkTrimFromProductVariantStep, unlinkTrimFromProductVariantStepId };
