import { type SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { IPricingModuleService, IProductModuleService } from "@medusajs/types";
import { Modules } from "@medusajs/utils";

export default async function handleProductCreation({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const pricingModuleService: IPricingModuleService = container.resolve(
    Modules.PRICING
  );
  const productModuleService: IProductModuleService = container.resolve(
    Modules.PRODUCT
  );

  const productId = data.id;

  // 1. Find the "Reservation" price list
  /*const [reservationPriceList] = await pricingModuleService.listPriceLists(
    { title: "Reservation" },
    { relations: ["prices"] }
  );

  if (!reservationPriceList) {
    console.warn("Reservation price list not found. Skipping auto-add for new product.");
    return;
  }

  if (!reservationPriceList.prices || reservationPriceList.prices.length === 0) {
    console.warn("Reservation price list has no prices. Cannot determine Price Set ID. Skipping auto-add for new product.");
    return;
  }

  // 2. Get the Price Set ID from an existing price
  const targetPriceSetId = reservationPriceList.prices[0].price_set_id;

  // 3. Get the variants of the newly created product
  const variants = await productModuleService.listVariants({
    product_id: productId,
  });

  if (variants.length === 0) {
    return;
  }

  const prices = variants.map((variant) => ({
    amount: 100000, // 1000 AED
    currency_code: "aed",
    variant_id: variant.id,
  }));

  // 4. Add the prices to the price list
  await pricingModuleService.addPrices({
    priceSetId: targetPriceSetId,
    prices,
  });

  console.log(
    `Successfully added ${prices.length} variants for new product ${productId} to the reservation price list.`
  );*/
}

export const config: SubscriberConfig = {
  event: "product.created",
  context: {
    subscriberId: "product-created-add-to-reservation-pricelist",
  },
};
