"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllIpsPrimaria = getAllIpsPrimaria;
const ips_primaria_1 = require("../entities/ips-primaria");
function getAllIpsPrimaria(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ipsPrimaria = yield ips_primaria_1.IpsPrimaria.find();
            return res.json(ipsPrimaria);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    });
}
