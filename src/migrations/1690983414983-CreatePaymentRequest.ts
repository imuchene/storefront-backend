import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePaymentRequest1690983414983 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_requests',
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
            name: 'secondary_provider_reference',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'text',
          },
          {
            name: 'payment_method',
            type: 'varchar',
          },
          {
            name: 'status',
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
      'payment_requests',
      new TableForeignKey({
        name: 'payment_request_order_id_fk',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'payment_requests',
      new TableForeignKey({
        name: 'payment_requests_order_id_fk',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
      }),
    );

    await queryRunner.dropTable('payment_requests');
  }
}
