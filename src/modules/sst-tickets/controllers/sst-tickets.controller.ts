import { NextFunction, Request, Response } from "express";
import { format, toZonedTime } from "date-fns-tz";
import path from "path";
import fs from "fs";
import { SstTicket } from "../entities/sst-ticket";
import { SstCategory } from "../entities/sst-category";
import { SstAttachment } from "../entities/sst-attachment";
import { NotificationService } from "../../notifications/services/notification.service";
import { validateEntity } from "@core/utils/validation-helper";
import Logger from "@core/utils/logger-wrapper";

export async function getAllSstTickets(req: Request, res: Response, next: NextFunction) {
    try {
        const tickets = await SstTicket.createQueryBuilder("t")
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
            return res.status(404).json({ message: "No SST tickets found" });
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
            attachments: t.attachmentsRelation.map((att) => ({
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

export async function getSstTicketById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const ticket = await SstTicket.findOneBy({ id: parseInt(String(id)) });

        if (!ticket) {
            return res.status(404).json({ message: "SST ticket not found" });
        }

        return res.json(ticket);
    } catch (error) {
        next(error);
    }
}

export async function createSstTicket(req: Request, res: Response, next: NextFunction) {
    const queryRunner = SstTicket.getRepository().manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let uploadedFilePath: string | null = null;

    try {
        const { title, description, userId, categoryId, headquartersId, locationDescription, attachmentType } = req.body;
        const file = req.file;

        const ticket = new SstTicket();
        ticket.title = title;
        ticket.description = description;
        ticket.userId = userId !== undefined && userId !== "" ? parseInt(String(userId)) : (undefined as any);
        ticket.categoryId = categoryId !== undefined && categoryId !== "" ? parseInt(String(categoryId)) : (undefined as any);
        ticket.headquartersId = headquartersId !== undefined && headquartersId !== "" ? parseInt(String(headquartersId)) : (undefined as any);
        ticket.statusId = 1;

        if (locationDescription) {
            ticket.locationDescription = locationDescription;
        }

        if(!categoryId) return res.status(404).json({ message: "Category not found" });

        const category = await queryRunner.manager.findOne(SstCategory, {
            where: { id: ticket.categoryId },
        });

        if (category?.priorityId) {
            Logger.info(`Assigning priority ${category.priorityId} to SST ticket from category ${category.name}`);
            ticket.priorityId = category.priorityId;
        } else {
            Logger.info(`No priority found for category ${categoryId}. Assigning default priority.`);
            ticket.priorityId = 2;
        }

        await validateEntity(ticket);
        await queryRunner.manager.save(ticket);

        if (file) {
            Logger.info(`File uploaded: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
            uploadedFilePath = file.path;

            const fileNameWithoutExt = path.basename(
                file.originalname,
                path.extname(file.originalname)
            ).normalize("NFD");

            const attachmentExist = await queryRunner.manager.findOne(SstAttachment, {
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

            const relativePath = `/sst-tickets/${file.filename}`;

            const attachment = new SstAttachment();
            attachment.ticketId = ticket.id;
            attachment.fileName = fileNameWithoutExt;
            attachment.fileUrl = relativePath;
            attachment.mimeType = file.mimetype;
            attachment.fileSize = file.size;
            attachment.fileNameSaved = file.filename;
            attachment.uploadedByUserId = userId !== undefined ? parseInt(String(userId)) : ticket.userId;
            attachment.attachmentType = attachmentType || "other";

            await validateEntity(attachment);
            await queryRunner.manager.save(attachment);
        }

        await queryRunner.commitTransaction();

        await NotificationService.createNotificationForRole(
            [24, 25],
            "Nuevo Ticket de SST",
            `Se ha creado un nuevo ticket de Salud y Seguridad del Trabajo: "${title}"`,
            ticket.id,
            "new_sst_ticket"
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

export async function updateSstTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { title, description, userId, categoryId, statusId, priorityId, sedeId, locationDescription, quotationAmount } = req.body;

        const ticket = await SstTicket.findOneBy({ id: parseInt(String(id)) });

        if (!ticket) {
            return res.status(404).json({ message: "SST ticket not found" });
        }

        ticket.title = title ?? ticket.title;
        ticket.description = description ?? ticket.description;
        if (userId !== undefined) ticket.userId = parseInt(String(userId));
        if (categoryId !== undefined) ticket.categoryId = parseInt(String(categoryId));
        if (statusId !== undefined) ticket.statusId = parseInt(String(statusId));
        if (sedeId !== undefined) ticket.headquartersId = parseInt(String(sedeId));
        if (locationDescription !== undefined) ticket.locationDescription = locationDescription;

        if (priorityId !== undefined && priorityId !== null) {
            ticket.priorityId = parseInt(String(priorityId));
        } else if (categoryId !== undefined) {
            const category = await SstCategory.findOneBy({ id: parseInt(String(categoryId)) });
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

export async function deleteSstTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const ticket = await SstTicket.findOneBy({ id: parseInt(String(id)) });

        if (!ticket) {
            return res.status(404).json({ message: "SST ticket not found" });
        }

        await ticket.remove();

        return res.json({ message: "SST ticket deleted" });
    } catch (error) {
        next(error);
    }
}

export async function getSstTicketsTable(req: Request, res: Response, next: NextFunction) {
    try {
        const tickets = await SstTicket.createQueryBuilder("ticket")
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
            return res.status(404).json({ message: "No SST tickets found" });
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
                nameRequester: t.userRelation?.name || "N/A",
                lastNameRequester: t.userRelation?.lastName || "N/A",
                phone: t.userRelation?.phoneNumber || "N/A",
                category: t.categoryRelation?.name || "N/A",
                priority: t.priorityRelation?.name || "N/A",
                status: t.statusRelation?.name || "N/A",
                incidentSede: t.sedeRelation?.name || "N/A",
                userSede: t.userRelation?.sedeRelation?.name || "N/A",
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

export async function getSstTicketsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const tickets = await SstTicket.createQueryBuilder("ticket")
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
            return res.status(404).json({ message: "No SST tickets found for this user" });
        }

        return res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
}
