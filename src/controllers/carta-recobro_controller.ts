import { NextFunction, Request, Response } from "express";
import { CartaRecobro } from "../entities/Carta_recobro";
import { validate } from "class-validator";
import { Radicacion } from "../entities/radicacion";
import { ADDRGETNETWORKPARAMS } from "dns";
import { CupsRadicados } from "../entities/cups-radicados";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import { format } from "date-fns";
import fs from "fs";

export async function getAllRecoveryLetter (req: Request, res: Response, next: NextFunction){
    try {
        
        const recoveryLatter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .leftJoinAndSelect("carta_recobro.radicacionRelation", "radicacion")
        .leftJoinAndSelect("carta_recobro.userRequestRelation", "usuario_solicita")
        .leftJoinAndSelect("carta_recobro.userAuditRelation", "usuario_audita")
        .getMany();

        return res.json(recoveryLatter);
        
    } catch (error) {
        next(error);
    }
}

export async function getRecoveryLetterById (req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const recoveryLatter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .leftJoinAndSelect("carta_recobro.radicacionRelation", "radicacion")
        .leftJoinAndSelect("carta_recobro.userRequestRelation", "usuario_solicita")
        .leftJoinAndSelect("carta_recobro.userAuditRelation", "usuario_audita")
        .where("carta_recobro.id = :id", {id})
        .getOne();

        if(!recoveryLatter){
            return res.status(404).json({message: "Carta de recobro no encontrada"});
        }

        return res.json(recoveryLatter);

    } catch (error) {
        next(error);
        
    }
}

export async function createRecoveryLetter (req: Request, res: Response, next: NextFunction){
    try {
        
        const { idRadicado, idUserRequest, idUserAudit, observacion, justification, dateImpression } = req.body;

        const recoveryLatter = new CartaRecobro();
        recoveryLatter.idRadicado = parseInt(idRadicado);
        recoveryLatter.idUserRequest = parseInt(idUserRequest);
        recoveryLatter.idUserAudit = parseInt(idUserAudit);
        recoveryLatter.observation = observacion;
        recoveryLatter.justification = justification;
        recoveryLatter.dateImpression = dateImpression;

        const erros = await validate(recoveryLatter);

        if (erros.length > 0) {
            const errorsMessage = erros.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error",errorsMessage});
        }

        await recoveryLatter.save();

        return res.json(recoveryLatter);

    } catch (error) {
        next(error);
        
    }
}

export async function updateRecoveryLetter (req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { idRadicado, idUserRequest, idUserAudit, observacion, justification, dateImpression } = req.body;

        const recoveryLatter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .where("carta_recobro.id = :id", {id})
        .getOne();

        if(!recoveryLatter){
            return res.status(404).json({message: "Carta de recobro no encontrada"});
        }

        recoveryLatter.idRadicado = parseInt(idRadicado);
        recoveryLatter.idUserRequest = parseInt(idUserRequest);
        recoveryLatter.idUserAudit = parseInt(idUserAudit);
        recoveryLatter.observation = observacion;
        recoveryLatter.justification = justification;
        recoveryLatter.dateImpression = dateImpression;

        const erros = await validate(recoveryLatter);

        if (erros.length > 0) {
            const errorsMessage = erros.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error",errorsMessage});
        }

        await recoveryLatter.save();

        return res.json(recoveryLatter);

    } catch (error) {
        next(error);
        
    }
}

export async function deleteRecoveryLetter (req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const recoveryLatter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .where("carta_recobro.id = :id", {id})
        .getOne();

        if(!recoveryLatter){
            return res.status(404).json({message: "Carta de recobro no encontrada"});
        }

        await recoveryLatter.remove();

        return res.json({message: "Carta de recobro eliminada"});

    } catch (error) {
        next(error);
        
    }
}

// radicados autorizados por auditoria para solicitar carta de recobro
export async function getRequestLetter(req: Request, res: Response, next: NextFunction){
    try {
        
        const requestLatter = await Radicacion.createQueryBuilder("radicacion")
        .leftJoinAndSelect("radicacion.cartaRelation", "carta_recobro")
        .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups_radicados")
        .leftJoinAndSelect("radicacion.patientRelation", "patient")
        .leftJoinAndSelect("patient.documentRelation", "document")
        .leftJoinAndSelect("patient.convenioRelation", "convenio")
        .leftJoinAndSelect("cups_radicados.statusRelation", "estados")
        .where("cups_radicados.status = 1")
        .getMany();

        const responseFormated = requestLatter.map(r => ({
            id: r.id,
            profetional: r.profetional,
            creatAt: r.createdAt,
            dniNumber: r.patientRelation.documentNumber,
            dniType: r.patientRelation.documentRelation.name,
            patientName: r.patientRelation.name,
            agreement: r.patientRelation.convenioRelation.name,
            cupsAuthorized: r.cupsRadicadosRelation.map(c => ({
                id: c.id,
                code: c.code,
                DescriptionCode: c.DescriptionCode,
                status: c.statusRelation.name,
                statusLetter: c.statusRecoveryLatter || "N/A",
            })),
            isRequested: r.cartaRelation.length > 0 ? true : false,
            idRequest: r.cartaRelation.length > 0 ? r.cartaRelation[0].id : null,
            datePrint: r.cartaRelation.length > 0 ? r.cartaRelation[0].dateImpression : null,
        }))

        return res.json(responseFormated);

    } catch (error) {
        next(error);
        
    }
}

// solicitudes de carta de recobro
export async function getResponseLetter(req: Request, res: Response, next: NextFunction){
    try {
        
        const responseLetter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .leftJoinAndSelect("carta_recobro.radicacionRelation", "radicacion")
        .leftJoinAndSelect("radicacion.patientRelation", "patient")
        .leftJoinAndSelect("patient.documentRelation", "document")
        .leftJoinAndSelect("patient.convenioRelation", "convenio")
        .leftJoinAndSelect("carta_recobro.userRequestRelation", "usuario_solicita")
        .leftJoinAndSelect("carta_recobro.userAuditRelation", "usuario_audita")
        .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups_radicados")
        .leftJoinAndSelect("cups_radicados.statusRelation", "estados")
        .andWhere('carta_recobro.idUserAudit IS NULL')
        .andWhere('cups_radicados.status = 1')
        .getMany(); 

        const responseLetterFormated = responseLetter.map(r => ({
            id: r.id,
            profetional: r.radicacionRelation.profetional,
            creatAt: r.radicacionRelation.createdAt,
            dniNumber: r.radicacionRelation.patientRelation.documentNumber,
            dniType: r.radicacionRelation.patientRelation.documentRelation.name,
            agreement: r.radicacionRelation.patientRelation.convenioRelation.name,
            idRadicado: r.radicacionRelation.id,
            cupsAuthorized: r.radicacionRelation.cupsRadicadosRelation.map(c => ({
                id: c.id,
                code: c.code,
                DescriptionCode: c.DescriptionCode,
                status: c.statusRelation.name
            })),
        }))
        
        return res.json(responseLetterFormated);

    } catch (error) {
        next(error);
        
    }
} 

// crear solicitud
export async function createRequestLetter(req: Request, res: Response, next: NextFunction){
    try {
        
        const { idRadicado, idUserRequest, justification } = req.body;

        const requestExist = await CartaRecobro.createQueryBuilder("carta_recobro")
        .where("carta_recobro.id_radicado = :idRadicado", {idRadicado})
        .getOne();

        if (requestExist != undefined) {
            return res.status(400).json({message: "Ya existe una solicitud de carta de recobro para este radicado"});

        }

        const requestLatter = new CartaRecobro();
        requestLatter.idRadicado = parseInt(idRadicado);
        requestLatter.idUserRequest = parseInt(idUserRequest);
        requestLatter.justification = justification;

        const erros = await validate(requestLatter);

        if (erros.length > 0) {
            const errorsMessage = erros.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error",errorsMessage});
        }

        await requestLatter.save();

        return res.json(requestLatter);

    } catch (error) {
        next(error);
    }
}

// auditar solicitud de carta
export async function creatAuditRequestLetter (req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;

        const { idUserAudit, observation, idRadicado, cups  } = req.body;
        
        // * se valida si existe la solicitud
        const requestExist = await CartaRecobro.createQueryBuilder("carta_recobro")
        .where("carta_recobro.id = :id", {id})
        .getOne();

        if (requestExist == undefined) {
            return res.status(404).json({message: "No existe una solicitud de carta de recobro para este radicado"});
        }

        // * se actualiza el registro de solicitud
        requestExist.idUserAudit = parseInt(idUserAudit);
        requestExist.observation = observation;
        
        const erros = await validate(requestExist);

        if (erros.length > 0) {
            const errorsMessage = erros.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error",errorsMessage});
        }

        // * actualiza el cups afectados

        const cupsExist = await CupsRadicados.createQueryBuilder("cups_radicados")
        .where("cups_radicados.idRadicacion = :idRadicado", {idRadicado})
        .getMany();

        for (const cup of cupsExist) {
            const updateCup = cups.find(
              (detail: any) => detail.id === cup.id
            );
            console.log(updateCup);
            if (updateCup) {
              cup.statusRecoveryLatter = updateCup.statusLetter              ,
              cup.dateAuditRecoveryLatter = updateCup.dateAuditRecoveryLatter

              await cup.save();
            }
          }

        await requestExist.save();

        return res.json({message: "Carta de recobro auditada"});

    } catch (error) {
        next(error);
        
    }
}

export async function generatePdf(req: Request, res: Response, next: NextFunction) {
    try {
        const { idRadicado } = req.params;

        // Obtener la información del radicado y sus CUPS autorizados
        const radicado = await Radicacion.createQueryBuilder("radicacion")
            .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cups_radicados")
            .leftJoinAndSelect("radicacion.cartaRelation", "carta_recobro")
            .leftJoinAndSelect("carta_recobro.userRequestRelation", "userRequest")
            .leftJoinAndSelect("carta_recobro.userAuditRelation", "userAudit")
            .leftJoinAndSelect("radicacion.patientRelation", 'paciente_radicado')
            .leftJoinAndSelect("paciente_radicado.documentRelation", 'documento_paciente')
            .where("radicacion.id = :idRadicado", { idRadicado })
            .andWhere("cups_radicados.statusRecoveryLatter = 'Autorizado'")
            .getOne();

        if (!radicado) {
            return res.status(404).json({ message: "Radicado no encontrado" });
        }

        // Cargar el formato del PDF
        const pdfPath = path.resolve(__dirname, '../templates/CARTA_DE_RECOBRO_CARTA.pdf');
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ message: "Formato PDF no encontrado" });
        }

        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Obtener la primera página del PDF
        const page = pdfDoc.getPages()[0];

        // funcion para dividir el texto en lineas
        function splitTextIntoLines(text: string, maxLenght: number): string[] {
            const words = text.split(' ');
            const lines: string[] = [];
            let currentLine = '';

            words.forEach(word => {
                if ((currentLine + word).length > maxLenght) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                }else{
                    currentLine += word + ' ';
                }
            })

            if (currentLine.trim().length > 0) {
                lines.push(currentLine.trim());
            }

            return lines;

        } 

        // Agregar la información del pacientee

        const dateNow = format(new Date(), 'dd/MM/yyyy');

        page.drawText(`${dateNow}`, { x: 182, y: 744, size: 10, color: rgb(0, 0, 0) });

        page.drawText(`${radicado.cartaRelation[0].id}`, { x: 500, y: 743, size: 10, color: rgb(0, 0, 0) });
        
        page.drawText(`${radicado.patientRelation.name}`, { x: 80, y: 540, size: 10, color: rgb(0, 0, 0) });
        
        page.drawText(`${radicado.patientRelation.documentRelation.name}`, { x: 90, y: 523, size: 10, color: rgb(0, 0, 0) });
        
        page.drawText(`${radicado.patientRelation.documentNumber}`, { x: 175, y: 523, size: 10, color: rgb(0, 0, 0) });
        
        page.drawText(`${radicado.cartaRelation[0].userRequestRelation.name}` , { x: 80, y: 100, size: 10, color: rgb(0, 0, 0) });
        
        page.drawText(`${radicado.cartaRelation[0].userRequestRelation.lastName}` , { x: 80, y: 90, size: 10, color: rgb(0, 0, 0) });
        
        page.drawText(`${radicado.cartaRelation[0].userAuditRelation.name}`, { x: 240, y: 100, size: 10, color: rgb(0, 0, 0) });
        
        page.drawText(`${radicado.cartaRelation[0].userAuditRelation.lastName}`, { x: 240, y: 90, size: 10, color: rgb(0, 0, 0) });

        const xCode = 90;
        const xDescription = 155;
        let yPosition = 455;

        // Agregar la información de los CUPS autorizados al PDF
        radicado.cupsRadicadosRelation.forEach(cup => {
            if (cup.statusRecoveryLatter === 'Autorizado') {
                const yCode = yPosition;
                const descriptionLines = splitTextIntoLines(cup.DescriptionCode, 50);

                // Dibujar el código del CUPS
                page.drawText(`${cup.code}`, { x: xCode, y: yCode, size: 10, color: rgb(0, 0, 0) });

                // Dibujar la descripción del CUPS
                descriptionLines.forEach((line, lineIndex) => {
                    const yLine = yPosition - (lineIndex * 10);
                    page.drawText(line, { x: xDescription, y: yLine, size: 8, color: rgb(0, 0, 0) });
                });

                // Actualizar yPosition dinámicamente
                yPosition -= (descriptionLines.length * 10) + 6; // Espaciado entre descripciones
            }
        });

        // Guardar el PDF modificado
        const pdfBytesModified = await pdfDoc.save();

        const fileName = `carta-recobro-${idRadicado}_${Date.now()}.pdf`;

        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
        res.send(Buffer.from(pdfBytesModified));

    } catch (error) {
        next(error);
    }
}

export async function drawGridOnPdf() {
    // Cargar el formato del PDF
    const pdfPath = path.resolve(__dirname, '../templates/CARTA_DE_RECOBRO_CARTA.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Obtener la primera página del PDF
    const page = pdfDoc.getPages()[0];

    // Dibujar una cuadrícula en el PDF
    const gridSize = 50;
    for (let x = 0; x < page.getWidth(); x += gridSize) {
        for (let y = 0; y < page.getHeight(); y += gridSize) {
            page.drawText(`(${x}, ${y})`, { x, y, size: 8, color: rgb(0, 0, 0) });
        }
    }

    // Guardar el PDF modificado
    const pdfBytesModified = await pdfDoc.save();
    fs.writeFileSync('grid-pdf-letter.pdf', pdfBytesModified);
}

// guardar fecha de impresion
export async function saveDateImpress(req: Request, res: Response, next: NextFunction){
    try {
        
        const { id } = req.params;
        const { dateImpression } = req.body;

        const recoveryLatter = await CartaRecobro.createQueryBuilder("carta_recobro")
        .where("carta_recobro.id = :id", {id})
        .getOne();

        if(!recoveryLatter){
            return res.status(404).json({message: "Carta de recobro no encontrada"});
        }

        recoveryLatter.dateImpression = dateImpression;

        const erros = await validate(recoveryLatter);

        if (erros.length > 0) {
            const errorsMessage = erros.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))
            return res.status(400).json({"message" : "Ocurrio un error",errorsMessage});
        }

        await recoveryLatter.save();

        return res.json(recoveryLatter);

    } catch (error) {
        next(error);
    }
}