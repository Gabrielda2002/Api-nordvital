import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTablesResearchCenter1746459736000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla contact_ci
        await queryRunner.createTable(
            new Table({
                name: "contact_ci",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "lastname",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "20"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "150"
                    },
                    {
                        name: "subject",
                        type: "varchar",
                        length: "50"
                    },
                    {
                        name: "description",
                        type: "text"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // Crear tabla volunteer_ci
        await queryRunner.createTable(
            new Table({
                name: "volunteer_ci",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "lastname",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "20"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "150"
                    },
                    {
                        name: "identification_type",
                        type: "varchar",
                        length: "3"
                    },
                    {
                        name: "identification_number",
                        type: "varchar",
                        length: "20"
                    },
                    {
                        name: "department",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "municipality",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "eps",
                        type: "varchar",
                        length: "80"
                    },
                    {
                        name: "age",
                        type: "varchar",
                        length: "3"
                    },
                    {
                        name: "nationality",
                        type: "varchar",
                        length: "50"
                    },
                    {
                        name: "date",
                        type: "date"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("volunteer_ci");
        await queryRunner.dropTable("contact_ci");
    }

}
