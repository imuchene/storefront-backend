import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCustomers1648820125567 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'customers',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    default: 'uuid_generate_v4()',
                  },
                  {
                    name: 'name',
                    type: 'varchar',
                  },
                  {
                    name: 'email',
                    type: 'varchar',
                  },
                  {
                    name: 'phone_number',
                    type: 'varchar',
                  },
                  {
                    name: 'password_digest',
                    type: 'varchar',
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
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('customers')
    }

}
