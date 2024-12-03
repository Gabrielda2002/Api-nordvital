import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableEquipos1733240778632 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Eliminar columna area
        await queryRunner.dropColumn('equipos', 'area');

        // Agregar columna candado
        await queryRunner.addColumn('equipos', new TableColumn({
            name: 'candado',
            type: 'tinyint',
            default: 0
        }));

        //agregar la columna de la clave del candado
        await queryRunner.addColumn('equipos', new TableColumn({
            name: 'clave_candado',
            type: 'int',
            default: null
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios
        await queryRunner.query(`ALTER TABLE equipos DROP COLUMN clave_candado`);
        await queryRunner.query(`ALTER TABLE equipos DROP COLUMN candado`);
        
        // Recrear columna area
        await queryRunner.query(`ALTER TABLE equipos ADD area VARCHAR(255)`);
    }
}