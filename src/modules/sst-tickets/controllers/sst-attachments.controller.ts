import { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import { SstAttachment } from "../entities/sst-attachment";
import { SstTicket } from "../entities/sst-ticket";
import { FileTokenService } from "../../documents/services/file-token.service";
import { validateEntity } from "@core/utils/validation-helper";
import Logger from "@core/utils/logger-wrapper";

export async function getSstTicketAttachments(req: Request, res: Response, next: NextFunction) {
    try {
        const { ticketId } = req.params;
        const userRole = req.user?.rol;

        const ticket = await SstTicket.findOne({ where: { id: parseInt(String(ticketId)) } });
        if (!ticket) {
            return res.status(404).json({ message: "SST ticket not found" });
        }

        const queryBuilder = SstAttachment.createQueryBuilder("attachment")
            .leftJoinAndSelect("attachment.uploaderRelation", "user")
            .where("attachment.ticketId = :ticketId", { ticketId });

        if (userRole && !["1", "24", "25"].includes(String(userRole))) {
            queryBuilder.andWhere("attachment.isInternal = :isInternal", { isInternal: false });
        }

        const attachments = await queryBuilder
            .orderBy("attachment.createdAt", "ASC")
            .getMany();

        return res.status(200).json({ message: "Attachments retrieved successfully", data: attachments });
    } catch (error) {
        next(error);
    }
}

export async function uploadSstAttachment(req: Request, res: Response, next: NextFunction) {
    try {
        const { ticketId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const ticket = await SstTicket.findOne({ where: { id: parseInt(String(ticketId)) } });
        if (!ticket) {
            return res.status(404).json({ message: "SST ticket not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.file;
        const { attachmentType = "other", isInternal = false } = req.body;

        const fileNameWithoutExt = path.basename(
            file.originalname,
            path.extname(file.originalname)
        ).normalize("NFD");

        const attachment = new SstAttachment();
        attachment.ticketId = parseInt(String(ticketId));
        attachment.fileName = fileNameWithoutExt;
        attachment.fileUrl = `/sst-tickets/${file.filename}`;
        attachment.fileSize = file.size;
        attachment.mimeType = file.mimetype;
        attachment.fileNameSaved = file.filename;
        attachment.uploadedByUserId = userId;
        attachment.attachmentType = attachmentType;
        attachment.isInternal = isInternal === "true" || isInternal === true;

        await validateEntity(attachment);
        await attachment.save();

        Logger.info(`SST attachment uploaded for ticket ${ticketId} by user ${userId}`);

        return res.status(201).json({ message: "Attachment uploaded successfully", data: attachment });
    } catch (error) {
        const file = req.file;
        if (file) {
            const filePath = path.join(__dirname, "..", "..", "..", "uploads", "sst-tickets", file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        next(error);
    }
}

export async function deleteSstAttachment(req: Request, res: Response, next: NextFunction) {
    try {
        const { attachmentId } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.rol;

        const attachment = await SstAttachment.findOne({
            where: { id: parseInt(String(attachmentId)) },
            relations: ["ticketRelation"],
        });

        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        const canDelete = ["1", "24"].includes(String(userRole)) || attachment.uploadedByUserId === userId;
        if (!canDelete) {
            return res.status(403).json({ message: "Not authorized to delete this attachment" });
        }

        const filePath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "uploads",
            "sst-tickets",
            attachment.fileNameSaved
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await attachment.remove();

        Logger.info(`SST attachment ${attachmentId} deleted by user ${userId}`);

        return res.status(200).json({ message: "Attachment deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export async function getSstAttachmentById(req: Request, res: Response, next: NextFunction) {
    try {
        const { attachmentId } = req.params;
        const userRole = req.user?.rol;

        const attachment = await SstAttachment.findOne({
            where: { id: parseInt(String(attachmentId)) },
            relations: ["uploaderRelation", "ticketRelation"],
        });

        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        if (attachment.isInternal && !["1", "24", "25"].includes(String(userRole))) {
            return res.status(403).json({ message: "Not authorized to access this attachment" });
        }

        return res.status(200).json({ message: "Attachment retrieved successfully", data: attachment });
    } catch (error) {
        next(error);
    }
}

export async function generateSstAttachmentDownloadToken(req: Request, res: Response, next: NextFunction) {
    try {
        const attachmentId = parseInt(String(req.params.id));
        const user = req.user;
        const clientIp = req.ip || req.socket.remoteAddress || "unknown";

        if (!user || !attachmentId) {
            return res.status(400).json({ message: "User or attachment ID not authenticated" });
        }

        const attachmentExist = await SstAttachment.findOne({ where: { id: attachmentId } });
        if (!attachmentExist) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        const token = FileTokenService.generateFileAccessToken(
            attachmentId,
            user.id,
            String(user.rol),
            "DOWNLOAD",
            clientIp
        );

        return res.status(200).json({
            token,
            expiredIn: 900,
            url: `/secure-download/${token}`,
        });
    } catch (error) {
        next(error);
    }
}

export async function downloadSstAttachment(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.params;
        const clientIp = req.ip || req.socket.remoteAddress || "unknown";

        if (!token) {
            return res.status(400).json({ message: "Invalid download token" });
        }

        const validationToken = FileTokenService.validateFileAccessToken(String(token), clientIp);

        if (!validationToken.valid) {
            return res.status(403).json({ message: "Invalid or expired download token" });
        }

        const { fileId } = validationToken.payload!;

        const attachment = await SstAttachment.findOne({ where: { id: fileId } });
        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        const relativePath = attachment.fileUrl.replace(/^\//, "");
        const filePath = path.join(__dirname, "..", "..", "..", "uploads", relativePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on server" });
        }

        res.download(filePath, attachment.fileNameSaved, (err) => {
            if (err) {
                res.status(500).json({ message: "Error downloading file", error: err.message });
            }
        });
    } catch (error) {
        next(error);
    }
}
