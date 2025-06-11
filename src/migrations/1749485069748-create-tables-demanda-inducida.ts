import {
  Column,
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTablesDemandaInducida1749485069748
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ? tabla elemento demanda inducida
    await queryRunner.createTable(
      new Table({
        name: "elemento_demanda_inducida",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            length: "60",
            isNullable: false,
          },
          {
            name: "activo",
            type: "tinyint",
            default: 1,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(`
            INSERT INTO elemento_demanda_inducida (nombre) VALUES 
            ('SMS'),
            ('Llamada telefónica'),
            ('Material Educativo'),
            ('Visita preventiva de salud'),
            ('Email'),
            ('Audiobot'),
            ('Sala de espera');
            `);

    //  ? tala tipo demanda inducida
    await queryRunner.createTable(
      new Table({
        name: "tipo_demanda_inducida",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            length: "60",
            isNullable: false,
          },
          {
            name: "activo",
            type: "tinyint",
            default: 1,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(`
            INSERT INTO tipo_demanda_inducida (nombre) VALUES 
            ('Mensaje'),
            ('Comunicación'),
            ('Telefónica'),
            ('Comunicación IVR'),
            ('Volante'),
            ('Afiche'),
            ('Calendario'),
            ('Toldillo'),
            ('Folleto carpeta gestante'),
            ('Carnet de la mujer'),
            ('Carnet del niño'),
            ('Carnet AEIPI'),
            ('Plegable de PYMS'),
            ('Plegable de vacuanción'),
            ('Material educativo'),
            ('Sala de espera');
        `);

    // ? objetivo demanda inducida table
    await queryRunner.createTable(
      new Table({
        name: "objetivo_demanda_inducida",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            length: "40",
            isNullable: false,
          },
          {
            name: "activo",
            type: "tinyint",
            default: 1,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(`
            INSERT INTO objetivo_demanda_inducida (nombre) VALUES 
            ('Inducción al programa'),
            ('Conocimiento estado salud'),
            ('Autocuidado'),
            ('Seguimiento'),
            ('Reprogramación y confirmación');
        `);

    // ? tabla relacion con el usuario
    await queryRunner.createTable(
      new Table({
        name: "relacion_usuario",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            length: "30",
            isNullable: false,
          },
          {
            name: "activo",
            type: "tinyint",
            default: 1,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(`
            INSERT INTO relacion_usuario (nombre) VALUES 
            ('Usuario'),
            ('Hijo (a)'),
            ('Padre'),
            ('Madre'),
            ('Hermano'),
            ('Tío'),
            ('Amigo'),
            ('Otro. Cual');
        `);

    // ? tabla area eps
    await queryRunner.createTable(
      new Table({
        name: "area_eps",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            length: "70",
            isNullable: false,
          },
          {
            name: "activo",
            type: "tinyint",
            default: 1,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(`
            INSERT INTO area_eps (nombre) VALUES 
            ('Afiliaciones'),
            ('Autorizaciones'),
            ('Otra'),
            ('Dificultades para la cita'),
            ('Inoportunidad de la atención'),
            ('Atención IPS con personal o profesional'),
            ('Entrega de medicamentos'),
            ('Realización de procedimientos');
        `);

    // ? tabla resumen seguimiento actividad
    await queryRunner.createTable(
      new Table({
        name: "resumen_seguimiento_actividad",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            length: "60",
            isNullable: false,
          },
          {
            name: "activo",
            type: "tinyint",
            default: 1,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(`
            INSERT INTO resumen_seguimiento_actividad (nombre) VALUES 
            ('Gestión de citas exámenes o autorizaciones'),
            ('Canalización a programas'),
            ('Educación en salud'),
            ('Acompañamiento'),
            ('Ninguna');
        `);

    // ? resultado de la llamada o sala de espera
    await queryRunner.createTable(
      new Table({
        name: "resultado_llamada",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "activo",
            type: "tinyint",
            default: 1,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(`
            INSERT INTO resultado_llamada (nombre) VALUES 
            ('Número equivocado'),
            ('Número no existe'),
            ('Sistema correo de voz'),
            ('No se encuentra el usuario'),
            ('Usuario no desea ser contactado'),
            ('Otro'),
            ('Usuario no acepta la llamada'),
            ('Usuario no se encuentra'),
            ('Usuario fallecido'),
            ('Usuario hospitalizado'),
            ('Usuario retirado'),
            ('Usuario no geo en la unidad');
        `);

    // ? motivo de visita no efectiva

    await queryRunner.createTable(
      new Table({
        name: "motivo_visita",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            length: "40",
            isNullable: false,
          },
          {
            name: "activo",
            type: "tinyint",
            default: 1,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(`
            INSERT INTO motivo_visita (nombre) VALUES 
            ('Dirección errónea'),
            ('Dirección no encontrada'),
            ('No vive allí'),
            ('Nadie atiende la visita'),
            ('No está interesada'),
            ('Otro'),
            ('Olvidó la cita');
        `);

    // ? area persona seguimiento
    await queryRunner.createTable(
      new Table({
        name: "area_persona_seguimiento",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            length: "40",
            isNullable: false,
          },
          {
            name: "activo",
            type: "tinyint",
            default: 1,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(`
            INSERT INTO area_persona_seguimiento (nombre) VALUES 
            ('PYMS'),
            ('Salud Pública'),
            ('Operador Web Help'),
            ('Operador Ápex');
        `);

    // ? tabla demanda inducida
    await queryRunner.createTable(
      new Table({
        name: "demanda_inducida",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "paciente_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "elemento_demanda_inducida_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "tipo_demanda_inducida_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "objetivo_demanda_inducida_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "relacion_usuario_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "area_eps_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "resumen_seguimiento_actividad_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "resultado_llamada_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "motivo_visita_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "area_persona_seguimiento_id",
            type: "int",
            isNullable: true,
          },
          // * numero telefonico con el que se establece el contacto. se deja el numero del paciente en base de datos
          {
            name: "clasificacion",
            type: "tinyint",
            isNullable: true,
            default: 0,
          },
          {
            name: "persona_recibe",
            type: "varchar",
            length: "60",
          },
          // * fecha llamada o sala de espera
          // * hora llamada o sala de espera
          {
            name: "texto_llamada",
            type: "text",
            isNullable: true,
          },
          {
            name: "dificultad_acceso",
            type: "tinyint",
            isNullable: true,
            default: 0,
          },
          {
            name: "area_dificultad",
            type: "enum",
            enum: ["IPS", "EPS"],
            isNullable: true,
          },
          {
            name: "condiocion_paciente",
            type: "tinyint",
            isNullable: true,
            default: 0,
          },
          {
            name: "soporte_recuperados",
            type: "varchar",
            length: "200",
            isNullable: true,
          },
          // {
          //   name: "departamento_id",
          //   type: "int",
          //   isNullable: true,
          // },
          // {
          //   name: "municipio_id",
          //   type: "int",
          //   isNullable: true,
          // },
          // {
          //   name: "barrio_vereda",
          //   type: "varchar",
          //   length: "200",
          //   isNullable: true,
          // },
          // * demas campos que son opcionales que hay que mirar si colocar o mejor tomar de pacientes
          {
            name: "fecha_envio",
            type: "date",
            isNullable: true,
          },
          {
            name: "hora_envio",
            type: "time",
            isNullable: true,
          },
          {
            name: "text_envio",
            type: "text",
            isNullable: true,
          },
          {
            name: "fecha_visita",
            type: "date",
            isNullable: true,
          },
          {
            name: "resumen_visita",
            type: "text",
            isNullable: true,
          },
          {
            name: "persona_seguimiento_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "programa",
            type: "varchar",
            length: "60",
            isNullable: true,
          },
          {
            name: "fecha_cita",
            type: "date",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            isNullable: false
          }
        ],
      })
    );

    // Crear las relaciones usando createForeignKey
    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_elemento",
        columnNames: ["elemento_demanda_inducida_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "elemento_demanda_inducida",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_tipo",
        columnNames: ["tipo_demanda_inducida_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "tipo_demanda_inducida",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_objetivo",
        columnNames: ["objetivo_demanda_inducida_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "objetivo_demanda_inducida",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_relacion",
        columnNames: ["relacion_usuario_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "relacion_usuario",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_area_eps",
        columnNames: ["area_eps_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "area_eps",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_resumen",
        columnNames: ["resumen_seguimiento_actividad_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "resumen_seguimiento_actividad",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_resultado",
        columnNames: ["resultado_llamada_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "resultado_llamada",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_motivo",
        columnNames: ["motivo_visita_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "motivo_visita",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_area_persona",
        columnNames: ["area_persona_seguimiento_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "area_persona_seguimiento",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_persona_seguimiento",
        columnNames: ["persona_seguimiento_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "usuario",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );

    // Agregar la relación faltante con pacientes
    await queryRunner.createForeignKey(
      "demanda_inducida",
      new TableForeignKey({
        name: "FK_demanda_paciente",
        columnNames: ["paciente_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "pacientes",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    // Crear índices para mejorar rendimiento
    await queryRunner.query(
      `CREATE INDEX IDX_demanda_paciente ON demanda_inducida(paciente_id);`
    );
    await queryRunner.query(
      `CREATE INDEX IDX_demanda_fecha_creacion ON demanda_inducida(created_at);`
    );
    // await queryRunner.query(
    //   `CREATE INDEX IDX_demanda_elemento ON demanda_inducida(elemento_demanda_inducida_id);`
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices - CORRECCIÓN: eliminar solamente los índices que existen
    // await queryRunner.query(
    //   `DROP INDEX IDX_demanda_elemento ON demanda_inducida;` // Este índice no existe en el método up
    // );
    await queryRunner.query(
      `DROP INDEX IDX_demanda_fecha_creacion ON demanda_inducida;`
    );
    await queryRunner.query(
      `DROP INDEX IDX_demanda_paciente ON demanda_inducida;`
    );

    // Eliminar claves foráneas
    const table = await queryRunner.getTable("demanda_inducida");
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey("demanda_inducida", foreignKey);
      }
    }

    await queryRunner.dropTable("demanda_inducida");
    await queryRunner.dropTable("area_persona_seguimiento");
    await queryRunner.dropTable("motivo_visita");
    await queryRunner.dropTable("resultado_llamada");
    await queryRunner.dropTable("resumen_seguimiento_actividad");
    await queryRunner.dropTable("area_eps");
    await queryRunner.dropTable("relacion_usuario");
    await queryRunner.dropTable("objetivo_demanda_inducida");
    await queryRunner.dropTable("tipo_demanda_inducida");
    await queryRunner.dropTable("elemento_demanda_inducida");
  }
}
