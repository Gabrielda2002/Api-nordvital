import { NextFunction, Request, Response } from "express";
import { Certificados } from "../entities/certificados";
import path from "path";
import { validate } from "class-validator";
import fs from "fs";

export async function createCertificate(req: Request, res: Response, next: NextFunction){
    try {

        const { dni } = req.body; 

        const file = req.file;

        // * si ya hay un certificado con el mismo dni
        const certificateExistByDni = await Certificados.findOneBy({dni: dni});

        if (certificateExistByDni) {
            return res.status(409).json({message: "El certificado ya existe"});
        }

        const certificateExist = await Certificados.findOneBy({name: file?.originalname});

        if (certificateExist) {
            return res.status(409).json({message: "El certificado ya existe"});
        }

        // * nombre del certificado sin la extensión
        const fileNameWithOutExt = file ? path.basename(file.originalname, path.extname(file.originalname)) : '';

        const certificado = Certificados.create({
                    name: fileNameWithOutExt?.normalize('NFC'),
                    dni: dni,
                    path: file?.path,
                    type: file?.mimetype,
                    size: file?.size,
                    nameSaved: file ? path.basename(file.filename) : ''

        })

        const errors = await validate(certificado);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message": "Error al validar los datos", messages});
        }

        await Certificados.save(certificado);

        return res.status(201).json(certificado);

    } catch (error) {
        next(error)
    }
}

export async function getCertificateByDni(req: Request, res: Response, next: NextFunction){
    try {
        const dni = req.params.dni;

        const certificate = await Certificados.findOneBy({dni: parseInt(dni)});

        if (!certificate) {
            return res.status(404).json({message: "Certificado no encontrado"});
        }

        return res.status(200).json(certificate);

    } catch (error) {
        next(error)
    }
}

export async function downloadCertificate(req: Request, res: Response, next: NextFunction){
    try {
        const dni = req.params.dni;

        const certificate = await Certificados.findOneBy({dni: parseInt(dni)});

        if (!certificate) {
            return res.status(404).json({message: "Certificado no encontrado"});
        }

        // obtener la ruta absoluta del archivo
        const filePath = path.resolve('src', 'uploads', certificate.path);
        console.log(filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({message: "Certificado no encontrado en el servidor"});
        }

        res.download(filePath, certificate.nameSaved, (err) => {
            if (err) {
              console.error("Error al descargar el certificado: ", err);
            }
        })

    } catch (error) {
        next(error)
    }
}