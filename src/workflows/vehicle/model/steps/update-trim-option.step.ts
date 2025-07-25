import { IProductModuleService, ProductTypes } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';

type UpdateTrimOptionInput = {
  inputOption: ProductTypes.CreateProductOptionDTO;
  options: ProductTypes.ProductOptionDTO[];
};

const updateTrimOptionStep = createStep(
  'update-trim-option-step',
  async ({ inputOption, options }: UpdateTrimOptionInput, context) => {
    const productModuleService: IProductModuleService = context.container.resolve(Modules.PRODUCT);

    const trimOption = options.find((o) => o.title === inputOption.title);

    if (trimOption) {
      // @ts-ignore
      productModuleService.updateProductOptions(trimOption.id, {
        metadata: {
          is_trim: true,
        },
      });
    }

    return new StepResponse({
      trimOption,
      trimOptionId: trimOption?.id,
    });
  },
  async ({ trimOptionId }, { container }) => {
    const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);
    // @ts-ignore
    productModuleService.updateProductOptions(trimOptionId, {
      metadata: {
        is_trim: false,
      },
    });
  },
);

export { updateTrimOptionStep };
