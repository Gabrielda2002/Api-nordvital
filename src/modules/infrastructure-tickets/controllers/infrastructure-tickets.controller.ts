import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { format, toZonedTime } from "date-fns-tz";
import path from "path";
import fs from "fs";
import { InfrastructureTicket } from "../entities/infrastructure-ticket";
import { InfrastructureCategory } from "../entities/infrastructure-category";
import { InfrastructureAttachment } from "../entities/infrastructure-attachment";
import { NotificationService } from "../../notifications/services/notification.service";
import Logger from "@core/utils/logger-wrapper";

export async function getAllInfrastructureTickets(req: Request, res: Response, next: NextFunction) {
    try {
        const tickets = await InfrastructureTicket.createQueryBuilder("t")
            .leftJoinAndSelect("t.categoryRelation", "category")
            .leftJoinAndSelect("t.userRelation", "user")
            .leftJoinAndSelect("t.statusRelation", "status")
            .leftJoinAndSelect("t.priorityRelation", "priority")
            .leftJoinAndSelect("t.sedeRelation", "sede")
            .leftJoinAndSelect("t.attachmentsRelation", "attachments")
            .leftJoinAndSelect("sede.municipioRelation", "municipio")
            .leftJoinAndSelect("user.sedeRelation", "userSede")
            .orderBy("t.createdAt", "DESC")
            .getMany();

        if (tickets.length === 0) {
            return res.status(404).json({ message: "No infrastructure tickets found" });
        }

        const ticketsFormatted = tickets.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            nameRequester: t.userRelation?.name,
            lastNameRequester: t.userRelation?.lastName,
            phone: t.userRelation?.phoneNumber,
            category: t.categoryRelation?.name,
            priority: t.priorityRelation?.name,
            status: t.statusRelation?.name,
            headquarter: t.sedeRelation?.name,
            municipio: t.sedeRelation?.municipioRelation?.name,
            locationDescription: t.locationDescription,
            attachments: t.attachmentsRelation.map(att => ({
                id: att.id,
                fileUrl: att.fileUrl,
            })),
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
        }));

        return res.status(200).json(ticketsFormatted);
    } catch (error) {
        next(error);
    }
}

export async function getInfrastructureTicketById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const ticket = await InfrastructureTicket.findOneBy({ id: parseInt(String(id)) });

        if (!ticket) {
            return res.status(404).json({ message: "Infrastructure ticket not found" });
        }

        return res.json(ticket);
    } catch (error) {
        next(error);
    }
}

export async function createInfrastructureTicket(req: Request, res: Response, next: NextFunction) {
    const queryRunner = InfrastructureTicket.getRepository().manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let uploadedFilePath: string | null = null;

    try {
        const { title, description, userId, categoryId, headquartersId, locationDescription, attachmentType } = req.body;
        const file = req.file;
        console.log(req.body)

        const ticket = new InfrastructureTicket();
        ticket.title = title;
        ticket.description = description;
        ticket.userId = parseInt(String(userId));
        ticket.categoryId = parseInt(String(categoryId));
        ticket.sedeId = parseInt(String(headquartersId));
        ticket.statusId = 1;

        if(!categoryId) {
            await queryRunner.rollbackTransaction();
            if ( file?.path && fs.existsSync(file?.path)) fs.unlinkSync(file.path);
            return res.status(400).json({ message: "Category ID is required" });
        } 

        if (locationDescription) {
            ticket.locationDescription = locationDescription;
        }

        const category = await queryRunner.manager.findOne(InfrastructureCategory, {
            where: { id: parseInt(String(categoryId)) },
        });

        if (category?.priorityId) {
            Logger.info(`Assigning priority ${category.priorityId} to infrastructure ticket from category ${category.name}`);
            ticket.priorityId = category.priorityId;
        } else {
            Logger.info(`No priority found for category ${categoryId}. Assigning default priority.`);
            ticket.priorityId = 2;
        }

        const ticketErrors = await validate(ticket);
        console.log()
        if (ticketErrors.length > 0) {
            await queryRunner.rollbackTransaction();
            const message = ticketErrors.map(e => Object.values(e.constraints || {}).join(", ")).join(", ");
            return res.status(400).json({ message });
        }

        await queryRunner.manager.save(ticket);

        if (file) {
            Logger.info(`File uploaded: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
            uploadedFilePath = file.path;

            const fileNameWithoutExt = path.basename(
                file.originalname,
                path.extname(file.originalname)
            ).normalize("NFD");

            const attachmentExist = await queryRunner.manager.findOne(InfrastructureAttachment, {
                where: { fileName: fileNameWithoutExt },
            });

            if (attachmentExist) {
                await queryRunner.rollbackTransaction();
                if (fs.existsSync(uploadedFilePath)) {
                    fs.unlinkSync(uploadedFilePath);
                }
                return res.status(400).json({
                    message: "A file with the same name already exists. Please rename the file and try again.",
                });
            }

            const relativePath = `/infrastructure-tickets/${file.filename}`;

            const attachment = new InfrastructureAttachment();
            attachment.ticketId = ticket.id;
            attachment.fileName = fileNameWithoutExt;
            attachment.fileUrl = relativePath;
            attachment.mimeType = file.mimetype;
            attachment.fileSize = file.size;
            attachment.fileNameSaved = file.filename;
            attachment.uploadedByUserId = parseInt(String(userId));
            attachment.attachmentType = attachmentType || "other";

            const attachmentErrors = await validate(attachment);
            if (attachmentErrors.length > 0) {
                await queryRunner.rollbackTransaction();
                if (fs.existsSync(uploadedFilePath)) {
                    fs.unlinkSync(uploadedFilePath);
                }
                const message = attachmentErrors.map(e => Object.values(e.constraints || {}).join(", ")).join(", ");
                return res.status(400).json({ message });
            }

            await queryRunner.manager.save(attachment);
        }

        await queryRunner.commitTransaction();

        await NotificationService.createNotificationForRole(
            [22, 23],
            "Nuevo Ticket de Infraestructura",
            `Se ha creado un nuevo ticket de infraestructura: "${title}"`,
            ticket.id,
            "new_infrastructure_ticket"
        );

        return res.status(201).json(ticket);
    } catch (error) {
        try {
            await queryRunner.rollbackTransaction();
        } catch (_) {}

        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            try {
                fs.unlinkSync(uploadedFilePath);
            } catch (_) {}
        }

        next(error);
    } finally {
        if (!queryRunner.isReleased) {
            await queryRunner.release();
        }
    }
}

export async function updateInfrastructureTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { title, description, userId, categoryId, statusId, priorityId, sedeId, locationDescription, quotationAmount } = req.body;

        const ticket = await InfrastructureTicket.findOneBy({ id: parseInt(String(id)) });

        if (!ticket) {
            return res.status(404).json({ message: "Infrastructure ticket not found" });
        }

        ticket.title = title ?? ticket.title;
        ticket.description = description ?? ticket.description;
        if (userId !== undefined) ticket.userId = parseInt(String(userId));
        if (categoryId !== undefined) ticket.categoryId = parseInt(String(categoryId));
        if (statusId !== undefined) ticket.statusId = parseInt(String(statusId));
        if (sedeId !== undefined) ticket.sedeId = parseInt(String(sedeId));
        if (locationDescription !== undefined) ticket.locationDescription = locationDescription;
        if (quotationAmount !== undefined) ticket.quotationAmount = parseFloat(String(quotationAmount));

        if (priorityId !== undefined && priorityId !== null) {
            ticket.priorityId = parseInt(String(priorityId));
        } else if (categoryId !== undefined) {
            const category = await InfrastructureCategory.findOneBy({ id: parseInt(String(categoryId)) });
            if (category?.priorityId) {
                ticket.priorityId = category.priorityId;
            }
        }

        await ticket.save();

        return res.json(ticket);
    } catch (error) {
        next(error);
    }
}

export async function deleteInfrastructureTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const ticket = await InfrastructureTicket.findOneBy({ id: parseInt(String(id)) });

        if (!ticket) {
            return res.status(404).json({ message: "Infrastructure ticket not found" });
        }

        await ticket.remove();

        return res.json({ message: "Infrastructure ticket deleted" });
    } catch (error) {
        next(error);
    }
}

export async function getInfrastructureTicketsTable(req: Request, res: Response, next: NextFunction) {
    try {
        const tickets = await InfrastructureTicket.createQueryBuilder("ticket")
            .leftJoinAndSelect("ticket.statusRelation", "status")
            .leftJoinAndSelect("ticket.priorityRelation", "priority")
            .leftJoinAndSelect("ticket.categoryRelation", "category")
            .leftJoinAndSelect("ticket.userRelation", "user")
            .leftJoinAndSelect("user.sedeRelation", "userSede")
            .leftJoinAndSelect("userSede.municipioRelation", "municipio")
            .leftJoinAndSelect("ticket.sedeRelation", "sede")
            .leftJoinAndSelect("ticket.attachmentsRelation", "attachment")
            .orderBy("ticket.createdAt", "DESC")
            .getMany();

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: "No infrastructure tickets found" });
        }

        const timeZone = "America/Bogota";

        const ticketsFormatted = tickets.map((t) => {
            const zonedDate = t.createdAt ? toZonedTime(t.createdAt, timeZone) : null;
            const zonedDateUpdated = t.updatedAt ? toZonedTime(t.updatedAt, timeZone) : null;

            return {
                id: t.id,
                title: t.title,
                description: t.description,
                locationDescription: t.locationDescription || "N/A",
                quotationAmount: t.quotationAmount ?? null,
                nameRequester: t.userRelation?.name || "N/A",
                lastNameRequester: t.userRelation?.lastName || "N/A",
                phone: t.userRelation?.phoneNumber || "N/A",
                category: t.categoryRelation?.name || "N/A",
                priority: t.priorityRelation?.name || "N/A",
                status: t.statusRelation?.name || "N/A",
                headquarter: t.sedeRelation?.name || "N/A",
                userHeadquarters: t.userRelation?.sedeRelation?.name || "N/A",
                municipio: t.userRelation?.sedeRelation?.municipioRelation?.name || "N/A",
                attachments: t.attachmentsRelation
                    .filter((att) => !att.isInternal)
                    .map((att) => ({ id: att.id, fileName: att.fileName })),
                createdAt: zonedDate ? format(zonedDate, "yyyy-MM-dd HH:mm", { timeZone }) : "N/A",
                updatedAt: zonedDateUpdated ? format(zonedDateUpdated, "yyyy-MM-dd HH:mm", { timeZone }) : "N/A",
            };
        });

        return res.status(200).json(ticketsFormatted);
    } catch (error) {
        next(error);
    }
}

export async function getInfrastructureTicketsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const tickets = await InfrastructureTicket.createQueryBuilder("ticket")
            .select("ticket.id", "id")
            .addSelect("ticket.title", "title")
            .addSelect("ticket.description", "description")
            .addSelect("ticket.locationDescription", "locationDescription")
            .addSelect("ticket.quotationAmount", "quotationAmount")
            .addSelect("ticket.createdAt", "createdAt")
            .addSelect("ticket.updatedAt", "updatedAt")
            .addSelect("status.name", "status")
            .addSelect("priority.name", "priority")
            .addSelect("category.name", "category")
            .addSelect("sede.name", "sede")
            .leftJoin("ticket.statusRelation", "status")
            .leftJoin("ticket.priorityRelation", "priority")
            .leftJoin("ticket.categoryRelation", "category")
            .leftJoin("ticket.sedeRelation", "sede")
            .where("ticket.userId = :userId", { userId: parseInt(String(id)) })
            .orderBy("ticket.createdAt", "DESC")
            .getRawMany();

        if (tickets.length === 0) {
            return res.status(404).json({ message: "No infrastructure tickets found for this user" });
        }

        return res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
}
