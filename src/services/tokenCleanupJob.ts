import cron from 'node-cron';
import logger from '../utils/logger';
import { TokenService } from './TokenService';

export class TokenCleanupJob {
    
    static start() {
        // Schedule the job to run every day at 3 AM
        cron.schedule(" 0 3 * * *", async () => {
            try {
                
                logger.info('Starting token cleanup job...');

                const statsBefore = await TokenService.getTokensStats();

                logger.info('Token stats before cleanup:', {
                    total: statsBefore.total,
                    expired: statsBefore.expired,
                    active: statsBefore.active
                })

                await TokenService.clearExpiredTokens();

                const statsAfter = await TokenService.getTokensStats();
                const tokensRemoved = statsBefore.total - statsAfter.total;

                logger.info('Token stats after cleanup:', {
                    total: statsAfter.total,
                    expired: statsAfter.expired,
                    active: statsAfter.active,
                    tokensRemoved
                });

                logger.info('Token cleanup job completed successfully.');

            } catch (error) {
                logger.error('Error in token cleanup job:', error);
            }
        })
    }

}