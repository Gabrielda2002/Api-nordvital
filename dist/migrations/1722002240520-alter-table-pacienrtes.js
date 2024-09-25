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
exports.fillPacienteIdInRadicacion1721999188716 = void 0;
class fillPacienteIdInRadicacion1721999188716 {
    constructor() {
        this.name = 'fillPacienteIdInRadicacion1721999188716';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ejecutar una consulta para actualizar la tabla 'radicacion' con el 'Paciente_id' correcto
            yield queryRunner.query(`
            UPDATE radicacion r
            SET Paciente_id = (
                SELECT p.IdUsuarios
                FROM pacientes p
                WHERE p.NombreCompleto = r.NombreCompleto
            )
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Revertir los cambios: puedes elegir dejar el campo como está o ponerlo en NULL
            yield queryRunner.query(`
            UPDATE radicacion
            SET Paciente_id = NULL
        `);
        });
    }
}
exports.fillPacienteIdInRadicacion1721999188716 = fillPacienteIdInRadicacion1721999188716;
