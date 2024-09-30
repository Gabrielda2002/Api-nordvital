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
exports.getAllMunicipios = getAllMunicipios;
exports.getMunicipioById = getMunicipioById;
exports.createMunicipio = createMunicipio;
exports.updateMunicipio = updateMunicipio;
exports.deleteMunicipio = deleteMunicipio;
exports.updateStatusMunicipio = updateStatusMunicipio;
const municipio_1 = require("../entities/municipio");
const class_validator_1 = require("class-validator");
function getAllMunicipios(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const municipios = yield municipio_1.Municipio.find();
            return res.json(municipios);
        }
        catch (error) {
            next(error);
        }
    });
}
function getMunicipioById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const municipio = yield municipio_1.Municipio.findOneBy({ id: parseInt(id) });
            if (!municipio) {
                return res.status(404).json({ message: "Municipio not found" });
            }
            return res.json(municipio);
        }
        catch (error) {
            next(error);
        }
    });
}
function createMunicipio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, nitMunicipio } = req.body;
            if (!name || !nitMunicipio) {
                return res.status(400).json({ message: "Name and nitMunicipio are required" });
            }
            const municipioExist = yield municipio_1.Municipio.findOneBy({ name });
            if (municipioExist) {
                return res.status(400).json({ message: "Municipio already exists" });
            }
            const municipio = new municipio_1.Municipio();
            municipio.name = name;
            municipio.nitMunicipio = nitMunicipio;
            municipio.status = true;
            const errors = yield (0, class_validator_1.validate)(municipio);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating municipio", messages });
            }
            yield municipio.save();
            return res.json(municipio);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateMunicipio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, nitMunicipio, status } = req.body;
            const municipio = yield municipio_1.Municipio.findOneBy({ id: parseInt(id) });
            if (!municipio) {
                return res.status(404).json({ message: "Municipio not found" });
            }
            municipio.name = name;
            municipio.nitMunicipio = nitMunicipio;
            municipio.status = status;
            const errors = yield (0, class_validator_1.validate)(municipio);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating municipio", messages });
            }
            yield municipio.save();
            return res.json(municipio);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteMunicipio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const municipio = yield municipio_1.Municipio.findOneBy({ id: parseInt(id) });
            if (!municipio) {
                return res.status(404).json({ message: "Municipio not found" });
            }
            yield municipio.remove();
            return res.json({ message: "Municipio deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
function updateStatusMunicipio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const municipio = yield municipio_1.Municipio.findOneBy({ id: parseInt(id) });
            if (!municipio) {
                return res.status(404).json({ message: "Municipio not found" });
            }
            municipio.status = status == "1";
            const errors = yield (0, class_validator_1.validate)(municipio);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating status municipio", messages });
            }
            yield municipio.save();
            return res.json(municipio);
        }
        catch (error) {
            next(error);
        }
    });
}
