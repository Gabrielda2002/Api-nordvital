import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Usuarios } from "../../auth/entities/usuarios";
import { MoodleService } from "../services/moodle.service";
import RedisService from "../../auth/services/redis.service";
import Logger from "@core/utils/logger-wrapper";
import { config } from "@core/config/environment.config";
import { NotFoundError, ValidationError } from "@core/utils/custom-errors";

/**
 * Generar token SSO para Moodle
 * El usuario ya está autenticado en Express (middleware auth)
 */
export const generateSSOToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Usuario no autenticado" 
      });
    }

    const userExists = await Usuarios.findOne({
      where: { id: userId },
      relations: ["rolesRelation"],
    });

    if (!userExists) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuario no encontrado" 
      });
    }

    Logger.info(`Generating SSO token for user ID: ${userId}`);

    // Crear token JWT temporal
    const ssoToken = jwt.sign(
      {
        userId: userExists.id,
        email: userExists.email,
        exp: Math.floor(Date.now() / 1000) + config.moodle.ssoTokenExpiry,
      },
      config.moodle.ssoSecret
    );

    // Guardar token en Redis con expiración automática
    await RedisService.saveSSOToken(
      ssoToken, 
      userExists.id, 
      config.moodle.ssoTokenExpiry
    );

    // Construir URL de Moodle con token
    const moodleUrl = `${config.moodle.url}/auth/sso/login.php?token=${ssoToken}`;

    Logger.info(`SSO token generated for user: ${userExists.email}`);

    res.json({
      success: true,
      moodleUrl,
      expiresIn: config.moodle.ssoTokenExpiry,
    });
  } catch (error) {
    Logger.error("Error generating SSO token", error);
    next(error);
  }
};

/**
 * Validar token SSO (llamado desde Moodle)
 * Endpoint público que Moodle usará para validar el token
 */
export const validateSSOToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      Logger.info("No SSO token provided");
      throw new ValidationError("Token de SSO no proporcionado");
    }

    Logger.info(`Validating SSO token: ${token.substring(0, 20)}...`);

    // Verificar JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.moodle.ssoSecret);
    } catch (error) {
      Logger.warn("Invalid SSO token signature");
      throw new ValidationError("Token de SSO inválido");
    }

    // Obtener y consumir token de Redis (uso único)
    const userId = await RedisService.consumeSSOToken(token);

    if (!userId) {
      Logger.warn("SSO token not found or already used");
      throw new NotFoundError("Token de SSO no encontrado o ya usado");
    }

    // Obtener datos del usuario
    const usuario = await Usuarios.findOne({
      where: { id: userId },
      relations: ["rolesRelation"],
    });

    if (!usuario) {
      Logger.error(`User not found for SSO token: ${userId}`);
      throw new NotFoundError("Usuario no encontrado para el token de SSO");
    }

    Logger.info(`SSO token validated successfully for user: ${usuario.email}`);

    // Retornar datos del usuario para Moodle
    res.json({
      valid: true,
      user: {
        id: usuario.id,
        username: usuario.dniNumber.toString(),
        email: usuario.email,
        firstname: usuario.name,
        lastname: usuario.lastName,
        role: usuario.rolesRelation?.name || "user",
      },
    });
  } catch (error) {
    Logger.error("Error validating SSO token", error);
    next(error);
  }
};

/**
 * Sincronizar usuario con Moodle
 * Crea el usuario en Moodle si no existe
 */
export const syncUserToMoodle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Usuario no autenticado" 
      });
    }

    const usuario = await Usuarios.findOne({
      where: { id: userId },
      relations: ["rolesRelation"],
    });

    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuario no encontrado" 
      });
    }

    // Verificar si el usuario ya existe en Moodle
    const moodleUser = await MoodleService.getUserByEmail(usuario.email);

    if (moodleUser) {
      Logger.info(`User already exists in Moodle: ${usuario.email}`);
      return res.json({
        success: true,
        message: "Usuario ya existe en Moodle",
        moodleUserId: moodleUser.id,
      });
    }

    // Crear usuario en Moodle
    const newMoodleUser = await MoodleService.createUserInMoodle({
      username: usuario.dniNumber.toString(),
      email: usuario.email,
      firstname: usuario.name,
      lastname: usuario.lastName,
    });

    Logger.info(`User created in Moodle: ${usuario.email}, ID: ${newMoodleUser.id}`);

    res.json({
      success: true,
      message: "Usuario sincronizado con Moodle",
      moodleUserId: newMoodleUser.id,
    });
  } catch (error) {
    Logger.error("Error syncing user to Moodle", error);
    next(error);
  }
};