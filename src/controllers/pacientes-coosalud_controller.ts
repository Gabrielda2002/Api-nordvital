import { NextFunction, Request, Response } from "express";
import { PacientesCoosalud } from "../entities/pacientes-coosalud";
import * as XLSX from "xlsx";

export async function getAllPatientsCoosalud(req: Request, res: Response, next: NextFunction){
    try {
        
        const patients = await PacientesCoosalud.find();

        res.json(patients);

    } catch (error) {
        next(error);
    }
}

export async function getPatientCoosalud(req: Request, res: Response, next: NextFunction){
    try {
        
        const patient = await PacientesCoosalud.findOneBy({ id: parseInt(req.params.id)});

        res.json(patient);

    } catch (error) {
        next(error);
    }
}

export async function createPatientCoosalud(req: Request, res: Response, next: NextFunction){
    try {
        
        const {tpsIdnId, hstIdnNumeroIdentificacion, aflPrimerApellido, aflSegundoApellido, aflPrimerNombre, aflSegundoNombre, aflFechaNacimiento, tpsGnrId, tpsRgmId, entId, tpsAflId, znsId, tpsEstAflId, tpsCndBnfId, dprId, mncId, divipola, tpsMdlSbsId} = req.body;

        const patientExist = await PacientesCoosalud.createQueryBuilder('pacientes_cosalud')
        .where('hstIdnNumeroIdentificacion = :hstIdnNumeroIdentificacion', {hstIdnNumeroIdentificacion})
        .getOne();

        if(patientExist){
            return res.status(400).json({message: 'Patient already exist'});
        }

        const patient = PacientesCoosalud.create({
            tpsIdnId, 
            hstIdnNumeroIdentificacion, 
            aflPrimerApellido, 
            aflSegundoApellido, 
            aflPrimerNombre, 
            aflSegundoNombre, 
            aflFechaNacimiento, 
            tpsGnrId, 
            tpsRgmId, 
            entId, 
            tpsAflId, 
            znsId, 
            tpsEstAflId, 
            tpsCndBnfId, 
            dprId, 
            mncId, 
            divipola, 
            tpsMdlSbsId
        });

        await patient.save();

        res.json(patient);

    } catch (error) {
        next(error);
    }
}

export async function updatePatientCoosalud(req: Request, res: Response, next: NextFunction){
    try {
        
        const {tpsIdnId, hstIdnNumeroIdentificacion, aflPrimerApellido, aflSegundoApellido, aflPrimerNombre, aflSegundoNombre, aflFechaNacimiento, tpsGnrId, tpsRgmId, entId, tpsAflId, znsId, tpsEstAflId, tpsCndBnfId, dprId, mncId, divipola, tpsMdlSbsId} = req.body;

        const patient = await PacientesCoosalud.findOneBy({id : parseInt(req.params.id)});

        if(!patient){
            return res.status(404).json({message: 'Patient not found'});
        }

        patient.tpsIdnId = tpsIdnId;
        patient.hstIdnNumeroIdentificacion = hstIdnNumeroIdentificacion;
        patient.aflPrimerApellido = aflPrimerApellido;
        patient.aflSegundoApellido = aflSegundoApellido;
        patient.aflPrimerNombre = aflPrimerNombre;
        patient.aflSegundoNombre = aflSegundoNombre;
        patient.aflFechaNacimiento = aflFechaNacimiento;
        patient.tpsGnrId = tpsGnrId;
        patient.tpsRgmId = tpsRgmId;
        patient.entId = entId;
        patient.tpsAflId = tpsAflId;
        patient.znsId = znsId;
        patient.tpsEstAflId = tpsEstAflId;
        patient.tpsCndBnfId = tpsCndBnfId;
        patient.dprId = dprId;
        patient.mncId = mncId;
        patient.divipola = divipola;
        patient.tpsMdlSbsId = tpsMdlSbsId;

        await patient.save();

        res.json(patient);

    } catch (error) {
        next(error);
    }
}

export async function deletePatientCoosalud(req: Request, res: Response, next: NextFunction){
    try {
        
        const patient = await PacientesCoosalud.findOneBy({ id: parseInt(req.params.id) });

        if(!patient){
            return res.status(404).json({message: 'Patient not found'});
        }

        await patient.remove();

        res.json({message: 'Patient deleted'});

    } catch (error) {
        next(error);
    }
}

// buscar paciente por numero identificacion
export async function getPatientByIdentificationCoosalud(req: Request, res: Response, next: NextFunction){
    try {
        
        const { numeroIdentificacion } = req.body;

        const patient = await PacientesCoosalud.createQueryBuilder('pacientes_cosalud')
        .where('pacientes_cosalud.hstIdnNumeroIdentificacion = :hstIdnNumeroIdentificacion', {hstIdnNumeroIdentificacion: numeroIdentificacion})
        .andWhere('pacientes_cosalud.Estado = :Estado', {Estado: 'Activo'})
        .getOne();

        if(!patient){
            return res.status(404).json({message: 'Patient not found'});
        }

        res.json(patient);

    } catch (error) {
        next(error);
    }
}

export async function updatePatientsStatusFromExcel(req: Request, res: Response, next: NextFunction) {
    try {
        // Verificar que se haya subido un archivo
        if (!req.file) {
            return res.status(400).json({ message: "No se ha subido ningún archivo" });
        }

        // Verificar que el archivo tiene contenido
        if (!req.file.buffer || req.file.buffer.length === 0) {
            return res.status(400).json({ message: "El archivo está vacío" });
        }

        try {
            // Leer el archivo Excel con manejo de errores
            const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
            
            // Verificar que hay hojas en el libro
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                return res.status(400).json({ message: "El archivo Excel no contiene hojas" });
            }
            
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            
            // Verificar que la hoja contiene datos
            if (!sheet) {
                return res.status(400).json({ message: "La hoja de cálculo está vacía" });
            }

            // Convertir los datos del Excel a JSON
            const data: any[] = XLSX.utils.sheet_to_json(sheet);
            
            if (!data || data.length === 0) {
                return res.status(400).json({ message: "No se encontraron datos en el archivo" });
            }
            // Obtener la lista de cédulas desde la columna correspondiente
            // Comprobamos si la columna existe en los datos
            const primeraFila = data[0];
            const nombreColumnas = Object.keys(primeraFila);
            
            console.log("Columnas disponibles:", nombreColumnas);
            
            if (!nombreColumnas.includes('HST_IDN_NUMERO_IDENTIFICACION')) {
                return res.status(400).json({ 
                    message: "El archivo no contiene la columna 'HST_IDN_NUMERO_IDENTIFICACION'",
                    columnasDisponibles: nombreColumnas 
                });
            }

            const cedulas = data
                .map(row => row.HST_IDN_NUMERO_IDENTIFICACION)
                .filter(cedula => cedula !== undefined && cedula !== null);

            if (cedulas.length === 0) {
                return res.status(400).json({ message: "No se encontraron cédulas válidas en el archivo" });
            }

            console.log(`Se encontraron ${cedulas.length} cédulas`);
            console.log("Primeras 5 cédulas:", cedulas.slice(0, 5));

            // Una vez verificado que todo funciona, puedes descomentar esta parte para actualizar la base de datos
        await PacientesCoosalud.createQueryBuilder()
            .update(PacientesCoosalud)
            .set({ estado: "Inactivo" })
            .where("hstIdnNumeroIdentificacion IN (:...cedulas)", { cedulas })
            .execute();
            return res.status(200).json({ 
                message: `Se encontraron ${cedulas.length} cédulas`,
                primeras: cedulas.slice(0, 10)
            });
        } catch (error: any) {
            console.error("Error al procesar el archivo Excel:", error);
            return res.status(400).json({ 
                message: "Error al procesar el archivo Excel. Asegúrate de que es un archivo Excel válido.",
                error: error.message 
            });
        }
    } catch (error) {
        console.error("Error general:", error);
        next(error);
    }
}