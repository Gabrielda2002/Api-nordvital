import multer from 'multer';
import path from 'path';


 export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  path.join(__dirname, '../uploads/FotosPerfil'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

export const uploadPhotoUser = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "image/jpg") {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    } // ? limite de 5 megas por arquivo
})