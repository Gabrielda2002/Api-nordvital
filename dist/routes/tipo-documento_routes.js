"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipo_documento_controller_1 = require("../controllers/tipo-documento_controller");
const router = (0, express_1.Router)();
router.get('/documento', tipo_documento_controller_1.getAllDocumentType);
exports.default = router;
