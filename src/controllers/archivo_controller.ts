import { NextFunction, Request, Response } from "express";
import { Archivos } from "../entities/archivos";
import path from "path";
import { validate } from "class-validator";

export async function getAllFiles(req: Request, res: Response, next: NextFunction){
    try {

        const files = await Archivos.find();

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
            where: {id: parseInt(id)}
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
        const { parentFolderId } = req.body;

        // Asegúrate de que req.files sea un array de archivos
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "At least one file is required" });
        }

        // Procesa cada archivo
        const fileResponses = await Promise.all(files.map(async (file) => {
            const fileExists = await Archivos.findOne({ where: { name: file.originalname } });

            if (fileExists) {
                return { status: 409, message: `File ${file.originalname} already exists` };
            }

            const fileNameWithOutExt = path.basename(file.originalname, path.extname(file.originalname));

            const newFile = new Archivos();
            newFile.name = fileNameWithOutExt?.normalize('NFC');
            newFile.path = file.path;
            newFile.size = file.size;
            newFile.mimeType = file.mimetype;
            newFile.folderId = parentFolderId;

            const errors = await validate(newFile);

            if (errors.length > 0) {
                const message = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }));
                return { status: 400, message };
            }

            await newFile.save();
            return { status: 201, file: newFile };
        }));

        // Filtra las respuestas fallidas y devuelve un mensaje combinado
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

        file.name = name;
        file.folderId = parentFolderId;

        const errors = await validate(file);

        if (errors.length > 0) {
            const message = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
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

        await file.remove();

        return res.status(204).json({message: "Archivo eliminado"});

    } catch (error) {
        next(error)
    }
}