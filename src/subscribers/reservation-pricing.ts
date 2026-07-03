import {
    type SubscriberArgs,
    type SubscriberConfig,
} from "@medusajs/medusa";
import {
    IPricingModuleService,
} from "@medusajs/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";

const VEHICLE_PRODUCT_TAG = "vehicle-product";

export default async function reservationPricingHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    console.log(`[Reservation Subscriber] Handling reservation pricing for product with ID: ${data.id}`);
    
    const pricingModuleService: IPricingModuleService = container.resolve(
        Modules.PRICING
    );
    const linkModule: any = container.resolve(
        ContainerRegistrationKeys.LINK
    );
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    // Fetch product with variants and their linked price sets
    const { data: [product] } = await query.graph({
        entity: "product",
        fields: ["id", "variants.id", "variants.price_set.id"],
        filters: { id: data.id },
    });

    if (!product) {
        console.warn(`[Reservation Subscriber] Product with ID ${data.id} not found.`);
        return;
    }

    const allPriceLists = await pricingModuleService.listPriceLists();
    const reservationPriceList = allPriceLists.find(
        (pl) => pl.title === 'Reservation',
    );

    if (!reservationPriceList) {
        console.warn("[Reservation Subscriber] Could not find a price list with the title 'Reservation'. Skipping.");
        return;
    }

    console.log(`[Reservation Subscriber] Using reservation price list: ${reservationPriceList.id}`);

    // Loop through each variant
    for (const variant of product.variants) {
        try {
            let priceSetId = variant.price_set?.id;

            // 1. If no price set exists, create one and link it
            if (!priceSetId) {
                console.log(`[Reservation Subscriber] No price set found for variant ${variant.id}. Creating new one.`);
                const [newPriceSet] = await pricingModuleService.createPriceSets([{}]);
                priceSetId = newPriceSet.id;

                await linkModule.create({
                    [Modules.PRODUCT]: {
                        variant_id: variant.id,
                    },
                    [Modules.PRICING]: {
                        price_set_id: priceSetId,
                    },
                });
                console.log(`[Reservation Subscriber] Linked variant ${variant.id} to new price set ${priceSetId}`);
            } else {
                console.log(`[Reservation Subscriber] Variant ${variant.id} already has price set ${priceSetId}. Reusing it.`);
            }

            // 2. Add the reservation price to the price list for this price set
            await pricingModuleService.addPriceListPrices([{
                price_list_id: reservationPriceList.id,
                prices: [
                    {
                        amount: 1000,
                        currency_code: "aed",
                        price_set_id: priceSetId,
                    },
                ],
            }]);
            console.log(`[Reservation Subscriber] Successfully added reservation price for variant ${variant.id}`);
        } catch (error) {
            console.error(
                `[Reservation Subscriber] FAILED to process variant ${variant.id}:`,
                error
            );
        }
    }
    console.log("[Reservation Subscriber] Finished processing all variants.");
}

export const config: SubscriberConfig = {
    event: "product.created",
};
