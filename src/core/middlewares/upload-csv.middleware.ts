import multer from "multer";

const storage = multer.memoryStorage();

export const uploadCsv = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/csv",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Solo se permiten archivos CSV (.csv)"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");
