import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhoneNumberConfirmationToCustomers1716287899327 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'is_phone_number_confirmed',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('customers', 'is_phone_number_confirmed');
  }
}
