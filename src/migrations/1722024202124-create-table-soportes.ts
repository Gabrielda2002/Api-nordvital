import { table } from "console";
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableSoportes1722024202124 implements MigrationInterface {
    name = 'CreateTableSoportes1722024202124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name: "soportes",
                columns:[
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "nombre",
                        type: "varchar",
                        length: "150", 
                        isNullable: false
                    },
                    {
                        name: "url",
                        type: "text",
                        length: "200",
                        isNullable: false
                    },
                    {
                        name: "id_radicacion",
                        type: "int",
                        isNullable: false
                    }
                ]
            })
        )

        await queryRunner.createForeignKey(
            'soportes',
            new TableForeignKey({
                columnNames: ['id_radicacion'],
                referencedColumnNames: ['IdRadicacion'], 
                referencedTableName: 'radicacion',
                onDelete: 'CASCADE'
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable("soportes");

        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("id_radicacion") !== -1);

        if (foreignKey) {
            await queryRunner.dropForeignKey("soportes", foreignKey);
        }

        await queryRunner.dropTable("soportes");

    }

}
