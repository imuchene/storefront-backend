import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTwoFactorToCustomers1715246854113
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'is_2fa_enabled',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('customers', 'is_2fa_enabled');
  }
}
