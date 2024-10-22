import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableGestionAuxiliar1729622852022 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
         const radicacionExist = await queryRunner.hasColumn("seguimientoauxiliar", 'Radicacion')
         if (radicacionExist) {
            
            // Find the foreign key
             const table = await queryRunner.getTable("seguimientoauxiliar");
             const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("Radicacion") !== -1);
            
            // Drop the foreign key
             if (foreignKey) {
                 await queryRunner.dropForeignKey("seguimientoauxiliar", foreignKey);
             }
         }

        // // rename the column
        // await queryRunner.renameColumn("seguimientoauxiliar", "Radicacion", "idCups");

        //  // Alter the column to set the correct default value
        //  await queryRunner.query(`ALTER TABLE \`seguimientoauxiliar\` CHANGE \`Radicacion\` \`idCups\` int(11) NULL DEFAULT NULL`);

        // create the foreign key with the cupspaciente table
        await queryRunner.createForeignKey("seguimientoauxiliar", new TableForeignKey({
            columnNames: ["Radicacion"],
            referencedColumnNames: ["IdCups"],
            referencedTableName: "cupspaciente",
            onDelete: "CASCADE"
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recreate the foreign key
        
        const radializacionExist = await queryRunner.hasColumn("seguimientoauxiliar", 'idCups')
        if (radializacionExist) {
            
            // Find the foreign key
            const table = await queryRunner.getTable("seguimientoauxiliar");
            const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("idCups") !== -1);
            
            // Drop the foreign key
            if (foreignKey) {
                await queryRunner.dropForeignKey("seguimientoauxiliar", foreignKey);
            }
        }

        // rename the column
        await queryRunner.renameColumn("seguimientoauxiliar", "idCups", "Radicacion");

        // Alter the column to set the correct default value
        await queryRunner.query(`ALTER TABLE \`seguimientoauxiliar\` CHANGE \`Radicacion\` \`Radicacion\` int NULL DEFAULT NULL`);
        

        // create the foreign key with the cupspaciente table
        await queryRunner.createForeignKey("seguimientoauxiliar", new TableForeignKey({
            columnNames: ["Radicacion"],
            referencedColumnNames: ["Radicacion"],
            referencedTableName: "cupspaciente",
            onDelete: "CASCADE"
        }));
        
    }
}