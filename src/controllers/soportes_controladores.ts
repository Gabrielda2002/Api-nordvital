import { NextFunction, Request, Response } from "express";
import { Soportes } from "../entities/soportes";
import { validate } from "class-validator";
import fs from "fs";
import path from "path";

export async function getAllSorportes(req: Request, res: Response, next: NextFunction){
    try {
        
        const soportes = await Soportes.find();

        if (!soportes) {
            return res.status(404).json({message: "No hay soportes registrados"});
        }

        return res.status(200).json(soportes);

    } catch (error) {
        next(error);
    }

}

export async function getSoporteById(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const soporte = await Soportes.findOneBy({id: parseInt(id)});

        if (!soporte) {
            return res.status(404).json({message: "Soporte no encontrado"});
        }

        return res.status(200).json(soporte);

    } catch (error) {
        next(error);
    }
}

export async function createSoporte(req: Request, res: Response, next: NextFunction){
    try {
        const { idRadicacion } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({message: "El archivo es requerido"});
        }

        const soporteExists = await Soportes.findOneBy({idRadicacion: parseInt(idRadicacion)});

        if (soporteExists) {
            return res.status(409).json({message: "El soporte ya existe"});
        }


        
        const fileNameWithoutExt = file ? path.basename(file.originalname, path.extname(file.originalname)) : '';


        const soporte = Soportes.create({
            name : fileNameWithoutExt?.normalize('NFC'),
            url: file?.path,
            size: file?.size,
            type: file?.mimetype,
            idRadicacion
        });

        const errors = await validate(soporte);

        if (errors.length > 0) {

            const menssages = errors.map(err =>({
                property: err.property,
                constraints: err.constraints
            }));
            return res.status(400).json({"message": "Error al validar los datos", menssages});
        }

        await soporte.save();

        return res.status(201).json(soporte);

    } catch (error) {
        next(error);
    }
}

export async function updateSoporte(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { name, url } = req.body;

        const soporteExist = await Soportes.findOneBy({id: parseInt (id)});

        if (!soporteExist) {
            return res.status(404).json({message: "Soporte no encontrado"});
        }

        soporteExist.name = name;
        soporteExist.url = url;

        const errors = await validate(soporteExist);

        if (errors.length > 0) {
            const messages = errors.map(err =>({
                property: err.property,
                constraints: err.constraints
            }));
            return res.status(400).json({message: "Error al validar los datos", messages});
        }

        await soporteExist.save();

        return res.status(200).json(soporteExist);

    } catch (error) {
        next(error);
    }
}

export async function deleteSoporte(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const soporteExist = await Soportes.findOneBy({id: parseInt(id)});
        
        if (!soporteExist) {
            return res.status(404).json({message: "Soporte no encontrado"});
        }

        const filePath = soporteExist.url

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await soporteExist.remove();

        return res.status(200).json({message: "Soporte eliminado"});

    }
    catch (error) {
        next(error);
    }
}