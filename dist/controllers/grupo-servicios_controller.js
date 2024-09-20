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
exports.getGrupoServicios = getGrupoServicios;
exports.createGrupoServicios = createGrupoServicios;
exports.updateGrupoServicios = updateGrupoServicios;
exports.deleteGrupoServicios = deleteGrupoServicios;
exports.getGrupoServiciosByName = getGrupoServiciosByName;
const grupo_servicios_1 = require("../entities/grupo-servicios");
const class_validator_1 = require("class-validator");
function getAllGruposServicios(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const gruposServicios = yield grupo_servicios_1.GrupoServicios.find();
            return res.json(gruposServicios);
        }
        catch (error) {
            next(error);
        }
    });
}
function getGrupoServicios(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const grupoServicios = yield grupo_servicios_1.GrupoServicios.findOneBy({ id: parseInt(id) });
            if (!grupoServicios) {
                return res.status(404).json({ message: "Grupo de servicios no encontrado" });
            }
            return res.json(grupoServicios);
        }
        catch (error) {
            next(error);
        }
    });
}
function createGrupoServicios(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const grupoServiciosExist = yield grupo_servicios_1.GrupoServicios.findOneBy({ name });
            if (grupoServiciosExist) {
                return res.status(400).json({ message: "Grupo de servicios ya existe" });
            }
            const grupoServicios = new grupo_servicios_1.GrupoServicios();
            grupoServicios.name = name;
            grupoServicios.status = true;
            const errors = yield (0, class_validator_1.validate)(grupoServicios);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating grupo de servicios", errors: errorsMessage });
            }
            yield grupoServicios.save();
            return res.status(201).json(grupoServicios);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateGrupoServicios(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
            const grupoServicios = yield grupo_servicios_1.GrupoServicios.findOneBy({ id: parseInt(id) });
            if (!grupoServicios) {
                return res.status(404).json({ message: "Grupo de servicios no encontrado" });
            }
            grupoServicios.name = name;
            grupoServicios.status = status;
            const errors = yield (0, class_validator_1.validate)(grupoServicios);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating grupo de servicios", errors: errorsMessage });
            }
            yield grupoServicios.save();
            return res.json(grupoServicios);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteGrupoServicios(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const grupoServicios = yield grupo_servicios_1.GrupoServicios.findOneBy({ id: parseInt(id) });
            if (!grupoServicios) {
                return res.status(404).json({ message: "Grupo de servicios no encontrado" });
            }
            yield grupoServicios.remove();
            return res.json({ message: "Grupo de servicios eliminado" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getGrupoServiciosByName(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const grupoServicios = yield grupo_servicios_1.GrupoServicios.createQueryBuilder("grupo_servicios")
                .where("grupo_servicios.name LIKE :name", { name: `%${name}%` })
                .getMany();
            if (!grupoServicios) {
                return res.status(404).json({ message: "Grupo de servicios no encontrado" });
            }
            return res.json(grupoServicios);
        }
        catch (error) {
            next(error);
        }
    });
}
