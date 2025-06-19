import multer from "multer";
import path, { parse } from "path";
import { Carpeta } from "../entities/carpeta";

export const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // * carpeta padre en la que se guardará el archivo
    const {parentFolderId}  = req.query;

    let uploadPath: string;

    // ? si existe un valor en parentFolderId, se buscará la carpeta padre
    if (parentFolderId) {
      // * se busca la carpeta padre
      const parentFolder = await Carpeta.findOneBy({ id: parseInt(parentFolderId as string) });

      // ? si no se encuentra la carpeta padre, se lanza un error
      if (!parentFolder) {
        return cb(new Error("ruta de carpeta padre no encontrada"), "");
      }

      // * se asigna la ruta de la carpeta padre si se encuentra
      uploadPath = path.join(__dirname, "../uploads", parentFolder.path);
    } else {
      // * ruta predeterminada en caso de que el archivo no tenga
      uploadPath = path.join(__dirname, '../uploads/SistemaGestionCalidad');
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFileName = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(
      null,
      newFileName
    );
  },
});

export const uploadSggc = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      ![  "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
        "application/msword", // DOC
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(
        file.mimetype
      )
    ) {
      return cb(new Error("Only PDFs, DOCX, or DOC files are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 8 * 1024 * 1024,
  }, // ? limite de 5 megas por arquivo
}).array("files", 10);
