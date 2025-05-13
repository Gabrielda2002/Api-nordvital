import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Filtro para eliminar datos sensibles o muy grandes
const sensitiveFields = ['password', 'token', 'authorization'];
const filterSensitiveInfo = format((info) => {
    if (info.body) {
        const filtered: Record<string, any> = { ...info.body };
        sensitiveFields.forEach(field => {
            if (filtered[field]) {
                filtered[field] = '[REDACTED]';
            }
        });
        info.body = filtered;
    }
    return info;
});

// Formato personalizado más compacto
const customFormat = format.printf(({ timestamp, level, message, method, url, body, error }) => {
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    // Añadir información HTTP si está disponible
    if (method) {
        logMessage += `\n  ${method} ${url}`;
    }
    
    // Añadir cuerpo de la petición solo si existe y no está vacío
    if (body && Object.keys(body).length > 0) {
        const bodyStr = JSON.stringify(body);
        // Solo incluir el cuerpo si no es demasiado grande
        if (bodyStr.length < 1000) {
            logMessage += `\n  Body: ${bodyStr}`;
        } else {
            logMessage += `\n  Body: [Large payload - ${bodyStr.length} chars]`;
        }
    }
    
    return logMessage;
});

// Determinar el entorno actual
const isDevelopment = process.env.NODE_ENV !== 'production';

// Configuraciones comunes para archivos rotatorios
const rotateFileConfig = {
    datePattern: "YYYY-MM-DD",
    zippedArchive: !isDevelopment, // Comprimir archivos en producción
    maxSize: "10m",
    maxFiles: isDevelopment ? "3d" : "14d" // Menos días en desarrollo
};

// Logger principal
const logger = createLogger({
    level: isDevelopment ? "debug" : "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        filterSensitiveInfo(),
        customFormat
    ),
    transports: [
        // Console transport - solo para desarrollo
        ...(isDevelopment ? [
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    customFormat
                )
            })
        ] : []),
        
        // Error logs - siempre activos
        new DailyRotateFile({
            filename: "logs/error-%DATE%.log",
            level: "error",
            ...rotateFileConfig
        }),
        
        // Combined logs
        new DailyRotateFile({
            filename: "logs/combined-%DATE%.log",
            ...rotateFileConfig
        }),
        
        // Logs de API en producción - separados para mejor análisis
        ...(isDevelopment ? [] : [
            new DailyRotateFile({
                filename: "logs/api-%DATE%.log",
                level: "http",
                ...rotateFileConfig
            })
        ])
    ]
});

export default logger;