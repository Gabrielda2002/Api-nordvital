// src/controllers/notification_controller.ts
import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../services/notificationService";
import { format, toZonedTime } from "date-fns-tz";

export async function getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.params;
        
        const notifications = await NotificationService.getUserNotifications(parseInt(userId));


        if (!notifications) {
            return res.status(404).json({ message: "No se encontraron notificaciones para este usuario" });
        }
        const timeZone = "America/Bogota";

        const notificacionsFormated = notifications.map(n => {
      
            const zonedDate = n.createdAt ? toZonedTime(n.createdAt, timeZone) : null;

            return{
            id: n.id,
            title: n.title,
            message: n.message,
            referenceType: n.referenceType,
            createdAt: zonedDate ? format(zonedDate, "yyyy-MM-dd HH:mm", { timeZone }) : "N/A",
            isRead: n.isRead,
            userId: n.userId,
            referenceId: n.referenceId,
    }})
        
        return res.json(notificacionsFormated);
    } catch (error) {
        next(error);
    }
}

export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        
        const notification = await NotificationService.markAsRead(parseInt(id));
        
        if (!notification) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }

        return res.json(notification);
    } catch (error) {
        next(error);
    }
}