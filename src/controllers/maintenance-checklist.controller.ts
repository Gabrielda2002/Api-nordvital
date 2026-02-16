import { NextFunction, Request, Response } from "express";
import { MaintenanceChecklistItem } from "../entities/maintenance-checklist-item";
import { MaintenanceChecklistResult } from "../entities/maintenance-checklist-result";
import { seguimientoEquipos } from "../entities/seguimiento-equipos";
import { validate } from "class-validator";

/**
 * Obtiene todos los ítems activos del checklist maestro
 */
export async function getChecklistItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const items = await MaintenanceChecklistItem.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" },
    });

    return res.json(items);
  } catch (error) {
    next(error);
  }
}

/**
 * Obtiene el checklist completo de un seguimiento de equipo específico
 */
export async function getChecklistByFollowUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const seguimientoId = parseInt(String(req.params.seguimientoId));

    // Verificar que el seguimiento existe
    const seguimiento = await seguimientoEquipos.findOneBy({
      id: seguimientoId,
    });

    if (!seguimiento) {
      return res.status(404).json({
        message: "Seguimiento de equipo no encontrado",
      });
    }

    // Obtener los resultados del checklist con los ítems relacionados
    const results = await MaintenanceChecklistResult.find({
      where: { seguimientoEquipoId: seguimientoId },
      relations: ["checklistItemRelation"],
      order: { checklistItemRelation: { displayOrder: "ASC" } },
    });

    return res.json(results);
  } catch (error) {
    next(error);
  }
}

/**
 * Guarda/actualiza el checklist de un seguimiento
 * Body: { items: Array<{ checklistItemId: number, isChecked: boolean }> }
 */
export async function saveChecklist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const seguimientoId = parseInt(String(req.params.seguimientoId));
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: "El campo 'items' debe ser un array",
      });
    }

    // Verificar que el seguimiento existe y es de tipo MANTENIMIENTO PREVENTIVO
    const seguimiento = await seguimientoEquipos.findOneBy({
      id: seguimientoId,
    });

    if (!seguimiento) {
      return res.status(404).json({
        message: "Seguimiento de equipo no encontrado",
      });
    }

    if (seguimiento.eventType !== "MANTENIMIENTO PREVENTIVO") {
      return res.status(400).json({
        message:
          "El checklist solo está disponible para seguimientos de tipo MANTENIMIENTO PREVENTIVO",
      });
    }

    const savedResults = [];

    // Procesar cada ítem
    for (const item of items) {
      const { checklistItemId, isChecked } = item;

      // Buscar si ya existe un resultado para este ítem
      let result = await MaintenanceChecklistResult.findOneBy({
        seguimientoEquipoId: seguimientoId,
        checklistItemId: checklistItemId,
      });

      if (!result) {
        // Crear nuevo resultado
        result = new MaintenanceChecklistResult();
        result.seguimientoEquipoId = seguimientoId;
        result.checklistItemId = checklistItemId;
      }

      // Actualizar el estado
      result.isChecked = isChecked;
      result.checkedAt = isChecked ? new Date() : null;

      const errors = await validate(result);
      if (errors.length > 0) {
        const message = errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        }));
        return res.status(400).json({ message });
      }

      await result.save();
      savedResults.push(result);
    }

    return res.json({
      message: "Checklist guardado exitosamente",
      results: savedResults,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Alterna el estado de un ítem del checklist (checked/unchecked)
 */
export async function toggleChecklistItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const resultId = parseInt(String(req.params.resultId));

    const result = await MaintenanceChecklistResult.findOneBy({
      id: resultId,
    });

    if (!result) {
      return res.status(404).json({
        message: "Ítem del checklist no encontrado",
      });
    }

    // Toggle del estado
    result.isChecked = !result.isChecked;
    result.checkedAt = result.isChecked ? new Date() : null;

    await result.save();

    return res.json(result);
  } catch (error) {
    next(error);
  }
}
