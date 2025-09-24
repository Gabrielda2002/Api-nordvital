import { NextFunction, Request, Response } from "express";
import { Permisos } from "../entities/permisos";
import { validate } from "class-validator";

export async function getRequestPermissions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        
        const userRol = req.user?.rol;

        const userId = req.user?.id;

        // verificar que el usuario tenga un jefe de area
        const userHasBoss = await Permisos

        const query = await Permisos.createQueryBuilder("permisos")
        .leftJoinAndSelect("permisos.applicantRelation", "applicant")
        .leftJoinAndSelect("permisos.bossRelation", "boss")
        .leftJoinAndSelect("permisos.managerRelation", "manager");

        if (userRol != "2" && userRol != "1") {
            query.where("permisos.bossId = :userId", { userId });
        }

        query.orderBy("permisos.id", "DESC");
        const permissions = await query.getMany();

        const permissionsFormatted = permissions.map(p => ({
            id: p.id || "N/A",
            requestedDays: p.requestedDays || "N/A",
            startDate: p.startDate || "N/A",
            endDate: p.endDate || "N/A",
            startTimeRequested: p.startTimeRequested || "N/A",
            endTimeRequested: p.endTimeRequested || "N/A",
            compensationTime: p.compensationTime || "N/A",
            nonRemunerated: p.nonRemunerated,
            notes: p.notes || "N/A",
            bossId: p.bossId || "N/A",
            bossName: p.bossRelation ? `${p.bossRelation.name} ${p.bossRelation.lastName}` : "N/A",
            bossStatus: p.bossStatus || "N/A",
            bossComment: p.bossComment || "N/A",
            managementId: p.managementId || "N/A",
            managerName: p.managementApprovedAt ? `${p.managementRelation.name} ${p.managementRelation.lastName}` : "N/A",
            managementStatus: p.managementStatus || "N/A",
            managementComment: p.managementComment || "N/A",
            createdAt: p.createdAt || "N/A",
            applicantId: p.applicantRelation || "N/A",
            applicantName: p.applicantRelation ? `${p.applicantRelation.name} ${p.applicantRelation.lastName}` : "N/A",
        }))

        res.status(200).json(permissionsFormatted);
        
    } catch (error) {
        next(error);
    }
}

export async function CreatePermissionRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        
        const {
            requestedDays,
            startDate,
            endDate,
            startTimeRequested,
            endTimeRequested,
            compensationTime,
            nonRemunerated,
            notes,
            applicantId,
        } = req.body;

        const requestExists = await Permisos.findOneBy({ applicantId });

        if (requestExists) {
            return res.status(400).json({ message: "Ya existe una solicitud de permiso para este usuario" });
        }

        const permiso = new Permisos();
        permiso.requestedDays = requestedDays;
        permiso.startDate = startDate;
        permiso.endDate = endDate;
        permiso.startTimeRequested = startTimeRequested;
        permiso.endTimeRequested = endTimeRequested;
        permiso.compensationTime = compensationTime;
        permiso.nonRemunerated = nonRemunerated;
        permiso.notes = notes;
        permiso.applicantId = applicantId;

        const errors = await validate(permiso);
        if (errors.length > 0) {
            const errorsMessage = errors.map(errors => (
                Object.values(errors.constraints || {}).join(", ")
            ));
            return res.status(400).json({ message: errorsMessage });
        }

        await permiso.save();

        return res.status(201).json(permiso);

    } catch (error) {
        next(error);
    }
}

export async function approvePermissionRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        
        const {
            permissionId,
            approverComment,
            approvalStatus,
        } = req.body;

        const currentUserRol = req.user?.rol;
        const currentUserId = req.user?.id;

       

    } catch (error) {
        next(error);
    }
}