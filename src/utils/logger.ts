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

// Formato personalizado más compacto con separadores visuales
const customFormat = format.printf(({ timestamp, level, message, method, url, body, error }) => {
    // Crear separador visual basado en el nivel del log
    const separatorChar = level === 'error' ? '!' : level === 'warn' ? '*' : '-';
    const separator = `\n${separatorChar.repeat(80)}\n`;
    
    let logMessage = `${separator}[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
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
    // Añadir separador de cierre
    logMessage += `\n${separatorChar.repeat(80)}`;
    
    return logMessage;
});

// Formato especial para consola con colores mejorados
const consoleFormat = format.printf(({ timestamp, level, message, method, url, body, error }) => {
    // Crear un separador visual más llamativo para la consola
    let separator;
    switch (level) {
        case 'error':
            separator = '\n\x1b[31m' + '!'.repeat(80) + '\x1b[0m\n'; // Rojo
            break;
        case 'warn':
            separator = '\n\x1b[33m' + '*'.repeat(80) + '\x1b[0m\n'; // Amarillo
            break;
        case 'info':
            separator = '\n\x1b[36m' + '-'.repeat(80) + '\x1b[0m\n'; // Cyan
            break;
        case 'http':
            separator = '\n\x1b[34m' + '~'.repeat(80) + '\x1b[0m\n'; // Azul
            break;
        default:
            separator = '\n\x1b[90m' + '-'.repeat(80) + '\x1b[0m\n'; // Gris
    }
    
    let logMessage = `${separator}[${timestamp}] \x1b[1m${level.toUpperCase()}\x1b[0m: ${message}`;
    
    // Añadir información HTTP si está disponible
    if (method) {
        logMessage += `\n  \x1b[1m${method}\x1b[0m ${url}`;
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
    
    // Añadir información de error si está disponible
    // if (error) {
    //     logMessage += `\n  \x1b[31mError: ${error.message}\x1b[0m`;
    //     if (error.stack) {
    //         logMessage += `\n  Stack: ${error.stack.split('\n').slice(0, 3).join('\n  ')}`;
    //     }
    // }
    
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
        // Console transport - solo para desarrollo con formato especial para consola
        ...(isDevelopment ? [
            new transports.Console({
                format: format.combine(
                    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                    format.errors({ stack: true }),
                    filterSensitiveInfo(),
                    consoleFormat
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