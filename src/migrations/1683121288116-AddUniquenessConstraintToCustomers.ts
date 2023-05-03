import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AddUniquenessConstraintToCustomers1683121288116
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'customers',
      new TableUnique({
        name: 'uniquePhoneNumber',
        columnNames: ['phone_number'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('customers', 'uniquePhoneNumber');
  }
}
