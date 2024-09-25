"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = loggerMiddleware;
const logger_1 = __importDefault(require("../utils/logger"));
function loggerMiddleware(req, res, next) {
    logger_1.default.info(`Request method: ${req.method} URL: ${req.url}`);
    next();
}
