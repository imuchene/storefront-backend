import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPaymentStatusToOrders1652272019740
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'payment_status',
        type: 'enum',
        enum: ['Created', 'Processing', 'Succeeded', 'Failed'],
        default: `'Created'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'payment_status');
  }
}
