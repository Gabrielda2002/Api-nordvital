import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableRadicacion1727816016045 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.dropColumn("radicacion", "ServicioSolicitado");
         await queryRunner.dropColumn("radicacion", "DescripcionCup");
         await queryRunner.dropColumn("radicacion", "NombreSoporte");
         await queryRunner.dropColumn("radicacion", "TipoSoporte");
         await queryRunner.dropColumn("radicacion", "ObservacionAuditoria");
         await queryRunner.dropColumn("radicacion", "Informacion");
         await queryRunner.dropColumn("radicacion", "contenido");

         //? se busca la llave foranea de pacientes y si se encuentra se elimina
     const unidadFuncionalExist = await queryRunner.hasColumn(
         "radicacion",
         "UnidadFuncional"
       );
       if (unidadFuncionalExist) {
         const table = await queryRunner.getTable("radicacion");
         const foreignKey = table?.foreignKeys.find(
           (fk) => fk.columnNames.indexOf("UnidadFuncional") !== -1
         );
  
         if (foreignKey) {
           await queryRunner.dropForeignKey("radicacion", foreignKey);
         }
  
        await queryRunner.dropColumn("radicacion", "UnidadFuncional");
       }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("radicacion", new TableColumn({
            name: "ServicioSolicitado",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("radicacion", new TableColumn({
            name: "DescripcionCup",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("radicacion", new TableColumn({
            name: "NombreSoporte",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("radicacion", new TableColumn({
            name: "TipoSoporte",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("radicacion", new TableColumn({
            name: "contenido",
            type: "text",
            isNullable: true
        }));
        await queryRunner.addColumn("radicacion", new TableColumn({
            name: "UnidadFuncional",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("radicacion", new TableColumn({
            name: "ObservacionAuditoria",
            type: "text",
            isNullable: true
        }));
        await queryRunner.addColumn("radicacion", new TableColumn({
            name: "Informacion",
            type: "text",
            isNullable: true
        }));
    }
}