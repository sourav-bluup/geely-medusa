/**
 * @file create-vehicle-product.workflow.ts
 * @description Defines the workflow for creating a vehicle product in the system.
 */

import { createWorkflow, transform, WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { createProductsWorkflow } from '@medusajs/medusa/core-flows';
import { VehicleProductSchemaType } from '../../../../api/admin/vehicle/product/validators';
import { linkTrimToProductVariantStep } from '../../trim/steps/link-trim-to-product-variation';
import { addInventoryItemToLocationStep } from '../steps/add-inventory-item-to-location-step';
import { associateCategoriesToProductStep } from '../steps/associate-categories-to-product-step';
import { associateProductWithModelStep } from '../steps/associate-product-with-model.step';
import { transformToProductStep } from '../steps/transform-to-product-step';

/**
 * Unique identifier for the createVehicleProductWorkflow.
 */
const createVehicleProductWorkflowId = 'create-vehicle-product-workflow';

/**
 * Workflow for creating a vehicle product.
 *
 * This workflow performs the following steps:
 * 1. Transforms the input data into a product format.
 * 2. Creates the product using the core product creation workflow.
 * 3. Processes variant stock information.
 * 4. Associates variants with trims.
 * 5. Adds inventory items to locations.
 * 6. Associates the product with a vehicle model.
 * 7. Links trims to product variants.
 * 8. Associates categories with the product.
 *
 * @param {WorkflowData<VehicleProductSchemaType>} input - The input data for creating a vehicle product.
 * @returns {WorkflowResponse} A response containing the created product.
 */
export const createVehicleProductWorkflow = createWorkflow(
  createVehicleProductWorkflowId,
  function (input: WorkflowData<VehicleProductSchemaType>) {
    // Transform input data to product format
    const transformedProduct = transformToProductStep(input);

    // Create the product using core workflow
    const createdProduct = createProductsWorkflow.runAsStep({
      input: {
        products: [transformedProduct.product],
      },
    });

    // Process variant stock information
    const variantIdsWithStock = transform({ input, createdProduct }, (data) =>
      data.createdProduct
        .map((product) => {
          const inputVariant = data.input.variants.find(
            (variant) => variant.sku === product.variants[0].sku,
          );
          return product.variants.map((variant) => ({
            variant_id: variant.id,
            stock: inputVariant?.stock?.map((stock) => ({
              location_id: stock.id,
              quantity: stock.value,
            })),
          }));
        })
        .flat(),
    );

    // Process variant trim associations
    const variantIdsWithTrims = transform({ input, createdProduct }, (data) =>
      data.createdProduct
        .map((product) => {
          const inputVariant = data.input.variants.find(
            (variant) => variant.sku === product.variants[0].sku,
          );
          return product.variants.map((variant) => ({
            variant_id: variant.id,
            trim_id: inputVariant.trim_id,
            data: {
              year: inputVariant.year,
              mileage: inputVariant.mileage,
            },
          }));
        })
        .flat(),
    );

    // Add inventory items to locations
    addInventoryItemToLocationStep(variantIdsWithStock);

    // Associate product with vehicle model
    associateProductWithModelStep([
      {
        product_id: createdProduct[0].id,
        model_id: input.model_id,
      },
    ]);

    // Link trims to product variants
    linkTrimToProductVariantStep(variantIdsWithTrims);

    // Associate categories with the product
    associateCategoriesToProductStep({
      product_id: createdProduct[0].id,
      model_id: input.model_id,
    });

    // Return the created product in the workflow response
    return new WorkflowResponse({
      product: createdProduct,
    });
  },
);

export default createVehicleProductWorkflow;
