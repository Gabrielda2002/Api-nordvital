import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableCirugias1724277033890 implements MigrationInterface {
  name = "AlterTableCirugias1724277033890";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // * se crea la relacion cirugias a ips_remite
    await queryRunner.createForeignKey(
      "cirugias",
      new TableForeignKey({
        columnNames: ["ips_remitente"],
        referencedColumnNames: ["IdIpsRemite"],
        referencedTableName: "ipsremite",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "gestion_auxiliar_cirugias",
      new TableForeignKey({
        columnNames: ["cup_id"],
        referencedColumnNames: ["IdServicioSolicitado"],
        referencedTableName: "serviciosolicitado",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey('gestion_auxiliar_cirugias', new TableForeignKey({
        columnNames: ['estado'],
        referencedColumnNames: ['id'],
        referencedTableName: 'estadoseguimiento',
        onDelete: 'CASCADE'
    }))


  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const ipsRemitenteExist = await queryRunner.hasColumn(
      "cirugias",
      "ips_remitente"
    );
    if (ipsRemitenteExist) {
      const table = await queryRunner.getTable("cirugias");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("ips_remitente") !== -1
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey("cirugias", foreignKey);
      }

      await queryRunner.dropColumn("cirugias", "ips_remitente");
    }

    const cupIdExist = await queryRunner.hasColumn(
      "gestion_auxiliar_cirugias",
      "cup_id"
    );

    if (cupIdExist) {
      const table = await queryRunner.getTable("gestion_auxiliar_cirugias");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("cup_id") !== -1
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey(
          "gestion_auxiliar_cirugias",
          foreignKey
        );
      }

      await queryRunner.dropColumn("gestion_auxiliar_cirugias", "cup_id");
    }

    const estadoExist = await queryRunner.hasColumn(
      "gestion_auxiliar_cirugias",
      "estado"
    );

    if (estadoExist) {
      const table = await queryRunner.getTable("gestion_auxiliar_cirugias");
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("estado") !== -1
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey(
          "gestion_auxiliar_cirugias",
          foreignKey
        );
      }

      await queryRunner.dropColumn("gestion_auxiliar_cirugias", "estado");
    }
  }
}
