import { NextFunction, Request, Response } from "express";
import { ServiciosEjecutados } from "../entities";
import { validate } from "class-validator";

export async function getAllServiciosEjecutados(req: Request, res: Response, next: NextFunction){
    try {
        
        const serviciosEjecutados = await ServiciosEjecutados.createQueryBuilder("servicios-ejecutados")
        .getMany();

        return res.json(serviciosEjecutados);
        
    } catch (error) {
        next(error);
    }
}

export async function getServiciosEjecutadosById(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const serviciosEjecutados = await ServiciosEjecutados.createQueryBuilder("servicios-ejecutados")
        .where("servicios-ejecutados.id = :id", { id: id });

        if (!serviciosEjecutados) {
            return res.status(404).json({ message: "ServiciosEjecutados not found" });
        }

        return res.json(serviciosEjecutados);

    } catch (error) {
        next(error);
    }
}

export async function createServiciosEjecutados(req: Request, res: Response, next: NextFunction) {
    try {
        
        const {
            idSede,
            idService,
            amount,
            rate,
            statusService,
            group,
            subGroup,
            documentType,
            identification,
            patientName,
            patientSex,
            dateBirth,
            riasGroup,
            mainDx,
            medicoCode,
            medicoName,
            medicoSpc,
            nameContract,
            userRegimen,
            authorizationNumber,
            assignmentDate,
            orderDate,
            prestDate,
            appointmentStatus,
            serviceType,
            appointmentType,
            userGenerated,
            convenio,
            servicePgp
        } = req.body;

        const serviciosEjecutados = new ServiciosEjecutados();
        serviciosEjecutados.idSede = parseInt(String(idSede));
        serviciosEjecutados.idService = parseInt(String(idService));
        serviciosEjecutados.amount = parseInt(String(amount));
        serviciosEjecutados.rate = parseInt(String(rate));
        serviciosEjecutados.statusService = statusService;
        serviciosEjecutados.group = group;
        serviciosEjecutados.subGroup = subGroup;
        serviciosEjecutados.documentType = parseInt(String(documentType));
        serviciosEjecutados.identification = parseInt(String(identification));
        serviciosEjecutados.patientName = patientName;
        serviciosEjecutados.patientSex = patientSex;
        serviciosEjecutados.dateBirth = dateBirth;
        serviciosEjecutados.riasGroup = riasGroup;
        serviciosEjecutados.mainDx = mainDx;
        serviciosEjecutados.medicoCode = medicoCode;
        serviciosEjecutados.medicoName = medicoName;
        serviciosEjecutados.medicoSpc = medicoSpc;
        serviciosEjecutados.nameContract = nameContract;
        serviciosEjecutados.userRegimen = userRegimen;
        serviciosEjecutados.authorizationNumber = authorizationNumber;
        serviciosEjecutados.assignmentDate = assignmentDate;
        serviciosEjecutados.orderDate = orderDate;
        serviciosEjecutados.prestDate = prestDate;
        serviciosEjecutados.appointmentStatus = appointmentStatus;
        serviciosEjecutados.serviceType = serviceType;
        serviciosEjecutados.appointmentType = appointmentType;
        serviciosEjecutados.userGenerated = userGenerated;
        serviciosEjecutados.convenio = convenio;
        serviciosEjecutados.servicePgp = servicePgp;

        const errors = await validate(serviciosEjecutados);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error creating servicios-ejecutados", messages });
        }

        await serviciosEjecutados.save();


        return res.json(serviciosEjecutados);


    } catch (error) {
        next(error);
    }
}

export async function updateServiciosEjecutados(req: Request, res: Response, next: NextFunction) {
    try {
        
        const { id } = req.params;

        const {
            idSede,
            idService,
            amount,
            rate,
            statusService,
            group,
            subGroup,
            documentType,
            identification,
            patientName,
            patientSex,
            dateBirth,
            riasGroup,
            mainDx,
            medicoCode,
            medicoName,
            medicoSpc,
            nameContract,
            userRegimen,
            authorizationNumber,
            assignmentDate,
            orderDate,
            prestDate,
            appointmentStatus,
            serviceType,
            appointmentType,
            userGenerated,
            convenio,
            servicePgp
        } = req.body;

        const serviciosEjecutados = await ServiciosEjecutados.createQueryBuilder("servicios-ejecutados")
        .where("servicios-ejecutados.id = :id", { id: id })
        .getOne();

        if (!serviciosEjecutados) {
            return res.status(404).json({ message: "ServiciosEjecutados not found" });
        }

        serviciosEjecutados.idSede = parseInt(String(idSede));
        serviciosEjecutados.idService = parseInt(String(idService));
        serviciosEjecutados.amount = parseInt(String(amount));
        serviciosEjecutados.rate = parseInt(String(rate));
        serviciosEjecutados.statusService = statusService;
        serviciosEjecutados.group = group;
        serviciosEjecutados.subGroup = subGroup;
        serviciosEjecutados.documentType = parseInt(String(documentType));
        serviciosEjecutados.identification = parseInt(String(identification));
        serviciosEjecutados.patientName = patientName;
        serviciosEjecutados.patientSex = patientSex;
        serviciosEjecutados.dateBirth = dateBirth;
        serviciosEjecutados.riasGroup = riasGroup;
        serviciosEjecutados.mainDx = mainDx;
        serviciosEjecutados.medicoCode = medicoCode;
        serviciosEjecutados.medicoName = medicoName;
        serviciosEjecutados.medicoSpc = medicoSpc;
        serviciosEjecutados.nameContract = nameContract;
        serviciosEjecutados.userRegimen = userRegimen;
        serviciosEjecutados.authorizationNumber = authorizationNumber;
        serviciosEjecutados.assignmentDate = assignmentDate;
        serviciosEjecutados.orderDate = orderDate;
        serviciosEjecutados.prestDate = prestDate;
        serviciosEjecutados.appointmentStatus = appointmentStatus;
        serviciosEjecutados.serviceType = serviceType;
        serviciosEjecutados.appointmentType = appointmentType;
        serviciosEjecutados.userGenerated = userGenerated;
        serviciosEjecutados.convenio = convenio;
        serviciosEjecutados.servicePgp = servicePgp;
        

        const errors = await validate(serviciosEjecutados);

        if (errors.length > 0) {
            const messages = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }))

            return res.status(400).json({ message: "Error updating servicios-ejecutados", messages });
        }

        await serviciosEjecutados.save();

        return res.json(serviciosEjecutados);

    }catch (error) {
        next(error);
    }   
}

export async function deleteServiciosEjecutados(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const serviciosEjecutados = await ServiciosEjecutados.findOneBy({ id: parseInt(String(id)) });

        if (!serviciosEjecutados) {
            return res.status(404).json({ message: "ServiciosEjecutados not found" });
        }

        await serviciosEjecutados.remove();

        return res.json({ message: "ServiciosEjecutados deleted" });

    } catch (error) {
        next(error);
    }
}