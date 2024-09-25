"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTablesSscDos1723758957184 = void 0;
const typeorm_1 = require("typeorm");
class CreateTablesSscDos1723758957184 {
    constructor() {
        this.name = 'CreateTablesSscDos1723758957184';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
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
                    }, {
                        name: 'ruta',
                        type: 'varchar'
                    }, {
                        name: 'tipo',
                        type: 'varchar'
                    }, {
                        name: 'tamano',
                        type: 'int'
                    }, {
                        name: 'carpeta_id',
                        type: 'int',
                        isNullable: true
                    }, {
                        name: 'mimeType',
                        type: 'varchar'
                    }, {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }, {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }]
            }));
            yield queryRunner.createTable(new typeorm_1.Table({
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
                    }, {
                        name: 'user_id',
                        type: 'int'
                    }, {
                        name: 'carpeta_padre_id',
                        type: 'int',
                        isNullable: true
                    }, {
                        name: 'ruta',
                        type: 'varchar'
                    }, {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }, {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }]
            }));
            yield queryRunner.createForeignKey('archivos', new typeorm_1.TableForeignKey({
                columnNames: ['carpeta_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'carpetas',
                onDelete: 'CASCADE'
            }));
            yield queryRunner.createForeignKey('carpetas', new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['IdUsuario'],
                referencedTableName: 'usuario',
                onDelete: 'CASCADE'
            }));
            yield queryRunner.createForeignKey('carpetas', new typeorm_1.TableForeignKey({
                columnNames: ['carpeta_padre_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'carpetas',
                onDelete: 'SET NULL'
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableArchivos = yield queryRunner.getTable('archivos');
            const foreignKeyArchivo = tableArchivos === null || tableArchivos === void 0 ? void 0 : tableArchivos.foreignKeys.find(fk => fk.columnNames.indexOf('carpeta_id') !== -1);
            if (foreignKeyArchivo) {
                yield queryRunner.dropForeignKey('archivos', foreignKeyArchivo);
            }
            yield queryRunner.dropTable('archivos');
            const tableCarpetas = yield queryRunner.getTable('carpetas');
            const foreignKeyUser = tableCarpetas === null || tableCarpetas === void 0 ? void 0 : tableCarpetas.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
            const foreignKeyCarpetaPadre = tableCarpetas === null || tableCarpetas === void 0 ? void 0 : tableCarpetas.foreignKeys.find(fk => fk.columnNames.indexOf('carpeta_padre_id') !== -1);
            if (foreignKeyUser) {
                yield queryRunner.dropForeignKey('carpetas', foreignKeyUser);
            }
            if (foreignKeyCarpetaPadre) {
                yield queryRunner.dropForeignKey('carpetas', foreignKeyCarpetaPadre);
            }
            yield queryRunner.dropTable('carpetas');
        });
    }
}
exports.CreateTablesSscDos1723758957184 = CreateTablesSscDos1723758957184;
