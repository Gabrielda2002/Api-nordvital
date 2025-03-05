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
                body,
                data
            })

            // enviar notificacion a cada suscripcion
            const results = await Promise.allSettled(
                subscriptions.map(async (sub) => {
                    try {
                        
                        const subscriptionObject = JSON.parse(sub.subscription);

                        await webpush.sendNotification(subscriptionObject, payload);
                        return true;

                    } catch (error) {
                        console.log('Error sending push notification', error);

                            await PushSubscription.remove(sub);

                        return false;
                    }
                })
            )

            return results;

        } catch (error) {
            console.log('Error sending push notification', error);
            return false;
        }
    }
}