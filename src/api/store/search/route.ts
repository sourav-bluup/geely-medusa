import { MedusaResponse } from '@medusajs/framework/http';
import { RequestWithContext } from '@medusajs/medusa/api/store/products/helpers';
import { wrapVariantsWithInventoryQuantityForSalesChannel } from '@medusajs/medusa/api/utils/middlewares/products/variant-inventory-quantity';
import { HttpTypes, IProductModuleService, ProductCategoryDTO } from '@medusajs/types';
import { ContainerRegistrationKeys, Modules, QueryContext } from '@medusajs/utils';
import { withVariantMedia } from './helpers/with-variant-media';
import { defaultStoreProductFields } from './query-config';
import { productTransformer } from './transformers/product-transformer';

type Filters = {
  model_id?: string;
  year?: {
    from?: string;
    to?: string;
  };
  seats?: string[];
  engine?: string[];
  fuel_type?: string[];
  body_type?: string[];
};

const getMinPrice = (product: any) => {
  if (!product.variants || product.variants.length === 0) {
    return 0;
  }
  // Find the minimum calculated_price among all variants
  return product.variants.reduce((min, variant) => {
    //console.log(variant, '\n\n--------------------------------------------------------------------');
    const price = variant.calculated_price?.original_amount;
    return price !== undefined && price < min ? price : min;
  }, Infinity);
};

// Helper function to find the year of a product
const getYear = (product: any, yearParentCategory: ProductCategoryDTO): number => {
  if (!product.categories || product.categories.length === 0) {
    return 0;
  }

  const YEAR_CATEGORY_PARENT_ID = yearParentCategory.id;

  const yearCategory = product.categories.find(
    (cat) => cat.parent_category_id === YEAR_CATEGORY_PARENT_ID
  );
  return yearCategory ? parseInt(yearCategory.name, 10) : 0;
};

export const GET = async (
  req: RequestWithContext<HttpTypes.StoreProductParams>,
  res: MedusaResponse,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { pagination } = req.queryConfig;

  const remove = ['model_id', 'year', 'seats', 'engine', 'fuel_type', 'body_type'];
  const filters: Filters = {};

  for (const key of remove) {
    if (req.query[key]) {
      filters[key] = req.query[key];
    }
    delete req.filterableFields[key];
  }

  const order = req.filterableFields.sortBy as string | undefined;
  delete req.filterableFields.sortBy;
  const isPriceSort = order === 'price_asc' || order === 'price_desc';
  const isYearSort = order === 'year_asc' || order === 'year_desc';
  const { data: products, metadata } = await query.graph({
    entity: 'product',
    fields: defaultStoreProductFields,
    filters: {
      ...req.filterableFields,
    },
    pagination: {
      ...pagination,
      skip: pagination.skip!,
    },
    context: {
      variants: {
        calculated_price: QueryContext({
          region_id: req.pricingContext.region_id!,
          currency_code: req.pricingContext.currency_code!,
        }),
      },
    },
  });

  const variants = products.map((product) => product.variants).flat(1);

  await wrapVariantsWithInventoryQuantityForSalesChannel(req, variants);
  await withVariantMedia(req, variants);
  // If the request was for a price sort, sort the results array now.

  const productModuleService: IProductModuleService = req.scope.resolve(
    Modules.PRODUCT
  );

  // 2. Fetch the main "Year" parent category by its handle
  const [yearParentCategory] = await productModuleService.listProductCategories({
    handle: "year",
  });

  // If the main "Year" category doesn't exist, we can't find a child
  if (!yearParentCategory) {
    console.warn("Main 'Year' category not found. by handle: year");
  }

  if (isPriceSort) {
    products.sort((a, b) => {
      const priceA = getMinPrice(a);
      const priceB = getMinPrice(b);
      console.log('priceA', priceA, 'priceB', priceB);
      return order === 'price_asc' ? priceA - priceB : priceB - priceA;
    });
  } else if (isYearSort) {
    products.sort((a, b) => {
      const yearA = getYear(a, yearParentCategory);
      const yearB = getYear(b, yearParentCategory);
      return order === 'year_asc' ? yearA - yearB : yearB - yearA;
    });
  }

  //console.log('products', products);
  return res.json({
    products: products.map(productTransformer),
    ...metadata,
  });
};
