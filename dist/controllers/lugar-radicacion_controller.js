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
exports.getLugarRadicacion = getLugarRadicacion;
exports.createLugarRadicacion = createLugarRadicacion;
exports.updateLugarRadicacion = updateLugarRadicacion;
exports.deleteLugarRadicacion = deleteLugarRadicacion;
exports.getLugaresRadicacionByName = getLugaresRadicacionByName;
const lugar_radicacion_1 = require("../entities/lugar-radicacion");
const class_validator_1 = require("class-validator");
function getAllLugaresRadicacion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lugaresRadicacion = yield lugar_radicacion_1.LugarRadicacion.find();
            return res.json(lugaresRadicacion);
        }
        catch (error) {
            next(error);
        }
    });
}
function getLugarRadicacion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const lugarRadicacion = yield lugar_radicacion_1.LugarRadicacion.findOneBy({ id: parseInt(id) });
            if (!lugarRadicacion) {
                return res.status(404).json({ message: "LugarRadicacion not found" });
            }
            return res.json(lugarRadicacion);
        }
        catch (error) {
            next(error);
        }
    });
}
function createLugarRadicacion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const lugarRadicacionExist = yield lugar_radicacion_1.LugarRadicacion.findOneBy({ name });
            if (lugarRadicacionExist) {
                return res.status(400).json({ message: "LugarRadicacion already exists" });
            }
            const lugarRadicacion = new lugar_radicacion_1.LugarRadicacion();
            lugarRadicacion.name = name;
            lugarRadicacion.status = true;
            const errors = yield (0, class_validator_1.validate)(lugarRadicacion);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating lugar radicador", messages });
            }
            yield lugarRadicacion.save();
            return res.json(lugarRadicacion);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateLugarRadicacion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
            const lugarRadicacion = yield lugar_radicacion_1.LugarRadicacion.findOneBy({ id: parseInt(id) });
            if (!lugarRadicacion) {
                return res.status(404).json({ message: "LugarRadicacion not found" });
            }
            lugarRadicacion.name = name;
            lugarRadicacion.status = status;
            const errors = yield (0, class_validator_1.validate)(lugarRadicacion);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating lugar radicador", messages });
            }
            yield lugarRadicacion.save();
            return res.json(lugarRadicacion);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteLugarRadicacion(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const lugarRadicacion = yield lugar_radicacion_1.LugarRadicacion.findOneBy({ id: parseInt(id) });
            if (!lugarRadicacion) {
                return res.status(404).json({ message: "LugarRadicacion not found" });
            }
            yield lugarRadicacion.remove();
            return res.json({ message: "LugarRadicacion deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getLugaresRadicacionByName(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const lugaresRadicacion = yield lugar_radicacion_1.LugarRadicacion.createQueryBuilder("lugar_radicacion")
                .where("lugar_radicacion.name LIKE :name", { name: `%${name}%` })
                .getMany();
            if (!lugaresRadicacion) {
                return res.status(404).json({ message: "LugarRadicacion not found" });
            }
            return res.json(lugaresRadicacion);
        }
        catch (error) {
            next(error);
        }
    });
}
