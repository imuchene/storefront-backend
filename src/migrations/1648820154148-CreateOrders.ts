import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateOrders1648820154148 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'orders',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    default: 'uuid_generate_v4()',
                  },
                  {
                    name: 'customer_id',
                    type: 'uuid',
                  },
                  {
                    name: 'total_amount',
                    type: 'decimal(12,2)',
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
            ]
        }));

        await queryRunner.createForeignKey(
            'orders',
            new TableForeignKey({
              name: 'customer_id_fk',
              columnNames: ['customer_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'customers',
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey(
            'orders',
            new TableForeignKey({
              name: 'customer_id_fk',
              columnNames: ['customer_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'customers',
            }),
          );

        await queryRunner.dropTable('orders')
    }

}
