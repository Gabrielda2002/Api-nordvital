import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableParticipant1745843903448 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "participantes",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "nombres",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "apellidos",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "tipo_documento",
                        type: "varchar",
                        length: "10",  
                        isNullable: false,
                    },
                    {
                        name: "numero_documento",
                        type: "int",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "profesion",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "correo",
                        type: "varchar",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "telefono",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "ciudad",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "pais",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "tipo_participante",
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
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("participantes");
    }
}