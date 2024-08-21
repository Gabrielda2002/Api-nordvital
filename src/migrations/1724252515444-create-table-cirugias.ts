import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";
import bcrypt from "bcrypt";

const saltRounds = 10;

export class createTableCirugias1724252515444 implements MigrationInterface {
  name =  "createTableCirugias1724252515444";

  public async up(queryRunner: QueryRunner): Promise<void> {


    // * se crea la tabla cirugias con las columnas requeridas
    await queryRunner.createTable(new Table({
        name: 'cirugias',
        columns: [{
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'

        },{
            name: 'fecha_ordenamiento',
            type: 'date',
        }, {
            name: 'fecha_paraclinicos',
            type: 'date',
        },{
            name: 'fecha_valoracion_anestencia',
            type: 'date',
        },{
            name: 'fecha_cirugia',
            type: 'date',
        },{
            name: 'hora_programada',
            type: 'time',
        },{
            name: 'ips_remitente',
            type: 'int',
        },{
            name: "observaciones",
            type: "text",
        },{
            name: "nombre_especialista",
            type: "varchar",
        }, {
            name: "especialidad_id",
            type: "int",
        },{
            name: 'paciente_id',
            type: 'int',
        },{
            name: 'radicado_id',
            type: 'int', 
        }, {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
        },{
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
        }
    
    ]
    }))

    // * se cambia a null la columna radicacion en la tabla seguimientoauxiliar
    await queryRunner.query('ALTER TABLE \`seguimientoauxiliar\` MODIFY \`Radicacion\` int NULL')

    // * se crea la tabla gestion_auxiliar_cirugias con las columnas requeridas
    await queryRunner.createTable(new Table({
        name: 'gestion_auxiliar_cirugias',
        columns: [{
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
        },{
            name: 'observacion',
            type: 'text'
        },{
            name: 'estado',
            type: 'int'
        },{
            name: 'cup_id',
            type: 'int'
        },{
            name: 'cirugia_id',
            type: 'int'
        },{
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
        },{
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
        }
    ]
    }))

    // * se renombra la columna IdUsuarios a id en la tabla pacientes
    await queryRunner.renameColumn('pacientes', 'IdUsuarios', 'id')

    // * se crea la relacion entre las tablas cirugias y pacientes
    await queryRunner.createForeignKey('cirugias', new TableForeignKey({
        columnNames: ['paciente_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pacientes',
        onDelete: 'CASCADE'
    }))

    // * se crea la relacion entre las tablas cirugias y radicacion
    await queryRunner.createForeignKey('cirugias', new TableForeignKey({
        columnNames: ['radicado_id'],
        referencedColumnNames: ['IdRadicacion'],
        referencedTableName: 'radicacion',
        onDelete: 'CASCADE'
    }))

    // * se crea la relacion entre las tablas gestion_auxiliar_cirugias y cirugias
    await queryRunner.createForeignKey('gestion_auxiliar_cirugias', new TableForeignKey({
        columnNames: ['cirugia_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cirugias',
        onDelete: 'CASCADE'
    }))

    // * se crea la relacion entre las tablas cirugias y especialidad
    await queryRunner.createForeignKey('cirugias', new TableForeignKey({
        columnNames: ['especialidad_id'],
        referencedColumnNames: ['IdEspecialidad'],
        referencedTableName: 'especialidad',
        onDelete: 'CASCADE'
    }))

    // * se crea la columna cirugias_id en la tabla cupspaciente
    await queryRunner.addColumn('cupspaciente', new TableColumn({
        name: 'cirugia_id',
        type: 'int',
        isNullable: true    
    }))

  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    // * se elimina la llave foranea de pacientes en la tabla cirugias
    const pacienteColumnExists = await queryRunner.hasColumn("cirugias", 'paciente_id');
        if (pacienteColumnExists) {
            const table = await queryRunner.getTable("cirugias");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("paciente_id") !== -1);

            if (foreignKey) {
                await queryRunner.dropForeignKey("cirugias", foreignKey);
            }
            
            await queryRunner.dropColumn("cirugias", "paciente_id");
        }

    // * se elimina la llave foranea de radicacion en la tabla cirugias

    const radicadoColumnExists = await queryRunner.hasColumn("cirugias", 'radicado_id');
        if (radicadoColumnExists) {
            const table = await queryRunner.getTable("cirugias");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("radicado_id") !== -1);

            if (foreignKey) {
                await queryRunner.dropForeignKey("cirugias", foreignKey);
            }
            
            await queryRunner.dropColumn("cirugias", "radicado_id");
        }

    // * se elimina la llave foranea de especialidad en la tabla cirugias
    const especialidadColumnExists = await queryRunner.hasColumn("cirugias", 'especialidad_id');
        if (especialidadColumnExists) {
            const table = await queryRunner.getTable("cirugias");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("especialidad_id") !== -1);

            if (foreignKey) {
                await queryRunner.dropForeignKey("cirugias", foreignKey);
            }
            
            await queryRunner.dropColumn("cirugias", "especialidad_id");
        }

    // * se elimina la llave foranea de cirugias en la tabla seguimientoauxiliar
    const cirugiaColumnExists = await queryRunner.hasColumn("gestion_auxiliar_cirugias", 'cirugia_id');
        if (cirugiaColumnExists) {
            const table = await queryRunner.getTable("gestion_auxiliar_cirugias");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("cirugia_id") !== -1);

            if (foreignKey) {
                await queryRunner.dropForeignKey("gestion_auxiliar_cirugias", foreignKey);
            }
            
            await queryRunner.dropColumn("gestion_auxiliar_cirugias", "cirugia_id");
        }

    // * se elimina la tabla gestion_auxiliar_cirugias
    await queryRunner.dropTable('gestion_auxiliar_cirugias')

    // * se renombra la columna id a IdUsuarios en la tabla pacientes
    await queryRunner.renameColumn('pacientes', 'id', 'IdUsuarios')

    // * se elimina la columna cirugias en la tabla seguimientoauxiliar
    await queryRunner.query('ALTER TABLE \`seguimientoauxiliar\` MODIFY \`Radicacion\` int NOT NULL')

    // * se elimina la tabla cirugias
    await queryRunner.dropTable('cirugias')




  }
}
