import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class RemoveUnitPriceFromOrderItems1673264642338 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('order_items', 'unit_price');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('order_items', new TableColumn({
            name: 'unit_price',
            type: 'decimal(12,2)'
        }));
    }

}
