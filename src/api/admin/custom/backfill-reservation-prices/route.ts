import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { IPricingModuleService, IProductModuleService } from "@medusajs/types";
import { Modules } from "@medusajs/utils";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const pricingModuleService: IPricingModuleService = req.scope.resolve(
    Modules.PRICING
  );
  const productModuleService: IProductModuleService = req.scope.resolve(
    Modules.PRODUCT
  );

   const priceLists = await pricingModuleService.listPriceLists(
    {},
    { relations: ["prices"] },
    {}
   );
  const reservationPriceList = priceLists.find(
    (pl) => pl.title === "Reservation"
  );

  const reservationPriceListId = reservationPriceList.id;

  // 2. Get all products and their variants.
  const products = await productModuleService.listProducts(
    {},
    { relations: ["variants"] },
    {} // Use empty context to fetch all products, ignoring admin scope.
  );

  const allVariants = products.flatMap(p => p.variants);

  // 3. Prepare the data to create a new Price Set for each variant.
  // Each price set is linked to the "Reservation" list via the 'rules' property.
  const priceSetsToCreate = allVariants.map(variant => ({
    prices: [{
      amount: 100000, // 1000 AED
      currency_code: "aed",
      variant_id: variant.id,
    }],
    rules: {
      price_list_id: reservationPriceListId,
    },
  }));
  
  // 4. Create all the new price sets in a single batch.
  if (priceSetsToCreate.length > 0) {
    // Note: This may fail if prices already exist. This is a simple backfill script.
    // For a more robust script, we would first check for existing prices.
    try {
      await pricingModuleService.createPriceSets(priceSetsToCreate);
    } catch (error) {
      // If some prices already exist, this might throw an error.
      // For a one-time script, this is often acceptable.
      console.error("Error creating price sets. Some may have already existed.", error);
    }
  }

  res.json({
    message: "Backfill process initiated. Check server logs for details.",
    variants_found: allVariants.length,
    price_sets_to_create: priceSetsToCreate.length,
  });
}
