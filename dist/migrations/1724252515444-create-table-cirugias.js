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
exports.createTableCirugias1724252515444 = void 0;
const typeorm_1 = require("typeorm");
const saltRounds = 10;
class createTableCirugias1724252515444 {
    constructor() {
        this.name = "createTableCirugias1724252515444";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // * se crea la tabla cirugias con las columnas requeridas
            yield queryRunner.createTable(new typeorm_1.Table({
                name: 'cirugias',
                columns: [{
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    }, {
                        name: 'fecha_ordenamiento',
                        type: 'date',
                    }, {
                        name: 'fecha_paraclinicos',
                        type: 'date',
                    }, {
                        name: 'fecha_valoracion_anestencia',
                        type: 'date',
                    }, {
                        name: 'fecha_cirugia',
                        type: 'date',
                    }, {
                        name: 'hora_programada',
                        type: 'time',
                    }, {
                        name: 'ips_remitente',
                        type: 'int',
                    }, {
                        name: "observaciones",
                        type: "text",
                    }, {
                        name: "nombre_especialista",
                        type: "varchar",
                    }, {
                        name: "especialidad_id",
                        type: "int",
                    }, {
                        name: 'paciente_id',
                        type: 'int',
                    }, {
                        name: 'radicado_id',
                        type: 'int',
                    }, {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }, {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }
                ]
            }));
            // * se cambia a null la columna radicacion en la tabla seguimientoauxiliar
            yield queryRunner.query('ALTER TABLE \`seguimientoauxiliar\` MODIFY \`Radicacion\` int NULL');
            // * se crea la tabla gestion_auxiliar_cirugias con las columnas requeridas
            yield queryRunner.createTable(new typeorm_1.Table({
                name: 'gestion_auxiliar_cirugias',
                columns: [{
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    }, {
                        name: 'observacion',
                        type: 'text'
                    }, {
                        name: 'estado',
                        type: 'int'
                    }, {
                        name: 'cup_id',
                        type: 'int'
                    }, {
                        name: 'cirugia_id',
                        type: 'int'
                    }, {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }, {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }
                ]
            }));
            // * se renombra la columna IdUsuarios a id en la tabla pacientes
            yield queryRunner.renameColumn('pacientes', 'IdUsuarios', 'id');
            // * se crea la relacion entre las tablas cirugias y pacientes
            yield queryRunner.createForeignKey('cirugias', new typeorm_1.TableForeignKey({
                columnNames: ['paciente_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'pacientes',
                onDelete: 'CASCADE'
            }));
            // * se crea la relacion entre las tablas cirugias y radicacion
            yield queryRunner.createForeignKey('cirugias', new typeorm_1.TableForeignKey({
                columnNames: ['radicado_id'],
                referencedColumnNames: ['IdRadicacion'],
                referencedTableName: 'radicacion',
                onDelete: 'CASCADE'
            }));
            // * se crea la relacion entre las tablas gestion_auxiliar_cirugias y cirugias
            yield queryRunner.createForeignKey('gestion_auxiliar_cirugias', new typeorm_1.TableForeignKey({
                columnNames: ['cirugia_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'cirugias',
                onDelete: 'CASCADE'
            }));
            // * se crea la relacion entre las tablas cirugias y especialidad
            yield queryRunner.createForeignKey('cirugias', new typeorm_1.TableForeignKey({
                columnNames: ['especialidad_id'],
                referencedColumnNames: ['IdEspecialidad'],
                referencedTableName: 'especialidad',
                onDelete: 'CASCADE'
            }));
            // * se crea la columna cirugias_id en la tabla cupspaciente
            yield queryRunner.addColumn('cupspaciente', new typeorm_1.TableColumn({
                name: 'cirugia_id',
                type: 'int',
                isNullable: true
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // * se elimina la llave foranea de pacientes en la tabla cirugias
            const pacienteColumnExists = yield queryRunner.hasColumn("cirugias", 'paciente_id');
            if (pacienteColumnExists) {
                const table = yield queryRunner.getTable("cirugias");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("paciente_id") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("cirugias", foreignKey);
                }
                yield queryRunner.dropColumn("cirugias", "paciente_id");
            }
            // * se elimina la llave foranea de radicacion en la tabla cirugias
            const radicadoColumnExists = yield queryRunner.hasColumn("cirugias", 'radicado_id');
            if (radicadoColumnExists) {
                const table = yield queryRunner.getTable("cirugias");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("radicado_id") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("cirugias", foreignKey);
                }
                yield queryRunner.dropColumn("cirugias", "radicado_id");
            }
            // * se elimina la llave foranea de especialidad en la tabla cirugias
            const especialidadColumnExists = yield queryRunner.hasColumn("cirugias", 'especialidad_id');
            if (especialidadColumnExists) {
                const table = yield queryRunner.getTable("cirugias");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("especialidad_id") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("cirugias", foreignKey);
                }
                yield queryRunner.dropColumn("cirugias", "especialidad_id");
            }
            // * se elimina la llave foranea de cirugias en la tabla seguimientoauxiliar
            const cirugiaColumnExists = yield queryRunner.hasColumn("gestion_auxiliar_cirugias", 'cirugia_id');
            if (cirugiaColumnExists) {
                const table = yield queryRunner.getTable("gestion_auxiliar_cirugias");
                const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf("cirugia_id") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("gestion_auxiliar_cirugias", foreignKey);
                }
                yield queryRunner.dropColumn("gestion_auxiliar_cirugias", "cirugia_id");
            }
            // * se elimina la tabla gestion_auxiliar_cirugias
            yield queryRunner.dropTable('gestion_auxiliar_cirugias');
            // * se renombra la columna id a IdUsuarios en la tabla pacientes
            yield queryRunner.renameColumn('pacientes', 'id', 'IdUsuarios');
            // * se elimina la columna cirugias en la tabla seguimientoauxiliar
            yield queryRunner.query('ALTER TABLE \`seguimientoauxiliar\` MODIFY \`Radicacion\` int NOT NULL');
            // * se elimina la tabla cirugias
            yield queryRunner.dropTable('cirugias');
        });
    }
}
exports.createTableCirugias1724252515444 = createTableCirugias1724252515444;
