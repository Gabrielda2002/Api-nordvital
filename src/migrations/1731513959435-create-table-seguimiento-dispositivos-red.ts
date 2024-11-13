import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableSeguimientoDispositivosRed1731513959435 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // se crea la tabla seguimiento_dispositivos_red
        await queryRunner.createTable(new Table({
            name: 'seguimiento_dispositivos_red',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'dispositivo_id',
                    type: 'int',
                },
                {
                    name: 'tipo_evento',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'descripcion',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'responsable',
                    type: 'int',
                },
                {
                    name: 'fecha_creacion',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'fecha_actualizacion',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                }
            ] ,
        }), true);

        // se crea la relacion con la tabla dispositivos_red
        await queryRunner.createForeignKey('seguimiento_dispositivos_red', new TableForeignKey({
            columnNames: ['responsable'],
            referencedColumnNames: ['IdUsuario'],
            referencedTableName: 'usuario',
            onDelete: 'CASCADE',
        }));
        // se cambia el tipo de de date a varchar
        await queryRunner.query(`
            ALTER TABLE seguimiento_equipos
            MODIFY COLUMN tipo_evento varchar(255);
        `);

        // se agregan los campos de fechas a la tabla seguimiento_equipos
        await queryRunner.query(`
            ALTER TABLE seguimiento_equipos
            ADD COLUMN fecha_creacion datetime DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN fecha_actualizacion datetime DEFAULT CURRENT_TIMESTAMP;
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('seguimiento_dispositivos_red');
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('responsable') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('seguimiento_dispositivos_red', foreignKey);
        }
        await queryRunner.dropTable('seguimiento_dispositivos_red');


        await queryRunner.query(`
            ALTER TABLE seguimiento_equipos
            MODIFY COLUMN tipo_evento varchar(255);
        `);

        // se eliminan los campos de fechas de la tabla seguimiento_equipos
        await queryRunner.query(`
            ALTER TABLE seguimiento_equipos
            DROP COLUMN fecha_creacion,
            DROP COLUMN fecha_actualizacion;
        `);
    }

}