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
exports.getAllGruposServicios = getAllGruposServicios;
const grupo_servicios_1 = require("../entities/grupo-servicios");
function getAllGruposServicios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const gruposServicios = yield grupo_servicios_1.GrupoServicios.find();
            return res.json(gruposServicios);
        }
        catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
