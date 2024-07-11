"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lugar_radicacion_controller_1 = require("../controllers/lugar-radicacion_controller");
const router = (0, express_1.Router)();
router.get("/lugares-radicacion", lugar_radicacion_controller_1.getAllLugaresRadicacion);
exports.default = router;
