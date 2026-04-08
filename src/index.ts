import "reflect-metadata";
import server from "./app";
import { AppDataSource } from "@core/db/conexion";
import { PushService, NotificationsCleanupJob } from "./modules/notifications";
import { TokenCleanupJob } from "./services/token-cleanup-job.service";
import { CVCleanupService } from "./services/cv-cleanup.service";
import { VacationCheckJob } from "./services/vacation-check-job.service";
import { config } from "@core/config/environment.config";
import Logger from "@core/utils/logger-wrapper";


    const start = async () => {

        try {
        
            await PushService.initialize();

            await AppDataSource.initialize();

            // job marcar notificaciones antiguas como leídas
            NotificationsCleanupJob.start(); 

            // job cleanup de tokens revokes
            TokenCleanupJob.start();
            
            // Inicializar servicio de limpieza de CVs (elimina CVs > 60 días)
            CVCleanupService.startCleanupService(60);

            // start job of cleanup attachments > 180 days
            CVCleanupService.startAttachmentCleanupService(180);
            
            // Inicializar job de verificación de vencimientos de vacaciones
            VacationCheckJob.start();
            
            Logger.info('Conexión a la base de datos establecida');
        
            server.listen(config.server.port, () => {
                Logger.info(`Servidor corriendo en el puerto http://localhost:${config.server.port}`);
            });
        } catch (error) {
            Logger.error('Ha ocurrido un error al iniciar el servidor', error);
            process.exit(1);
        }

    }
start();

