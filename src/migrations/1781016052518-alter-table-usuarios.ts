import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableUsuarios1781016052518 implements MigrationInterface {
    name = "AlterTableUsuarios1781016052518";

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        // renombrar la tabla usuario a users
        await queryRunner.renameTable("usuario", "users");

        // renombrar columnas
        await queryRunner.renameColumn("users", "nombre", "name");
        await queryRunner.renameColumn("users", "apellido", "lastname");
        await queryRunner.renameColumn("users", "cedula", "identification");
        await queryRunner.renameColumn("users", "tipo_cedula_id", "identification_type_id");
        await queryRunner.renameColumn("users", "contrasena", "password");
        await queryRunner.renameColumn("users", "estado", "status");
        await queryRunner.renameColumn("users", "fecha-creacion", "created_at");
        await queryRunner.renameColumn("users", "fecha-actualizacion", "updated_at");
        await queryRunner.renameColumn("users", "cargo_id", "position_id");
        await queryRunner.renameColumn("users", "sede_id", "headquarter_id");
        await queryRunner.renameColumn("users", "celular", "phone");
        await queryRunner.renameColumn("users", "fecha_inicio_contrato", "contract_start_date");
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`tipo_contrato\` \`contract_type\` enum('FIJO','INDEFINIDO','POR OBRA O LABOR','PRESTACION DE SERVICIOS') DEFAULT NULL`);


        // eliminar columnas
        await queryRunner.dropColumn("users", "area");
        await queryRunner.dropColumn("users", "cargo");

        // renombrar columnas tabla rol
        await queryRunner.renameColumn("rol", "IdRol", "id");
        await queryRunner.renameColumn("rol", "TipoRol", "name");
        await queryRunner.renameColumn("rol", "fecha-creacion", "created_at");
        await queryRunner.renameColumn("rol", "fecha-actualizacion", "updated_at");

        // renombrar tabla cargo a position
        await queryRunner.renameTable("cargo", "position");

        // renombrar columnas tabbla cargo
        await queryRunner.renameColumn("position", "nombre", "name");
        await queryRunner.renameColumn("position", "descripcion", "description");
        await queryRunner.renameColumn("position", "estado", "status");
        await queryRunner.renameColumn("position", "fecha_creacion", "created_at");
        await queryRunner.renameColumn("position", "fecha_actualizacion", "updated_at");

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // renombrar la tabla users a ususario
        await queryRunner.renameTable("users", "usuario");

        // renombrar columnas
        await queryRunner.renameColumn("usuario", "name", "nombre");
        await queryRunner.renameColumn("usuario", "lastname", "apellido");
        await queryRunner.renameColumn("usuario", "identification", "cedula");
        await queryRunner.renameColumn("usuario", "identification_type_id", "tipo_cedula_id");
        await queryRunner.renameColumn("usuario", "password", "contrasena");
        await queryRunner.renameColumn("usuario", "status", "estado");
        await queryRunner.renameColumn("usuario", "created_at", "fecha-creacion");
        await queryRunner.renameColumn("usuario", "updated_at", "fecha-actualizacion");
        await queryRunner.renameColumn("usuario", "position_id", "cargo_id");
        await queryRunner.renameColumn("usuario", "headquarter_id", "sede_id");
        await queryRunner.renameColumn("usuario", "phone", "celular");
        await queryRunner.renameColumn("usuario", "contract_start_date", "fecha_inicio_contrato");
        await queryRunner.renameColumn("usuario", "contract_type", "tipo_contrato");

        // agregar columnas
        await queryRunner.addColumn("usuario", new TableColumn({
            name: "area",
            type: "varchar",
            isNullable: true,
        }));

        await queryRunner.addColumn("usuario", new TableColumn({
            name: "cargo",
            type: "varchar",
            isNullable: true,
        }));

        // renombrar columnas tabla rol
        await queryRunner.renameColumn("rol", "id", "IdRol");
        await queryRunner.renameColumn("rol", "name", "TipoRol");
        await queryRunner.renameColumn("rol", "created_at", "fecha-creacion");
        await queryRunner.renameColumn("rol", "updated_at", "fecha-actualizacion");

        // renombrar tabla position a cargo
        await queryRunner.renameTable("position", "cargo");

        // renombrar columnas tabbla cargo
        await queryRunner.renameColumn("cargo", "name", "nombre");
        await queryRunner.renameColumn("cargo", "description", "descripcion");
        await queryRunner.renameColumn("cargo", "status", "estado");
        await queryRunner.renameColumn("cargo", "created_at", "fecha_creacion");
        await queryRunner.renameColumn("cargo", "updated_at", "fecha_actualizacion");

    }
}