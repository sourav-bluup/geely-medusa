import { Migration } from '@mikro-orm/migrations';

export class Migration20241014023120 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop index if exists "IDX_vehicle_model_category_id";');
    this.addSql(
      'alter table if exists "vehicle_model" rename column "category_id" to "product_category_id";',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_product_category_id" ON "vehicle_model" (product_category_id) WHERE deleted_at IS NULL;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_vehicle_model_product_category_id";');
    this.addSql(
      'alter table if exists "vehicle_model" rename column "product_category_id" to "category_id";',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_category_id" ON "vehicle_model" (category_id) WHERE deleted_at IS NULL;',
    );
  }
}
