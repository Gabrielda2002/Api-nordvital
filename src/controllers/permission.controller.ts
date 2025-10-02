import { NextFunction, Request, Response } from "express";
import { PermissionService } from "../services/permission.service";
import fs from "fs";
import path from "path";
import { Soportes } from "../entities/soportes";
import { AppDataSource } from "../db/conexion";
import { PermissionAttachment } from "../entities/permission-attachment";

// POST /permisos/requests
// Crea una solicitud según la categoría y políticas. Valida:
// - Fechas y horas (granularity)
// - Antigüedad (solo para VACACIONES)
// - Documentos requeridos (INCAPACIDAD, VACACIONES)
// - No solapamiento si la política lo prohíbe
// - Topes por solicitud y por año
export async function createPermissionRequest(req: Request, res: Response, next: NextFunction) {
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
      requesterId 
    } = req.body;
    const requesterIdDInamic = req.user ? (req.user as any).id : requesterId; // fallback

    // Archivo cargado en memoria por multer
    const file = (req as any).file as Express.Multer.File | undefined;

    // 1) Creamos la solicitud (sin escribir archivo aún). El servicio valida políticas y solapamientos
    const created = await service.createRequest({
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
    if (file && created) {
      const uploadsDir = path.join(__dirname, "../uploads/AttachmentsPermissions");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname) || ".pdf";
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      const fullPath = path.join(uploadsDir, filename);

      // Escribir a disco
      fs.writeFileSync(fullPath, file.buffer);

      const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));

      // Crear registro en Soportes y PermissionAttachment en una pequeña transacción separada
      await AppDataSource.transaction(async (manager) => {
        const soporte = manager.create(Soportes, {
          name: fileNameWithoutExt.normalize('NFC'),
          url: fullPath,
          size: file.size,
          type: file.mimetype,
          nameSaved: filename,
        });
        await manager.save(soporte);

        const attachment = manager.create(PermissionAttachment, {
          requestRelation: created,
          requestId: created.id,
          supportId: soporte.id,
          label: category, // etiqueta básica por categoría, puedes ajustar desde el front
          uploadedBy: requesterIdDInamic,
        } as any);
        await manager.save(attachment);
      });
    }

    return res.json(created);
  } catch (error) {
    // Si algo falla luego de haber escrito el archivo, intentamos limpiar (best-effort)
    try {
      const file = (req as any).file as Express.Multer.File | undefined;
      if (file) {
        const uploadsDir = path.join(__dirname, "../uploads/AttachmentsPermissions");
        const pattern = `${file.fieldname}-`; // no sabemos el nombre final si falló antes, omitimos delete agresivo
        // Best-effort: no eliminamos por patrón para evitar borrar otros archivos; si necesitas cleanup exacto, mueve escritura dentro de la misma transacción con una tabla staging
      }
    } catch (_) { /* ignore */ }
    next(error);
  }
}

// GET /permisos/requests/:id
// Devuelve la solicitud con steps y adjuntos
export async function getPermissionRequestById(req: Request, res: Response, next: NextFunction) {
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
export async function actOnPermissionStep(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, stepId } = req.params;
    const { action, comment } = req.body as { action: "approve" | "reject" | "ack"; comment?: string };
    if (!action || !["approve", "reject", "ack"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const actorUserId = req.user ? (req.user as any).id : req.body.actorUserId;
    if (!actorUserId) return res.status(401).json({ message: "Missing actor user" });

    const service = new PermissionService();
    const result = await service.actOnStep(parseInt(id), parseInt(stepId), actorUserId, action, comment);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}


