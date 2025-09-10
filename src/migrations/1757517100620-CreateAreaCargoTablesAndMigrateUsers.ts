import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateAreaCargoTablesAndMigrateUsers1757517100620
  implements MigrationInterface
{
  name = "CreateAreaCargoTablesAndMigrateUsers1757517100620";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // PASO 1: Temporalmente deshabilitar el modo estricto para limpiar datos
    await queryRunner.query(`SET SESSION sql_mode = 'ALLOW_INVALID_DATES'`);
    
    // PASO 2: Limpiar datos inválidos usando un enfoque más robusto
    await queryRunner.query(`
      UPDATE \`usuario\` 
      SET \`fecha-actualizacion\` = CURRENT_TIMESTAMP(6) 
      WHERE YEAR(\`fecha-actualizacion\`) = 0 
         OR \`fecha-actualizacion\` IS NULL 
         OR \`fecha-actualizacion\` < '1970-01-01'
    `);

    await queryRunner.query(`
      UPDATE \`usuario\` 
      SET \`fecha-creacion\` = CURRENT_TIMESTAMP(6) 
      WHERE YEAR(\`fecha-creacion\`) = 0 
         OR \`fecha-creacion\` IS NULL 
         OR \`fecha-creacion\` < '1970-01-01'
    `);

    // PASO 3: Restaurar el modo estricto
    await queryRunner.query(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'`);

    // PASO 4: Crear tabla area (solo si no existe)
    const areaTableExists = await queryRunner.hasTable('area');
    if (!areaTableExists) {
      await queryRunner.createTable(new Table({
          name: 'area',
          columns: [
              {
                  name: 'id',
                  type: 'int',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment'
              },
              {
                  name: 'nombre',
                  type: 'varchar',
                  length: '100',
                  isNullable: false,
                  isUnique: true
              },
              {
                  name: 'descripcion',
                  type: 'varchar',
                  length: '500',
                  isNullable: true
              },
              {
                  name: 'jefe_area_id',
                  type: 'int',
                  isNullable: true
              },
              {
                  name: 'estado',
                  type: 'tinyint',
                  default: true
              },
              {
                  name: 'fecha_creacion',
                  type: 'datetime',
                  precision: 6,
                  default: 'CURRENT_TIMESTAMP(6)'
              },
              {
                  name: 'fecha_actualizacion',
                  type: 'datetime',
                  precision: 6,
                  default: 'CURRENT_TIMESTAMP(6)',
                  onUpdate: 'CURRENT_TIMESTAMP(6)'
              }
          ]
      }));
    }

    // PASO 5: Crear tabla cargo (solo si no existe)
    const cargoTableExists = await queryRunner.hasTable('cargo');
    if (!cargoTableExists) {
      await queryRunner.createTable(new Table({
          name: 'cargo',
          columns: [
              {
                  name: 'id',
                  type: 'int',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment'
              },
              {
                  name: 'nombre',
                  type: 'varchar',
                  length: '200',
                  isNullable: false,
                  isUnique: true
              },
              {
                  name: 'descripcion',
                  type: 'varchar',
                  length: '500',
                  isNullable: true
              },
              {
                  name: 'area_id',
                  type: 'int',
                  isNullable: true
              },
              {
                  name: 'estado',
                  type: 'tinyint',
                  default: true
              },
              {
                  name: 'fecha_creacion',
                  type: 'datetime',
                  precision: 6,
                  default: 'CURRENT_TIMESTAMP(6)'
              },
              {
                  name: 'fecha_actualizacion',
                  type: 'datetime',
                  precision: 6,
                  default: 'CURRENT_TIMESTAMP(6)',
                  onUpdate: 'CURRENT_TIMESTAMP(6)'
              }
          ]
      }));
    }

    // PASO 6: Agregar columnas a usuario (solo si no existen)
    const usuarioTable = await queryRunner.getTable('usuario');
    
    if (usuarioTable && !usuarioTable.findColumnByName('cargo_id')) {
      await queryRunner.addColumn('usuario',
          new TableColumn({
              name: 'cargo_id',
              type: 'int',
              isNullable: true
          })
      );
    }
    
    if (usuarioTable && !usuarioTable.findColumnByName('fecha_inicio_contrato')) {
      await queryRunner.addColumn('usuario',
          new TableColumn({
              name: "fecha_inicio_contrato",
              type: "date",
              isNullable: true
          })
      );
    }
    
    if (usuarioTable && !usuarioTable.findColumnByName('tipo_contrato')) {
      await queryRunner.addColumn('usuario',
          new TableColumn({
              name: "tipo_contrato",
              type: "enum",
              enum: ["FIJO", "INDEFINIDO", "POR OBRA O LABOR", "PRESTACION DE SERVICIOS"],
              isNullable: true
          })
      );
    }

    // PASO 7: Insertar datos (solo si no existen)
    const areaCount = await queryRunner.query(`SELECT COUNT(*) as count FROM \`area\``);
    if (areaCount[0].count === 0) {
      await queryRunner.query(`
          INSERT INTO \`area\` (\`nombre\`, \`estado\`) VALUES
          ('LABORATORIO CLINICO', 1),
          ('ODONTOLOGIA', 1),
          ('ENFERMERIA', 1),
          ('TERAPEUTICO', 1),
          ('ADMINISTRATIVA', 1),
          ('MEDICINA GENERAL', 1),
          ('SERVICIO AL CLIENTE', 1),
          ('SSTSG', 1),
          ('SISTEMAS', 1),
          ('OPTICA', 1),
          ('LOGISTICO', 1),
          ('SIAU', 1),
          ('DIRECCION MEDICA', 1),
          ('GERENCIA', 1),
          ('CONTABILIDAD', 1),
          ('COMPRAS', 1),
          ('REDES SOCIALES Y COMUNICACIONES', 1),
          ('CALIDAD', 1),
          ('GESTION HUMANA', 1),
          ('JURIDICA', 1),
          ('ARCHIVO CLINICO', 1),
          ('ASISTENCIAL', 1),
          ('MÉDICO', 1)
      `);
    }

    const cargoCount = await queryRunner.query(`SELECT COUNT(*) as count FROM \`cargo\``);
    if (cargoCount[0].count === 0) {
      await queryRunner.query(`
          INSERT INTO \`cargo\` (\`nombre\`, \`estado\`) VALUES
          ('AUXILIAR LABORATORIO', 1),
          ('ODONTOLOGO', 1),
          ('AUXILIAR ENFERMERIA', 1),
          ('FISIOTERAPEUTA', 1),
          ('NUTRICIONISTA', 1),
          ('AUXILIAR ADMINISTRATIVO', 1),
          ('MEDICO GENERAL', 1),
          ('AUXILIAR DE SERVICIO AL USUARIO', 1),
          ('AUXILIAR DE SGSST', 1),
          ('COORDINADORA DE ENFERMERIA', 1),
          ('COORDINADOR EN SISTEMAS DE INFORMACION NACIONAL', 1),
          ('AUX ADMINISTRATIVO-OPTICA', 1),
          ('FISIOTERAPEUTA COORD', 1),
          ('ENFERMERA JEFE', 1),
          ('AUXILIAR SERVICIOS GENERALES', 1),
          ('BACTERIOLOGO', 1),
          ('TRABAJADORA SOCIAL', 1),
          ('AUXILIAR DE ENFERMERIA', 1),
          ('AUXILIAR SISTEMAS', 1),
          ('JEFE DE AUTORIZACIONES', 1),
          ('JEFE SERVICIO AL USUARIO', 1),
          ('COORDINADOR RECURSOS FISICOS Y DE APOYO REGIONAL', 1),
          ('COORDINADOR ADMINISTRATIVO DE SEDE', 1),
          ('GERENTE', 1),
          ('PROFESIONAL ADMINISTRATIVO OPTICA', 1),
          ('COORDINADOR ADMINISTRATIVO', 1),
          ('AUXILIAR CONTABLE', 1),
          ('AUXILIAR ENFERMERIA PYM', 1),
          ('AUXILIAR SERVICIO AL USUARIO', 1),
          ('LIDER DE COMPRAS', 1),
          ('ORIENTADOR', 1),
          ('ASISTENTE ADMINISTRATIVO (CONTABILIDAD-COMPRAS)', 1),
          ('ENFERMERA JEFE - COORDINADORA', 1),
          ('PSICOLOGO', 1),
          ('FONOAUDIOLOGA', 1),
          ('DISEÑADOR GRAFICO', 1),
          ('DIRECTOR MEDICO NACIONAL', 1),
          ('AUXILIAR ODONTOLOGIA', 1),
          ('AUXILIAR DE ADMINISTRATIVO', 1),
          ('COORDINADOR DE LABORATORIO NACIONAL', 1),
          ('ASISTENTE CENTRO DE INFORMACION', 1),
          ('LIDER DE CALIDAD', 1),
          ('JEFE DE SISTEMAS', 1),
          ('OFICIAL DE CUMPLIMIENTO', 1),
          ('COORDINADOR NACIONAL DE GESTION HUMANA', 1),
          ('FACTURADOR', 1),
          ('ASISTENTE ADMINISTRATIVO', 1),
          ('FONOAUDIOLOGO', 1),
          ('AUXILIAR JURIDICO', 1),
          ('AUXILIAR DE COMPRAS', 1),
          ('AUXILIAR ARCHIVO', 1),
          ('COORDINADOR SERVICIO AL USUARIO REGIONAL', 1),
          ('OPTOMETRA', 1),
          ('COORDINADOR DE CALIDAD NACIONAL', 1),
          ('COORDINADORA SEDE', 1),
          ('AUXILIAR MANTENIMIENTO', 1),
          ('LIDER CALLCENTER', 1),
          ('JEFE SIAU', 1),
          ('MÉDICO', 1),
          ('PROFESIONAL DE GESTIÓN HUMANA', 1),
          ('TERAPIA OCUPACIONAL', 1)
      `);
    }

    // PASO 8: Crear foreign keys AL FINAL con validaciones
    
    // FK 1: area.jefe_area_id -> usuario.id
    const areaFKExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
      WHERE CONSTRAINT_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'area' 
        AND REFERENCED_TABLE_NAME = 'usuario'
        AND CONSTRAINT_NAME LIKE '%jefe_area_id%'
    `);
    
    if (areaFKExists[0].count === 0) {
      await queryRunner.createForeignKey(
        "area",
        new TableForeignKey({
          columnNames: ["jefe_area_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "usuario",
          onDelete: "SET NULL",
          onUpdate: "NO ACTION",
        })
      );
    }

    // FK 2: cargo.area_id -> area.id
    const cargoAreaFKExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
      WHERE CONSTRAINT_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'cargo' 
        AND REFERENCED_TABLE_NAME = 'area'
        AND CONSTRAINT_NAME LIKE '%area_id%'
    `);
    
    if (cargoAreaFKExists[0].count === 0) {
      await queryRunner.createForeignKey(
        "cargo",
        new TableForeignKey({
          columnNames: ["area_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "area",
          onDelete: "SET NULL",
          onUpdate: "NO ACTION",
        })
      );
    }

    // FK 3: usuario.cargo_id -> cargo.id
    const usuarioCargoFKExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
      WHERE CONSTRAINT_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'usuario' 
        AND REFERENCED_TABLE_NAME = 'cargo'
        AND CONSTRAINT_NAME LIKE '%cargo_id%'
    `);
    
    if (usuarioCargoFKExists[0].count === 0) {
      await queryRunner.createForeignKey(
        "usuario",
        new TableForeignKey({
          columnNames: ["cargo_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "cargo",
          onDelete: "SET NULL",
          onUpdate: "NO ACTION",
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys usando dropForeignKey con los nombres exactos
    await queryRunner.query(
      `ALTER TABLE \`usuario\` DROP FOREIGN KEY IF EXISTS \`FK_usuario_cargo_id\``
    );
    await queryRunner.query(
      `ALTER TABLE \`cargo\` DROP FOREIGN KEY IF EXISTS \`FK_cargo_area_id\``
    );
    await queryRunner.query(
      `ALTER TABLE \`area\` DROP FOREIGN KEY IF EXISTS \`FK_area_jefe_area_id\``
    );

    // Eliminar columnas de usuario
    await queryRunner.dropColumn("usuario", "tipo_contrato");
    await queryRunner.dropColumn("usuario", "fecha_inicio_contrato");
    await queryRunner.dropColumn("usuario", "cargo_id");

    // Eliminar tablas en orden correcto
    await queryRunner.dropTable("cargo");
    await queryRunner.dropTable("area");
  }
}
