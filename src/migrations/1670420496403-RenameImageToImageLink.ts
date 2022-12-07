import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameImageToImageLink1670420496403 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('products', 'image', 'image_url');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('products', 'image_url', 'image');
  }
}
