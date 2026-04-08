import cron from 'node-cron';
import logger from '@core/utils/logger';
import { NotificationService } from './notification.service';

export class NotificationsCleanupJob {

    static start() {
        logger.info('Notifications cleanup scheduled: every Monday at 3am');
        // todos los lunes a las 3am
        cron.schedule("0 3 * * 1", async () => {
            try {

                logger.info('Starting notifications cleanup job...');

                const statsBefore = await NotificationService.countUnreadNotifications();

                logger.info('Notifications stats before cleanup:', {
                    total: statsBefore
                });

                await NotificationService.markOldNotificationsAsRead(8);

                const statsAfter = await NotificationService.countUnreadNotifications();

                logger.info('Notifications stats after cleanup:', {
                    total: statsAfter,
                    notificationsMarkedAsRead: statsBefore - statsAfter
                });

                logger.info('Notifications cleanup job completed successfully', {
                    before: statsBefore,
                    after: statsAfter,
                    marked: statsBefore - statsAfter
                });

            } catch (error) {
                logger.error('Error in notifications cleanup job:', error);
            }
        }, {
            timezone: 'America/Bogota'
        })
    }

}
