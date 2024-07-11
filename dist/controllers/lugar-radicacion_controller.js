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
exports.getAllLugaresRadicacion = getAllLugaresRadicacion;
const lugar_radicacion_1 = require("../entities/lugar-radicacion");
function getAllLugaresRadicacion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lugaresRadicacion = yield lugar_radicacion_1.LugarRadicacion.find();
            return res.json(lugaresRadicacion);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
        }
    });
}
