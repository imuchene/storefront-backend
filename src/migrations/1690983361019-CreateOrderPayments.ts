import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrderPayments1690983361019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'provider_reference',
            type: 'varchar',
          },
          {
            name: 'payment_status',
            type: 'varchar',
          },
          {
            name: 'reason',
            type: 'text',
          },
          {
            name: 'transaction_code',
            type: 'varchar',
          },
          {
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'order_payments',
      new TableForeignKey({
        name: 'order_payments_order_id_fk',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'order_payments',
      new TableForeignKey({
        name: 'order_payments_order_id_fk',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
      }),
    );

    await queryRunner.dropTable('order_payments');
  }
}
