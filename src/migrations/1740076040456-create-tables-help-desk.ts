import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTicketsTable1740076040456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // tabla categorias
    await queryRunner.createTable(
      new Table({
        name: "categorias",
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
            length: "255",
            isNullable: false,
          },
        ],
      })
    );

    // tabla estados_tickets
    await queryRunner.createTable(
      new Table({
        name: "estados_tickets",
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
            length: "255",
            isNullable: false,
          },
        ],
      })
    );

    // tabla prioridades
    await queryRunner.createTable(
      new Table({
        name: "prioridades",
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
            length: "255",
            isNullable: false,
          },
        ],
      })
    );

    // tabla tickets
    await queryRunner.createTable(
      new Table({
        name: "tickets",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "titulo",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "descripcion",
            type: "text",
            isNullable: false,
          },
          {
            name: "usuario_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "categoria_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "estado_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "prioridad_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "fecha_creacion",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "fecha_actualizacion",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["usuario_id"],
            referencedColumnNames: ["IdUsuario"],
            referencedTableName: "usuario",
            onDelete: "CASCADE",
          },
          {
            columnNames: ["categoria_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "categorias",
            onDelete: "CASCADE",
          },
          {
            columnNames: ["estado_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "estados_tickets",
            onDelete: "CASCADE",
          },
          {
            columnNames: ["prioridad_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "prioridades",
            onDelete: "CASCADE",
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "comentarios",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "ticket_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "usuario_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "comentario",
            type: "text",
            isNullable: false,
          },
          {
            name: "fecha_creacion",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["ticket_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "tickets",
            onDelete: "CASCADE",
          },
          {
            columnNames: ["usuario_id"],
            referencedColumnNames: ["IdUsuario"],
            referencedTableName: "usuario",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("tickets");
  }
}
