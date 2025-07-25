import { MetadataType } from '@medusajs/framework/types';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { VEHICLE_MODULE } from '../../../../modules/vehicle';
import { Link } from '@medusajs/framework/modules-sdk';

type StepInput = {
  trim_id: string;
  variant_id: string;
  data?: {
    metadata?: MetadataType;
    year?: number;
    mileage?: number;
  };
}[];
export const linkTrimToProductVariantStepId = 'link-trim-to-product-variant-step';

export const linkTrimToProductVariantStep = createStep(
  linkTrimToProductVariantStepId,
  async (input: StepInput, { container }) => {
    const remoteLink: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkDefinitions = input
      .filter(({ trim_id, variant_id }) => trim_id && variant_id)
      .map(({ trim_id, variant_id, data }) => ({
        [VEHICLE_MODULE]: {
          vehicle_trim_id: trim_id,
        },
        [Modules.PRODUCT]: {
          product_variant_id: variant_id,
        },
        ...(data && {
          data: {
            ...(data.metadata && { metadata: data.metadata }),
            ...(data.year && { year: data.year }),
            ...(data.mileage && { mileage: data.mileage }),
          },
        }),
      }));

    const links = await remoteLink.create(linkDefinitions);

    return new StepResponse(links, linkDefinitions);
  },
  async (linkDefinitions, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK);
    const links = await remoteLink.dismiss(linkDefinitions);
  },
);
