import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { PermissionService } from "../services/permission.service";

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
      attachments,
      requesterId 
    } = req.body;
    const requesterIdDInamic = req.user ? (req.user as any).id : requesterId; // fallback

    const created = await service.createRequest({
      category: category,
      granularity: granularity,
      requesterId: requesterIdDInamic,
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      nonRemunerated: nonRemunerated,
      compensationTime: compensationTime,
      notes: notes,
      attachments: attachments,
    });

    return res.json(created);
  } catch (error) {
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


