import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AddUniquenessConstraintToOrderPayments1691073047948
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'order_payments',
      new TableUnique({
        name: 'uniqueProviderReferenceOrderPayments',
        columnNames: ['provider_reference', 'transaction_code'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'order_payments',
      'uniqueProviderReferenceOrderPayments',
    );
  }
}
