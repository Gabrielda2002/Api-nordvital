import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import bcrypt from "bcrypt";

const saltRounds = 10;

export class alterTableArchivos1724188034994 implements MigrationInterface {
    name = 'alterTableArchivos1724188034994';

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.addColumn('archivos', new TableColumn({
        name: 'name_saved',
        type: 'varchar',
        isNullable: true
       }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropColumn('archivos', 'name_saved');

    }
}
