import fs from 'fs';
import { Soportes } from '../entities/soportes';
import { QueryRunner } from 'typeorm';

/**
 * Actualiza un archivo existente y su registro en la base de datos
 * 
 * @param queryRunner Instancia de QueryRunner para manejar transacciones
 * @param oldActaId ID del acta/soporte existente que se va a actualizar
 * @param newFileData Datos del nuevo archivo
 * @param newFilePath Ruta del nuevo archivo guardado
 * @param newFileName Nombre del nuevo archivo guardado
 * @returns El objeto Soportes actualizado
 */
export async function updateFileAndRecord(
  queryRunner: QueryRunner,
  oldActaId: number | null,
  newFileData: {
    originalName: string,
    size: number,
    mimetype: string
  },
  newFilePath: string,
  newFileName: string
): Promise<Soportes | null> {
  // Si no hay acta anterior, retornamos null
  if (!oldActaId) return null;

  try {
    // 1. Buscar el registro anterior
    const oldSoporte = await Soportes.findOneBy({ id: oldActaId });
    if (!oldSoporte) return null;

    // 2. Eliminar el archivo físico anterior
    if (oldSoporte.url && fs.existsSync(oldSoporte.url)) {
      fs.unlinkSync(oldSoporte.url);
    }

    // 3. Actualizar el registro con la nueva información
    oldSoporte.name = newFileData.originalName;
    oldSoporte.url = newFilePath;
    oldSoporte.size = newFileData.size;
    oldSoporte.type = newFileData.mimetype;
    oldSoporte.nameSaved = newFileName;

    // 4. Guardar el registro actualizado
    await queryRunner.manager.save(oldSoporte);
    
    return oldSoporte;
  } catch (error) {
    console.error('Error al actualizar archivo:', error);
    throw error;
  }
}

/**
 * Elimina un archivo y su registro en la base de datos
 * 
 * @param queryRunner Instancia de QueryRunner para manejar transacciones
 * @param actaId ID del acta/soporte a eliminar
 */
export async function deleteFileAndRecord(
  queryRunner: QueryRunner,
  actaId: number | null
): Promise<void> {
  if (!actaId) return;
  
  try {
    // 1. Buscar el registro
    const soporte = await Soportes.findOneBy({ id: actaId });
    if (!soporte) return;

    // 2. Eliminar el archivo físico
    if (soporte.url && fs.existsSync(soporte.url)) {
      fs.unlinkSync(soporte.url);
    }

    // 3. Eliminar el registro
    await queryRunner.manager.remove(soporte);
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    throw error;
  }
}