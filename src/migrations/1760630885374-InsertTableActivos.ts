import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertTableActivos1760630885374 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO \`activos\` (\`nombre\`, \`id_clasificacion\`) VALUES 
            ('Baño Serologico', 6),
            ('Centrifuga', 6),
            ('Cabina Bioseguridad', 6),
            ('Incubadora', 6),
            ('Microscopio', 6),
            ('Congelador', 6),
            ('Congelador Farmaceutico', 6),
            ('Centrifugadora Analoga', 6),
            ('Agitador De Plaquetas', 6),
            ('Analizador De Quimioluminiscencia', 6),
            ('Rotador De Mazzini', 6),
            ('MicroPipeta', 6),
            ('Analizador De Orina', 6),
            ('Termohigometro', 6)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`activos\` 
            WHERE \`nombre\` IN (
                'Baño Serologico',
                'Centrifuga',
                'Cabina Bioseguridad',
                'Incubadora',
                'Microscopio',
                'Congelador',
                'Congelador Farmaceutico',
                'Centrifugadora Analoga',
                'Agitador De Plaquetas',
                'Analizador De Quimioluminiscencia',
                'Rotador De Mazzini',
                'MicroPipeta',
                'Analizador De Orina',
                'Termohigometro'
            ) AND \`id_clasificacion\` = 6
        `);
    }
}
