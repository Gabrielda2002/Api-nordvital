"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ips_remite_controller_1 = require("../controllers/ips-remite_controller");
const router = (0, express_1.Router)();
router.get("/ips-remite", ips_remite_controller_1.getAllIpsRemite);
exports.default = router;
