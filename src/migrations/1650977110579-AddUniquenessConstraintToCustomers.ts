import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUniquenessConstraintToCustomers1650977110579
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'customers',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'customers',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
      }),
    );
  }
}
