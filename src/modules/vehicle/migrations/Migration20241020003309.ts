import { Migration } from '@mikro-orm/migrations';

export class Migration20241020003309 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "vehicle_model" add column if not exists "handle" text null;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_handle" ON "vehicle_model" (handle) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "vehicle_trim" add column if not exists "handle" text null;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_vehicle_trim_handle" ON "vehicle_trim" (handle) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_vehicle_model_handle";');
    this.addSql('alter table if exists "vehicle_model" drop column if exists "handle";');

    this.addSql('drop index if exists "IDX_vehicle_trim_handle";');
    this.addSql('alter table if exists "vehicle_trim" drop column if exists "handle";');
  }

}
