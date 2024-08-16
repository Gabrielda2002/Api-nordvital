import multer from "multer";
import path from "path";
import { Carpeta } from "../entities/carpeta";


export const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { parentFolderId } = req.body;


    let uploadPath: string;

    if (parentFolderId) {
      const parentFolder = await Carpeta.findOneBy({ id: parentFolderId });

      if (!parentFolder) {
        return cb(new Error("Pasta não encontrada"), "");
      }

      uploadPath = parentFolder.path;
    } else {
      // * ruta predeterminada en caso de que el archivo no tenga
      uploadPath = path.join(__dirname, '../uploads');
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const uploadSggc = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      !["application/pdf", "application/docx", "application/msword"].includes(
        file.mimetype
      )
    ) {
      return cb(new Error("Only PDFs, DOCX, or DOC files are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  }, // ? limite de 5 megas por arquivo
}).array("files", 10);
