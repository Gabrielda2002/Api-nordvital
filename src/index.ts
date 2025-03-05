import "reflect-metadata";
import server from "./app";
import dotenv from "dotenv";
import { AppDataSource } from "./db/conexion";
import { PushService } from "./services/pushService";


    const start = async () => {

        try {
        
            await PushService.initialize();

            await AppDataSource.initialize();
            console.log('Conexión a la base de datos establecida');
        
            const PUERTO = process.env.PORT;
            server.listen(PUERTO, () => {
                console.log(`Servidor corriendo en el puerto http://localhost:${PUERTO}`);
            });
        } catch (error) {
            console.log(`Ha ocurrido un error al iniciar el servidor: ${error}`);
            process.exit(1);
        }

    }
start();

