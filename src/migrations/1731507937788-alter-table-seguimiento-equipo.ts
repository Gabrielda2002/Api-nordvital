import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableSeguimientoEquipo1731507937788 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE seguimiento_equipos
            MODIFY COLUMN responsable INT;
        `);
        
        await queryRunner.createForeignKey("seguimiento_equipos", new TableForeignKey({
            columnNames: ["responsable"],
            referencedColumnNames: ["IdUsuario"],
            referencedTableName: "usuario",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE seguimiento_equipos
            MODIFY COLUMN responsable VARCHAR(255);
        `);

        const table = await queryRunner.getTable("seguimiento_equipos");
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("usuario_id") !== -1);
        await queryRunner.dropForeignKey("seguimiento_equipos", foreignKey as TableForeignKey);
    }

}