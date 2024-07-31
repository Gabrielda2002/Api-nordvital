import { NextFunction, Request, Response } from "express";
import { Usuarios } from "../entities/usuarios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { dniNumber, password } = req.body;
        console.log(dniNumber, password);

        // Buscar el usuario por dniNumber
        const user = await Usuarios.findOneBy({ dniNumber });
        console.log(user);


        const passwordMatch = await bcrypt.compare(password, user?.password || '');

        console.log(passwordMatch);

        // Validar el usuario y la contraseña
        if (!user || !passwordMatch) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user.id, dniNumber: user.dniNumber }, JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token al cliente
        res.json({ token });
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
}
