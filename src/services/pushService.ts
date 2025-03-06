import webpush from 'web-push';
import { PushSubscription } from '../entities/push-subscription';

export class PushService{
    static async initialize(){
        const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
        const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

        if (!PUBLIC_KEY || !PRIVATE_KEY) {
            console.log('VAPID keys are not set');
            return;
        }

        webpush.setVapidDetails(
            'mailto:contacto@nordvitalips.com',
            PUBLIC_KEY,
            PRIVATE_KEY
        );
    }

    static async sendPushNotification(userId: number, title: string, body: string, data: any = {}){
        try {
            const subscriptions = await PushSubscription.createQueryBuilder('subscription')
            .where('subscription.userId = :userId', { userId })
            .getMany();

            if (!subscriptions.length) {
                console.log('No subscriptions found');
                return;
            }

            const payload = JSON.stringify({
                title,
                body, // Cambiar body a message para compatibilidad
                url: data.ticketId ? `/tickets/${data.ticketId}` : undefined,
                data // Mantener data para compatibilidad futura
              });

            console.log(`[push] enviando notificaciones a ${subscriptions.length}`)

            // enviar notificacion a cada suscripcion
            const results = await Promise.allSettled(
                subscriptions.map(async (sub, index) => {
                    try {
                        const subscriptionObject = JSON.parse(sub.subscription);

                        await webpush.sendNotification(subscriptionObject, payload);
                        return true;

                    } catch (error) {
                        console.log('Error sending push notification', error);

                        if (error && typeof error === 'object' && 'statusCode' in error) {
                            // Si es error 410 (suscripción expirada) o 404 (no encontrada)
                            const statusCode = (error as any).statusCode;
                            if (statusCode === 410 || statusCode === 404) {
                                console.log(`[Push] Eliminando suscripción inválida #${index+1}`);
                                await PushSubscription.remove(sub);
                            }
                        }

                        return false;
                    }
                })
            )

            const successCount = results.filter(r => r.status === 'fulfilled' && r.value === true).length;

            return results;

        } catch (error) {
            console.log('Error sending push notification', error);
            return false;
        }
    }
}