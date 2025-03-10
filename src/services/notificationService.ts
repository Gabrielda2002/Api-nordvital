// src/services/notification-service.ts
import { io } from "../app";
import { Notification } from "../entities/notificaciones";
import { Tickets } from "../entities/tickets";
import { PushService } from "./pushService";

export class NotificationService {
    /**
     * Crea una notificación para un usuario cuando un ticket se cierra
     */
    static async createTicketClosedNotification(ticket: Tickets, title: string): Promise<Notification> {
        const notification = new Notification();
        notification.userId = ticket.userId;
        notification.title = title;
        notification.message = `Se actualizó el estado de tu ticket "${ticket.title}".`;
        notification.referenceId = ticket.id;
        notification.referenceType = "ticket";
        notification.isRead = false;
        
        await notification.save();

        console.log('emitiendo notificacion ')
        console.log(`[Socket.io] Emitiendo notificación a sala user_${ticket.userId}:`, notification);
        io.to(`user_${ticket.userId}`).emit(`newNotification`, notification)

        // Enviar notificación push
        try {
            await PushService.sendPushNotification(
                ticket.userId,
                notification.title,
                notification.message,
                {
                    ticketId: ticket.id,
                    notificationId: notification.id,
                    type: 'ticket_closed'
                }
            );
            console.log('[push] Notificación push enviada');
        } catch (error) {
            console.log('[Error] enviando notificación push', error);
        }

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