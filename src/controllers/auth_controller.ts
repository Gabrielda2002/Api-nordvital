import { NextFunction, Request, Response } from "express";
import { Usuarios } from "../entities/usuarios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { dniNumber, password } = req.body;

        // Buscar el usuario por dniNumber
        const user = await Usuarios.createQueryBuilder("usuario")
        .leftJoinAndSelect("usuario.sedeRelation", "sede")
        .leftJoinAndSelect("sede.municipioRelation", "municipio")
        .where("usuario.dniNumber = :dniNumber", { dniNumber })
        .getOne();

        const passwordMatch = await bcrypt.compare(password, user?.password || '');

        // Validar el usuario y la contraseña
        if (!user || !passwordMatch) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        // validar que el usuario este activo
        if (user.status === false) {
            return res.status(401).json({ message: "Usuario inactivo" });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user.id, dniNumber: user.dniNumber, rol: user.rol }, JWT_SECRET, { expiresIn: '5h' });

        // Enviar el token al cliente
        res.json({  token,Municipio: user.sedeRelation?.municipioRelation?.id,rol: user.rol , user: {
            id: user.id,
            dniNumber: user.dniNumber,
            email: user.email,
            name: user.name,
            lastname: user.lastName,
            rol: user.rol,
            status: user.status,
            photo: user.photo,
            phone: user.phoneNumber,
            municipality: user.sedeRelation?.municipioRelation?.name,
            area: user.area,
            position: user.position,
            headquarters: user.sedeRelation?.name,
        } ,message: "Inicio de sesión exitoso" });
    } catch (error) {
        next(error);
    }
}
