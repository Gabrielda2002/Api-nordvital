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
exports.getAllAuxiliarySurgeries = getAllAuxiliarySurgeries;
exports.getAuxiliarySurgery = getAuxiliarySurgery;
exports.createAuxiliarySurgery = createAuxiliarySurgery;
exports.updateAuxiliarySurgery = updateAuxiliarySurgery;
exports.deleteAuxiliarySurgery = deleteAuxiliarySurgery;
const seguimiento_auxiliar_cirugias_1 = require("../entities/seguimiento-auxiliar-cirugias");
const class_validator_1 = require("class-validator");
function getAllAuxiliarySurgeries(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auxiliarySurgeries = yield seguimiento_auxiliar_cirugias_1.SeguimientoAuxiliarCirugias.find();
            res.json(auxiliarySurgeries);
        }
        catch (error) {
            next(error);
        }
    });
}
function getAuxiliarySurgery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const auxiliarySurgery = yield seguimiento_auxiliar_cirugias_1.SeguimientoAuxiliarCirugias.findOne({ where: { id: parseInt(id) } });
            if (!auxiliarySurgery) {
                return res.status(404).json({ message: "Auxiliary surgery not found" });
            }
            res.json(auxiliarySurgery);
        }
        catch (error) {
            next(error);
        }
    });
}
function createAuxiliarySurgery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { obersevation, status, cupsId, surgeryId } = req.body;
            const auxiliarySurgery = new seguimiento_auxiliar_cirugias_1.SeguimientoAuxiliarCirugias();
            auxiliarySurgery.observation = obersevation;
            auxiliarySurgery.status = status;
            auxiliarySurgery.cupsId = cupsId;
            auxiliarySurgery.surgeryId = surgeryId;
            const errors = yield (0, class_validator_1.validate)(auxiliarySurgery);
            if (errors.length > 0) {
                const message = errors.map(err => ({
                    property: err.property,
                    constrainst: err.constraints
                }));
                return res.status(400).json({ message: "Error creating auxiliary surgery", errors: message });
            }
            yield auxiliarySurgery.save();
            res.json({ auxiliarySurgery });
        }
        catch (error) {
            next(error);
        }
    });
}
function updateAuxiliarySurgery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { obersevation, status, cupsId, surgeryId } = req.body;
            const auxiliarySurgery = yield seguimiento_auxiliar_cirugias_1.SeguimientoAuxiliarCirugias.findOne({ where: { id: parseInt(id) } });
            if (!auxiliarySurgery) {
                return res.status(404).json({ message: "Auxiliary surgery not found" });
            }
            auxiliarySurgery.observation = obersevation;
            auxiliarySurgery.status = status;
            auxiliarySurgery.cupsId = cupsId;
            auxiliarySurgery.surgeryId = surgeryId;
            const errors = yield (0, class_validator_1.validate)(auxiliarySurgery);
            if (errors.length > 0) {
                const message = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating auxiliary surgery", errors: message });
            }
            yield auxiliarySurgery.save();
            return res.json(auxiliarySurgery);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteAuxiliarySurgery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const auxiliarySurgery = yield seguimiento_auxiliar_cirugias_1.SeguimientoAuxiliarCirugias.findOne({ where: { id: parseInt(id) } });
            if (!auxiliarySurgery) {
                return res.status(404).json({ message: "Auxiliary surgery not found" });
            }
            yield auxiliarySurgery.remove();
            res.json({ message: 'Auxiliary surgery deleted' });
        }
        catch (error) {
            next(error);
        }
    });
}
