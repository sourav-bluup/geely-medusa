import { Context } from '@medusajs/types';
import { MikroOrmBase } from '@medusajs/utils';
import { SqlEntityManager } from '@mikro-orm/postgresql';

export class ModelRepository extends MikroOrmBase {
  constructor() {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);
  }

  async getSpecificationsById({
    modelId,
    context = {},
    group,
    trim_id,
  }: {
    modelId: string;
    context?: Context;
    group?: string;
    trim_id?: string | string[];
  }) {
    const knex = super.getActiveManager<SqlEntityManager>(context).getKnex();

    let query = knex
      .select({
        id: 'vts.id',
        trim_title: 'vt.title',
        trim_id: 'vt.id',
        group: 'vts.group',
        group_value: 'vts.group_value',
        unit: 'vts.unit',
        value: 'vts.value',
        type: 'vts.type',
        is_active: 'vts.is_active',
        order: 'vts.order',
      })
      .from('vehicle_trim_specification as vts')
      .leftJoin('vehicle_trim as vt', 'vts.trim_id', '=', 'vt.id')
      .where('vts.model_id', modelId)
      .orderBy('vts.order');

    if (group) {
      query.where('vts.group', group);
    }

    if (trim_id) {
      query.whereIn('vts.trim_id', Array.isArray(trim_id) ? trim_id : [trim_id]);
    }

    return query;
  }

  async getSpecificationGroups(modelId: string, context: Context = {}) {
    const knex = super.getActiveManager<SqlEntityManager>(context).getKnex();

    return knex
      .select(
        knex.raw('vt.group as title, COUNT(*) as count'),
        knex.raw(
          "STRING_AGG(DISTINCT CASE WHEN trim.id IS NOT NULL THEN trim.title ELSE NULL END, ', ') as trims",
        ),
      )
      .from('vehicle_trim_specification as vt')
      .leftJoin('vehicle_trim as trim', 'vt.trim_id', 'trim.id')
      .where('vt.model_id', modelId)
      .groupBy('vt.group')
      .orderBy('vt.group');
  }
}
