import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableEquipos1732049016866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "equipos",
      new TableColumn({
        name: "DHCP",
        type: "tinyint",
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      "equipos",
      "direccion_ip",
      new TableColumn({
        name: "direccion_ip",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "sedes",
      new TableColumn({
        name: "numero_sede",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.addColumn("equipos", new TableColumn({
      name: "id_usuario",
      type: "int",
      isNullable: true
    }));

    await queryRunner.createForeignKey("equipos", new TableForeignKey({
      columnNames: ["id_usuario"],
      referencedColumnNames: ["IdUsuario"],
      referencedTableName: "usuario",
      onDelete: "CASCADE"
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("equipos", "FK_equipos_usuarios");
    await queryRunner.dropColumn("equipos", "id_usuario");

    await queryRunner.changeColumn(
      "equipos",
      "direccion_ip",
      new TableColumn({
        name: "direccion_ip",
        type: "varchar",
        isNullable: false,
      })
    );

    await queryRunner.dropColumn("equipos", "DHCP");

    await queryRunner.dropColumn("sede", "numero_sede");
  }
}
