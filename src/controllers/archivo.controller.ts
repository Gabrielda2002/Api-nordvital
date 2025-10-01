import { NextFunction, Request, Response } from "express";
import { Archivos } from "../entities/archivos";
import path from "path";
import { validate } from "class-validator";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { Carpeta } from "../entities/carpeta";
import { FileTokenService } from "../services/file-token.service";


export async function getAllFiles(req: Request, res: Response, next: NextFunction){
    try {

        const files = await Archivos.find({ order: { name: "ASC" } });

        if (!files) {
            return res.status(404).json({message: "No hay archivos registrados"});
        }

        return res.status(200).json(files);

    } catch (error) {
        next(error)
    }
}

export async function getFileById(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const file = await Archivos.findOne({
            where: {id: parseInt(id)},
            order: { name: "ASC" }
        });

        if (!file) {
            return res.status(404).json({message: "Archivo no encontrado"});
        }

        return res.status(200).json(file);

    } catch (error) {
        next(error)
    }
} // Asegúrate de que la ruta es correcta

export async function createFile(req: Request, res: Response, next: NextFunction) {
    try {
        const { parentFolderId } = req.query;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "At least one file is required" });
        }

        const parentFolder = await Carpeta.findOne({ where: { id: parseInt(parentFolderId as string) } });

        if (!parentFolder) {
            return res.status(404).json({ message: "Parent folder not found" });
        }

        const fileResponses = await Promise.all(files.map(async (file) => {
            const fileExists = await Archivos.findOne({ where: { name: file.originalname } });
            if (fileExists) {
                return { status: 409, message: `File ${file.originalname} already exists` };
            }

            const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));

            const newFile = new Archivos();
            newFile.name = fileNameWithoutExt?.normalize("NFC").trim();

            // Obtener ruta relativa uniforme
            const relativePath = path.join(parentFolder.path, file.filename).replace(/\\/g, '/');
            newFile.path = relativePath;
            newFile.size = file.size;
            newFile.mimeType = file.mimetype;
            newFile.folderId = parseInt(parentFolderId as string);
            newFile.nameSaved = path.basename(file.filename);

            const errors = await validate(newFile);
            if (errors.length > 0) {
                const message = errors.map(err => (
                    Object.values(err.constraints || {}).join(", ")
                ))
                return { status: 400, message };
            }

            await newFile.save();
            return { status: 201, file: newFile };
        }));

        const errors = fileResponses.filter(response => response.status !== 201);
        if (errors.length > 0) {
            return res.status(errors[0].status).json(errors.map(error => error.message));
        }

        return res.status(201).json(fileResponses.map(response => response.file));
    } catch (error) {
        next(error);
    }
}

export async function updateFile(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const { name, parentFolderId } = req.body;

        const file = await Archivos.findOne({where: {id: parseInt(id)}});

        if (!file) {
            return res.status(404).json({message: "Archivo no encontrado"});
        }

        file.name = name.trim();
        file.folderId = parentFolderId;

        const errors = await validate(file);

        if (errors.length > 0) {
            const message = errors.map(err => (
                Object.values(err.constraints || {}).join(", ")
            ));
            return res.status(400).json({message});
        }

        await file.save();

        return res.status(200).json(file);

    } catch (error) {
        next(error)
    }
}

export async function deleteFile(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        

        const file = await Archivos.findOne({where: {id: parseInt(id)}});

        if (!file) {
            return res.status(404).json({message: "Archivo no encontrado"});
        }

         // Obtener la ruta absoluta del archivo
         const fileAbsolutePath = path.resolve(__dirname, ".." ,'uploads', file.path);

         // Verificar si el archivo existe en el sistema
         if (fs.existsSync(fileAbsolutePath)) {
             try {
                 // Eliminar el archivo del sistema de archivos
                 await fsPromises.unlink(fileAbsolutePath);
                 console.log(`Archivo eliminado: ${fileAbsolutePath}`);
             } catch (error) {
                 console.error(`Error al eliminar el archivo: ${error}`);
                 return res.status(500).json({ message: "Error al eliminar el archivo físico" });
             }
         } else {
             console.warn(`El archivo no existe en la ruta: ${fileAbsolutePath}`);
         }

        await file.remove();

        return res.status(204).json({message: "Archivo eliminado"});

    } catch (error) {
        next(error)
    }
}

export async function downloadFile(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const file = await Archivos.findOne({where: {id: parseInt(id)}});

        if (!file) {
            return res.status(404).json({message: "Archivo no encontrado"});
        }

        const cleanPath = file.path.replace(/^\.\.\/\.\.\//, '');
        // * Obtener la ruta absoluta del archivo
        const filePath = path.resolve(__dirname, ".." , 'uploads', cleanPath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({message: "Archivo no encontrado en el servidor"});
        }

        res.download(filePath, file.nameSaved, (err) => {
            if (err) {
              res.status(500).json({ message: "Error al descargar el archivo" });
            }
          });

    } catch (error) {
        next(error)
    }
}

export async function moveFiles(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { fileIds, newParentId } = req.body;

        if (!Array.isArray(fileIds) || fileIds.length === 0) {
            return res.status(400).json({ message: "fileIds array is required" });
        }

        if (!fileIds && !newParentId) {
            return res.status(400).json({ message: "fileIds and newParentId are required" });
        }

        const destinationFolder = await Carpeta.findOneBy({ id: newParentId });
        if (!destinationFolder) {
            return res.status(404).json({ message: "Destination folder not found" });
        }

        const movedFiles = [];
        const errors = [];

        for(const fileId of fileIds) {
            try {
                
                const file = await Archivos.findOne({ where: { id: parseInt(fileId)}});
                if (!file) {
                    errors.push({ fileId, error: "File not found" });
                    continue;
                }
                // ? Verificar si hay un archivo con el mismo nombre en la nueva carpeta destino
                const existingFile = await Archivos.createQueryBuilder("archivo")
                .where("archivo.name = :name AND archivo.folderId = :folderId", {
                    name: file.name,
                    folderId: newParentId
                })
                .getOne();

                if (existingFile) {
                        errors.push({fileId, fileName: file.name, error: "File with the same name already exists in the destination folder"});
                        continue;
                }

                // construir nuevas rutas
                const oldPthysicalPath = path.join(__dirname , '..', 'uploads',file.path);
                const newFileName = file.nameSaved;
                const newPhysicalPath = path.join(__dirname, '..', "uploads", destinationFolder.path, newFileName);

                // ? verificar que el archivo fisico existe
                if (!fs.existsSync(oldPthysicalPath)) {
                    errors.push({
                        fileId,
                        fileName: file.name,
                        error: "Physical file does not exist"
                    });
                    continue;
                }

                await fsPromises.rename(oldPthysicalPath, newPhysicalPath);

                // actualizar la base de datos
                const newRelativePath = path.join(destinationFolder.path, newFileName).replace(/\\/g, '/');

                file.folderId = newParentId;
                file.path = newRelativePath;

                const validationErrors =  await validate(file);
                if (validationErrors.length > 0) {
                    const message = validationErrors.map(err => (
                        Object.values(err.constraints || {}).join(", ")
                    ));
                    errors.push({fileId, fileName: file.name, error: message});
                    continue;
                }

                await file.save();
                movedFiles.push(file);

            } catch (error) {
                errors.push({
                    fileId,
                    error: `Error moving file with ID ${fileId}: ${error instanceof Error ? error.message : "Unknown error"}`
                })
            }
        }

        const response = {
            movedFiles,
            errors,
            summary: {
                totalFiles: fileIds.length,
                movedFilesCount: movedFiles.length,
                errorsCount: errors.length
            }
        };

        if (errors.length > 0 && movedFiles.length > 0) {
            return res.status(207).json(response); // Multi-Status response
        }

        if (errors.length > 0 && movedFiles.length === 0) {
            return res.status(400).json(response);
        }

        return res.status(200).json(response); 

    } catch (error) {
        next(error);
    }
}

export async function moveFile(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { newParentId } = req.body;

        req.body = {
            fileIds: [parseInt(id)],
            newParentId: newParentId
        };

        return moveFiles(req, res, next);

    } catch (error) {
        next(error);
    }
}

/**
 * Genera un token temporal para acceder a un archivo de forma segura
 */
export async function generateFileAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { action } = req.query;
        const user = (req as any).user; // Usuario del middleware de auth
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

        // Validar parámetros
        const fileId = parseInt(id);
        const actionType = (action as string)?.toUpperCase() as 'VIEW' | 'DOWNLOAD';
        
        if (!fileId || !actionType || !['VIEW', 'DOWNLOAD'].includes(actionType)) {
            return res.status(400).json({ 
                message: "ID de archivo y acción requeridos. Acción debe ser VIEW o DOWNLOAD" 
            });
        }

        // Verificar que el archivo existe
        const file = await Archivos.findOne({ where: { id: fileId } });
        if (!file) {
            return res.status(404).json({ message: "Archivo no encontrado" });
        }

        // TODO: Aquí validarías permisos específicos del archivo basado en roles
        // Por ahora asumo que si pasó el middleware de auth, tiene acceso

        // Generar token temporal (15 minutos)
        const token = FileTokenService.generateFileAccessToken(
            fileId,
            user.id,
            user.rol, // Asumo que tienes el rol en el usuario
            actionType,
            clientIP,
            15 // 15 minutos de expiración
        );

        return res.status(200).json({
            token,
            expiresIn: 900, // 15 minutos en segundos
            url: `/api/v1/secure-file/${token}`,
            action: actionType
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Sirve un archivo de forma segura validando el token temporal
 */
export async function serveSecureFile(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.params;
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

        if (!token) {
            return res.status(400).json({ message: "Token requerido" });
        }

        // Validar token
        const validation = FileTokenService.validateFileAccessToken(token, clientIP);
        
        if (!validation.valid) {
            return res.status(403).json({ 
                message: "Token inválido o expirado",
                error: validation.error 
            });
        }

        const { fileId, action } = validation.payload!;

        // Buscar el archivo
        const file = await Archivos.findOne({ where: { id: fileId } });
        if (!file) {
            return res.status(404).json({ message: "Archivo no encontrado" });
        }

        // Construir ruta del archivo
        const cleanPath = file.path.replace(/^\.\.\/\.\.\//, '');
        const filePath = path.resolve(__dirname, "..", 'uploads', cleanPath);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Archivo no encontrado en el servidor" });
        }

        // TODO: Aquí registrarías el acceso para auditoría
        console.log(`Archivo accedido: ${file.name} por usuario: ${validation.payload!.userId} - Acción: ${action}`);

        // Determinar cómo servir el archivo
        if (action === 'DOWNLOAD') {
            // Forzar descarga
            res.download(filePath, file.nameSaved, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error al descargar el archivo" });
                }
            });
        } else {
            // VIEW - Mostrar en el navegador
            const stat = fs.statSync(filePath);
            
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', file.mimeType);
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            
            fileStream.on('error', (err) => {
                console.error('Error streaming file:', err);
                if (!res.headersSent) {
                    res.status(500).json({ message: "Error al cargar el archivo" });
                }
            });
        }

    } catch (error) {
        next(error);
    }
}