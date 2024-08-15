import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTablesSscDos1723758957184 implements MigrationInterface {
    name = 'CreateTablesSscDos1723758957184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'arhivos',
            columns: [{
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            }, {
                name: 'nombre',
                type: 'varchar'
            }, {
                name: 'fecha',
                type: 'date'
            }, {
                name: 'tipo',
                type: 'varchar'
            }, {
                name: 'size',
                type: 'int'
            }]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }
}
