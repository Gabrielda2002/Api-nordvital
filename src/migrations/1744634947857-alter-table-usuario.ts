import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableUsuario1744634947857 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint

        const table = await queryRunner.getTable("usuario");
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("Nit_Municipio") !== -1
        );

        if (foreignKey) {
            await queryRunner.dropForeignKey("usuario", foreignKey);
        }

        await queryRunner.dropColumn("usuario", "Nit_Municipio");

        // cambiar nombre llave primaria a id
        await queryRunner.renameColumn("usuario", "IdUsuario", "id");
        
        // cambiar nombre de CedulaUsuario a cedula
        await queryRunner.renameColumn("usuario", "CedulaUsuario", "cedula"); 

        // cambiar nombre de NombreUsuario a nombre
        await queryRunner.renameColumn("usuario", "NombreUsuario", "nombre");

        // cambiar nombre de ApellidoUsuario a apellido
        await queryRunner.renameColumn("usuario", "ApellidoUsuario", "apellido");

        // cambiar nombre de EmailUsuario a email
        await queryRunner.renameColumn("usuario", "EmailUsuario", "email");

        // cambiar nombre de ClaveUsuario a constrasena
        await queryRunner.renameColumn("usuario", "ClaveUsuario", "contrasena");

        // cambiar nombre de Estado a estado
        await queryRunner.renameColumn("usuario", "Estado", "estado");

        // cambiar nombre de Tipo_rol a rol
        await queryRunner.renameColumn("usuario", "Tipo_rol", "rol_id");

        // cambiar nombre de TipoCedula a tipo_cedula
        await queryRunner.query(
            `ALTER TABLE usuario CHANGE COLUMN TipoCedula tipo_cedula_id INT NULL`
        );

        // Actualizar la clave foránea para que apunte al nuevo nombre
        const updatedTable = await queryRunner.getTable("usuario");

        const foreignKeyRol = updatedTable?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("Tipo_rol") !== -1
        );

        if (foreignKeyRol) {
            await queryRunner.dropForeignKey("usuario", foreignKeyRol);
        }

        const updatedForeignKey = updatedTable?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("TipoCedula") !== -1
        );

        if (updatedForeignKey) {
            await queryRunner.dropForeignKey("usuario", updatedForeignKey);
        }

        // await queryRunner.createForeignKey(
        //     "usuario",
        //     new TableForeignKey({
        //         columnNames: ["tipo_cedula_id"],
        //         referencedTableName: "documento",
        //         referencedColumnNames: ["IdDocumento"],
        //         onDelete: "CASCADE",
        //         onUpdate: "CASCADE",
        //     })
        // );

        // await queryRunner.createForeignKey(
        //     "usuario",
        //     new TableForeignKey({
        //         columnNames: ["rol_id"],
        //         referencedTableName: "rol",
        //         referencedColumnNames: ["IdRol"],
        //         onDelete: "CASCADE",
        //         onUpdate: "CASCADE",
        //     })
        // );


        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recreate foreign key constraint
        await queryRunner.createForeignKey(
            "usuario",
            new TableForeignKey({
                name: "FK_usuario_Nit_Municipio",
                columnNames: ["Nit_Municipio"],
                referencedTableName: "municipio",
                referencedColumnNames: ["Nit"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );
    }
}