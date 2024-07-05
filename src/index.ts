import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./db/conexion";

try {

    AppDataSource.initialize();

    const PUERTO =  process.env.PORT || 3600;
    app.listen(PUERTO, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PUERTO}`);
    });
} catch (error) {
    console.log(`Ha ocurrido un error al iniciar el servidor: ${error}`);
}

