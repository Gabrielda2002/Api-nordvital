import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

// * Middleware para autenticar a los usuarios
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "No se ha proporcionado el encabezado de autorizacion.",
    });
  }

  const token = authHeader.substring(7);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token no proporcionado.", code: "NO_TOKEN" });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        let code = "INVALID_TOKEN";
        if (err.name === "TokenExpiredError") {
          code = "TOKEN_EXPIRED";
        }

        console.log("Error al verificar el token:", err.message);
        console.log("Token:", token);

        return res.status(401).json({
          message: "Token no válido o expirado.",
          code: code,
        });
      }

      if (decoded) {
        req.user = decoded as JwtPayload & { rol: string | number };
        return next(); // Asegúrate de que next() esté dentro del bloque if para el caso exitoso
      }

      res
        .status(403)
        .json({ message: "Token no válido.", code: "INVALID_TOKEN" });
    }
  );
}
