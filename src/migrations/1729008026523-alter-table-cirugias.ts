import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCirugias1729008026523 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {

        const unidadFuncionalExist = await queryRunner.hasColumn(
            "cirugias",
            "especialidad_id"
          );
          if (unidadFuncionalExist) {
            const table = await queryRunner.getTable("cirugias");
            const foreignKey = table?.foreignKeys.find(
              (fk) => fk.columnNames.indexOf("especialidad_id") !== -1
            );
      
            if (foreignKey) {
              await queryRunner.dropForeignKey("cirugias", foreignKey);
            }

            await queryRunner.dropColumn("cirugias", "especialidad_id");
          }

          await queryRunner.dropColumn("cirugias", "fecha_paraclinicos")
          await queryRunner.dropColumn("cirugias", "fecha_valoracion_anestencia")
          await queryRunner.dropColumn("cirugias", "nombre_especialista")

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("cirugias", new TableColumn({
            name: "especialidad_id",
            type: "int",
            isNullable: false
        }));
        await queryRunner.addColumn("cirugias", new TableColumn({
            name: "fecha_paraclinicos",
            type: "date",
            isNullable: true
        }));
        await queryRunner.addColumn("cirugias", new TableColumn({
            name: "fecha_valoracion_anestencia",
            type: "date",
            isNullable: true
        }));
        await queryRunner.addColumn("cirugias", new TableColumn({
            name: "nombre_especialista",
            type: "varchar",
            length: "100",
            isNullable: false
        }));
    }
}