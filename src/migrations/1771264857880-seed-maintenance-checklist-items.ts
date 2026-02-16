import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedMaintenanceChecklistItems1771264857880 implements MigrationInterface {
    name?: "SeedMaintenanceChecklistItems1771264857880";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO maintenance_checklist_items (item_key, label, display_order, is_active) VALUES
            ('limpieza-interna', 'Limpieza interna del equipo', 1, 1),
            ('limpieza-externa', 'Limpieza externa del equipo', 2, 1),
            ('revision-refrigeracion', 'Limpieza y revisión de sistema de refrigeración', 3, 1),
            ('pasta-termica', 'Aplicación/revisión de pasta térmica', 4, 1),
            ('actualizacion-so', 'Actualización del sistema operativo', 5, 1),
            ('desfragmentacion', 'Desfragmentación/optimización de disco', 6, 1),
            ('revision-cables', 'Revisión de cables y conexiones', 7, 1),
            ('limpieza-temporales', 'Limpieza de archivos temporales', 8, 1),
            ('revision-perifericos', 'Revisión de periféricos (teclado, mouse, monitor)', 9, 1),
            ('pruebas-rendimiento', 'Pruebas de rendimiento general', 10, 1),
            ('revision-bateria', 'Revisión del estado de la batería (laptops)', 11, 1)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM maintenance_checklist_items 
            WHERE item_key IN (
                'limpieza-interna',
                'limpieza-externa',
                'revision-refrigeracion',
                'pasta-termica',
                'actualizacion-so',
                'desfragmentacion',
                'revision-cables',
                'limpieza-temporales',
                'revision-perifericos',
                'pruebas-rendimiento',
                'revision-bateria'
            )
        `);
    }
}
