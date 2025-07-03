import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableDemandaInducidaAddProfesional1751489113063 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("demanda_inducida", new TableColumn({
            name: "profesional",
            type: "enum",
            enum: ["Medicina General", "Enfermería"],
            isNullable: false,
            default: "'Medicina General'"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("demanda_inducida", "profesional");
    }
}