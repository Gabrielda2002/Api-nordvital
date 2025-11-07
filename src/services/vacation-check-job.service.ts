import cron from "node-cron";
import logger from "../utils/logger";
import { VacationManagementService } from "./vacation-management.service";

export class VacationCheckJob {
  static start() {
    // Ejecutar todos los días a las 2 AM
    cron.schedule("0 2 * * *", async () => {
      try {
        logger.info("Starting vacation expiration check job...");

        const vacationService = new VacationManagementService();
        await vacationService.checkVacationExpirations();

        logger.info("Vacation expiration check job completed successfully.");
      } catch (error) {
        logger.error("Error in vacation expiration check job:", error);
      }
    });

    logger.info("Vacation check job scheduled to run daily at 2 AM");
  }
}
