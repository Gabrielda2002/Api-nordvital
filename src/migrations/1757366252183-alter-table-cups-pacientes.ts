import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCupsPacientes1757366252183 implements MigrationInterface {
    name = 'AlterTableCupsPacientes1757366252183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Agregar el nuevo campo servicio_id a la tabla cupspaciente
        await queryRunner.query(`ALTER TABLE \`cupspaciente\` ADD \`servicio_id\` int NULL`);
        
        // 2. Migrar datos: actualizar servicio_id basándose en coincidencia de códigos
        // Estrategia múltiple para manejar códigos con ceros perdidos:
        
        // 2.1 Coincidencia directa (sin padding)
        await queryRunner.query(`
            UPDATE \`cupspaciente\` cp 
            INNER JOIN \`serviciosolicitado\` s ON CAST(cp.\`CodigoCupsPacientes\` AS CHAR) = s.\`Codigo\`
            SET cp.\`servicio_id\` = s.\`IdServicioSolicitado\`
            WHERE cp.\`servicio_id\` IS NULL
        `);
        
        // 2.2 Coincidencia con padding a 6 dígitos (030217)
        await queryRunner.query(`
            UPDATE \`cupspaciente\` cp 
            INNER JOIN \`serviciosolicitado\` s ON LPAD(cp.\`CodigoCupsPacientes\`, 6, '0') = s.\`Codigo\`
            SET cp.\`servicio_id\` = s.\`IdServicioSolicitado\`
            WHERE cp.\`servicio_id\` IS NULL
        `);
        
        // 2.3 Coincidencia con padding a 5 dígitos (00123)
        await queryRunner.query(`
            UPDATE \`cupspaciente\` cp 
            INNER JOIN \`serviciosolicitado\` s ON LPAD(cp.\`CodigoCupsPacientes\`, 5, '0') = s.\`Codigo\`
            SET cp.\`servicio_id\` = s.\`IdServicioSolicitado\`
            WHERE cp.\`servicio_id\` IS NULL
        `);
        
        // 2.4 Coincidencia con padding a 4 dígitos (0123)
        await queryRunner.query(`
            UPDATE \`cupspaciente\` cp 
            INNER JOIN \`serviciosolicitado\` s ON LPAD(cp.\`CodigoCupsPacientes\`, 4, '0') = s.\`Codigo\`
            SET cp.\`servicio_id\` = s.\`IdServicioSolicitado\`
            WHERE cp.\`servicio_id\` IS NULL
        `);
        
        // 3. Crear el constraint de foreign key
        await queryRunner.query(`
            ALTER TABLE \`cupspaciente\` 
            ADD CONSTRAINT \`FK_cupspaciente_servicio\` 
            FOREIGN KEY (\`servicio_id\`) 
            REFERENCES \`serviciosolicitado\`(\`IdServicioSolicitado\`) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE
        `);
        
        // 4. Crear índice para mejorar performance
        await queryRunner.query(`CREATE INDEX \`IDX_cupspaciente_servicio\` ON \`cupspaciente\` (\`servicio_id\`)`);
        
        // 5. Mostrar estadísticas de la migración (opcional, para verificar)
        console.log('=== ESTADÍSTICAS DE MIGRACIÓN ===');
        
        const totalCups = await queryRunner.query("SELECT COUNT(*) as total FROM `cupspaciente`");
        console.log('Total de registros en cupspaciente:', totalCups[0].total);
        
        const migrated = await queryRunner.query("SELECT COUNT(*) as migrated FROM `cupspaciente` WHERE `servicio_id` IS NOT NULL");
        console.log('Registros migrados exitosamente:', migrated[0].migrated);
        
        const notMigrated = await queryRunner.query("SELECT COUNT(*) as not_migrated FROM `cupspaciente` WHERE `servicio_id` IS NULL");
        console.log('Registros NO migrados (sin coincidencia):', notMigrated[0].not_migrated);
        
        // 6. Mostrar códigos que no pudieron migrar (para debug)
        if (notMigrated[0].not_migrated > 0) {
            const orphanCodes = await queryRunner.query(`
                SELECT DISTINCT CodigoCupsPacientes as codigo_huerfano 
                FROM cupspaciente 
                WHERE servicio_id IS NULL 
                LIMIT 10
            `);
            console.log('Códigos sin coincidencia (primeros 10):', orphanCodes);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios en orden inverso
        
        // 1. Eliminar índice
        await queryRunner.query(`DROP INDEX \`IDX_cupspaciente_servicio\` ON \`cupspaciente\``);
        
        // 2. Eliminar foreign key constraint
        await queryRunner.query(`ALTER TABLE \`cupspaciente\` DROP FOREIGN KEY \`FK_cupspaciente_servicio\``);
        
        // 3. Eliminar la columna servicio_id
        await queryRunner.query(`ALTER TABLE \`cupspaciente\` DROP COLUMN \`servicio_id\``);
        
        console.log('Migración revertida: se eliminó la relación con servicios solicitados');
    }
}