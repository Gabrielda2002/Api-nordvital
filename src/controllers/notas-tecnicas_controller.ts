import { NextFunction, Request, Response } from "express";
import { NotasTecnicas } from "../entities/notas-tecnicas";
import { validate } from "class-validator";
import * as ExcelJS from "exceljs";
import { off } from "node:process";

export async function getAllNotaTecnica(req: Request, res: Response, next: NextFunction){
    try {
        
        const nota = await NotasTecnicas.find();

        return res.json(nota);

    } catch (error) {
        next(error);
    }
}

export async function getNotaTecnicaById(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const nota = await NotasTecnicas.createQueryBuilder("nota")
            .where("nota.id = :id", { id: parseInt(id) })
            .getMany();

        if (!nota) {
            return res.status(404).json({ message: "Nota tecnica not found" });
        }

        return res.json(nota);

    } catch (error) {
        next(error);
    }
}

export async function createNotaTecnica(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { idEps, idService, frecuencyUse, amount, subgroup, group, idSede, rate } = req.body;

        const nota = new NotasTecnicas();
        nota.idEps = parseInt(idEps);
        nota.idService = parseInt(idService);
        nota.frecuencyUse = frecuencyUse;
        nota.amount = parseInt(amount);
        nota.subgroup = subgroup;
        nota.group = group;
        nota.idSede = parseInt(idSede);
        nota.rate = parseInt(rate);

        const errors = await validate(nota);
        if (errors.length > 0) {
            const mesage = errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }))
            return res.status(400).json({ message: "Error creating nota tecnica", mesage });
        }

        await nota.save();

        return res.json(nota);

    } catch (error) {
        next(error);
    }
}

export async function updateNotaTecnica(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;
        const { idEps, idService, frecuencyUse, amount, subgroup, group, idSede, rate } = req.body;

        const nota = await NotasTecnicas.createQueryBuilder("nota")
            .where("nota.id = :id", { id: parseInt(id) })
            .getOne();

        if (!nota) {
            return res.status(404).json({ message: "Nota tecnica not found" });
        }

        nota.idEps = parseInt(idEps);
        nota.idService = parseInt(idService);
        nota.frecuencyUse = frecuencyUse;
        nota.amount = parseInt(amount);
        nota.subgroup = subgroup;
        nota.group = group;
        nota.idSede = parseInt(idSede);
        nota.rate = parseInt(rate);

        const errors = await validate(nota);
        if (errors.length > 0) {
            const mesage = errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }))
            return res.status(400).json({ message: "Error updating nota tecnica", mesage });
        }

        await nota.save();

        return res.json(nota);

    } catch (error) {
        next(error);
    }
}

export async function deleteNotaTecnica(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const nota = await NotasTecnicas.createQueryBuilder("nota")
            .where("nota.id = :id", { id: parseInt(id) })
            .getOne();

        if (!nota) {
            return res.status(404).json({ message: "Nota tecnica not found" });
        }

        await nota.remove();

        return res.json({ message: "Nota tecnica deleted" });

    } catch (error) {
        next(error);
    }
}

// actualizar estados servicios generales a partir de un excel donde esta el id 
export async function updateNotaTecnicaStatusFromExcel(req: Request, res: Response, next: NextFunction) {
    try {
        
        // Verificar que se haya subido un archivo
        if (!req.file) {
            return res.status(400).json({ message: "No se ha subido ningún archivo" });
        }

        // Verificar que el archivo tiene contenido
        if (!req.file.buffer || req.file.buffer.length === 0) {
            return res.status(400).json({ message: "El archivo está vacío" });
        }

        // Leer el archivo Excel con ExcelJS en lugar de XLSX
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);

        if (workbook.worksheets.length === 0) {
            return res.status(400).json({ message: "El archivo no contiene hojas" });
        }

        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            return res.status(400).json({ message: "La hoja esta vacia" });
        }

        // Convertir el contenido de la hoja a JSON
        const data: any[] = [];
        const headers: string[] = [];

        // Obtener los encabezados
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            headers[colNumber - 1] = cell.value ? cell.value.toString() : '';
        });

        // Obtener los datos
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Saltar la fila de encabezado
                const rowData: any = {};
                row.eachCell((cell, colNumber) => {
                    rowData[headers[colNumber - 1]] = cell.value;
                });
                data.push(rowData);
            }
        });

        if (!data || data.length === 0) {
            return res.status(400).json({ message: "No se encontraron datos en la hoja" });
        }

        const firstRow = data[0];
        const columnName = Object.keys(firstRow);

        console.log("Columnas disponibles:", columnName);

        if (!columnName.includes('id_servicio')) {
            return res.status(400).json({ 
                message: "El archivo no contiene la columna 'id_servicio'",
                columnasDisponibles: columnName 
            });
        }

        const idsColumn = data.map(row => row.id_servicio)
                       .filter(id => id !== undefined && id !== null);

        console.log("IDs de servicios generales:", idsColumn);

        if (idsColumn.length === 0) {
            return res.status(400).json({ message: "No se encontraron IDs de servicios generales en la hoja" });
        }

        console.log("IDs de servicios generales:", idsColumn);

        // Obtener los IDs de los servicios generales desde la primera columna del Excel
        // Actualizar el estado de los servicios generales en la base de datos
        await NotasTecnicas.createQueryBuilder()
            .update(NotasTecnicas)
            .set({ status: () => "0" })
            .where("idService IN (:...idsColumn)", { idsColumn })
            .execute();

        return res.status(200).json({ message: "Estado de los servicios generales actualizado",
            primerasCincoIds: idsColumn.slice(0, 5)
         });

    } catch (error) {
        next(error);
    }
}