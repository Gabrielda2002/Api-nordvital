import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RenameTablesSgc1781191257245 implements MigrationInterface {
    name = "RenameTablesSgc1781191257245";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ? renombrar carpetas a folders y sus columnas
        await queryRunner.query(`RENAME TABLE carpetas TO folders`);

        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN nombre TO name`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN carpeta_padre_id TO parent_folder_id`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN ruta TO path`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN createdAt TO created_at`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN updatedAt TO updated_at`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN seccion TO section`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN id_departamento TO department_id`);

        await queryRunner.addColumn("folders", new TableColumn({
            name: "icon",
            type: "varchar",
            length: "50",
            isNullable: true
        }));

        // ? renombrar archivos a documents y sus columnas
        await queryRunner.query(`RENAME TABLE archivos TO documents`);

        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN nombre TO name`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN ruta TO path`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN tamano TO size`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN carpeta_id TO folder_id`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN createdAt TO created_at`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN updatedAt TO updated_at`);

        // ? renombrar departamentos a departments y sus columnas
        await queryRunner.query(`RENAME TABLE departamentos TO departments`);

        await queryRunner.query(`ALTER TABLE departments RENAME COLUMN nombre TO name`);
        await queryRunner.query(`ALTER TABLE departments RENAME COLUMN codigo_departamento TO code`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ? renombrar departments a departamentos y sus columnas
        await queryRunner.query(`ALTER TABLE departments RENAME COLUMN name TO nombre`);
        await queryRunner.query(`ALTER TABLE departments RENAME COLUMN code TO codigo_departamento`);
        await queryRunner.query(`RENAME TABLE departments TO departamentos`);

        // ? renombrar documents a archivos y sus columnas
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN name TO nombre`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN path TO ruta`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN size TO tamano`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN folder_id TO carpeta_id`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN created_at TO createdAt`);
        await queryRunner.query(`ALTER TABLE documents RENAME COLUMN updated_at TO updatedAt`);
        await queryRunner.query(`RENAME TABLE documents TO archivos`);

        // ? renombrar folders a carpetas y sus columnas
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN name TO nombre`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN parent_folder_id TO carpeta_padre_id`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN path TO ruta`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN created_at TO createdAt`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN updated_at TO updatedAt`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN section TO seccion`);
        await queryRunner.query(`ALTER TABLE folders RENAME COLUMN department_id TO id_departamento`);
        await queryRunner.query(`RENAME TABLE folders TO carpetas`);
        await queryRunner.dropColumn("folders", "icon");
    }
}
