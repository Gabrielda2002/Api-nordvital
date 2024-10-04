import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableCertificados1728066713815 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "certificados",
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
                        name: "numero_cedula",
                        type: "bigint(25)",
                        isNullable: false,
                    },
                    {
                        name: "ruta",
                        type: "varchar(255)",
                        isNullable: false,
                    },
                    {
                      name: "tipo",
                        type: "varchar(100)",
                        isNullable: false,  
                    },
                    {
                        name: "size",
                        type: "bigint(25)",
                        isNullable: false,
                    },
                    {
                        name: "fecha_creacion",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("certificados");
    }
}