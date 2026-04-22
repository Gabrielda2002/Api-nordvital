// src/services/notification-service.ts
import { io } from "../../../app";
import { EncuestasSatisfaccion } from "../../hr/entities/encuestas-satisfaccion";
import { Notification } from "../entities/notificaciones";
import { Tickets } from "../../tickets/entities/tickets";
import { Usuarios } from "../../auth/entities/usuarios";
import { PushService } from "./push.service";
import Logger from "@core/utils/logger-wrapper";

export class NotificationService {
  /**
    * Crea una notificación para un usuario cuando un ticket se cierra
    */
  static async createTicketClosedNotification(
    ticket: Tickets,
    title: string
  ): Promise<Notification> {
    const notification = new Notification();
    notification.userId = ticket.userId;
    notification.title = title;
    notification.message = `Se actualizó el estado de tu ticket "${ticket.title}".`;
    notification.referenceId = ticket.id;
    notification.referenceType = "update_ticket";
    notification.isRead = false;

    await notification.save();

    io.to(`user_${ticket.userId}`).emit(`newNotification`, notification);
    Logger.info(`[Socket.io] Notificación emitida a sala user_${ticket.userId}`);

    // Enviar notificación push
    try {
      await PushService.sendPushNotification(
        ticket.userId,
        notification.title,
        notification.message,
        {
          ticketId: ticket.id,
          notificationId: notification.id,
          type: "ticket_closed",
        }
      );
    } catch (error) {
      Logger.error("[PushService] Error enviando notificación push", error);
    }

    return notification;
  }

  // ? crear notificacion para cualquier uso
  static async createNotification(
    userId: number,
    title: string,
    message: string,
    referenceId: number,
    referenceType: string
  ): Promise<Notification> {
    const notification = new Notification();
    notification.userId = userId;
    notification.title = title;
    notification.message = message;
    notification.referenceId = referenceId;
    notification.referenceType = referenceType;
    notification.isRead = false;

    await notification.save();

    io.to(`user_${userId}`).emit(`newNotification`, notification);
    Logger.info(`[Socket.io] Notificación emitida a sala user_${userId}`);

    // Enviar notificación push
    try {
      await PushService.sendPushNotification(userId, title, message, {});
    } catch (error) {
      Logger.error("[PushService] Error enviando notificación push", error);
    }

    return notification;
  }

  /**
    * Obtiene todas las notificaciones de un usuario
    */
  static async getUserNotifications(userId: number): Promise<Notification[]> {
    const notifications = await Notification.createQueryBuilder("notification")
      .where("notification.user_id = :userId", { userId })
      .andWhere("notification.is_read = :isRead", { isRead: false })
      .orderBy("notification.created_at", "DESC")
      .getMany();

    // validar si ticket tiene encuestra registrada y si la tiene no mostrar notificacion
    for (const notification of notifications) {
      const encuestas = await EncuestasSatisfaccion.createQueryBuilder(
        "encuestaSatisfaccion"
      )
        .where("encuestaSatisfaccion.ticketId = :referenceId", {
          referenceId: notification.referenceId,
        })
        .getOne();
      // si hay una encuesta para el ticket no returnar la notificacion
      if (encuestas) {
        notification.isRead = true;
        await notification.save();
      }
    }

    return notifications;
  }

  // Contar notificaciones no leidas
  static async countUnreadNotifications(): Promise<number> {
    return await Notification.createQueryBuilder("notification")
      .where("notification.is_read = :isRead", { isRead: false })
      .getCount();
  }

  /**
    * Marca una notificación como leída
    */
  static async markAsRead(
    notificationId: number
  ): Promise<Notification | null> {
    const notification = await Notification.findOneBy({ id: notificationId });
    if (!notification) return null;

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  static async createNotificationForRole(
    roleIds: number[],
    title: string,
    message: string,
    referenceId: number,
    referenceType: string
  ): Promise<void> {
    try {
      const users = await Usuarios.createQueryBuilder("usuario")
        .where("usuario.rol IN (:...roleIds)", { roleIds })
        .getMany();

      if (!users.length) {
        Logger.warn(`[NotificationService] No users found for roles: ${roleIds}`);
        return;
      }

      Logger.info(`[NotificationService] Enviando notificaciones a ${users.length} usuarios con roles ${roleIds}`);

      for (const user of users) {
        const notification = new Notification();
        notification.userId = user.id;
        notification.title = title;
        notification.message = message;
        notification.referenceId = referenceId;
        notification.referenceType = referenceType;
        notification.isRead = false;

        await notification.save();

        io.to(`user_${user.id}`).emit("newNotification", notification);
        Logger.info(`[Socket.io] Notificación emitida a sala user_${user.id}`);

        try {
          await PushService.sendPushNotification(user.id, title, message, {
            ticketId: referenceId,
            notificationId: notification.id,
            type: referenceType,
          });
        } catch (pushError) {
          Logger.error(`[PushService] Error enviando push al usuario ${user.id}`, pushError);
        }
      }
    } catch (error) {
      Logger.error("[NotificationService] Error en createNotificationForRole", error);
    }
  }

  // eliminar notificaciones antiguas (mas de 90 dias)
  static async deleteOldNotifications(days: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    await Notification.createQueryBuilder()
      .delete()
      .where("created_at < :cutoffDate", { cutoffDate })
      .execute();
  }

  // marcar notificaciones de ciertos dias como leidas
  static async markOldNotificationsAsRead(days: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    await Notification.createQueryBuilder()
      .update()
      .set({ isRead: true })
      .where("is_read = :isRead", { isRead: false })
      .andWhere("created_at < :cutoffDate", { cutoffDate })
      .execute();
  }
}
