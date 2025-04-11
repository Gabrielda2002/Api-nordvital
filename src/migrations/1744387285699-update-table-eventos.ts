import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateTableEventos1744387285699 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Primero actualizamos valores inválidos usando una aproximación diferente
        try {
            // Intenta actualizar registros con fechas incorrectas
            await queryRunner.query(`
                UPDATE eventos 
                SET fecha_inicio = '2000-01-01 00:00:00' 
                WHERE fecha_inicio IS NULL OR fecha_inicio < '1000-01-01 00:00:00'
            `);
            
            await queryRunner.query(`
                UPDATE eventos 
                SET fecha_fin = '2000-01-01 00:00:00' 
                WHERE fecha_fin IS NULL OR fecha_fin < '1000-01-01 00:00:00'
            `);
        } catch (error) {
            console.log("Advertencia: No se pudieron actualizar las fechas inválidas, continuando con la migración");
        }

        // 2. Luego crea columnas temporales de tipo DATE
        await queryRunner.addColumn(
            "eventos",
            new TableColumn({
                name: "fecha_inicio_new",
                type: "date",
                isNullable: false,
                default: "'2000-01-01'" // Agregamos comillas adicionales
            })
        );

        await queryRunner.addColumn(
            "eventos",
            new TableColumn({
                name: "fecha_fin_new",
                type: "date",
                isNullable: false,
                default: "'2000-01-01'" // Agregamos comillas adicionales
            })
        );

        // 3. Copia los datos válidos y establece valores por defecto para inválidos
        await queryRunner.query(`
            UPDATE eventos 
            SET fecha_inicio_new = CASE 
                WHEN fecha_inicio IS NULL OR fecha_inicio < '1000-01-01 00:00:00' THEN '2000-01-01'
                ELSE DATE(fecha_inicio) 
            END
        `);
        
        await queryRunner.query(`
            UPDATE eventos 
            SET fecha_fin_new = CASE 
                WHEN fecha_fin IS NULL OR fecha_fin < '1000-01-01 00:00:00' THEN '2000-01-01'
                ELSE DATE(fecha_fin) 
            END
        `);

        // 4. Elimina las columnas originales
        await queryRunner.dropColumn("eventos", "fecha_inicio");
        await queryRunner.dropColumn("eventos", "fecha_fin");

        // 5. Renombra las nuevas columnas
        await queryRunner.renameColumn("eventos", "fecha_inicio_new", "fecha_inicio");
        await queryRunner.renameColumn("eventos", "fecha_fin_new", "fecha_fin");

        // 6. Añade las columnas hora_inicio y hora_fin
        await queryRunner.addColumns("eventos", [
            new TableColumn({
                name: "hora_inicio",
                type: "time",
                isNullable: false,
                default: "'00:00:00'" // Agregamos comillas adicionales
            }),
            new TableColumn({
                name: "hora_fin",
                type: "time",
                isNullable: false,
                default: "'00:00:00'" // Agregamos comillas adicionales
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar las columnas de hora
        await queryRunner.dropColumn("eventos", "hora_inicio");
        await queryRunner.dropColumn("eventos", "hora_fin");

        // Crear columnas temporales de tipo timestamp
        await queryRunner.addColumn(
            "eventos",
            new TableColumn({
                name: "fecha_inicio_old",
                type: "timestamp",
                isNullable: false,
                default: () => "CURRENT_TIMESTAMP",
            })
        );

        await queryRunner.addColumn(
            "eventos",
            new TableColumn({
                name: "fecha_fin_old",
                type: "timestamp",
                isNullable: false,
                default: () => "CURRENT_TIMESTAMP",
            })
        );

        // Copiar datos
        await queryRunner.query(`
            UPDATE eventos 
            SET fecha_inicio_old = fecha_inicio
        `);
        
        await queryRunner.query(`
            UPDATE eventos 
            SET fecha_fin_old = fecha_fin
        `);

        // Eliminar columnas originales
        await queryRunner.dropColumn("eventos", "fecha_inicio");
        await queryRunner.dropColumn("eventos", "fecha_fin");

        // Renombrar columnas
        await queryRunner.renameColumn("eventos", "fecha_inicio_old", "fecha_inicio");
        await queryRunner.renameColumn("eventos", "fecha_fin_old", "fecha_fin");
    }
}