import { MigrationInterface, QueryRunner, TableIndex, TableForeignKey } from "typeorm";

export class AlterIndexProgramaMetaHistorico1753797466390 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Primero, obtener información sobre la clave foránea
        const table = await queryRunner.getTable("programa_meta_historico");
        const foreignKey = table?.foreignKeys.find(fk => 
            fk.columnNames.includes("programa_id")
        );

        // 2. Si existe la clave foránea, eliminarla temporalmente
        if (foreignKey) {
            await queryRunner.dropForeignKey("programa_meta_historico", foreignKey);
        }

        // 3. Eliminar el índice único actual
        await queryRunner.dropIndex("programa_meta_historico", "IDX_programa_meta_año_mes");
        
        // 4. Crear el nuevo índice único que incluye el campo 'profesional'
        await queryRunner.createIndex(
            "programa_meta_historico",
            new TableIndex({
                name: "IDX_programa_meta_año_mes_profesional",
                columnNames: ["programa_id", "año", "mes", "profesional"],
                isUnique: true, // Un programa solo puede tener una meta por mes por profesional
            })
        );

        // 5. Restaurar la clave foránea
        if (foreignKey) {
            await queryRunner.createForeignKey("programa_meta_historico", foreignKey);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Obtener información sobre la clave foránea
        const table = await queryRunner.getTable("programa_meta_historico");
        const foreignKey = table?.foreignKeys.find(fk => 
            fk.columnNames.includes("programa_id")
        );

        // 2. Si existe la clave foránea, eliminarla temporalmente
        if (foreignKey) {
            await queryRunner.dropForeignKey("programa_meta_historico", foreignKey);
        }

        // 3. Eliminar el nuevo índice
        await queryRunner.dropIndex("programa_meta_historico", "IDX_programa_meta_año_mes_profesional");
        
        // 4. Restaurar el índice original (sin profesional)
        await queryRunner.createIndex(
            "programa_meta_historico",
            new TableIndex({
                name: "IDX_programa_meta_año_mes",
                columnNames: ["programa_id", "año", "mes"],
                isUnique: true,
            })
        );

        // 5. Restaurar la clave foránea
        if (foreignKey) {
            await queryRunner.createForeignKey("programa_meta_historico", foreignKey);
        }
    }
}
