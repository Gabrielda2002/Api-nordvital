import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AlterTableInventarioGeneral1743625602171 implements MigrationInterface {
    name = 'AlterTableInventarioGeneral1743625602171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add sede_id column to inventario_general table
        await queryRunner.query(`ALTER TABLE \`inventario_general\` ADD COLUMN \`sede_id\` int NOT NULL`);
     
        await queryRunner.createForeignKey("inventario_general", new TableForeignKey({
            columnNames: ["sede_id"],
            referencedColumnNames: ["IdLugar"],
            referencedTableName: "sedes",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.query(`ALTER TABLE "inventario_general" DROP CONSTRAINT "FK_inventario_general_sede"`);
        
        // Drop the sede_id column
        await queryRunner.query(`ALTER TABLE "inventario_general" DROP COLUMN "sede_id"`);
    }
}