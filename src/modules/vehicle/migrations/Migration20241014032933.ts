import { Migration } from '@mikro-orm/migrations';

export class Migration20241014032933 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_variant_media" rename column "pp_variant_id" to "variant_id";',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_variant_media" rename column "variant_id" to "pp_variant_id";',
    );
  }
}
