import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAdministradorTable1729699117873
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key
    const administradorExist = await queryRunner.hasColumn(
      "administrador",
      "TipoRol"
    );
    if (administradorExist) {
      // Find the foreign key
      const table = await queryRunner.getTable("administrador");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("TipoRol") !== -1
      );

      // Drop the foreign key
      if (foreignKey) {
        await queryRunner.dropForeignKey("administrador", foreignKey);
      }
    }

    // Drop table Administrador
    await queryRunner.query(`DROP TABLE IF EXISTS administrador`);

    // drop foreign key
    const gerenteExist = await queryRunner.hasColumn("gerente", "TipoRol");
    if (gerenteExist) {
      // Find the foreign key
      const table = await queryRunner.getTable("gerente");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("TipoRol") !== -1
      );

      // Drop the foreign key
      if (foreignKey) {
        await queryRunner.dropForeignKey("gerente", foreignKey);
      }
    }

    // Drop table Gerente
    await queryRunner.query(`DROP TABLE IF EXISTS gerente`);

    // drop foreign keys id_permisos id_rol
    const idPermisosExist = await queryRunner.hasColumn(
      "permisosrol",
      "id_permisos"
    );
    if (idPermisosExist) {
      // Find the foreign key
      const table = await queryRunner.getTable("permisosrol");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("id_permisos") !== -1
      );

      // Drop the foreign key
      if (foreignKey) {
        await queryRunner.dropForeignKey("permisosrol", foreignKey);
      }
    }

    const idRolExist = await queryRunner.hasColumn("permisosrol", "id_rol");
    if (idRolExist) {
      // Find the foreign key
      const table = await queryRunner.getTable("permisosrol");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("id_rol") !== -1
      );

      // Drop the foreign key
      if (foreignKey) {
        await queryRunner.dropForeignKey("permisosrol", foreignKey);
      }
    }

    // drop table permisosrol
    await queryRunner.query(`DROP TABLE IF EXISTS permisosrol`);

    // drop foreign keys id_usuario  id_permiso 
    const idUsuarioExist = await queryRunner.hasColumn(
      "permisosusuario",
      "id_usuario"
    );
    if (idUsuarioExist) {
      // Find the foreign key
      const table = await queryRunner.getTable("permisosusuario");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("id_usuario") !== -1
      );

      // Drop the foreign key
      if (foreignKey) {
        await queryRunner.dropForeignKey("permisosusuario", foreignKey);
      }
    }

    //drop permisosusuario
    await queryRunner.query(`DROP TABLE IF EXISTS permisosusuario`);

    
    //drop table permisos
    await queryRunner.query(`DROP TABLE IF EXISTS permisos`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE administrador (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

    await queryRunner.query(`
            CREATE TABLE gerente (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        

  }
}
