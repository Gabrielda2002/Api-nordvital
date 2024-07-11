"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const radicador_controller_1 = require("../controllers/radicador_controller");
const router = (0, express_1.Router)();
router.get("/radicador", radicador_controller_1.getAllRadicador);
exports.default = router;
