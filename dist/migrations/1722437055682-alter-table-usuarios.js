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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterTableUsuarios1722437055682 = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
class AlterTableUsuarios1722437055682 {
    constructor() {
        this.name = 'AlterTableUsuarios1722437055682';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener todos los usuarios
                const users = yield queryRunner.query('SELECT IdUsuario, CedulaUsuario FROM usuario');
                for (const user of users) {
                    // Hashear el DNI
                    const hashedPassword = yield bcrypt_1.default.hash(user.CedulaUsuario.toString(), saltRounds);
                    // Actualizar la contraseña en la base de datos
                    yield queryRunner.query('UPDATE usuario SET ClaveUsuario = ? WHERE IdUsuario = ?', [hashedPassword, user.IdUsuario]);
                }
            }
            catch (error) {
                console.error('Error during migration up:', error);
                throw error;
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // No es posible revertir cambios de contraseñas cifradas
            // Si se requiere revertir en el futuro, se debería implementar una estrategia diferente
        });
    }
}
exports.AlterTableUsuarios1722437055682 = AlterTableUsuarios1722437055682;
