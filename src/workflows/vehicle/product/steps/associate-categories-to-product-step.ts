import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';

/**
 * Input type for the associateCategoriesToProductStep.
 */
type StepInput = {
  product_id: string;
  model_id: string;
};

/**
 * List of category types to be associated with the product.
 */
const SELECT_CATEGORIES = [
  'engine_category',
  'year_category',
  'transmission_category',
  'drive_type_category',
  'body_type_category',
  'fuel_type_category',
  'model_category',
];

/**
 * Unique identifier for the associateCategoriesToProductStep.
 */
export const associateCategoriesToProductStepId = 'associate-categories-to-product-step';

/**
 * Step to associate categories from a vehicle model to a product.
 *
 * This step performs the following actions:
 * 1. Retrieves the vehicle model using the provided model_id.
 * 2. Extracts the relevant categories from the model.
 * 3. Updates the product with the extracted category IDs.
 *
 * @param input - StepInput containing product_id and model_id
 * @param container - Container for dependency injection
 * @returns StepResponse containing the updated product and the product ID
 */
export const associateCategoriesToProductStep = createStep(
  associateCategoriesToProductStepId,
  async (input: StepInput, { container }) => {
    const productService = container.resolve(Modules.PRODUCT);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const {
      data: [model],
    } = await query.graph({
      entity: 'vehicle_model',
      fields: SELECT_CATEGORIES.map((category) => `${category}.id`),
      filters: {
        id: input.model_id,
      },
    });

    const categories = Object.entries(model)
      .filter(([key, _]) => SELECT_CATEGORIES.includes(key))
      .flatMap(([_, category]) => category) as Array<{ id: string }>;

    const products = await productService.updateProducts(input.product_id, {
      category_ids: categories.map((category) => category?.id),
    });

    return new StepResponse(products, {
      productId: input.product_id,
    });
  },
);
