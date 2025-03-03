// src/services/notification-service.ts
import { Notification } from "../entities/notificaciones";
import { Tickets } from "../entities/tickets";

export class NotificationService {
    /**
     * Crea una notificación para un usuario cuando un ticket se cierra
     */
    static async createTicketClosedNotification(ticket: Tickets): Promise<Notification> {
        const notification = new Notification();
        notification.userId = ticket.userId;
        notification.title = "Ticket Cerrado";
        notification.message = `Tu ticket "${ticket.title}" ha sido cerrado.`;
        notification.referenceId = ticket.id;
        notification.referenceType = "ticket";
        notification.isRead = false;
        
        await notification.save();
        return notification;
    }

    /**
     * Obtiene todas las notificaciones de un usuario
     */
    static async getUserNotifications(userId: number): Promise<Notification[]> {
        return Notification.createQueryBuilder("notification")
            .where("notification.user_id = :userId", { userId })
            .orderBy("notification.created_at", "DESC")
            .getMany();
    }

    /**
     * Marca una notificación como leída
     */
    static async markAsRead(notificationId: number): Promise<Notification | null> {
        const notification = await Notification.findOneBy({ id: notificationId });
        if (!notification) return null;

        notification.isRead = true;
        await notification.save();
        return notification;
    }
}