import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AllowNullValuesInProviderReference1693923264688 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('payment_requests', 'provider_reference', new TableColumn({
            name: 'provider_reference',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('payment_requests', 'provider_reference', new TableColumn({
            name: 'provider_reference',
            type: 'varchar',
            isNullable: false,
        }));
    }

}
