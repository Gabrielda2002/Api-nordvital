"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const convenio_controller_1 = require("../controllers/convenio-controller");
const router = (0, express_1.Router)();
router.get('/convenio', convenio_controller_1.getAllConvenio);
exports.default = router;
