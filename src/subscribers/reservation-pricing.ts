import {
    type SubscriberArgs,
    // CORRECTED: Import Subscriber types from the main medusa package
    type SubscriberConfig,
} from "@medusajs/medusa";
import {
    IPricingModuleService,
    IProductModuleService
} from "@medusajs/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";

const VEHICLE_PRODUCT_TAG = "vehicle-product";

export default async function reservationPricingHandler({
    event: { data }, // The event payload is in `data`
    container,
}: SubscriberArgs<{ id: string }>) {
    console.log(`Handling reservation pricing for product with ID: ${data.id}`);
    const productModuleService: IProductModuleService = container.resolve(
        Modules.PRODUCT
    );
    const pricingModuleService: IPricingModuleService = container.resolve(
        Modules.PRICING
    );
    const linkModule: any = container.resolve(
        ContainerRegistrationKeys.LINK
    );

    // CORRECTED: The method is `retrieveProduct` and we use `data.id`
    const product = await productModuleService.retrieveProduct(data.id, {
        relations: ["tags", "variants"],
    });

    const allPriceLists = await pricingModuleService.listPriceLists();

    // Step 2: Find the "Reservation" price list in the array
    const reservationPriceList = allPriceLists.find(
        (pl) => pl.title === 'Reservation',
    );
    console.log(`Found reservation price list: ${reservationPriceList?.id}`);
    if (!reservationPriceList) {
        console.warn("Could not find a price list with the title 'Reservation'.");
        return;
    }

    // 1. Create a new, empty price set for each variant
    const priceSetPayload = product.variants.map(() => ({}));
    const priceSets = await pricingModuleService.createPriceSets(priceSetPayload);

    // 2. Loop through each variant to link it and add the price
    for (const [index, variant] of product.variants.entries()) {
        try {
            const priceSetId = priceSets[index].id;

            // 3. Explicitly link the variant to its new price set
            await linkModule.create({
                [Modules.PRODUCT]: {
                    variant_id: variant.id,
                },
                [Modules.PRICING]: {
                    price_set_id: priceSetId,
                },
            });
            console.log(`[Reservation Subscriber] Successfully linked variant ${variant.id} to price set ${priceSetId}`);

            // 4. Add the reservation price to the price list
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