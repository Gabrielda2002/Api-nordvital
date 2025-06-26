import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateProfesionalesAndUpdateRadicacion1750948366048
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla profesionales
    await queryRunner.createTable(
      new Table({
        name: "profesionales",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "nombre",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    await queryRunner.query(`
            INSERT INTO profesionales (nombre)
            VALUES
                ('LUZARDO ALBERTO PORRAS QUEVEDO'),
                ('NEIKI NORELYS VARELA VARGAS'),
                ('JESSICA ELAINE DIAZ'),
                ('LUIS ALBERTO ALMAGUER'),
                ('CINDY PAOLA CABALLERO'),
                ('SUSAN DANIELA PARADA'),
                ('ROCIO AMPARO LAGUADO'),
                ('SHANTAL JULIANA ALVAREZ MORENO'),
                ('DEISY VALENTINA CELIS'),
                ('JOSE ISRAEL SABOGAL'),
                ('JOSE ANTONIO CASTILLO'),
                ('MARIA JULIANA RAMIREZ'),
                ('OSCAR JAVIER GARRIDO'),
                ('EMELIN LOYO'),
                ('DIEGO ANDRES ARIAS PEREZ'),
                ('MARIO VILLAMARIN'),
                ('AMINE AMPARO SAFADI SUAREZ'),
                ('JUAN PABLO MENDOZA'),
                ('OLGA ARIAS'),
                ('EDWARD FABIAN SANTAMARIA'),
                ('ANDREA GARZON BARRERA'),
                ('EVELYN TORRES'),
                ('ANGELA LUCIA VELEZ'),
                ('MIGUEL ANTONIO PARRA LEAL MARIO TERCERO HERNANDEZ'),
                ('MARIO TERCERO HERNANDEZ'),
                ('LUIS PALENCIA'),
                ('JOSE CHAUSTRE'),
                ('NATALI GONZALEZ'),
                ('ANGELICA BARBA'),
                ('ROXANA CALDERON'),
                ('MARIA ISABEL VARELA'),
                ('NURY WILCHES'),
                ('ELKIN PAREDES'),
                ('JORGE MENDOZA'),
                ('JOSE ARNAEZ'),
                ('GERSON GUARIN'),
                ('KRISELL CONTRERAS'),
                ('ANDRES FELIPE ARIAS'),
                ('VANESSA SANCHEZ'),
                ('LEONARDO CUELLA'),
                ('FREDDY RIVERO'),
                ('JUAN GALLEGO'),
                ('YOLI MOSQUERA'),
                ('GERARDO BUSTAMANTE'),
                ('ALEXANDER BAHAMON'),
                ('MARCO LEYVA'),
                ('JORGE YAÑEZ'),
                ('ERWIN HERRERA'),
                ('CARLOS PANQUEBA'),
                ('OSCAR MEDINA'),
                ('GERARDO RODRIGUEZ'),
                ('JESUS VELANDIA'),
                ('YORDIS FERNANDEZ'),
                ('NESTOR IBARRA'),
                ('JESSICA GOMEZ'),
                ('MELISSA SILVA'),
                ('JOSE CARRILLO'),
                ('ARMANDO DIAZ'),
                ('DR. EDUARDO HERNANDEZ'),
                ('ALCIRA RUEDA'),
                ('GAMAL HAMDAN'),
                ('LUIS VILLAMIZAR ZUÑIGA'),
                ('LEONARDO BELLO'),
                ('ALBERTO OCHOA'),
                ('CARLOS MORENO CHACON'),
                ('TULIO JAIMES'),
                ('MARTIN FABRICIO ANGARITA'),
                ('ANA RODRIGUEZ'),
                ('MIREP'),
                ('JUAN BAUTISTA'),
                ('ALVARO GRANADOS'),
                ('MARIA MERCEDES GOMEZ'),
                ('NEFRA ARREVALO ANGULO'),
                ('YELITZA RAMIREZ'),
                ('NESLLY USECHE'),
                ('BERNARDO VEGA'),
                ('HOLLMAN AVENDAÑO'),
                ('ELIANA GARCIA'),
                ('DR JORGE ANTONIO MARTINEZ'),
                ('SANDRA SANCHES'),
                ('MARIANA VIZCAINO'),
                ('JUAN PABLO GUERRERO'),
                ('CAROLINA KERGUELEN'),
                ('ANDREA JAIMEZ'),
                ('KAILYN ALEJANDRA PATIÑO'),
                ('JESUS ALVAREZ'),
                ('DRA SONIA CAROLINA PEÑA'),
                ('ROSA LILIANA ESPINAL'),
                ('ALVARO ACEVEDO'),
                ('NAHILE RIOS'),
                ('JAVIER LEAL'),
                ('ERIKA MANGLES'),
                ('CLELIA PADILLA'),
                ('NATALIA MARA JAUREGUI'),
                ('GABRIEL MANOSALVA'),
                ('LIGIA PICON'),
                ('JENNY CHAUSTRE'),
                ('JOSE GABRIEL EDUDARDO CASTELLANOS NAVIA'),
                ('JOSE LUIS HERNANDEZ GONZALES'),
                ('EMILIN CHARINA LOYO'),
                ('CARLOS HUMBERTO MORA URBINA'),
                ('RAFAEL LEONARDO CUELLAR SUS'),
                ('LEONARDO ANDRES CASTRO VALENCIA'),
                ('RAFAEL IVAN NEIRA SAYAGO')
        `);

    // Agregar columna profesional_id a radicacion
    await queryRunner.addColumn(
      "radicacion",
      new TableColumn({
        name: "id_profesional",
        type: "int",
        isNullable: true,
        default: null,
      })
    );

    // Crear llave foránea
    await queryRunner.createForeignKey(
      "radicacion",
      new TableForeignKey({
        columnNames: ["id_profesional"],
        referencedTableName: "profesionales",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar llave foránea
    const table = await queryRunner.getTable("radicacion");
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("id_profesional") !== -1
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey("radicacion", foreignKey);
    }

    // Eliminar columna id_profesional
    await queryRunner.dropColumn("radicacion", "id_profesional");

    // Eliminar tabla profesionales
    await queryRunner.dropTable("profesionales");
  }
}
