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
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        isUnique: false,
                    },
                    {
                        name: "profesion",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "Empresa",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "correo",
                        type: "varchar",
                        isNullable: false,
                        isUnique: false,
                    },
                    {
                        name: "telefono",
                        type: "varchar",
                        length: "15",
                        isNullable: false,
                    },
                    {
                        name: "direccion",
                        type: "varchar",
                        length: "150",
                        isNullable: false,
                    },
                    {
                        name: "ciudad",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "pais",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "departamento",
                        type: "varchar",
                        isNullable: false,
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