import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) =>{
        if (err) return res.sendStatus(403);

        (req as any).user = user;
        next();
    });
}