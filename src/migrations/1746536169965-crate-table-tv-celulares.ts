import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CrateTableTvCelulares1746536169965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla televisores
        await queryRunner.createTable(new Table({
            name: "televisores",
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
                    name: "ubicacion",
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
                    name: "pulgadas",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "tipo_pantalla",
                    type: "varchar(100)",
                    isNullable: false,
                    comment: "LED, LCD, OLED, QLED, etc."
                },
                {
                    name: "smart_tv",
                    type: "tinyint",
                    isNullable: false,
                    comment: "1 = Es SmartTV, 0 = No es SmartTV"
                },
                {
                    name: "sistema_operativo",
                    type: "varchar(255)",
                    isNullable: true,
                    comment: "WebOS, Android TV, Tizen, etc."
                },
                {
                    name: "direccion_ip",
                    type: "varchar(20)",
                    isNullable: true
                },
                {
                    name: "mac",
                    type: "varchar(255)",
                    isNullable: true
                },
                {
                    name: "resolucion",
                    type: "varchar(100)",
                    isNullable: false,
                    comment: "HD, Full HD, 4K, 8K, etc."
                },
                {
                    name: "num_puertos_hdmi",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "num_puertos_usb",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "conectividad",
                    type: "varchar(255)",
                    isNullable: true,
                    comment: "Wifi, Bluetooth, etc."
                },
                {
                    name: "fecha_compra",
                    type: "date",
                    isNullable: false
                },
                {
                    name: "tiempo_garantia",
                    type: "varchar(100)",
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
                    name: "numero_inventario",
                    type: "varchar(255)",
                    isNullable: false
                },
                // {
                //     name: "area_responsable",
                //     type: "varchar(255)",
                //     isNullable: false
                // },
                {
                    name: "id_responsable",
                    type: "int",
                    isNullable: true
                },
                // {
                //     name: "acta_id",
                //     type: "int",
                //     isNullable: true
                // },
                {
                    name: "observaciones",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "estado",
                    type: "varchar(100)",
                    isNullable: false,
                    comment: "Activo, En reparación, Dado de baja, etc."
                },
                {
                    name: "valor_adquisicion",
                    type: "decimal(12,2)",
                    isNullable: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false
                },
                {
                    name: 'control_remoto',
                    type: 'tinyint',
                    isNullable: true,
                    comment: '1 = Tiene control remoto, 0 = No tiene control remoto'
                },
                {
                    name: 'utilidad',
                    type: 'varchar(100)',
                    isNullable: true,
                    comment: 'Utilidad del televisor (Ej: Sala de reuniones, Oficina, etc.)'
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false
                }
            ]
        }), true);

        // Crear tabla celulares
        await queryRunner.createTable(new Table({
            name: "celulares",
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
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "serial",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "imei",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "sistema_operativo",
                    type: "varchar(100)",
                    isNullable: false,
                    comment: "Android, iOS, etc."
                },
                {
                    name: "version_so",
                    type: "varchar(50)",
                    isNullable: true
                },
                {
                    name: "capacidad_almacenamiento",
                    type: "varchar(50)",
                    isNullable: false,
                    comment: "64GB, 128GB, etc."
                },
                {
                    name: "capacidad_ram",
                    type: "varchar(50)",
                    isNullable: false,
                    comment: "4GB, 6GB, 8GB, etc."
                },
                {
                    name: "numero_telefonico",
                    type: "varchar(20)",
                    isNullable: true
                },
                {
                    name: "operador",
                    type: "varchar(100)",
                    isNullable: true,
                    comment: "Claro, Movistar, etc."
                },
                {
                    name: "tipo_plan",
                    type: "varchar(100)",
                    isNullable: true
                },
                {
                    name: "fecha_vencimiento_plan",
                    type: "date",
                    isNullable: true
                },
                {
                    name: "mac_wifi",
                    type: "varchar(255)",
                    isNullable: true
                },
                {
                    name: "direccion_bluetooth",
                    type: "varchar(255)",
                    isNullable: true
                },
                // {
                //     name: "id_corporativo",
                //     type: "varchar(255)",
                //     isNullable: true,
                //     comment: "Correo o ID corporativo asociado"
                // },
                {
                    name: "fecha_compra",
                    type: "date",
                    isNullable: false
                },
                {
                    name: "tiempo_garantia",
                    type: "varchar(100)",
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
                    name: "numero_inventario",
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "responsable",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "acta_id",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "case_protector",
                    type: "tinyint",
                    isNullable: true,
                    comment: "1 = Tiene case, 0 = No tiene"
                },
                {
                    name: "vidrio_temperado",
                    type: "tinyint",
                    isNullable: true,
                },
                {
                    name: "observaciones",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "estado",
                    type: "varchar(100)",
                    isNullable: false,
                    comment: "Activo, En reparación, Dado de baja, etc."
                },
                {
                    name: "valor_adquisicion",
                    type: "decimal(12,2)",
                    isNullable: true
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
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false
                }
            ]
        }), true);

        // Crear tabla seguimiento_televisores
        await queryRunner.createTable(new Table({
            name: "seguimiento_televisores",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "televisor_id",
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
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "descripcion",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "responsable",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false
                }
            ],
            foreignKeys: [
                {
                    columnNames: ["televisor_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "televisores",
                    onDelete: "CASCADE"
                }
            ]
        }), true);

        // Crear tabla seguimiento_celulares
        await queryRunner.createTable(new Table({
            name: "seguimiento_celulares",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "celular_id",
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
                    type: "varchar(255)",
                    isNullable: false
                },
                {
                    name: "descripcion",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "responsable",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false
                }
            ],
            foreignKeys: [
                {
                    columnNames: ["celular_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "celulares",
                    onDelete: "CASCADE"
                }
            ]
        }), true);

        // // Relaciones con sedes y usuarios
        await queryRunner.createForeignKey("televisores", new TableForeignKey({
            columnNames: ["sede_id"],
            referencedColumnNames: ["IdLugar"],
            referencedTableName: "sedes",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("televisores", new TableForeignKey({
            columnNames: ["id_responsable"],
            referencedColumnNames: ["id"],
            referencedTableName: "usuario",
            onDelete: "SET NULL"
        }));

        // await queryRunner.createForeignKey("televisores", new TableForeignKey({
        //     columnNames: ["acta_id"],
        //     referencedColumnNames: ["id"],
        //     referencedTableName: "soportes",
        //     onDelete: "SET NULL"
        // }));

        await queryRunner.createForeignKey("celulares", new TableForeignKey({
            columnNames: ["sede_id"],
            referencedColumnNames: ["IdLugar"],
            referencedTableName: "sedes",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("celulares", new TableForeignKey({
            columnNames: ["responsable"],
            referencedColumnNames: ["id"],
            referencedTableName: "usuario",
            onDelete: "SET NULL"
        }));

        await queryRunner.createForeignKey("celulares", new TableForeignKey({
            columnNames: ["acta_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "soportes",
            onDelete: "SET NULL"
        }));

        await queryRunner.createForeignKey("seguimiento_televisores", new TableForeignKey({
            columnNames: ["responsable"],
            referencedColumnNames: ["id"],
            referencedTableName: "usuario",
            onDelete: "NO ACTION"
        }));

        await queryRunner.createForeignKey("seguimiento_celulares", new TableForeignKey({
            columnNames: ["responsable"],
            referencedColumnNames: ["id"],
            referencedTableName: "usuario",
            onDelete: "NO ACTION"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("seguimiento_celulares");
        await queryRunner.dropTable("seguimiento_televisores");
        await queryRunner.dropTable("celulares");
        await queryRunner.dropTable("televisores");
    }
}