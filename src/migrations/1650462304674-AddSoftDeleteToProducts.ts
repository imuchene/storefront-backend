import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSoftDeleteToProducts1650462304674
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'is_discontinued');

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'is_discontinued',
        type: 'boolean',
        default: false,
      }),
    );
    await queryRunner.dropColumn('products', 'deleted_at');
  }
}
