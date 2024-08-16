import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTablesSscDos1723758957184 implements MigrationInterface {
    name = 'CreateTablesSscDos1723758957184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'archivos',
            columns: [{
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            }, {
                name: 'nombre',
                type: 'varchar'
            }, {
                name: 'fecha',
                type: 'date'
            },{
                name: 'ruta',
                type: 'varchar'
            }, {
                name: 'tipo',
                type: 'varchar'
            }, {
                name: 'tamano',
                type: 'int'
            },{
                name: 'carpeta_id',
                type: 'int',
                isNullable: true
            },{
                name: 'mimeType',
                type: 'varchar'
            },{
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP'
            },{
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP'
            }]
        }));

        await queryRunner.createTable(new Table({
            name: 'carpetas',
            columns: [{
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment'
            }, {
                name: 'nombre',
                type: 'varchar'
            },{
                name: 'user_id',
                type: 'int'
            }, {
                name: 'carpeta_padre_id',
                type: 'int',
                isNullable: true
            }, {
                name: 'ruta',
                type: 'varchar'
            },{
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP'
            },{
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP'
            }]
        }));

        await queryRunner.createForeignKey('archivos', new TableForeignKey({
            columnNames: ['carpeta_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'carpetas',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createForeignKey('carpetas', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['IdUsuario'],
            referencedTableName: 'usuario',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createForeignKey('carpetas', new TableForeignKey({
            columnNames: ['carpeta_padre_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'carpetas',
            onDelete: 'SET NULL'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableArchivos = await queryRunner.getTable('archivos');
        const foreignKeyArchivo = tableArchivos?.foreignKeys.find(fk => fk.columnNames.indexOf('carpeta_id') !== -1);

        if (foreignKeyArchivo) {
            await queryRunner.dropForeignKey('archivos', foreignKeyArchivo);
            
        }
        await queryRunner.dropTable('archivos');

        const tableCarpetas = await queryRunner.getTable('carpetas');
        const foreignKeyUser = tableCarpetas?.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        const foreignKeyCarpetaPadre = tableCarpetas?.foreignKeys.find(fk => fk.columnNames.indexOf('carpeta_padre_id') !== -1);

        if (foreignKeyUser) {
            await queryRunner.dropForeignKey('carpetas', foreignKeyUser);
        }
        if (foreignKeyCarpetaPadre) {
            await queryRunner.dropForeignKey('carpetas', foreignKeyCarpetaPadre);
        }
        await queryRunner.dropTable('carpetas');
    }
}
