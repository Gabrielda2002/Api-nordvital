import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class RellenarCargoUsuario1757530166543 implements MigrationInterface {
    name = 'RellenarCargoUsuario1757530166543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Actualizar cargo_id basado en el campo position (cargo) existente
        // Usando COLLATE para forzar la misma collation en ambas columnas
        await queryRunner.query(`
            UPDATE \`usuario\` u
            INNER JOIN \`cargo\` c ON 
                UPPER(TRIM(u.cargo)) COLLATE utf8mb4_general_ci = 
                UPPER(TRIM(c.nombre)) COLLATE utf8mb4_general_ci
            SET u.cargo_id = c.id
            WHERE u.cargo IS NOT NULL 
              AND u.cargo != ''
              AND u.cargo_id IS NULL
        `);

        const userTable = await queryRunner.getTable("usuario");
        const hasCargoIdForeignKey = userTable?.foreignKeys.some(fk => fk.columnNames.indexOf("cargo_id") !== -1);

        if (!hasCargoIdForeignKey) {
        await queryRunner.createForeignKey("usuario", new TableForeignKey({
            columnNames: ["cargo_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "cargo",
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        }));
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Limpiar los cargo_id que se asignaron automáticamente
        await queryRunner.query(`
            UPDATE \`usuario\` 
            SET cargo_id = NULL 
            WHERE cargo_id IS NOT NULL
        `);

        const userTable = await queryRunner.getTable("usuario");
        const foreignKey = userTable?.foreignKeys.find(fk => fk.columnNames.indexOf("cargo_id") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("usuario", foreignKey);
        }
    }
}