import path from "path"
import { Carpeta } from "../entities/carpeta";
import { Archivos } from "../entities/archivos";
import { createConnection } from "typeorm";
import { AppDataSource } from "../db/conexion";

function limpiarRuta(ruta: string, uploadsAbsolutePath: string): string {
  // Si contiene "uploads/", extrae solo la parte después de "uploads/"
  const idx = ruta.indexOf("uploads/");
  if (idx !== -1) {
    return ruta.substring(idx + "uploads/".length).replace(/\\/g, '/');
  }

  // Si contiene "uploads\" (por si acaso en Windows)
  const idxWin = ruta.indexOf("uploads\\");
  if (idxWin !== -1) {
    return ruta.substring(idxWin + "uploads\\".length).replace(/\\/g, '/');
  }

  // Si es absoluta y está dentro de uploads
  if (path.isAbsolute(ruta) && ruta.startsWith(uploadsAbsolutePath)) {
    return path.relative(uploadsAbsolutePath, ruta).replace(/\\/g, '/');
  }

  // Si es relativa y tiene ../ o ../../, intenta normalizar
  const partes = ruta.split(/[/\\]+/);
  const idxUploads = partes.findIndex(p => p === "uploads");
  if (idxUploads !== -1) {
    return partes.slice(idxUploads + 1).join('/');
  }

  // Si ya es relativa y no tiene ../ ni uploads, la dejamos igual
  return ruta.replace(/\\/g, '/');
}

const migratePaths = async () => {
    const uploadsAbsolutePath = path.resolve(__dirname, '../../uploads');

    await AppDataSource.initialize();

    const carpetas = await AppDataSource.getRepository(Carpeta).find();
    for(const carpeta of carpetas) {
        const nuevaRuta = limpiarRuta(carpeta.path, uploadsAbsolutePath);
        if (carpeta.path !== nuevaRuta) {
            carpeta.path = nuevaRuta;
            await AppDataSource.getRepository(Carpeta).save(carpeta);
            console.log(`Carpeta ${carpeta.id} path updated to ${carpeta.path}`);
        }
    }

    // migracion archivos
    const archivos = await AppDataSource.getRepository(Archivos).find();
    for(const archivo of archivos) {
        const nuevaRuta = limpiarRuta(archivo.path, uploadsAbsolutePath);
        if (archivo.path !== nuevaRuta) {
            archivo.path = nuevaRuta;
            await AppDataSource.getRepository(Archivos).save(archivo);
            console.log(`Archivo ${archivo.id} path updated to ${archivo.path}`);
        }
    }

    await AppDataSource.destroy();
    console.log("Migration completed successfully.");
} 

migratePaths()
  .then(() => console.log("Migration finished successfully."))
  .catch((error) => console.error("Migration failed:", error));