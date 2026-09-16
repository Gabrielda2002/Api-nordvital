import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableEventos1789505689513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "eventos",
      new TableColumn({
        name: "place",
        type: "varchar",
        length: "100",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "eventos",
      new TableColumn({
        name: "autor_id",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "eventos",
      new TableForeignKey({
        name: "FK_eventos_autor_users",
        columnNames: ["autor_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("eventos", "FK_eventos_autor_users");
    await queryRunner.dropColumn("eventos", "autor_id");
    await queryRunner.dropColumn("eventos", "place");
  }
}