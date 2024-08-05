import rateLimit from "express-rate-limit";
import logger from "../utils/logger";


export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    handler: (req, res, options) => { // * configuración para el mensaje de error con winston
        logger.warn(`Too many requests from this IP: ${req.ip}`);
        res.status(429).json({ message: "Limite de solicitudes alcanzado." });
    }
})