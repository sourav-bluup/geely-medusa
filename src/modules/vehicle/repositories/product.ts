import { Context } from '@medusajs/types';
import { MikroOrmBase } from '@medusajs/utils';
import { SqlEntityManager } from '@mikro-orm/postgresql';

export type GetProductIdsFromYearParams = {
  toYear?: number;
  fromYear?: number;
  productIds?: string[];
  context?: Context;
};

export class ProductRepository extends MikroOrmBase {
  constructor() {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);
  }

  async getProductTrimOptions(productId: string, context: Context = {}) {
    const knex = super.getActiveManager<SqlEntityManager>(context).getKnex();

    return knex({
      pov: 'product_option_value',
    })
      .select({
        id: 'pov.id',
        title: 'pov.value',
        option_title: 'o.title',
        option_id: 'o.id',
        product_id: 'o.product_id',
      })
      .from('product_option_value as pov')
      .leftJoin('product_option as o', 'o.id', 'pov.option_id')
      .where('o.product_id', productId)
      .andWhereRaw("o.metadata->'is_trim' = 'true'::jsonb");
  }

  async filterCategoriesByCollection(
    collectionHandle: string,
    parentCategoryId: string,
    context: Context = {},
  ): Promise<
    Array<{
      id: string;
      name: string;
      handle: string;
    }>
  > {
    const knex = super.getActiveManager<SqlEntityManager>(context).getKnex();

    return knex('product_category as c')
      .distinct('c.id', 'c.name', 'c.handle')
      .join('product_category_product as pcp', 'c.id', 'pcp.product_category_id')
      .join('product as p', 'p.id', 'pcp.product_id')
      .join('product_collection as col', 'p.collection_id', 'col.id')
      .where('col.handle', collectionHandle)
      .andWhere('c.parent_category_id', parentCategoryId);
  }

  async getProductIdsFromYear({
    toYear,
    fromYear,
    productIds,
    context = {},
  }: GetProductIdsFromYearParams) {
    const knex = super.getActiveManager<SqlEntityManager>(context).getKnex();

    let query = knex('vehiclemodule_vehicle_trim_product_product_variant as vtvpv')
      .distinct('pv.product_id')
      .innerJoin('product_variant as pv', 'vtvpv.product_variant_id', 'pv.id')
      .whereNull('vtvpv.deleted_at')
      .whereNull('pv.deleted_at');

    // Apply year filters
    if (fromYear) {
      query = query.where('vtvpv.year', '>=', fromYear);
    }
    if (toYear) {
      query = query.where('vtvpv.year', '<=', toYear);
    }

    // Apply product ID filter if provided
    if (productIds && productIds.length > 0) {
      query = query.whereIn('pv.product_id', productIds);
    }

    const results = await query;
    return results.map((r) => r.product_id);
  }
}
