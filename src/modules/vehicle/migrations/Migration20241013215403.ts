import { Migration } from '@mikro-orm/migrations';

export class Migration20241013215403 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_model" add column if not exists "introduction_year_id" text null, add column if not exists "engine_id" text null, add column if not exists "transmission_id" text null, add column if not exists "body_type_id" text null, add column if not exists "fuel_type_id" text null, add column if not exists "drive_type_id" text null, add column if not exists "door_count_id" text null, add column if not exists "seat_count_id" text null;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_introduction_year_id" ON "vehicle_model" (introduction_year_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_engine_id" ON "vehicle_model" (engine_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_transmission_id" ON "vehicle_model" (transmission_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_body_type_id" ON "vehicle_model" (body_type_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_fuel_type_id" ON "vehicle_model" (fuel_type_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_drive_type_id" ON "vehicle_model" (drive_type_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_door_count_id" ON "vehicle_model" (door_count_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_seat_count_id" ON "vehicle_model" (seat_count_id) WHERE deleted_at IS NULL;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_vehicle_model_introduction_year_id";');
    this.addSql('drop index if exists "IDX_vehicle_model_engine_id";');
    this.addSql('drop index if exists "IDX_vehicle_model_transmission_id";');
    this.addSql('drop index if exists "IDX_vehicle_model_body_type_id";');
    this.addSql('drop index if exists "IDX_vehicle_model_fuel_type_id";');
    this.addSql('drop index if exists "IDX_vehicle_model_drive_type_id";');
    this.addSql('drop index if exists "IDX_vehicle_model_door_count_id";');
    this.addSql('drop index if exists "IDX_vehicle_model_seat_count_id";');
    this.addSql(
      'alter table if exists "vehicle_model" drop column if exists "introduction_year_id";',
    );
    this.addSql('alter table if exists "vehicle_model" drop column if exists "engine_id";');
    this.addSql('alter table if exists "vehicle_model" drop column if exists "transmission_id";');
    this.addSql('alter table if exists "vehicle_model" drop column if exists "body_type_id";');
    this.addSql('alter table if exists "vehicle_model" drop column if exists "fuel_type_id";');
    this.addSql('alter table if exists "vehicle_model" drop column if exists "drive_type_id";');
    this.addSql('alter table if exists "vehicle_model" drop column if exists "door_count_id";');
    this.addSql('alter table if exists "vehicle_model" drop column if exists "seat_count_id";');
  }
}
