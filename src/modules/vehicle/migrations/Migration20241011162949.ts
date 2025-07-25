import { Migration } from '@mikro-orm/migrations';

export class Migration20241011162949 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_trim" add column if not exists "sort_rank" integer not null default 0;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_trim_sort_rank" ON "vehicle_trim" (sort_rank) WHERE deleted_at IS NULL;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_vehicle_trim_sort_rank";');
    this.addSql('alter table if exists "vehicle_trim" drop column if exists "sort_rank";');
  }
}
