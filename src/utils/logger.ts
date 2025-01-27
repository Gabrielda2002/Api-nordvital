import { createLogger, format, transport, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const custonFormat = format.printf(({ timestamp, level, message, stack}) => {
    return `
    [${timestamp}] ${level.toUpperCase()}:
    ${message}
    ${stack ? `\nStack Trace:\n${stack}` : ""}
    `;
})

const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: format.combine(
        format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        format.errors({stack: true}),
        custonFormat
    ),

    transports:[
        new transports.Console(),
        new DailyRotateFile({
            filename: "logs/error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxSize: "20m",
            maxFiles: "14d",
        }),
        new DailyRotateFile({
            filename: "logs/combined-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
        })
    ],
})

export default logger;