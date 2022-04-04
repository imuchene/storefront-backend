import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateOrderItems1649079742594 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'order_items',
            columns: [
                {
                    
                    name: 'customer_id',
                    type: 'uuid',
                },
                {
                    
                    name: 'product_id',
                    type: 'uuid',
                },
                {
                    name: 'unit_price',
                    type: 'decimal(12,2)',
                },
                {
                    name: 'quantity',
                    type: 'integer',
                }
            ],
        }));

        await queryRunner.createForeignKeys('order_items', [
            new TableForeignKey({
                name: 'customer_id_fk',
                columnNames: ['customer_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'customers',
              }),
            new TableForeignKey({
                name: 'product_id_fk',
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'products',
            }),
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys('order_items', [
            new TableForeignKey({
                name: 'customer_id_fk',
                columnNames: ['customer_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'customers',
              }),
            new TableForeignKey({
                name: 'product_id_fk',
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'products',
            }),
        ]);
        await queryRunner.dropTable('order_items');
    }

}
