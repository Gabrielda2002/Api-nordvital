"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarId = validarId;
function validarId(req, res, next) {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        return res.status(400).json({ message: "Id must be a number" });
    }
    req.params.id = parsedId.toString();
    next();
}
