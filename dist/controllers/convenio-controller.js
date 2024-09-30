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
exports.getAllConvenio = getAllConvenio;
exports.getConvenioById = getConvenioById;
exports.createConvenio = createConvenio;
exports.updateConvenio = updateConvenio;
exports.deleteConvenio = deleteConvenio;
exports.updateStatusConvenio = updateStatusConvenio;
const convenio_1 = require("../entities/convenio");
const class_validator_1 = require("class-validator");
function getAllConvenio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const convenio = yield convenio_1.Convenio.find();
            return res.json(convenio);
        }
        catch (error) {
            next(error);
        }
    });
}
/**
 * Retrieves a convenio by its ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The JSON representation of the convenio.
 */
function getConvenioById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const convenio = yield convenio_1.Convenio.findOneBy({ id: parseInt(id) });
            if (!convenio) {
                return res.status(404).json({ message: "Convenio not found" });
            }
            return res.json(convenio);
        }
        catch (error) {
            next(error);
        }
    });
}
/**
 * Creates a new convenio.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The created convenio object or an error message.
 */
function createConvenio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const convenioExist = yield convenio_1.Convenio.findOneBy({ name });
            if (convenioExist) {
                return res.status(400).json({ message: "Convenio already exists" });
            }
            const convenio = new convenio_1.Convenio();
            convenio.name = name;
            convenio.status = true;
            const errors = yield (0, class_validator_1.validate)(convenio);
            if (errors.length > 0) {
                const errorMensage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ mesage: "error creating convenio", errors: errorMensage });
            }
            yield convenio.save();
            return res.status(201).json(convenio);
        }
        catch (error) {
            next(error);
        }
    });
}
/**
 * Updates a convenio (agreement) based on the provided ID.
 * @param req - The request object containing the ID parameter and the new name in the request body.
 * @param res - The response object used to send the updated convenio or error messages.
 * @returns The updated convenio if successful, or an error message if there was an error.
 */
function updateConvenio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const convenio = yield convenio_1.Convenio.findOneBy({ id: parseInt(id) });
            if (!convenio) {
                return res.status(404).json({ message: "Convenio not found" });
            }
            convenio.name = name;
            const errors = yield (0, class_validator_1.validate)(convenio);
            if (errors.length > 0) {
                const errorMensage = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ mesage: "error updating convenio", errors: errorMensage });
            }
            yield convenio.save();
            return res.json(convenio);
        }
        catch (error) {
            next(error);
        }
    });
}
/**
 * Deletes a convenio (agreement) by its ID.
 *
 * @param req - The request object containing the ID of the convenio to be deleted.
 * @param res - The response object used to send the result of the operation.
 * @returns A JSON response indicating the result of the operation.
 */
function deleteConvenio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const convenio = yield convenio_1.Convenio.findOneBy({ id: parseInt(id) });
            if (!convenio) {
                return res.status(404).json({ message: "Convenio not found" });
            }
            yield convenio.remove();
            return res.json({ message: "Convenio deleted" });
        }
        catch (error) {
            next(error);
        }
    });
}
// actualizar el estado de los convenios
function updateStatusConvenio(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const convenio = yield convenio_1.Convenio.findOneBy({ id: parseInt(id) });
            if (!convenio) {
                return res.status(404).json({ message: "Convenio not found" });
            }
            convenio.status = status == "1";
            const errors = yield (0, class_validator_1.validate)(convenio);
            if (errors.length > 0) {
                const messages = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return res.status(400).json({ message: "Error updating status convenio", messages });
            }
            yield convenio.save();
            return res.json(convenio);
        }
        catch (error) {
            next(error);
        }
    });
}
