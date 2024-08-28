import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
  } from "typeorm";
  
  const columns = [
    "TipoDocumento",
    "Identificacion",
    "NombreCompleto",
    "NumeroCel",
    "TelFijo",
    "Email",
    "Direccion",
    "Convenio",
    "IpsPrimaria",
  ];
  
  // Nombres reales de las claves foráneas en la base de datos

  
  export class AlterTableRadicacion1722007000819 implements MigrationInterface {
    name = "AlterTableRadicacion1722007000819";
  
    public async up(queryRunner: QueryRunner): Promise<void> {

      // Obtener la tabla 'radicacion'

      const columnExists = await queryRunner.hasColumn("radicacion", "TipoDocumento");
      if (columnExists) {
          // * Verificar si la llave foránea existe en la tabla "soportes"
          const table = await queryRunner.getTable("radicacion");
          const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("TipoDocumento") !== -1);

          if (foreignKey) {
              // * Si la llave foránea existe, eliminarla
              await queryRunner.dropForeignKey("radicacion", foreignKey);
          }

          // * Si la columna existe, eliminarla
          await queryRunner.dropColumn("radicacion", "TipoDocumento");
      }

      // * Eliminar las columnas y las llaves foránea convenio"

      const columnConvenioExists = await queryRunner.hasColumn("radicacion", "Convenio");
      if (columnConvenioExists) {
          // * Verificar si la llave foránea existe en la tabla "soportes"
          const table = await queryRunner.getTable("radicacion");
          const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("Convenio") !== -1);

          if (foreignKey) {
              // * Si la llave foránea existe, eliminarla
              await queryRunner.dropForeignKey("radicacion", foreignKey);
          }

          // * Si la columna existe, eliminarla
          await queryRunner.dropColumn("radicacion", "Convenio");
      }

      // * Eliminar las columnas y las llaves foránea IpsPrimaria"

      const columnIpsPrimariaExists = await queryRunner.hasColumn("radicacion", "IpsPrimaria");
      if (columnIpsPrimariaExists) {
          // * Verificar si la llave foránea existe en la tabla "soportes"
          const table = await queryRunner.getTable("radicacion");
          const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("IpsPrimaria") !== -1);

          if (foreignKey) {
              // * Si la llave foránea existe, eliminarla
              await queryRunner.dropForeignKey("radicacion", foreignKey);
          }

          // * Si la columna existe, eliminarla
          await queryRunner.dropColumn("radicacion", "IpsPrimaria");
      }
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      // Restaurar las columnas
    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "TipoDocumento",
        type: "int",
      })
    );

    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "Identificacion",
        type: "varchar", 
      })
    );

    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "NombreCompleto",
        type: "varchar", 
      })
    );

    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "NumeroCel",
        type: "varchar",
      })
    );

    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "TelFijo",
        type: "varchar", 
      })
    );

    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "Email",
        type: "varchar",
      })
    );

    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "Direccion",
        type: "varchar", 
      })
    );

    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "Convenio",
        type: "int", 
      })
    );

    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "IpsPrimaria",
        type: "int", // Reemplazar con el tipo de dato correcto
      })
    );

    // Restaurar claves foráneas
    await queryRunner.createForeignKey(
      "radicacion",
      new TableForeignKey({
        columnNames: ["TipoDocumento"],
        referencedColumnNames: ["IdDocumento"], // Reemplazar con el nombre correcto de la columna referenciada
        referencedTableName: "documento", // Reemplazar con el nombre correcto de la tabla referenciada
        onDelete: "SET NULL", // Ajustar según sea necesario
      })
    );

    await queryRunner.createForeignKey(
      "radicacion",
      new TableForeignKey({
        columnNames: ["Convenio"],
        referencedColumnNames: ["IdConvenio"], // Reemplazar con el nombre correcto de la columna referenciada
        referencedTableName: "convenio", // Reemplazar con el nombre correcto de la tabla referenciada
        onDelete: "SET NULL", // Ajustar según sea necesario
      })
    );

    await queryRunner.createForeignKey(
      "radicacion",
      new TableForeignKey({
        columnNames: ["IpsPrimaria"],
        referencedColumnNames: ["IdIpsPrimaria"], // Reemplazar con el nombre correcto de la columna referenciada
        referencedTableName: "ipsprimaria", // Reemplazar con el nombre correcto de la tabla referenciada
        onDelete: "SET NULL", // Ajustar según sea necesario
      })
    );
    }
  }
  