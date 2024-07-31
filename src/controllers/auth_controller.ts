import { NextFunction, Request, Response } from "express";
import { Usuarios } from "../entities/usuarios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function login(req: Request, res: Response, next: NextFunction){

    try {
        
        const { dniNumber, password } = req.body;

        // * Validar que el usuario exista
        const user = await Usuarios.findOneBy({ dniNumber });

        if(!user || !await bcrypt.compare(password, user.password) ) return res.sendStatus(401).json({message: "Usuario o contraseña incorrectos"});

        const token = jwt.sign({id: user.id, dniNumber: user.dniNumber}, JWT_SECRET, {expiresIn: '1h'});

        res.json({token});        
    } catch (error) {
        next(error);
    }

}