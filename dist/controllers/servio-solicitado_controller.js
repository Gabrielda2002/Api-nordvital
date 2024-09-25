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
exports.getAllServiciosSolicitados = getAllServiciosSolicitados;
exports.getServicioSolicitado = getServicioSolicitado;
exports.createServicioSolicitado = createServicioSolicitado;
exports.updateServicioSolicitado = updateServicioSolicitado;
exports.deleteServicioSolicitado = deleteServicioSolicitado;
exports.getServiciosSolicitadosByCode = getServiciosSolicitadosByCode;
const servicios_solicitados_1 = require("../entities/servicios-solicitados");
const class_validator_1 = require("class-validator");
function getAllServiciosSolicitados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const serviciosSolicitados = yield servicios_solicitados_1.ServiciosSolicitados.find();
            return res.json(serviciosSolicitados);
        }
        catch (error) {
            next(error);
        }
    });
}
function getServicioSolicitado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const servicioSolicitado = yield servicios_solicitados_1.ServiciosSolicitados.findOneBy({ id: parseInt(id) });
            if (!servicioSolicitado) {
                return res.status(404).json({ message: "Servicio solicitado no encontrado" });
            }
            return res.json(servicioSolicitado);
        }
        catch (error) {
            next(error);
        }
    });
}
function createServicioSolicitado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { code, name } = req.body;
            if (!code || !name) {
                return res.status(400).json({ message: "Código y nombre son requeridos" });
            }
            const codeExists = yield servicios_solicitados_1.ServiciosSolicitados.findOneBy({ code });
            if (codeExists) {
                return res.status(400).json({ message: "El código ya existe" });
            }
            const servicioSolicitado = new servicios_solicitados_1.ServiciosSolicitados();
            servicioSolicitado.code = code;
            servicioSolicitado.name = name;
            servicioSolicitado.status = true;
            const errors = yield (0, class_validator_1.validate)(servicioSolicitado);
            if (errors.length > 0) {
                const message = errors.map(err => ({
                    constraint: err.constraints,
                    property: err.property
                }));
                return res.status(400).json({ "messages": "Ocurrio un error: ", message });
            }
            yield servicioSolicitado.save();
            return res.json(servicioSolicitado);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateServicioSolicitado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { code, name, status } = req.body;
            const servicioSolicitado = yield servicios_solicitados_1.ServiciosSolicitados.findOneBy({ id: parseInt(id) });
            if (!servicioSolicitado) {
                return res.status(404).json({ message: "Servicio solicitado no encontrado" });
            }
            servicioSolicitado.code = code;
            servicioSolicitado.name = name;
            servicioSolicitado.status = status;
            const errors = yield (0, class_validator_1.validate)(servicioSolicitado);
            if (errors.length > 0) {
                const message = errors.map(err => ({
                    constraint: err.constraints,
                    property: err.property
                }));
                return res.status(400).json({ "messages": "Ocurrio un error: ", message });
            }
            yield servicioSolicitado.save();
            return res.json(servicioSolicitado);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteServicioSolicitado(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const servicioSolicitado = yield servicios_solicitados_1.ServiciosSolicitados.findOneBy({ id: parseInt(id) });
            if (!servicioSolicitado) {
                return res.status(404).json({ message: "Servicio solicitado no encontrado" });
            }
            yield servicioSolicitado.remove();
            return res.json({ message: "Servicio solicitado eliminado" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getServiciosSolicitadosByCode(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { code } = req.body;
            const servicioSolicitado = yield servicios_solicitados_1.ServiciosSolicitados.createQueryBuilder("servicios_solicitados")
                .where("servicios_solicitados.code = :code", { code })
                .getOne();
            if (!servicioSolicitado) {
                return res.status(404).json({ message: "Servicio solicitado no encontrado" });
            }
            return res.json(servicioSolicitado);
        }
        catch (error) {
            next(error);
        }
    });
}
