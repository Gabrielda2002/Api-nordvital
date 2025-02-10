import { NextFunction, Request, Response } from "express";
import { PacientesCoosalud } from "../entities/pacientes-coosalud";

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
        .getOne();

        if(!patient){
            return res.status(404).json({message: 'Patient not found'});
        }

        res.json(patient);

    } catch (error) {
        next(error);
    }
}