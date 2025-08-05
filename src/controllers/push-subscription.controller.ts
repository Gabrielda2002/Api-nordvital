// src/controllers/push_controller.ts
import { NextFunction, Request, Response } from "express";
import { PushSubscription } from "../entities/push-subscription";
import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();

export async function getVapidPublicKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY;

    if (!publicKey) {
      return res
        .status(500)
        .json({ message: "VAPID public key not configured" });
    }

    return res.json({ publicKey });
  } catch (error) {
    next(error);
  }
}

export async function subscribe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, subscription } = req.body;

    if (!userId || !subscription) {
      return res
        .status(400)
        .json({ message: "User ID and subscription are required" });
    }

    // Buscar si ya existe una suscripción para este usuario y endpoint
    const existingSubscription = await PushSubscription.createQueryBuilder(
      "push_subscription"
    )
      .where("push_subscription.userId = :userId", { userId })
      .andWhere("push_subscription.subscription LIKE :endpoint", {
        endpoint: `%${subscription.endpoint}%`,
      })
      .getOne();

    if (existingSubscription) {
      // Actualizar la suscripción existente
      existingSubscription.subscription = JSON.stringify(subscription);
      await existingSubscription.save();
      return res.json({ message: "Subscription updated" });
    }

    // Crear nueva suscripción
    const newSubscription = new PushSubscription();
    newSubscription.userId = userId;
    newSubscription.subscription = JSON.stringify(subscription);

    await newSubscription.save();

    return res.status(201).json({ message: "Subscription saved" });
  } catch (error) {
    next(error);
  }
}

export async function unsubscribe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, endpoint } = req.body;

    if (!userId || !endpoint) {
      return res
        .status(400)
        .json({ message: "User ID and endpoint are required" });
    }

    // Buscar la suscripción
    const subscriptions = await PushSubscription.createQueryBuilder(
      "push_subscription"
    )
      .where("push_subscription.userId = :userId", { userId })
      .andWhere("push_subscription.subscription LIKE :endpoint", {
        endpoint: `%${endpoint}%`,
      })
      .getMany();

    if (subscriptions.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Eliminar suscripciones
    for (const subscription of subscriptions) {
      await subscription.remove();
    }

    return res.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    next(error);
  }
}

export async function sendTestPush(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const subscriptions = await PushSubscription.find({
      where: { userId: parseInt(userId) },
    });

    if (subscriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No subscriptions found for this user" });
    }

    const payload = JSON.stringify({
      title: "Test Notification",
      body: "Esta es una notificación de prueba",
      data: {
        type: "test_notification",
        time: new Date().toISOString(),
      },
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(JSON.parse(sub.subscription), payload);
          return true;
        } catch (error) {
          console.error("Error sending test push:", error);

          // Verificar el tipo de error antes de acceder a sus propiedades
          // Usar aserción de tipo (ten cuidado, esto puede causar errores en tiempo de ejecución)
          const webPushError = error as { statusCode?: number };
          if (webPushError.statusCode === 410) {
            await PushSubscription.remove(sub);
          }

          throw error;
        }
      })
    );

    return res.json({
      message: "Test notifications sent",
      results: results.map((r) => r.status),
    });
  } catch (error) {
    next(error);
  }
}
