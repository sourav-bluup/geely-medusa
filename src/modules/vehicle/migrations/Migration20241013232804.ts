import { Migration } from '@mikro-orm/migrations';

export class Migration20241013232804 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_model" alter column "introduction_year" type text using ("introduction_year"::text);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "vehicle_model" alter column "introduction_year" type integer using ("introduction_year"::integer);',
    );
  }
}
