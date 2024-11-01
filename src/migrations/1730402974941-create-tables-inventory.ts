import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateTablesInventory1730402974941 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // crear tbala equipos
        await queryRunner.createTable(new Table({
            name: "equipos",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "sede_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "nombre_equipo",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "area",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "ubicacion",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "tipo_equipo",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "marca",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "modelo",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "serial",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "sistema_operativo",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "direccion_ip",
                    type: "varchar(20)",
                    isNullable: false
                },
                {
                    name: "mac",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "fecha_compra",
                    type: "date",
                    isNullable: false
                },
                {
                    name: "tiempo_garantia",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "garantia",
                    type: "tinyint",
                    isNullable: false
                },
                {
                    name: "fecha_entrega",
                    type: "date",
                    isNullable: false
                },
                {
                    name: "numero_intentario",
                    type: "varchar(255)",
                    isNullable: false
                },
            ]
        }), true);

    await queryRunner.renameTable("lugarradicacion", "sedes");

        await queryRunner.addColumn("sedes", new TableColumn({
            name: "direccion",
            type: "varchar",
            length: "255",
            isNullable: false
        }));
        
        await queryRunner.addColumn("sedes", new TableColumn({
            name: "departamento",
            type: "varchar",
            length: "255",
            isNullable: false
        }));
        
        await queryRunner.addColumn("sedes", new TableColumn({
            name: "ciudad",
            type: "varchar",
            length: "255",
            isNullable: false
        }));
        // relacion entre equipos y sedes
        await queryRunner.createForeignKey("equipos", new TableForeignKey({
            columnNames: ["sede_id"],
            referencedColumnNames: ["IdLugar"],
            referencedTableName: "sedes",
            onDelete: "CASCADE"
        }));
        // crear tabla componentes de equipos
        await queryRunner.createTable(new Table({
            name: "componentes",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "equipo_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "nombre",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "marca",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "capacidad",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "velocidad",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "otras_especificaciones",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "modelo",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "serial",
                    type: "varchar(255)",
                    isNullable: false
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["equipo_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "equipos",
                    onDelete: "CASCADE"
                }
            ]
        }), true);
        // crear tabla software de equipos
        await queryRunner.createTable(new Table({   
            name: "software",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "equipo_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "nombre",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "version",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "licencia",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "otros_datos",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "fecha_instalacion",
                    type: "date",
                    isNullable: true
                },
                {
                    name: "estado",
                    type: "varchar(255)",
                    isNullable: false
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["equipo_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "equipos",
                    onDelete: "CASCADE"
                }
            ]
        }), true);
        // crear tabla seguimiento de equipos
        await queryRunner.createTable(new Table({
            name: "seguimiento_equipos",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "equipo_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "fecha_evento",
                    type: "date",
                    isNullable: false
                },
                {
                    name: "tipo_evento",
                    type: "date",
                    isNullable: false
                },
                {
                    name: "descripcion",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "responsable",
                    type: "varchar(255)",
                    isNullable: false
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["equipo_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "equipos",
                    onDelete: "CASCADE"
                }
            ]
        }), true);
        // crear tabla accesorios de equipos
        await queryRunner.createTable(new Table({
            name: "accesorios_equipos",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "equipo_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "nombre",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "marca",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "modelo",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "serial",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "otros_datos",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "estado",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "numero_inventario",
                    type: "varchar(255)",
                    isNullable: false
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["equipo_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "equipos",
                    onDelete: "CASCADE"
                }
            ]
        }), true);
        // crear tabla dispositivos de red de sedes
        await queryRunner.createTable(new Table({
            name: "dispositivos_red",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "sede_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "nombre",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "marca",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "modelo",
                    type: "varchar(20)",
                    isNullable: false
                },
                {
                    name: "serial",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "direccion_ip",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "mac",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "otros_datos",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "estado",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "numero_inventario",
                    type: "varchar(255)",
                    isNullable: false
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["sede_id"],
                    referencedColumnNames: ["IdLugar"],
                    referencedTableName: "sedes",
                    onDelete: "CASCADE"
                }
            ]
        }), true);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("equipos");
        await queryRunner.dropTable("sedes");
        await queryRunner.dropTable("componentes");
        await queryRunner.dropTable("software");
        await queryRunner.dropTable("seguimiento_equipos");
        await queryRunner.dropTable("accesorios_equipos");
        await queryRunner.dropTable("dispositivos_red");
    }

}