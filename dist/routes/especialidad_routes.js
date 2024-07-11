"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const especialidad_controller_1 = require("../controllers/especialidad_controller");
const router = (0, express_1.Router)();
router.get("/especialidades", especialidad_controller_1.getAllEspecialidades);
exports.default = router;
