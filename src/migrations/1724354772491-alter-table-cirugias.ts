import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";
import bcrypt from "bcrypt";

const saltRounds = 10;

export class AlterTableCirugias1724354772491 implements MigrationInterface {
  name = "AlterTableCirugias1724354772491";

  public async up(queryRunner: QueryRunner): Promise<void> {

    // ? se busca la llave foranea de pacientes y si se encuentra se elimina
    const pacienteExist = await queryRunner.hasColumn(
        "cirugias",
        "paciente_id"
      );
      if (pacienteExist) {
        const table = await queryRunner.getTable("cirugias");
        const foreignKey = table?.foreignKeys.find(
          (fk) => fk.columnNames.indexOf("paciente_id") !== -1
        );
  
        if (foreignKey) {
          await queryRunner.dropForeignKey("cirugias", foreignKey);
        }
  
        await queryRunner.dropColumn("cirugias", "paciente_id");
      }

      // ? se crea la columna estado en la tabla cirugias

      await queryRunner.addColumn('cirugias', new TableColumn({
            name: 'estado',
            type: 'tinyint',
            isNullable: true
      }))

      //?  se eliminan campos sobrantes en la tabla archivos
        const nameSavedExist = await queryRunner.hasColumn(
            "archivos",
            "fecha"
        );
        if (nameSavedExist) {
            await queryRunner.dropColumn("archivos", "fecha");
        }

        const nameSavedExist2 = await queryRunner.hasColumn(
            "archivos",
            "tipo"
        );
        if (nameSavedExist2) {
            await queryRunner.dropColumn("archivos", "tipo");
        }

    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    // ? se crea la columna paciente_id en la tabla cirugias
    await queryRunner.addColumn('cirugias', new TableColumn({
        name: 'paciente_id',
        type: 'int',
        isNullable: true
    }))

    // ? se crea la llave foranea de pacientes a cirugias
    await queryRunner.createForeignKey(
        "cirugias",
        new TableForeignKey({
          columnNames: ["paciente_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "pacientes",
          onDelete: "CASCADE",
        })
      );

    // ? se elimina la columna estado en la tabla cirugias
    const estadoExist = await queryRunner.hasColumn(
        "cirugias",
        "estado"
      );
      if (estadoExist) {
        await queryRunner.dropColumn("cirugias", "estado");
      }

    // ? se crean las columnas fecha y tipo en la tabla archivos
    await queryRunner.addColumn('archivos', new TableColumn({
        name: 'fecha',
        type: 'timestamp',
        isNullable: true
    }))

    await queryRunner.addColumn('archivos', new TableColumn({
        name: 'tipo',
        type: 'varchar',
        isNullable: true
    }))

  }
}
