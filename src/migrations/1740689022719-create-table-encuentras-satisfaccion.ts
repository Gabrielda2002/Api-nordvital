import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEncuestasSatisfaccionTable1740689022719 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "encuestas_satisfaccion",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "ticket_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "usuario_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "calificacion_general",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "tiempo_respuesta",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "conocimiento_tecnico",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "amabilidad_soporte",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "solucion_efectiva",
                    type: "boolean",
                    isNullable: false
                },
                {
                    name: "comentario",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "recomendaria_servicio",
                    type: "boolean",
                    isNullable: false
                },
                {
                    name: "fecha_creacion",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ],
            foreignKeys: [
                {
                    columnNames: ["ticket_id"],
                    referencedTableName: "tickets",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE"
                },
                {
                    columnNames: ["usuario_id"],
                    referencedTableName: "usuario",
                    referencedColumnNames: ["IdUsuario"],
                    onDelete: "CASCADE"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("encuestas_satisfaccion");
    }
}