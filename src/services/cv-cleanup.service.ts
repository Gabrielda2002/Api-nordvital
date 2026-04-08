import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import cron from 'node-cron';
import Logger from '@core/utils/logger-wrapper';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

/**
 * Servicio para limpiar automáticamente CVs antiguos
 * 
 * Características:
 * - Elimina CVs mayores a 60 días (configurable)
 * - Se ejecuta diariamente a las 2:00 AM
 * - Registra todas las operaciones
 * - Manejo seguro de errores
 */
export class CVCleanupService {
    private static isRunning = false;
    private static readonly DEFAULT_MAX_AGE_DAYS = 60;
    private static readonly CV_DIRECTORY = path.resolve(__dirname, '..', 'uploads', 'FilesEmails');

    /**
     * Inicia el servicio de limpieza automática
     * 
     * @param maxAgeDays - Días máximos que debe tener un CV para ser eliminado (por defecto 60)
     */
    static startCleanupService(maxAgeDays: number = this.DEFAULT_MAX_AGE_DAYS) {
        console.log(`🧹 Iniciando servicio de limpieza de CVs (eliminar archivos > ${maxAgeDays} días)`);

        // Programar ejecución diaria a las 2:00 AM
        cron.schedule('0 2 * * *', async () => {
            await this.cleanupOldCVs(maxAgeDays);
        }, {
            timezone: "America/Bogota" // Ajusta según tu timezone
        });

        console.log('📅 Limpieza de CVs programada: todos los días a las 2:00 AM');
    }

    /**
     * Ejecuta la limpieza de CVs antiguos
     * 
     * @param maxAgeDays - Días máximos de antigüedad permitidos
     * @returns Estadísticas de la limpieza
     */
    static async cleanupOldCVs(maxAgeDays: number = this.DEFAULT_MAX_AGE_DAYS) {
        if (this.isRunning) {
            console.log('⏳ Limpieza de CVs ya en ejecución, omitiendo...');
            return;
        }

        this.isRunning = true;
        const startTime = Date.now();

        console.log(`🧹 Iniciando limpieza de CVs antiguos (> ${maxAgeDays} días)...`);

        const stats = {
            totalFiles: 0,
            oldFiles: 0,
            deletedFiles: 0,
            failedFiles: 0,
            errors: [] as string[],
            freedSpace: 0 // en bytes
        };

        try {
            // Verificar que el directorio existe
            if (!fs.existsSync(this.CV_DIRECTORY)) {
                console.log(`📁 Directorio de CVs no existe: ${this.CV_DIRECTORY}`);
                return stats;
            }

            const files = await readdir(this.CV_DIRECTORY);
            stats.totalFiles = files.length;

            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);

            console.log(`📂 Encontrados ${files.length} archivos en ${this.CV_DIRECTORY}`);
            console.log(`📅 Eliminando archivos anteriores a: ${cutoffDate.toLocaleDateString()}`);

            for (const filename of files) {
                try {
                    const filepath = path.join(this.CV_DIRECTORY, filename);
                    const fileStats = await stat(filepath);

                    // Solo procesar archivos (no directorios)
                    if (!fileStats.isFile()) {
                        continue;
                    }

                    // Verificar si el archivo es más antiguo que el cutoff
                    if (fileStats.mtime < cutoffDate) {
                        stats.oldFiles++;

                        try {
                            // Registrar el tamaño antes de eliminar
                            stats.freedSpace += fileStats.size;

                            await unlink(filepath);
                            stats.deletedFiles++;

                            console.log(`🗑️ Eliminado: ${filename} (${this.formatFileSize(fileStats.size)}) - Fecha: ${fileStats.mtime.toLocaleDateString()}`);

                        } catch (deleteError) {
                            stats.failedFiles++;
                            const errorMsg = `Error eliminando ${filename}: ${deleteError}`;
                            stats.errors.push(errorMsg);
                            console.error(`❌ ${errorMsg}`);
                        }
                    }

                } catch (statError) {
                    const errorMsg = `Error obteniendo stats de ${filename}: ${statError}`;
                    stats.errors.push(errorMsg);
                    console.error(`❌ ${errorMsg}`);
                }
            }

            const duration = Date.now() - startTime;

            console.log(`✅ Limpieza de CVs completada en ${duration}ms:`);
            console.log(`   📁 Archivos totales: ${stats.totalFiles}`);
            console.log(`   📅 Archivos antiguos encontrados: ${stats.oldFiles}`);
            console.log(`   🗑️ Archivos eliminados: ${stats.deletedFiles}`);
            console.log(`   ❌ Archivos con error: ${stats.failedFiles}`);
            console.log(`   💾 Espacio liberado: ${this.formatFileSize(stats.freedSpace)}`);

            if (stats.errors.length > 0) {
                console.log(`   ⚠️ Errores: ${stats.errors.length}`);
            }

        } catch (error) {
            console.error(`❌ Error fatal en limpieza de CVs: ${error}`);
            stats.errors.push(`Error fatal: ${error}`);
        } finally {
            this.isRunning = false;
        }

        return stats;
    }

    /**
     * Ejecuta limpieza manual (para testing o mantenimiento)
     */
    static async manualCleanup(maxAgeDays: number = this.DEFAULT_MAX_AGE_DAYS) {
        console.log('🔧 Ejecutando limpieza manual de CVs...');
        return await this.cleanupOldCVs(maxAgeDays);
    }

    /**
     * Obtiene estadísticas del directorio de CVs sin eliminar archivos
     */
    static async getCVDirectoryStats(): Promise<{
        totalFiles: number;
        totalSize: number;
        oldestFile?: { name: string; date: Date; size: number };
        newestFile?: { name: string; date: Date; size: number };
    }> {
        const stats = {
            totalFiles: 0,
            totalSize: 0,
            oldestFile: undefined as any,
            newestFile: undefined as any
        };

        try {
            if (!fs.existsSync(this.CV_DIRECTORY)) {
                return stats;
            }

            const files = await readdir(this.CV_DIRECTORY);

            for (const filename of files) {
                try {
                    const filepath = path.join(this.CV_DIRECTORY, filename);
                    const fileStats = await stat(filepath);

                    if (!fileStats.isFile()) continue;

                    stats.totalFiles++;
                    stats.totalSize += fileStats.size;

                    const fileInfo = {
                        name: filename,
                        date: fileStats.mtime,
                        size: fileStats.size
                    };

                    if (!stats.oldestFile || fileStats.mtime < stats.oldestFile.date) {
                        stats.oldestFile = fileInfo;
                    }

                    if (!stats.newestFile || fileStats.mtime > stats.newestFile.date) {
                        stats.newestFile = fileInfo;
                    }

                } catch (error) {
                    console.error(`Error procesando archivo ${filename}:`, error);
                }
            }

        } catch (error) {
            console.error('Error obteniendo estadísticas de CVs:', error);
        }

        return stats;
    }

    /**
     * Formatea tamaños de archivo de manera legible
     */
    private static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Starts the automatic attachment cleanup service
     *
     * @param maxAgeDays - Maximum age in days before an attachment is deleted (default 180)
     */
    static startAttachmentCleanupService(maxAgeDays: number = 180) {
        Logger.info(`🧹 Starting attachment cleanup service (delete files > ${maxAgeDays} days)`);

        // Run on the 1st of every month at 3:00 AM
        cron.schedule('0 3 1 * *', async () => {
            await this.cleanupOldAttachments(maxAgeDays);
        }, {
            timezone: 'America/Bogota'
        });

        Logger.info('📅 Attachment cleanup scheduled: 1st of every month at 3:00 AM');
    }

    /**
     * Cleans up ticket attachment files older than maxAgeDays.
     * Uses DB createdAt as the reference date, then removes the physical file
     * and the DB record.
     *
     * @param maxAgeDays - Maximum age in days (default 180 = 6 months)
     */
    static async cleanupOldAttachments(maxAgeDays: number = 180) {
        if (this.isRunning) {
            Logger.info('⏳ Attachment cleanup already running, skipping...');
            return;
        }

        this.isRunning = true;
        const startTime = Date.now();

        const ATTACHMENTS_DIRECTORY = path.resolve(__dirname, '..', 'uploads', 'tickets');

        Logger.info(`🧹 Starting attachment cleanup (> ${maxAgeDays} days)...`);

        const stats = {
            totalRecords: 0,
            deletedFiles: 0,
            missingFiles: 0,
            failedFiles: 0,
            deletedRecords: 0,
            errors: [] as string[],
            freedSpace: 0
        };

        try {
            const { TicketAttachment } = await import('../modules/tickets/entities/ticket-attachment');

            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);

            Logger.info(`📅 Deleting attachments created before: ${cutoffDate.toLocaleDateString()}`);

            const oldAttachments = await TicketAttachment.createQueryBuilder('ta')
                .where('ta.created_at < :cutoffDate', { cutoffDate })
                .getMany();

            stats.totalRecords = oldAttachments.length;

            if (oldAttachments.length === 0) {
                Logger.info('✅ No old attachments found.');
                return stats;
            }

            Logger.info(`📂 Found ${oldAttachments.length} old attachment records to delete.`);

            for (const attachment of oldAttachments) {
                const filePath = path.join(ATTACHMENTS_DIRECTORY, attachment.fileNameSaved);

                try {
                    if (fs.existsSync(filePath)) {

                        const fileStats = await stat(filePath);
                        stats.freedSpace += fileStats.size;
                        await unlink(filePath);
                        stats.deletedFiles++;
                        Logger.info(`🗑️ Deleted file: ${attachment.fileNameSaved} (${this.formatFileSize(fileStats.size)})`);
                    } else {
                        stats.missingFiles++;
                        Logger.info(`⚠️ File not found on disk (already removed?): ${attachment.fileNameSaved}`);
                    }

                    await TicketAttachment.delete(attachment.id);
                    stats.deletedRecords++;

                } catch (fileError) {
                    stats.failedFiles++;
                    const errorMsg = `Error processing attachment id=${attachment.id} (${attachment.fileNameSaved}): ${fileError}`;
                    stats.errors.push(errorMsg);
                    console.error(`❌ ${errorMsg}`);
                }
            }

            const duration = Date.now() - startTime;

            Logger.info(`✅ Attachment cleanup completed in ${duration}ms:`);
            Logger.info(`   📋 Total records found: ${stats.totalRecords}`);
            Logger.info(`   🗑️ Files deleted: ${stats.deletedFiles}`);
            Logger.info(`   ⚠️ Files missing on disk: ${stats.missingFiles}`);
            Logger.info(`   ❌ Errors: ${stats.failedFiles}`);
            Logger.info(`   🗃️ DB records removed: ${stats.deletedRecords}`);
            Logger.info(`   💾 Space freed: ${this.formatFileSize(stats.freedSpace)}`);

        } catch (error) {
            Logger.info(`❌ Fatal error in attachment cleanup: ${error}`);
            stats.errors.push(`Fatal error: ${error}`);
        } finally {
            this.isRunning = false;
        }

        return stats;
    }

}
