import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Aseguramos que la ruta sea consistente
        const uploadPath = path.join(__dirname, '../uploads/ActasEntrega');
        // Creamos la carpeta si no existe
        const fs = require('fs');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const uploadDocDelivery = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error('Only PDFs are allowed'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1 * 1024 * 1024 // 1 MB por archivo
    }
});