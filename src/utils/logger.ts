import { createLogger, format, transport, transports } from "winston";

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
        new transports.File({ filename: 'logs/error.log', level: 'error'}),
        new transports.File({ filename: 'logs/combined.log'})
    ],
})

export default logger;