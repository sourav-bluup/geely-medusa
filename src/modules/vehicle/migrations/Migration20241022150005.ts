import { Migration } from '@mikro-orm/migrations';

export class Migration20241022150005 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_trim_specification_group" ON "vehicle_trim_specification" ("group") WHERE deleted_at IS NULL;',
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_variant_media_variant_id" ON "vehicle_variant_media" (variant_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_variant_media_mime_type" ON "vehicle_variant_media" (mime_type) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_variant_media_media_type" ON "vehicle_variant_media" (media_type) WHERE deleted_at IS NULL;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_vehicle_trim_specification_group";');

    this.addSql('drop index if exists "IDX_vehicle_variant_media_variant_id";');
    this.addSql('drop index if exists "IDX_vehicle_variant_media_mime_type";');
    this.addSql('drop index if exists "IDX_vehicle_variant_media_media_type";');
  }
}
