import multer from 'multer';

// Configurar el almacenamiento en memoria
const storage = multer.memoryStorage();

// Crear el middleware de carga
export const uploadXlsx = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Verificar que sea un archivo Excel
        if (
            file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
            file.mimetype !== 'application/vnd.ms-excel' // .xls
        ) {
            return cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
}).single('file'); // 'file' es el nombre del campo en la petición