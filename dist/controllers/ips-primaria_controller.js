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
exports.getAllIpsPrimaria = getAllIpsPrimaria;
exports.getIpsPrimaria = getIpsPrimaria;
exports.createIpsPrimaria = createIpsPrimaria;
exports.updateIpsPrimaria = updateIpsPrimaria;
exports.deleteIpsPrimaria = deleteIpsPrimaria;
exports.getIpsPrimariaByName = getIpsPrimariaByName;
exports.updateStatusIpsPrimaria = updateStatusIpsPrimaria;
const ips_primaria_1 = require("../entities/ips-primaria");
const class_validator_1 = require("class-validator");
function getAllIpsPrimaria(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipsPrimaria = yield ips_primaria_1.IpsPrimaria.find();
            return res.json(ipsPrimaria);
        }
        catch (error) {
            next(error);
        }
    });
}
function getIpsPrimaria(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const ipsPrimaria = yield ips_primaria_1.IpsPrimaria.findOneBy({ id: parseInt(id) });
            if (!ipsPrimaria) {
                return res.status(404).json({ message: "Ips Primaria not found" });
            }
            return res.json(ipsPrimaria);
        }
        catch (error) {
            next(error);
        }
    });
}
function createIpsPrimaria(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const ipsPrimariaExist = yield ips_primaria_1.IpsPrimaria.findOneBy({ name });
            if (ipsPrimariaExist) {
                return res.status(400).json({ message: "Ips Primaria already exists" });
            }
            const ipsPrimaria = new ips_primaria_1.IpsPrimaria();
            ipsPrimaria.name = name;
            ipsPrimaria.status = true;
            const errors = yield (0, class_validator_1.validate)(ipsPrimaria);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json(errorsMessage);
            }
            yield ipsPrimaria.save();
            return res.json(ipsPrimaria);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateIpsPrimaria(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
            const ipsPrimaria = yield ips_primaria_1.IpsPrimaria.findOneBy({ id: parseInt(id) });
            if (!ipsPrimaria) {
                return res.status(404).json({ message: "Ips Primaria not found" });
            }
            ipsPrimaria.name = name;
            ipsPrimaria.status = status;
            const errors = yield (0, class_validator_1.validate)(ipsPrimaria);
            if (errors.length > 0) {
                const errorsMessage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ "message": "Error updating ips primaria ", errorsMessage });
            }
            yield ipsPrimaria.save();
            return res.json(ipsPrimaria);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteIpsPrimaria(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const ipsPrimaria = yield ips_primaria_1.IpsPrimaria.findOneBy({ id: parseInt(id) });
            if (!ipsPrimaria) {
                return res.status(404).json({ message: "Ips Primaria not found" });
            }
            yield ipsPrimaria.remove();
            return res.json({ message: "Ips Primaria deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getIpsPrimariaByName(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const ipsPrimaria = yield ips_primaria_1.IpsPrimaria.createQueryBuilder("ipsPrimaria")
                .where("ipsPrimaria.name LIKE :name", { name: `%${name}%` })
                .getMany();
            if (!ipsPrimaria) {
                return res.status(404).json({ message: "Ips Primaria not found" });
            }
            return res.json(ipsPrimaria);
        }
        catch (error) {
            next(error);
        }
    });
}
// actualizar el estado de la ips primaria
function updateStatusIpsPrimaria(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const ipsPrimaria = yield ips_primaria_1.IpsPrimaria.findOneBy({ id: parseInt(id) });
            if (!ipsPrimaria) {
                return res.status(404).json({ message: "Ips Primaria not found" });
            }
            ipsPrimaria.status = status == "1";
            const errors = yield (0, class_validator_1.validate)(ipsPrimaria);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: 'Error actualizando estado radicador', messages });
            }
            yield ipsPrimaria.save();
            return res.json(ipsPrimaria);
        }
        catch (error) {
            next(error);
        }
    });
}
