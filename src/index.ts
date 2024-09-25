import "reflect-metadata";
import app from "./app";
import dotenv from "dotenv";
import { AppDataSource } from "./db/conexion";

dotenv.config();

    const start = async () => {

        try {
        
            await AppDataSource.initialize();
            console.log('Conexión a la base de datos establecida');
        
            const PUERTO = 3600;
            app.listen(PUERTO, () => {
                console.log(`Servidor corriendo en el puerto http://localhost:${PUERTO}`);
            });
        } catch (error) {
            console.log(`Ha ocurrido un error al iniciar el servidor: ${error}`);
            process.exit(1);
        }

    }
start();

