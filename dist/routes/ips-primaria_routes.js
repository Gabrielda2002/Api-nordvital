"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ips_primaria_controller_1 = require("../controllers/ips-primaria_controller");
const router = (0, express_1.Router)();
router.get('/ips-primaria', ips_primaria_controller_1.getAllIpsPrimaria);
exports.default = router;
