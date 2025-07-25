import { Migration } from '@mikro-orm/migrations';

export class Migration20241013211439 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_variant_media" drop constraint if exists "vehicle_variant_media_media_type_check";',
    );

    this.addSql(
      'alter table if exists "vehicle_model" add column if not exists "category_id" text null;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_category_id" ON "vehicle_model" (category_id) WHERE deleted_at IS NULL;',
    );

    this.addSql(
      'alter table if exists "vehicle_variant_media" alter column "media_type" type text using ("media_type"::text);',
    );
    this.addSql(
      "alter table if exists \"vehicle_variant_media\" add constraint \"vehicle_variant_media_media_type_check\" check (\"media_type\" in ('main', 'front', 'back', 'trim', 'bodyColor', 'interiorColor', 'exteriorColor', 'other'));",
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_variant_media" drop constraint if exists "vehicle_variant_media_media_type_check";',
    );

    this.addSql('drop index if exists "IDX_vehicle_model_category_id";');
    this.addSql('alter table if exists "vehicle_model" drop column if exists "category_id";');

    this.addSql(
      'alter table if exists "vehicle_variant_media" alter column "media_type" type text using ("media_type"::text);',
    );
    this.addSql(
      "alter table if exists \"vehicle_variant_media\" add constraint \"vehicle_variant_media_media_type_check\" check (\"media_type\" in ('front', 'back', 'trim', 'bodyColor', 'interiorColor', 'exteriorColor', 'other'));",
    );
  }
}
