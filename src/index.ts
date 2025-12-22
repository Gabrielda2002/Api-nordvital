import "reflect-metadata";
import server from "./app";
import { AppDataSource } from "./db/conexion";
import { PushService } from "./services/push.service";
import { TokenCleanupJob } from "./services/token-cleanup-job.service";
import { CVCleanupService } from "./services/cv-cleanup.service";
import { VacationCheckJob } from "./services/vacation-check-job.service";
import { NotificationsCleanupJob } from "./services/notifications-cleanup-job.service";
import { config } from "./config/environment.config";


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
            
            // Inicializar job de verificación de vencimientos de vacaciones
            VacationCheckJob.start();
            
            console.log('Conexión a la base de datos establecida');
        
            server.listen(config.server.port, () => {
                console.log(`Servidor corriendo en el puerto http://localhost:${config.server.port}`);
            });
        } catch (error) {
            console.log(`Ha ocurrido un error al iniciar el servidor: ${error}`);
            process.exit(1);
        }

    }
start();

