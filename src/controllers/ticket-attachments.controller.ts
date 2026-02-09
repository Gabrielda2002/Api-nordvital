import { NextFunction, Request, Response } from "express";
import { TicketAttachment } from "../entities/ticket-attachment";
import { Tickets } from "../entities/tickets";
import { validate } from "class-validator";
import logger from "../utils/logger";
import * as fs from "fs";
import * as path from "path";

/**
 * Get all attachments for a ticket
 * If user is not admin/support, only return non-internal attachments
 */
export async function getTicketAttachments(req: Request, res: Response, next: NextFunction) {
    try {
        const { ticketId } = req.params;
        const userRole = req.user?.rol; // Assuming auth middleware sets this

        // Verify ticket exists
        const ticket = await Tickets.findOne({ where: { id: parseInt(ticketId as string) } });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const queryBuilder = TicketAttachment.createQueryBuilder("attachment")
            .leftJoinAndSelect("attachment.uploaderRelation", "user")
            .where("attachment.ticketId = :ticketId", { ticketId });

        // If user is not admin or support, filter out internal attachments
        if (userRole && !["1", "17"].includes(String(userRole))) {
            queryBuilder.andWhere("attachment.isInternal = :isInternal", { isInternal: false });
        }

        const attachments = await queryBuilder
            .orderBy("attachment.createdAt", "ASC")
            .getMany();

        return res.status(200).json({
            message: "Attachments retrieved successfully",
            data: attachments
        });
    } catch (error) {
        logger.error("Error getting ticket attachments:", error);
        next(error);
    }
}

/**
 * Upload attachment to a ticket
 */
export async function uploadTicketAttachment(req: Request, res: Response, next: NextFunction) {
    try {
        const { ticketId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Verify ticket exists
        const ticket = await Tickets.findOne({ where: { id: parseInt(ticketId as string) } });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.file;
        const { attachmentType = "other", isInternal = false } = req.body;

        // Create attachment entity
        const attachment = new TicketAttachment();
        attachment.ticketId = parseInt(ticketId as string);
        attachment.fileName = file.originalname;
        attachment.fileUrl = `/uploads/tickets/${file.filename}`;
        attachment.fileSize = file.size;
        attachment.mimeType = file.mimetype;
        attachment.fileNameSaved = file.filename;
        attachment.uploadedByUserId = userId;
        attachment.attachmentType = attachmentType;
        attachment.isInternal = isInternal === "true" || isInternal === true;

        // Validate
        const errors = await validate(attachment);
        if (errors.length > 0) {
            // Delete uploaded file if validation fails
            const filePath = path.join(__dirname, "..", "uploads", "tickets", file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(400).json({ message: "Validation failed", errors });
        }

        // Save to database
        await attachment.save();

        logger.info(`Attachment uploaded for ticket ${ticketId} by user ${userId}`);

        return res.status(201).json({
            message: "Attachment uploaded successfully",
            data: attachment
        });
    } catch (error) {
        logger.error("Error uploading ticket attachment:", error);
        next(error);
    }
}

/**
 * Delete an attachment
 */
export async function deleteTicketAttachment(req: Request, res: Response, next: NextFunction) {
    try {
        const { attachmentId } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.rol;

        const attachment = await TicketAttachment.findOne({
            where: { id: parseInt(attachmentId as string) },
            relations: ["ticketRelation"]
        });

        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        // Only admin, support, or the uploader can delete
        const canDelete = ["1", "17"].includes(userRole as string) || attachment.uploadedByUserId === userId;
        if (!canDelete) {
            return res.status(403).json({ message: "Not authorized to delete this attachment" });
        }

        // Delete physical file
        const filePath = path.join(__dirname, "..", "uploads", "tickets", attachment.fileNameSaved);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        await attachment.remove();

        logger.info(`Attachment ${attachmentId} deleted by user ${userId}`);

        return res.status(200).json({ message: "Attachment deleted successfully" });
    } catch (error) {
        logger.error("Error deleting ticket attachment:", error);
        next(error);
    }
}

/**
 * Get single attachment details
 */
export async function getTicketAttachmentById(req: Request, res: Response, next: NextFunction) {
    try {
        const { attachmentId } = req.params;
        const userRole = req.user?.rol;

        const attachment = await TicketAttachment.findOne({
            where: { id: parseInt(attachmentId as string) },
            relations: ["uploaderRelation", "ticketRelation"]
        });

        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        // Check if user can access internal attachments
        if (attachment.isInternal && !["1", "17"].includes(userRole as string)) {
            return res.status(403).json({ message: "Not authorized to access this attachment" });
        }

        return res.status(200).json({
            message: "Attachment retrieved successfully",
            data: attachment
        });
    } catch (error) {
        logger.error("Error getting attachment by ID:", error);
        next(error);
    }
}
