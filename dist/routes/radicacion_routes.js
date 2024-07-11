"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const radicacion_controller_1 = require("../controllers/radicacion_controller");
const router = (0, express_1.Router)();
router.get('/radicacion', radicacion_controller_1.getAllRadicacion);
router.get('/radicacion/:id', radicacion_controller_1.getRadicacionById);
router.post('/radicacion', radicacion_controller_1.createRadicado);
exports.default = router;
