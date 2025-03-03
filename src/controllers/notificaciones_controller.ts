// src/controllers/notification_controller.ts
import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../services/notificationService";

export async function getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.params;
        
        const notifications = await NotificationService.getUserNotifications(parseInt(userId));
        
        return res.json(notifications);
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