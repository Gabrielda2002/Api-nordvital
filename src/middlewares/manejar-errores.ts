import { NextFunction, Request, Response } from "express";

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction){
    console.log(error);

    if (res.headersSent) {
        return next(error);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(statusCode).json({ message });   
}