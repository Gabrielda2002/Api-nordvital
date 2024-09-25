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
exports.getAllSurgery = getAllSurgery;
exports.getSurgery = getSurgery;
exports.createSurgery = createSurgery;
exports.updateSurgery = updateSurgery;
exports.deleteSurgery = deleteSurgery;
exports.getSurgeryTable = getSurgeryTable;
const cirugias_1 = require("../entities/cirugias");
const class_validator_1 = require("class-validator");
function getAllSurgery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const surgery = yield cirugias_1.Cirugias.find();
            res.json(surgery);
        }
        catch (error) {
            next(error);
        }
    });
}
function getSurgery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const surgery = yield cirugias_1.Cirugias.findOne({ where: { id: parseInt(id) } });
            if (!surgery) {
                return res.status(404).json({ message: "Surgery not found" });
            }
            res.json(surgery);
        }
        catch (error) {
            next(error);
        }
    });
}
function createSurgery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { orderingDate, paraclinicalDate, anesthesiaAssessmentDate, surgeryDate, scheduledTime, ipsRemite, observation, specialistName, specialityId, status, radicadoId } = req.body;
            const surgery = new cirugias_1.Cirugias();
            surgery.orderingDate = orderingDate;
            surgery.paraclinicalDate = paraclinicalDate;
            surgery.anesthesiaAssessmentDate = anesthesiaAssessmentDate;
            surgery.surgeryDate = surgeryDate;
            surgery.scheduledTime = scheduledTime;
            surgery.ipsRemite = ipsRemite;
            surgery.observation = observation;
            surgery.specialistName = specialistName;
            surgery.specialityId = specialityId;
            surgery.status = status;
            surgery.radicadoId = radicadoId;
            const errors = yield (0, class_validator_1.validate)(surgery);
            if (errors.length > 0) {
                const message = errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error creating surgery", errors: message });
            }
            yield surgery.save();
            return res.status(201).json(surgery);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateSurgery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { orderingDate, paraclinicalDate, anesthesiaAssessmentDate, surgeryDate, scheduledTime, ipsRemite, observation, specialistName, specialityId, status, radicadoId } = req.body;
            const surgery = yield cirugias_1.Cirugias.findOne({ where: { id: parseInt(id) } });
            if (!surgery) {
                return res.status(404).json({ message: "Surgery not found" });
            }
            surgery.orderingDate = orderingDate;
            surgery.paraclinicalDate = paraclinicalDate;
            surgery.anesthesiaAssessmentDate = anesthesiaAssessmentDate;
            surgery.surgeryDate = surgeryDate;
            surgery.scheduledTime = scheduledTime;
            surgery.ipsRemite = ipsRemite;
            surgery.observation = observation;
            surgery.specialistName = specialistName;
            surgery.specialityId = specialityId;
            surgery.status = status;
            surgery.radicadoId = radicadoId;
            const errors = yield (0, class_validator_1.validate)(surgery);
            if (errors.length > 0) {
                const message = errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating surgery", errors: message });
            }
            yield surgery.save();
            return res.json(surgery);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteSurgery(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const surgery = yield cirugias_1.Cirugias.findOne({ where: { id: parseInt(id) } });
            if (!surgery) {
                return res.status(404).json({ message: "Surgery not found" });
            }
            yield surgery.remove();
            return res.json({ message: "Surgery deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
function getSurgeryTable(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const surgery = yield cirugias_1.Cirugias.createQueryBuilder("cirugias")
                .leftJoinAndSelect("cirugias.speciality", "speciality")
                .leftJoinAndSelect("cirugias.ipsRemiteRelation", "ips")
                .leftJoinAndSelect("cirugias.radicacionRelation", "radicado")
                .leftJoinAndSelect("radicado.patientRelation", "pacientes")
                .leftJoinAndSelect("cirugias.statusRelation", "status")
                .getMany();
            res.json(surgery);
        }
        catch (error) {
            next(error);
        }
    });
}
