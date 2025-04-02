import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTablesInventarioGeneral1743539414403 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "inventario_general",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "id_clasificacion",
                        type: "int",
                    },
                    {
                        name: "id_activo",
                        type: "int",
                    },
                    {
                        name: "marca",
                        type: "varchar",
                        length: "150",
                        isNullable: true,
                    },
                    {
                        name: "modelo",
                        type: "varchar",
                        length: "150",
                        isNullable: true,
                    },
                    {
                        name: "id_material",
                        type: "int",
                    },
                    {
                        name: "numero_serial",
                        type: "varchar",
                        length: "150",
                        isNullable: true,
                    },
                    {
                        name: "id_estado",
                        type: "int",
                    },
                    {
                        name: "id_tipo_area",
                        type: "int",
                    },
                    {
                        name: "id_area_dependencia",
                        type: "int",
                    },
                    {
                        name: "ubicacion",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "id_tipo_activo",
                        type: "int",
                    },
                    {
                        name: "cantidad",
                        type: "int",
                    },
                    {
                        name: "id_responsable",
                        type: "int",
                    },
                    {
                        name: "otros_detalles",
                        type: "text",
                    },
                    {
                        name: "fecha_adquisicion",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "valor_compra",
                        type: "bigint",
                        isNullable: true,
                    },
                    {
                        name: "garantia",
                        type: "tinyint",
                    },
                    {
                        name: "tiempo_garantia",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "numero_inventario",
                        type: "varchar",
                        length: "150",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createTable(
            new Table({
                name: "clasificacion",
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
                        length: "150",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );

        // Add foreign key to inventario_general
        await queryRunner.createForeignKey(
            "inventario_general",
            new TableForeignKey({
                columnNames: ["id_clasificacion"],
                referencedColumnNames: ["id"],
                referencedTableName: "clasificacion",
                onDelete: "CASCADE",
            })
        );

        // Insert initial data
        await queryRunner.query(`
            INSERT INTO clasificacion (nombre) VALUES 
            ('ACCESORIOS'),
            ('ELECTRODOMESTICOS'),
            ('EQUIPOS BIOMEDICOS'),
            ('MOBILIARIO Y UTILES'),
            ('INFRAESTRUCTURA'),
            ('LABORATORIO CLINICO')
        `);


            await queryRunner.createTable(
                new Table({
                    name: "tipo_activo",
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
                            length: "150",
                        },
                        {
                            name: "created_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                        {
                            name: "updated_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                    ],
                }),
                true,
            );

            // Add foreign key from inventario_general to tipo_activo
            await queryRunner.createForeignKey(
                "inventario_general",
                new TableForeignKey({
                    columnNames: ["id_tipo_activo"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "tipo_activo",
                    onDelete: "CASCADE",
                })
            );

            // Insert initial data for tipo_activo
            await queryRunner.query(`
                INSERT INTO tipo_activo (nombre) VALUES 
                ('PROPIO'),
                ('EN ARRIENDO'),
                ('EN COMODATO'),
                ('PRESTADO'),
                ('OUTSOURCING')
            `);

            await queryRunner.createTable(
                new Table({
                    name: "materiales",
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
                            length: "150",
                        },
                        {
                            name: "created_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                        {
                            name: "updated_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                    ],
                }),
                true,
            );

            // Add foreign key from inventario_general to materiales
            await queryRunner.createForeignKey(
                "inventario_general",
                new TableForeignKey({
                    columnNames: ["id_material"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "materiales",
                    onDelete: "CASCADE",
                })
            );

            // Insert initial data for materiales
            await queryRunner.query(`
                INSERT INTO materiales (nombre) VALUES 
                ('ACERO'),
                ('ACERO-COJIN'),
                ('ACERO-PASTA'),
                ('ACERO-PLASTICO'),
                ('ALUMINIO-VIDRIO'),
                ('COJIN-PASTA-METAL'),
                ('HIERRO'),
                ('HIERRO-PASTA'),
                ('MADERA'),
                ('MADERA-COJIN'),
                ('MADERA-PASTA'),
                ('MDF'),
                ('MDF-BRILLANTE'),
                ('MDF-OSCURO'),
                ('MDF-METAL'),
                ('METAL'),
                ('METAL-COJIN'),
                ('METAL-PASTA'),
                ('METAL-PLASTICO'),
                ('METAL-TELA'),
                ('METAL-VIDRIO'),
                ('PASTA'),
                ('PASTA-COJIN'),
                ('PASTA-METAL'),
                ('PASTA-METAL-TELA'),
                ('PASTA-TELA'),
                ('PASTA-VIDRIO'),
                ('TELA-METAL-PASTA'),
                ('VIDRIO-TEMPLADO')
            `);

            await queryRunner.createTable(
                new Table({
                    name: "estado_inv_general",
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
                            length: "150",
                        },
                        {
                            name: "created_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                        {
                            name: "updated_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                    ],
                }),
                true,
            );

            // Add foreign key from inventario_general to estado_inv_general
            await queryRunner.createForeignKey(
                "inventario_general",
                new TableForeignKey({
                    columnNames: ["id_estado"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "estado_inv_general",
                    onDelete: "CASCADE",
                })
            );

            // Insert initial data for estado_inv_general
            await queryRunner.query(`
                INSERT INTO estado_inv_general (nombre) VALUES 
                ('NUEVO'),
                ('USADO'),
                ('EN REPARACION')
            `);

            await queryRunner.createTable(
                new Table({
                    name: "tipo_area",
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
                            length: "150",
                        },
                        {
                            name: "created_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                        {
                            name: "updated_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                    ],
                }),
                true,
            );

            // Add foreign key from inventario_general to tipo_area
            await queryRunner.createForeignKey(
                "inventario_general",
                new TableForeignKey({
                    columnNames: ["id_tipo_area"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "tipo_area",
                    onDelete: "CASCADE",
                })
            );

            // Insert initial data for tipo_area
            await queryRunner.query(`
                INSERT INTO tipo_area (nombre) VALUES 
                ('ASISTENCIAL'),
                ('ADMINISTRATIVA')
            `);

            await queryRunner.createTable(
                new Table({
                    name: "area_dependencia",
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
                            length: "150",
                        },
                        {
                            name: "created_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                        {
                            name: "updated_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                    ],
                }),
                true,
            );

            // Add foreign key from inventario_general to area_dependencia
            await queryRunner.createForeignKey(
                "inventario_general",
                new TableForeignKey({
                    columnNames: ["id_area_dependencia"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "area_dependencia",
                    onDelete: "CASCADE",
                })
            );

            // Insert initial data for area_dependencia
            await queryRunner.query(`
                INSERT INTO area_dependencia (nombre) VALUES 
                ('AGENDAMIENTO'),
                ('APOYO TERAPEUTICO'),
                ('ARCHIVO CLINICO'),
                ('CALIDAD'),
                ('COMPRAS'),
                ('CONSULTA ESPECIALIZADA'),
                ('CONTABILIDAD'),
                ('CUENTAS MEDICAS'),
                ('DIRECCION MEDICA'),
                ('ENFERMERIA'),
                ('FARMACIA'),
                ('GERENCIA'),
                ('GESTION HUMANA'),
                ('JURIDICA'),
                ('LABORATORIO CLINICO'),
                ('INFRAESTRUCTURA'),
                ('MEDICINA GENERAL'),
                ('ODONTOLOGIA'),
                ('OPTICA'),
                ('REDES SOCIALES Y COMUNICACIONES'),
                ('SEGURIDAD Y SALUD EN EL TRABAJO'),
                ('SERVICIO AL CLIENTE'),
                ('SIAU'),
                ('SISTEMAS Y CENTRO DE INFORMACION'),
                ('AUDITORIA')
            `);

            // * relacion con usuarios
            await queryRunner.createForeignKey(
                "inventario_general",
                new TableForeignKey({
                    columnNames: ["id_responsable"],
                    referencedColumnNames: ["IdUsuario"],
                    referencedTableName: "usuario",
                    onDelete: "CASCADE",
                })
            );

            // Create the activos table
            await queryRunner.createTable(
                new Table({
                    name: "activos",
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
                            length: "150",
                        },
                        {
                            name: "id_clasificacion",
                            type: "int",
                        },
                        {
                            name: "created_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                        {
                            name: "updated_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                        },
                    ],
                }),
                true,
            );

            // Add foreign key from activos to clasificacion
            await queryRunner.createForeignKey(
                "activos",
                new TableForeignKey({
                    columnNames: ["id_clasificacion"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "clasificacion",
                    onDelete: "CASCADE",
                })
            );

            // Add foreign key from inventario_general to activos
            await queryRunner.createForeignKey(
                "inventario_general",
                new TableForeignKey({
                    columnNames: ["id_activo"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "activos",
                    onDelete: "CASCADE",
                })
            );

            // ACCESORIOS (id=1)
            await queryRunner.query(`
                INSERT INTO activos (nombre, id_clasificacion) VALUES 
                ('BASE PARA COMPUTADOR', 1),
                ('BALONES DE PILATES', 1),
                ('COLCHONETAS', 1);
            `);

            // ELECTRODOMESTICOS (id=2)
            await queryRunner.query(`
                INSERT INTO activos (nombre, id_clasificacion) VALUES 
                ('AIRE ACONDICIONADO', 2),
                ('CAFETERA', 2),
                ('DESHUMIFICADOR', 2),
                ('LAVADORA', 2),
                ('HORNO MICROONDAS', 2),
                ('NEVERA', 2),
                ('NEVERA HORIZONTAL', 2),
                ('VENTILADOR', 2),
                ('VENTILADOR DE MESA', 2),
                ('GRECA', 2),
                ('PLANCHA', 2);
            `);

            // MOBILIARIO Y UTILES (id=4)
            await queryRunner.query(`
                INSERT INTO activos (nombre, id_clasificacion) VALUES 
                ('ARMARIO', 4),
                ('ARMARIO ARCHIVADOR', 4),
                ('CAJON', 4),
                ('CAJON P', 4),
                ('CAMILLA', 4),
                ('CASILLERO', 4),
                ('ESCALAS DE CAMILLA', 4),
                ('ESCRITORIO', 4),
                ('ESCRITORIO TIPO L', 4),
                ('ESTANTE', 4),
                ('EXHIBIDOR DE GAFAS', 4),
                ('MESA', 4),
                ('MESA DE MAYO', 4),
                ('MESA DE PATIO', 4),
                ('MESA PLASTICA', 4),
                ('MESAS EXHIBIDORAS', 4),
                ('MUEBLES RECEPCION', 4),
                ('TABLERO', 4),
                ('SILLA ACOJINADA', 4),
                ('SILLA AUXILIAR', 4),
                ('SILLA DE ESPERA', 4),
                ('SILLA ERGONOMICA CON REPOSABRAZOS', 4),
                ('SILLA ERGONOMICA SIN REPOSABRAZOS', 4),
                ('SILLA INTERLOCUTORA', 4),
                ('SILLA PLASTICA', 4),
                ('SILLA TANDEM', 4);
            `);

            // EQUIPOS BIOMEDICOS (id=3)
            await queryRunner.query(`
                INSERT INTO activos (nombre, id_clasificacion) VALUES 
                ('AUTOCLAVE', 3),
                ('ECOGRAFO', 3),
                ('CAMINADORA', 3),
                ('ELECTROCARDIOGRAFO', 3),
                ('EQUIPO DE ELECTROTERAPIA', 3);
            `);

            // INFRAESTRUCTURA (id=5)
            await queryRunner.query(`
                INSERT INTO activos (nombre, id_clasificacion) VALUES
                ('TALADRO PERCUTOR', 5),
                ('PULIDOR', 5);
            `);

            // LABORATORIO CLINICO (id=6)
            await queryRunner.query(`
                INSERT INTO activos (nombre, id_clasificacion) VALUES 
                ('MICROSCOPIO', 6),
                ('CENTRIFUGA', 6),
                ('ANALIZADOR DE SANGRE', 6),
                ('EQUIPO DE QUIMICA', 6),
                ('INCUBADORA', 6),
                ('ESPECTROFOTOMETRO', 6),
                ('PIPETA AUTOMATICA', 6);
            `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("inventario_general");
        await queryRunner.dropTable("clasificacion");
        await queryRunner.dropTable("tipo_activo");
        await queryRunner.dropTable("materiales");
        await queryRunner.dropTable("estado_inv_general");
        await queryRunner.dropTable("tipo_area");
        await queryRunner.dropTable("area_dependencia");
        await queryRunner.dropTable("activos");
    }
}