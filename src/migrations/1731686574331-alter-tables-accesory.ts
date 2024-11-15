import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTablesAddTimestamps1731686574331 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('componentes', [
            new TableColumn({
                name: 'created_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }),
            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }),
        ]);

        await queryRunner.addColumns('accesorios_equipos', [
            new TableColumn({
                name: 'created_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }),
            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }),
        ]);

        await queryRunner.addColumns('software', [
            new TableColumn({
                name: 'created_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }),
            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('componentes', 'created_at');
        await queryRunner.dropColumn('componentes', 'updated_at');

        await queryRunner.dropColumn('accesorios_equipos', 'created_at');
        await queryRunner.dropColumn('accesorios_equipos', 'updated_at');

        await queryRunner.dropColumn('software', 'created_at');
        await queryRunner.dropColumn('software', 'updated_at');
    }
}