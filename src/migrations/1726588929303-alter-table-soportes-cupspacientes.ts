import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableSoportesCupspacientes1726588929303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         // Add name_saved column to soportes table
        await queryRunner.addColumn("soportes", new TableColumn({
            name: "name_saved",
            type: "varchar",
            isNullable: true
        }));

        await queryRunner.query(`
            UPDATE \`cupspaciente\`
            SET \`UltimaModificacion\` = STR_TO_DATE(\`UltimaModificacion\`, '%Y-%m-%d %h:%i %p')
        `)

        await queryRunner.query(`
            UPDATE \`cupspaciente\`
            SET \`FechaRegistro\` = STR_TO_DATE(\`FechaRegistro\`, '%Y-%m-%d %h:%i %p')
        `)

         // Change data type of UltimaModificacion and FechaRegistro to timestamp in cupspacientes table
        await queryRunner.changeColumn("cupspaciente", "UltimaModificacion", new TableColumn({
            name: "UltimaModificacion",
            type: "timestamp",
            isNullable: false
        }));

        await queryRunner.changeColumn("cupspaciente", "FechaRegistro", new TableColumn({
            name: "FechaRegistro",
            type: "timestamp",
            isNullable: false

        }));

        
        // * en caso de que ocurra un error a la hora de correr la migracion tal y como esta
        // crear la columna FechaRegistro en la tabla cupspaciente
        // await queryRunner.addColumn("cupspaciente", new TableColumn({
        //     name: "FechaRegistro",
        //     type: "timestamp",
        //     default: "CURRENT_TIMESTAMP",
        //     isNullable: false
        // }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // Remove name_saved column from soportes table
        await queryRunner.dropColumn("soportes", "name_saved");

        // Change data type of UltimaModificacion and FechaRegistro back to original type in cupspacientes table
        await queryRunner.changeColumn("cupspaciente", "UltimaModificacion", new TableColumn({
            name: "UltimaModificacion",
            type: "varchar", 
            isNullable: false
        }));

        await queryRunner.changeColumn("cupspaciente", "FechaRegistro", new TableColumn({
            name: "FechaRegistro",
            type: "varchar", 
            isNullable: false
        }));
    }
}