import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AddUniquenessConstraintToPaymentRequests1691073080496
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'payment_requests',
      new TableUnique({
        name: 'uniqueProviderReferencePaymentRequests',
        columnNames: ['provider_reference', 'secondary_provider_reference'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'payment_requests',
      'uniqueProviderReferencePaymentRequests',
    );
  }
}
