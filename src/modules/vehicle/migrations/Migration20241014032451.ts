import { Migration } from '@mikro-orm/migrations';

export class Migration20241014032451 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_variant_media" rename column "product_variant_id" to "pp_variant_id";',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_variant_media" rename column "pp_variant_id" to "product_variant_id";',
    );
  }
}
