import { NextFunction, Request, Response } from "express";
import { PermissionService } from "../services/permission.service";
import fs from "fs";
import path from "path";
import { Soportes } from "../entities/soportes";
import { AppDataSource } from "../db/conexion";
import { PermissionAttachment } from "../entities/permission-attachment";
import { FileTokenService } from "../services/file-token.service";
import { NotificationService } from "../services/notificationService";

// POST /permisos/requests
// Crea una solicitud según la categoría y políticas. Valida:
// - Fechas y horas (granularity)
// - Antigüedad (solo para VACACIONES)
// - Documentos requeridos (INCAPACIDAD, VACACIONES)
// - No solapamiento si la política lo prohíbe
// - Topes por solicitud y por año
export async function createPermissionRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const service = new PermissionService();
    const {
      category,
      granularity,
      startDate,
      endDate,
      startTime,
      endTime,
      nonRemunerated,
      compensationTime,
      notes,
      requesterId,
    } = req.body;
    const requesterIdDInamic = req.user ? (req.user as any).id : requesterId; // fallback

    // Archivo cargado en memoria por multer
    const file = (req as any).file as Express.Multer.File | undefined;

    // 1) Creamos la solicitud (sin escribir archivo aún). El servicio valida políticas y solapamientos
    const result = await service.createRequest({
      category,
      granularity,
      requesterId: requesterIdDInamic,
      startDate,
      endDate,
      startTime,
      endTime,
      nonRemunerated,
      compensationTime,
      notes,
      deferredAttachment: !!file,
      // attachments los manejaremos abajo tras guardar a disco
    } as any);

    // 2) Si hay archivo, persistirlo ahora que la solicitud fue creada con éxito
    if (file && result.success && result.data) {
      const uploadsDir = path.join(
        __dirname,
        "../uploads/AttachmentsPermissions"
      );
      if (!fs.existsSync(uploadsDir))
        fs.mkdirSync(uploadsDir, { recursive: true });

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname) || ".pdf";
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      const fullPath = path.join(uploadsDir, filename);

      // Escribir a disco
      fs.writeFileSync(fullPath, file.buffer);

      const fileNameWithoutExt = path.basename(
        file.originalname,
        path.extname(file.originalname)
      );

      // Crear registro en Soportes y PermissionAttachment en una pequeña transacción separada
      await AppDataSource.transaction(async (manager) => {
        const soporte = manager.create(Soportes, {
          name: fileNameWithoutExt.normalize("NFC"),
          url: fullPath,
          size: file.size,
          type: file.mimetype,
          nameSaved: filename,
        });
        await manager.save(soporte);

        const attachment = manager.create(PermissionAttachment, {
          requestRelation: result.data,
          requestId: result.data.id,
          supportId: soporte.id,
          label: category, // etiqueta básica por categoría, puedes ajustar desde el front
          uploadedBy: requesterIdDInamic,
        } as any);
        
        await manager.save(attachment);
      });
    } else if(!result.success) {
      return res.status(result.statusCode).json({ message: result.error });
    }

    if (result.data.category != "VACACIONES") {
      await NotificationService.createNotification(
        result.data.stepsRelation[0].approverUserId || 0,
        "Solicitud de permiso creada",
        `Tienes una nueva solicitud de permiso de ${result.data.requesterRelation.name}`,
        result.data.id,
        "PERMISSION_REQUEST"
      )
    }else {
      await NotificationService.createNotificationForRole(
        [18],
        "Solicitud de permiso creada",
        `Tienes una nueva solicitud de permiso de ${result.data.requesterRelation.name}`,
        result.data.id,
        "PERMISSION_REQUEST"
      )
    }


    return res.status(201).json(result.data);
  } catch (error) {
    // Si algo falla luego de haber escrito el archivo, intentamos limpiar (best-effort)
    try {
      const file = (req as any).file as Express.Multer.File | undefined;
      if (file) {
        const uploadsDir = path.join(
          __dirname,
          "../uploads/AttachmentsPermissions"
        );
        const pattern = `${file.fieldname}-`; // no sabemos el nombre final si falló antes, omitimos delete agresivo
        // Best-effort: no eliminamos por patrón para evitar borrar otros archivos; si necesitas cleanup exacto, mueve escritura dentro de la misma transacción con una tabla staging
      }
    } catch (_) {
      /* ignore */
    }
    next(error);
  }
}

// GET /permisos/requests/:id
// Devuelve la solicitud con steps y adjuntos
export async function getPermissionRequestById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const service = new PermissionService();
    const found = await service.getRequestById(parseInt(id));
    if (!found) return res.status(404).json({ message: "Request not found" });
    return res.json(found);
  } catch (error) {
    next(error);
  }
}

// POST /permisos/requests/:id/steps/:stepId/actions
// Acciona un paso: approve | reject | ack
// Autorización:
// - JEFE: solo el usuario asignado en el paso
// - RRHH: cualquier usuario con rol RRHH (por implementar chequeo de rol)
export async function actOnPermissionStep(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, stepId } = req.params;
    const { action, comment } = req.body as {
      action: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "VISTO";
      comment?: string;
    };
    if (
      !action ||
      !["PENDIENTE", "APROBADO", "RECHAZADO", "VISTO"].includes(action)
    ) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const actorUserId = req.user ? (req.user as any).id : req.body.actorUserId;
    if (!actorUserId)
      return res.status(401).json({ message: "Missing actor user" });

    const service = new PermissionService();
    const result = await service.actOnStep(
      parseInt(id),
      parseInt(stepId),
      actorUserId,
      action,
      comment
    );

    await NotificationService.createNotification(
      result.request.requesterId,
      "Actualización de solicitud de permiso",
      `Tu solicitud de permiso ha sido ${action.toLowerCase()} por ${result.step.approverUserRelation?.name}`,
      result.request.id,
      "PERMISSION_REQUEST"
    )

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

// GET /list/requests
// listar solicitudes por jefe o si el rol del usuario es rrhh
export async function listPermissionRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id as number;
    const userRol = req.user?.rol;

    const service = new PermissionService();
    const request = await service.listRequestsForUser(
      userId,
      userRol == "18" ? true : false
    );

    return res.status(200).json(request);
  } catch (error) {
    next(error);
  }
}

// GET /list/requests/user
// listar todas las solicitudes del usuario autenticado
export async function listAllRequestsByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id as number;
    const service = new PermissionService();
    const requests = await service.listAllRequestsByUser(userId);
    return res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
}

// POST /attachments/:id/access-token
// Genera un token temporal para acceder a un adjunto de permiso de forma segura
export async function generatePermissionAttachmentAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { action } = req.query;

    const user = (req as any).user;
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";

    const attachmentId = parseInt(id);
    const actionType = (action as string)?.toUpperCase() as "VIEW" | "DOWNLOAD";

    if (
      !attachmentId ||
      !actionType ||
      !["VIEW", "DOWNLOAD"].includes(actionType)
    ) {
      return res.status(400).json({
        message:
          "ID de adjunto y acción requeridos. Acción debe ser VIEW o DOWNLOAD",
      });
    }

    const attachmentExists = await Soportes.findOne({
      where: { id: attachmentId },
    });
    if (!attachmentExists) {
      return res.status(404).json({ message: "Adjunto no encontrado" });
    }

    // token temporal usando el ID del adjunto como fileId
    const token = FileTokenService.generateFileAccessToken(
      attachmentId,
      user.id,
      user.rol,
      actionType,
      clientIP,
      15
    );

    return res.status(200).json({
      token,
      expiresIn: 900,
      url: `/api/v1/secure-attachment/${token}`,
      action: actionType,
    });
  } catch (error) {
    next(error);
  }
}

// GET /secure-attachment/:token
export async function serveSecurePermissionAttachment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token } = req.params;
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";

    if (!token) {
      return res.status(400).json({ message: "El token es requerido" });
    }

    const validation = FileTokenService.validateFileAccessToken(
      token,
      clientIP
    );

    if (!validation.valid) {
      return res
        .status(403)
        .json({
          message: "Token inválido o expirado",
          error: validation.error,
        });
    }

    const { fileId, action }    = validation.payload!;

    const attachment = await Soportes.findOne({ where: { id: fileId } });
    console.log("adjuntos", attachment);
    if (!attachment) {
      return res.status(404).json({ message: "Adjunto no encontrado" });
    }

    const filePath = attachment.url;

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "Archivo no encontrado en el servidor" });
    }

    if (action === "DOWNLOAD") {
      res.download(filePath, attachment.nameSaved, (err) => {
        if (err) {
          res.status(500).json({ message: "Error al descargar el archivo" });
        }
      });
    } else {
      const stat = fs.statSync(filePath);

      res.setHeader("Content-Length", stat.size);
      res.setHeader("Content-Type", attachment.type);
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on("error", (err) => {
        console.error("Error streaming adjunto:", err);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error al cargar el adjunto" });
        }
      });
    }
  } catch (error) {
    next(error);
  }
}
