// src/services/notification-service.ts
import { io } from "../app";
import { EncuestasSatisfaccion } from "../entities/encuestas-satisfaccion";
import { Notification } from "../entities/notificaciones";
import { Tickets } from "../entities/tickets";
import { Usuarios } from "../entities/usuarios";
import { PushService } from "./push.service";

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

    console.log("emitiendo notificacion ");
    console.log(
      `[Socket.io] Emitiendo notificación a sala user_${ticket.userId}:`,
      notification
    );
    io.to(`user_${ticket.userId}`).emit(`newNotification`, notification);

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
      console.log("[push] Notificación push enviada");
    } catch (error) {
      console.log("[Error] enviando notificación push", error);
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

    console.log("emitiendo notificacion ");
    console.log(
      `[Socket.io] Emitiendo notificación a sala user_${userId}:`,
      notification
    );
    io.to(`user_${userId}`).emit(`newNotification`, notification);

    // Enviar notificación push
    try {
      await PushService.sendPushNotification(
        userId,
        title,
        message,
        {}
      );
      console.log("[push] Notificación push enviada");
    } catch (error) {
      console.log("[Error] enviando notificación push", error);
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
        console.log("No users found for role", roleIds);
        return;
      }

      console.log(
        `[ENVIANDO NOTIFICACIONES A ${users.length} usuarios con el rol ${roleIds} const user of users]`
      );

      roleIds.forEach(r => {
        io.to(`role_${r}`).emit("newNotification", {
          title,
          message,
          referenceId,
          referenceType,
        });
      })      

      for (const user of users) {
        const notification = new Notification();
        notification.userId = user.id;
        notification.title = title;
        notification.message = message;
        notification.referenceId = referenceId;
        notification.referenceType = referenceType;
        notification.isRead = false;

        await notification.save();

        await PushService.sendPushNotification(user.id, title, message, {
          ticketId: referenceId,
          notificationId: notification.id,
          type: referenceType,
        });
      }
    } catch (error) {}
  }
}
