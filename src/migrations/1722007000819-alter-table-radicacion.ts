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
  const foreignKeys = [
    { columnName: "TipoDocumento", foreignKeyName: "radicacion_ibfk_13" },
    { columnName: "Convenio", foreignKeyName: "radicacion_ibfk_2" },
    { columnName: "IpsPrimaria", foreignKeyName: "radicacion_ibfk_3" },
  ];
  
  export class AlterTableRadicacion1722007000819 implements MigrationInterface {
    name = "AlterTableRadicacion1722007000819";
  
    public async up(queryRunner: QueryRunner): Promise<void> {
      // Obtener la tabla 'radicacion'
      const table = await queryRunner.getTable("radicacion");
  
      if (!table) {
        console.error("La tabla 'radicacion' no se encontró.");
        return;
      }
  
      console.log("Claves foráneas existentes en la tabla:");
      table.foreignKeys.forEach((fk) => {
        console.log(`Nombre: ${fk.name}, Columnas: ${fk.columnNames}`);
      });
  
      // Eliminar claves foráneas
      for (const fk of foreignKeys) {
        const foreignKey = table.foreignKeys.find(
          (foreignKey) => foreignKey.name === fk.foreignKeyName
        );
  
        console.log(`Buscando clave foránea: ${fk.foreignKeyName}`);
  
        if (foreignKey) {
          console.log(`Eliminando clave foránea: ${fk.foreignKeyName}`);
          await queryRunner.dropForeignKey("radicacion", foreignKey);
        } else {
          console.warn(`No se encontró la clave foránea: ${fk.foreignKeyName}`);
        }
      }
  
      // Eliminar columnas
      for (const columnName of columns) {
        console.log(`Eliminando columna: ${columnName}`);
        await queryRunner.dropColumn("radicacion", columnName);
      }
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      // Agregar nuevamente las columnas eliminadas
      await queryRunner.addColumns("radicacion", [
        new TableColumn({ name: "TipoDocumento", type: "int", isNullable: true }),
        new TableColumn({
          name: "Identificacion",
          type: "varchar",
          length: "255",
          isNullable: true,
        }),
        new TableColumn({
          name: "NombreCompleto",
          type: "varchar",
          length: "255",
          isNullable: true,
        }),
        new TableColumn({
          name: "NumeroCel",
          type: "varchar",
          length: "20",
          isNullable: true,
        }),
        new TableColumn({
          name: "TelFijo",
          type: "varchar",
          length: "20",
          isNullable: true,
        }),
        new TableColumn({
          name: "Email",
          type: "varchar",
          length: "255",
          isNullable: true,
        }),
        new TableColumn({
          name: "Direccion",
          type: "varchar",
          length: "255",
          isNullable: true,
        }),
        new TableColumn({ name: "Convenio", type: "int", isNullable: true }),
        new TableColumn({ name: "IpsPrimaria", type: "int", isNullable: true }),
      ]);
  
      // Volver a agregar claves foráneas
      await queryRunner.createForeignKeys("radicacion", [
        new TableForeignKey({
          name: "FK_TipoDocumento",
          columnNames: ["TipoDocumento"],
          referencedColumnNames: ["id"],
          referencedTableName: "tipo_documento",
          onDelete: "SET NULL",
        }),
        new TableForeignKey({
          name: "FK_Convenio",
          columnNames: ["Convenio"],
          referencedColumnNames: ["id"],
          referencedTableName: "convenio",
          onDelete: "SET NULL",
        }),
        new TableForeignKey({
          name: "FK_IpsPrimaria",
          columnNames: ["IpsPrimaria"],
          referencedColumnNames: ["id"],
          referencedTableName: "ips_primaria",
          onDelete: "SET NULL",
        }),
      ]);
    }
  }
  