import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';

const memoryStorage = multer.memoryStorage();

// Función pura para guardar archivo desde buffer a disco
// Esta función puede ser importada y usada en los controladores
export const saveFileToDisk = (fileBuffer: Buffer, originalName: string): {path: string, filename: string} => {
    // Aseguramos que la ruta sea consistente
    const uploadPath = path.join(__dirname, '../uploads/ActasEntrega');
    
    // Creamos la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(originalName || "");
    const fileName = 'file-' + uniqueSuffix + extension;
    const filePath = path.join(uploadPath, fileName);

    fs.writeFileSync(filePath, fileBuffer);

    return {
        path: filePath,
        filename: fileName
    };
};

export const SaveFileToDiks = (req: Request, res: Response, next: NextFunction) =>  {

    if (!req.file) {
        return next();
    }

    try {
        const result = saveFileToDisk(req.file.buffer, req.file.originalname);
        
        req.file.path = result.path;
        req.file.filename = result.filename;
        next();
    } catch (error) {
        next(error);
    }
};

export const uploadDocDelivery = multer({
    storage: memoryStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error('Only PDFs are allowed'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1 * 1024 * 1024 // 1 MB por archivo
    }
}).single('file');