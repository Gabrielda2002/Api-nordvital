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
exports.getAllIpsRemite = getAllIpsRemite;
exports.getIpsRemite = getIpsRemite;
exports.createIpsRemite = createIpsRemite;
exports.updateIpsRemite = updateIpsRemite;
exports.deleteIpsRemite = deleteIpsRemite;
exports.getIpsRemiteByName = getIpsRemiteByName;
exports.updateStatusIpsRemite = updateStatusIpsRemite;
const ips_remite_1 = require("../entities/ips-remite");
const class_validator_1 = require("class-validator");
function getAllIpsRemite(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipsRemite = yield ips_remite_1.IpsRemite.find();
            return res.json(ipsRemite);
        }
        catch (error) {
            next(error);
        }
    });
}
function getIpsRemite(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const ipsRemite = yield ips_remite_1.IpsRemite.findOneBy({ id: parseInt(id) });
            if (!ipsRemite) {
                return res.status(404).json({ message: "Ips Remite not found" });
            }
            return res.json(ipsRemite);
        }
        catch (error) {
            next(error);
        }
    });
}
function createIpsRemite(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const ipsRemiteExist = yield ips_remite_1.IpsRemite.findOneBy({ name });
            if (ipsRemiteExist) {
                return res.status(400).json({ message: "Ips Remite already exists" });
            }
            const ipsRemite = new ips_remite_1.IpsRemite();
            ipsRemite.name = name;
            ipsRemite.status = true;
            const erros = yield (0, class_validator_1.validate)(ipsRemite);
            if (erros.length > 0) {
                const messages = erros.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating ips Remite ", messages });
            }
            yield ipsRemite.save();
            return res.json(ipsRemite);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateIpsRemite(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, status } = req.body;
            const ipsRemite = yield ips_remite_1.IpsRemite.findOneBy({ id: parseInt(id) });
            if (!ipsRemite) {
                return res.status(404).json({ message: "Ips Remite not found" });
            }
            ipsRemite.name = name;
            ipsRemite.status = status;
            const errors = yield (0, class_validator_1.validate)(ipsRemite);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating ips Remite", messages });
            }
            yield ipsRemite.save();
            return res.json(ipsRemite);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteIpsRemite(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const ipsRemite = yield ips_remite_1.IpsRemite.findOneBy({ id: parseInt(id) });
            if (!ipsRemite) {
                return res.status(404).json({ message: "Ips Remite not found" });
            }
            yield ipsRemite.remove();
            return res.json({ message: "Ips Remite deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getIpsRemiteByName(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const ipsRemite = yield ips_remite_1.IpsRemite.createQueryBuilder("ipsRemite")
                .where("ipsRemite.name LIKE :name", { name: `%${name}%` })
                .getMany();
            if (ipsRemite.length === 0) {
                return res.status(404).json({ message: "Ips Remite not found" });
            }
            return res.json(ipsRemite);
        }
        catch (error) {
            next(error);
        }
    });
}
// actualizar el estado de la ips remite
function updateStatusIpsRemite(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const ipsRemite = yield ips_remite_1.IpsRemite.findOneBy({ id: parseInt(id) });
            if (!ipsRemite) {
                return res.status(404).json({ message: "Ips Remite not found" });
            }
            ipsRemite.status = status == '1';
            const errors = yield (0, class_validator_1.validate)(ipsRemite);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating ips Remite", messages });
            }
            yield ipsRemite.save();
            return res.json(ipsRemite);
        }
        catch (error) {
            next(error);
        }
    });
}
