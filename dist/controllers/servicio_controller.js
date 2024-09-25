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
exports.getAllServicios = getAllServicios;
exports.getServicioById = getServicioById;
exports.createServicio = createServicio;
exports.updateServicio = updateServicio;
exports.deleteServicio = deleteServicio;
exports.getServiciosByName = getServiciosByName;
const servicios_1 = require("../entities/servicios");
const class_validator_1 = require("class-validator");
function getAllServicios(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const servicios = yield servicios_1.Servicios.find();
            return res.json(servicios);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    });
}
function getServicioById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const servicio = yield servicios_1.Servicios.findOneBy({ id: parseInt(id) });
            if (!servicio) {
                return res.status(404).json({ message: "Servicio no encontrado" });
            }
            return res.json(servicio);
        }
        catch (error) {
            next(error);
        }
    });
}
function createServicio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "El nombre y el estado del servicio son requeridos" });
            }
            const servicio = new servicios_1.Servicios();
            servicio.name = name;
            servicio.status = true;
            const errors = yield (0, class_validator_1.validate)(servicio);
            if (errors.length > 0) {
                const message = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ "messages": "ocurrio un error", message });
            }
            yield servicio.save();
            return res.status(201).json(servicio);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateServicio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
            const servicio = yield servicios_1.Servicios.findOneBy({ id: parseInt(id) });
            if (!servicio) {
                return res.status(404).json({ message: "Servicio no encontrado" });
            }
            servicio.name = name;
            servicio.status = status;
            const errors = yield (0, class_validator_1.validate)(servicio);
            if (errors.length > 0) {
                const message = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ "messages": "ocurrio un error", message });
            }
            yield servicio.save();
            return res.json(servicio);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteServicio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const servicio = yield servicios_1.Servicios.findOneBy({ id: parseInt(id) });
            if (!servicio) {
                return res.status(404).json({ message: "Servicio no encontrado" });
            }
            yield servicio.remove();
            return res.json({ message: "Servicio eliminado" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getServiciosByName(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "El nombre del servicio es requerido" });
            }
            const servicios = yield servicios_1.Servicios.createQueryBuilder("servicios")
                .where("servicios.name LIKE :name", { name: `%${name}%` })
                .getMany();
            return res.json(servicios);
        }
        catch (error) {
            next(error);
        }
    });
}
