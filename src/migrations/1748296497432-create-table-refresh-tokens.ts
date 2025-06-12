import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTableRefreshTokens1748296497432
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "refresh_tokens",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "token",
            type: "text",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "expires_at",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "is_revoked",
            type: "tinyint",
            default: 0,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Crear la relación con la tabla usuario
    await queryRunner.createForeignKey(
      "refresh_tokens",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "usuario",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    // Crear índice para mejorar el rendimiento en consultas por token
    await queryRunner.query(`
            CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token(255));
        `);

    // Crear índice para consultas por usuario
    await queryRunner.query(`
            CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
        `);

    // Crear índice para consultas por fecha de expiración
    await queryRunner.query(`
            CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(
      `DROP INDEX idx_refresh_tokens_expires_at ON refresh_tokens;`
    );
    await queryRunner.query(
      `DROP INDEX idx_refresh_tokens_user_id ON refresh_tokens;`
    );
    await queryRunner.query(
      `DROP INDEX idx_refresh_tokens_token ON refresh_tokens;`
    );

    // Eliminar clave foránea
    const table = await queryRunner.getTable("refresh_tokens");
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("user_id") !== -1
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey("refresh_tokens", foreignKey);
    }

    // Eliminar tabla
    await queryRunner.dropTable("refresh_tokens");
  }
}
