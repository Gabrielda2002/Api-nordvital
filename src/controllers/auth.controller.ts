import { NextFunction, Request, Response } from "express";
import { Usuarios } from "../entities/usuarios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TokenService } from "../services/TokenService";
import dotenv from "dotenv";
import { time } from "console";

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { dniNumber, password } = req.body;

    // Buscar el usuario por dniNumber
    const user = await Usuarios.createQueryBuilder("usuario")
      .leftJoinAndSelect("usuario.sedeRelation", "sede")
      .leftJoinAndSelect("sede.municipioRelation", "municipio")
      .leftJoinAndSelect("usuario.cargoRelation", "cargo")
      .leftJoinAndSelect("cargo.areaRelation", "area")
      .leftJoinAndSelect("usuario.rolesRelation", "rol")
      .where("usuario.dniNumber = :dniNumber", { dniNumber })
      .getOne();

    const passwordMatch = await bcrypt.compare(password, user?.password || "");

    // Validar el usuario y la contraseña
    if (!user || !passwordMatch) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    // validar que el usuario este activo
    if (user.status === false) {
      return res.status(401).json({ message: "Usuario inactivo" });
    }

    // Generar el token JWT
    const accessToken = TokenService.genereteAccessTocken({
      id: user.id,
      dniNumber: user.dniNumber,
      rol: user.rol,
    });

    const refreshToken = TokenService.generateRefreshToken(user.id);
    await TokenService.saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo enviar cookies seguras en producción
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      accessToken,
      Municipio: user.sedeRelation?.municipioRelation.id,
      rol: user.rol,
      user: {
        id: user.id,
        dniNumber: user.dniNumber,
        email: user.email,
        name: user.name,
        lastname: user.lastName,
        rol: user.rolesRelation?.name,
        status: user.status,
        photo: user.photo,
        phone: user.phoneNumber,
        municipality: user.sedeRelation?.municipioRelation?.name,
        area: user.cargoRelation?.areaRelation?.name || "No asignada",
        position: user.cargoRelation?.name,
        headquarters: user.sedeRelation?.name,
        headquartersId: user?.sedeRelation?.id,
        contractType: user.contractType,
        dateStartContract: user.dateStartContract,
        managerName: user.cargoRelation?.areaRelation?.managerRelation?.name || "No asignado",
        managerLastName: user.cargoRelation?.areaRelation?.managerRelation?.lastName || "No asignado",
      },
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No se proporcionó un token de actualización",
      });
    }

    const tokenData = await TokenService.verifyAccessToken(refreshToken);

    if (!tokenData) {
      return res.status(401).json({
        message: "Token de actualización inválido o expirado",
      });
    }

    const newAccessToken = TokenService.genereteAccessTocken({
      id: tokenData.userRelation.id,
      dniNumber: tokenData.userRelation.dniNumber,
      rol: tokenData.userRelation.rol,
    });

    // * crea el nuevo token
    const newRefreshToken = TokenService.generateRefreshToken(
      tokenData.userRelation.id
    );

    // * revoca el token anterior y guarda el nuevo
    await TokenService.revokeAllUserTokens(tokenData.userRelation.id);
    await TokenService.saveRefreshToken(
      tokenData.userRelation.id,
      newRefreshToken
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo enviar cookies seguras en producción
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      accessToken: newAccessToken,
      message: "Token de acceso renovado exitosamente",
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.cookies)
    const { refreshToken } = req.cookies;


    if (!refreshToken) {
      return res.status(401).json({
        message: "No se proporcionó un token de actualización",
      });
    }

    res.clearCookie("refreshToken");
    res.json({
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
        
        const userId = req.user?.id;

        if (userId) {
            await TokenService.revokeAllUserTokens(userId);
        }

        res.clearCookie("refreshToken");
        res.json({
            message: "Todas las sesiones cerradas exitosamente",
        });

    } catch (error) {
        next(error);
    }
}

// stats tokens 
export async function getStatsTokens(req: Request, res: Response, next: NextFunction) {
  try {

    const stats = await TokenService.getTokensStats();

    const response = {
      statistics: {
        total: stats.total,
        active: stats.active,
        expired: stats.expired,
      },
      timestamp: new Date().toISOString(),
    }
    
  res.json(response);

  } catch (error) {
    next(error);
  }
}