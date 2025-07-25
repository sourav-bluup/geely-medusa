import { Migration } from '@mikro-orm/migrations';

export class Migration20241011133450 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "vehicle_make" ("id" text not null, "name" text not null, "country" text null, "mileage" integer null, "year_founded" integer null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_make_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table if not exists "vehicle_model" ("id" text not null, "title" text not null, "introduction_year" integer null, "discontinued_year" integer null, "make_id" text not null, "engine" text null, "transmission" text null, "body_type" text null, "fuel_type" text null, "drive_type" text null, "door_count" integer null, "seat_count" integer null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_model_pkey" primary key ("id"));',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_engine" ON "vehicle_model" (engine) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_transmission" ON "vehicle_model" (transmission) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_body_type" ON "vehicle_model" (body_type) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_fuel_type" ON "vehicle_model" (fuel_type) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_drive_type" ON "vehicle_model" (drive_type) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_door_count" ON "vehicle_model" (door_count) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_seat_count" ON "vehicle_model" (seat_count) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_model_make_id" ON "vehicle_model" (make_id) WHERE deleted_at IS NULL;',
    );

    this.addSql(
      'create table if not exists "vehicle_trim" ("id" text not null, "title" text not null, "is_default" boolean not null default false, "model_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_trim_pkey" primary key ("id"));',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_trim_is_default" ON "vehicle_trim" (is_default) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_trim_model_id" ON "vehicle_trim" (model_id) WHERE deleted_at IS NULL;',
    );

    this.addSql(
      "create table if not exists \"vehicle_trim_specification\" (\"id\" text not null, \"group_value\" text null, \"value\" text null, \"group\" text null, \"type\" text check (\"type\" in ('text', 'boolean', 'number')) not null default 'text', \"model_id\" text not null, \"trim_id\" text not null, \"unit\" text check (\"unit\" in ('kg', 'km', 'mm', 'cm', 'l', 'm', 'cm3', 'bhp', 'nm', 'rpm', 'hp', 'kw', 'cc', 'ps', 'kgm', 'lkm', 'kmpl', 'kmhr', 'kmph')) null, \"is_active\" boolean not null default true, \"order\" integer not null default 0, \"metadata\" jsonb null, \"created_at\" timestamptz not null default now(), \"updated_at\" timestamptz not null default now(), \"deleted_at\" timestamptz null, constraint \"vehicle_trim_specification_pkey\" primary key (\"id\"));",
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_trim_specification_model_id" ON "vehicle_trim_specification" (model_id) WHERE deleted_at IS NULL;',
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vehicle_trim_specification_trim_id" ON "vehicle_trim_specification" (trim_id) WHERE deleted_at IS NULL;',
    );

    this.addSql(
      'create table if not exists "vehicle_variant_media" ("id" text not null, "title" text not null, "description" text null, "url" text not null, "file_id" text not null, "variant_id" text not null, "mime_type" text not null, "media_type" text check ("media_type" in (\'front\', \'back\', \'trim\', \'bodyColor\', \'interiorColor\', \'exteriorColor\', \'other\')) not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_variant_media_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table if exists "vehicle_model" add constraint "vehicle_model_make_id_foreign" foreign key ("make_id") references "vehicle_make" ("id") on update cascade;',
    );

    this.addSql(
      'alter table if exists "vehicle_trim" add constraint "vehicle_trim_model_id_foreign" foreign key ("model_id") references "vehicle_model" ("id") on update cascade;',
    );

    this.addSql(
      'alter table if exists "vehicle_trim_specification" add constraint "vehicle_trim_specification_model_id_foreign" foreign key ("model_id") references "vehicle_model" ("id") on update cascade;',
    );
    this.addSql(
      'alter table if exists "vehicle_trim_specification" add constraint "vehicle_trim_specification_trim_id_foreign" foreign key ("trim_id") references "vehicle_trim" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_model" drop constraint if exists "vehicle_model_make_id_foreign";',
    );

    this.addSql(
      'alter table if exists "vehicle_trim" drop constraint if exists "vehicle_trim_model_id_foreign";',
    );

    this.addSql(
      'alter table if exists "vehicle_trim_specification" drop constraint if exists "vehicle_trim_specification_model_id_foreign";',
    );

    this.addSql(
      'alter table if exists "vehicle_trim_specification" drop constraint if exists "vehicle_trim_specification_trim_id_foreign";',
    );

    this.addSql('drop table if exists "vehicle_make" cascade;');

    this.addSql('drop table if exists "vehicle_model" cascade;');

    this.addSql('drop table if exists "vehicle_trim" cascade;');

    this.addSql('drop table if exists "vehicle_trim_specification" cascade;');

    this.addSql('drop table if exists "vehicle_variant_media" cascade;');
  }
}
