"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const grupo_servicios_controller_1 = require("../controllers/grupo-servicios_controller");
const router = (0, express_1.Router)();
router.get("/grupo-servicios", grupo_servicios_controller_1.getAllGruposServicios);
exports.default = router;
