import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertActivos1768597059212 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO \`activos\` (\`nombre\`, \`id_clasificacion\`) VALUES 
            ('TENSIOMETRO ADULTO', 3),
            ('TENSIOMETRO PEDIATRICO', 3),
            ('TENSIOMETRO DIGITAL', 3),
            ('FONENDOSCOPIO', 3),
            ('BALANZA DIGITAL', 3),
            ('BALANZA PEDIATRICA', 3),
            ('TALLIMETRO', 3),
            ('CINTA METRICA', 3),
            ('MARTILLO DE REFLEJOS', 3),
            ('NEGATOSCOPIO', 3),
            ('LAMPARA CUELLO DE CISNE', 3),
            ('LAMPARA DE PROCEDIMIENTOS', 3),
            ('LINTERNA DE PROCEDIMIENTO', 3),
            ('EQUIPO DE ORGANOS DE LOS SENTIDOS', 3),
            ('PULSIOXIMETRO ADULTO', 3),
            ('PULSIOXIMETRO PEDIATRICO', 3),
            ('TERMOMETRO DIGITAL', 3),
            ('TERMOMETRO ADULTO', 3),
            ('TERMOMETRO PEDIATRICO', 3),
            ('TERMOMETRO AMBIENTAL', 3),
            ('TERMOHIGROMETRO DIGITAL', 3),
            ('REFRIGERADOR PARA BIOLOGICOS', 3),
            ('TERMO PORTA VACUNAS', 3),
            ('CAJA DE EMERGENCIA', 3),
            ('DOPPLER FETAL', 3),
            ('GLUCOMETRO', 3),
            ('CAMILLA', 3)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`activos\` 
            WHERE \`nombre\` IN (
                'TENSIOMETRO ADULTO',
                'TENSIOMETRO PEDIATRICO',
                'TENSIOMETRO DIGITAL',
                'FONENDOSCOPIO',
                'BALANZA DIGITAL',
                'BALANZA PEDIATRICA',
                'TALLIMETRO',
                'CINTA METRICA',
                'MARTILLO DE REFLEJOS',
                'NEGATOSCOPIO',
                'LAMPARA CUELLO DE CISNE',
                'LAMPARA DE PROCEDIMIENTOS',
                'LINTERNA DE PROCEDIMIENTO',
                'EQUIPO DE ORGANOS DE LOS SENTIDOS',
                'PULSIOXIMETRO ADULTO',
                'PULSIOXIMETRO PEDIATRICO',
                'TERMOMETRO DIGITAL',
                'TERMOMETRO ADULTO',
                'TERMOMETRO PEDIATRICO',
                'TERMOMETRO AMBIENTAL',
                'TERMOHIGROMETRO DIGITAL',
                'REFRIGERADOR PARA BIOLOGICOS',
                'TERMO PORTA VACUNAS',
                'CAJA DE EMERGENCIA',
                'DOPPLER FETAL',
                'GLUCOMETRO',
                'CAMILLA'
            ) AND \`id_clasificacion\` = 3
        `);
    }
}
