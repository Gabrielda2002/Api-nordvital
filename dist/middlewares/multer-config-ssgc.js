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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSggc = exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const carpeta_1 = require("../entities/carpeta");
exports.storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        const { parentFolderId } = req.query;
        let uploadPath;
        if (parentFolderId) {
            const parentFolder = yield carpeta_1.Carpeta.findOneBy({ id: parseInt(parentFolderId) });
            if (!parentFolder) {
                return cb(new Error("ruta de carpeta padre no encontrada"), "");
            }
            uploadPath = parentFolder.path;
        }
        else {
            // * ruta predeterminada en caso de que el archivo no tenga
            uploadPath = path_1.default.join(__dirname, '../uploads');
        }
        cb(null, uploadPath);
    }),
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const newFileName = file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname);
        cb(null, newFileName);
    },
});
exports.uploadSggc = (0, multer_1.default)({
    storage: exports.storage,
    fileFilter: (req, file, cb) => {
        if (!["application/pdf", "application/docx", "application/msword", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.mimetype)) {
            return cb(new Error("Only PDFs, DOCX, or DOC files are allowed"));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    }, // ? limite de 5 megas por arquivo
}).array("files", 10);
