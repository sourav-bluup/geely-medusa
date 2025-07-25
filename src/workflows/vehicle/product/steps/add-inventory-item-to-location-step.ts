import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';

type StepInput = {
  variant_id: string;
  stock: { location_id: string; quantity: number }[];
}[];

export const addInventoryItemToLocationStepId = 'add-inventory-item-to-location';

export const addInventoryItemToLocationStep = createStep(
  addInventoryItemToLocationStepId,
  async (input: StepInput, { container }) => {
    const inventoryService = container.resolve(Modules.INVENTORY);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data: inventoryItems } = await query.graph({
      entity: 'product_variant_inventory_item',
      fields: ['inventory_item_id', 'variant_id'],
      filters: {
        variant_id: input
          .filter((variant) => variant.stock.length > 0)
          .map((variant) => variant.variant_id),
      },
    });

    // from input, each location id and map with inventory item id
    const inventoryLevelsInput = input.flatMap((variant) =>
      variant.stock.map((stock) => ({
        location_id: stock.location_id,
        inventory_item_id: inventoryItems.find((item) => item.variant_id === variant.variant_id)
          ?.inventory_item_id,
        stocked_quantity: stock.quantity,
      })),
    );

    const inventoryLevels = await inventoryService.createInventoryLevels(inventoryLevelsInput);

    return new StepResponse(
      inventoryLevels,
      inventoryLevels.map((level) => level.id),
    );
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return;
    }
    const service = container.resolve(Modules.INVENTORY);
    await service.deleteInventoryLevels(ids);
  },
);
