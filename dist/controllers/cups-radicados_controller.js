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
exports.getAllCupsRadicados = getAllCupsRadicados;
exports.getCupsRadicados = getCupsRadicados;
exports.createCupsRadicados = createCupsRadicados;
exports.updateCupsRadicados = updateCupsRadicados;
exports.deleteCupsRadicados = deleteCupsRadicados;
exports.autorizarCups = autorizarCups;
const cups_radicados_1 = require("../entities/cups-radicados");
const class_validator_1 = require("class-validator");
function getAllCupsRadicados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cupsRadicados = yield cups_radicados_1.CupsRadicados.find({
                relations: ["radicacionRelation", "functionalUnitRelation"],
            });
            return res.json(cupsRadicados);
        }
        catch (error) {
            next(error);
        }
    });
}
function getCupsRadicados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cupsRadicados = yield cups_radicados_1.CupsRadicados.findOne({
                where: { id: parseInt(id) },
                relations: ["radicacionRelation", "functionalUnitRelation"],
            });
            if (!cupsRadicados) {
                return res.status(404).json({ message: "Cups Radicados not found" });
            }
            return res.json(cupsRadicados);
        }
        catch (error) {
            next(error);
        }
    });
}
function createCupsRadicados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { code, DescriptionCode, idRadicado } = req.body;
            if (!code || !DescriptionCode) {
                return res.status(400).json({ message: "All fields are required" });
            }
            console.log(req.body);
            // * se crea array de codigos y descripciones CUPS
            const codigosArray = code ? code.split(",") : [];
            console.log(codigosArray);
            const descripcionesArray = DescriptionCode
                ? DescriptionCode.split(",")
                : [];
            console.log(descripcionesArray);
            const cupCreados = [];
            for (let i = 0; i < codigosArray.length; i++) {
                const cupsRadicados = new cups_radicados_1.CupsRadicados();
                cupsRadicados.code = parseInt(codigosArray[i], 10);
                cupsRadicados.DescriptionCode = descripcionesArray[i];
                cupsRadicados.status = 6;
                cupsRadicados.observation = "Pendiente";
                cupsRadicados.functionalUnit = 12;
                cupsRadicados.idRadicacion = parseInt(idRadicado);
                const errors = yield (0, class_validator_1.validate)(cupsRadicados);
                if (errors.length > 0) {
                    const errorMensage = errors.map((err) => ({
                        property: err.property,
                        constraints: err.constraints,
                    }));
                    return res
                        .status(400)
                        .json({ mensaje: "Error creating cup", errorMensage });
                }
                yield cupsRadicados.save();
                cupCreados.push(cupsRadicados);
            }
            return res.status(201).json();
        }
        catch (error) {
            next(error);
        }
    });
}
function updateCupsRadicados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { code, DescriptionCode, status, observation, functionalUnit, idRadicacion, } = req.body;
            if (!code ||
                !DescriptionCode ||
                !status ||
                !observation ||
                !functionalUnit ||
                !idRadicacion) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const cupsRadicados = yield cups_radicados_1.CupsRadicados.findOneBy({ id: parseInt(id) });
            if (!cupsRadicados) {
                return res.status(404).json({ message: "Cups Radicados not found" });
            }
            cupsRadicados.code = code;
            cupsRadicados.DescriptionCode = DescriptionCode;
            cupsRadicados.status = status;
            cupsRadicados.observation = observation;
            cupsRadicados.functionalUnit = functionalUnit;
            const errors = yield (0, class_validator_1.validate)(cupsRadicados);
            if (errors.length > 0) {
                const errorMensage = errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                return res
                    .status(400)
                    .json({ message: "Error updating cups", errorMensage });
            }
            yield cupsRadicados.save();
            return res.json(cupsRadicados);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteCupsRadicados(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cupsRadicados = yield cups_radicados_1.CupsRadicados.findOneBy({ id: parseInt(id) });
            if (!cupsRadicados) {
                return res.status(404).json({ message: "Cups Radicados not found" });
            }
            yield cupsRadicados.remove();
            return res.json({ message: "Cups Radicados deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
function autorizarCups(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { cupsDetails } = req.body;
            console.log(cupsDetails);
            const cupsRadicados = yield cups_radicados_1.CupsRadicados.createQueryBuilder("cupsRadicados")
                .where("cupsRadicados.idRadicado = :id", { id: id })
                .getMany();
            console.log("resultados busqueda" + cupsRadicados);
            if (!cupsRadicados) {
                return res.status(404).json({ message: "Cups Radicados not found" });
            }
            for (const cup of cupsRadicados) {
                const updateCup = cupsDetails.find((detail) => detail.idCupsRadicado === cup.id);
                if (updateCup) {
                    console.log(updateCup);
                    cup.status = parseInt(updateCup.estadoCups, 10);
                    cup.observation = updateCup.observacionCups;
                    cup.functionalUnit = parseInt(updateCup.unidadFuncional, 10);
                    yield cup.save();
                }
            }
            return res.json({ message: "Cups Radicados exitosamente!" });
        }
        catch (error) {
            next(error);
        }
    });
}
