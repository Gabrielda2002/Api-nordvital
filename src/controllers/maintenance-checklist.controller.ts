import { NextFunction, Request, Response } from "express";
import { MaintenanceChecklistItem } from "../entities/maintenance-checklist-item";
import { MaintenanceChecklistResult } from "../entities/maintenance-checklist-result";
import { seguimientoEquipos } from "../entities/seguimiento-equipos";
import { validate } from "class-validator";
import { AccesoriosEquipos } from "../entities/accesorios-equipos";
import { MaintenanceAccessoryObservation } from "../entities/MaintenanceAccessoryObservation";

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
    const monitoringId = parseInt(String(req.params.id));

    // Verificar que el seguimiento existe
    const seguimiento = await seguimientoEquipos.findOneBy({
      id: monitoringId,
    });

    if (!seguimiento) {
      return res.status(404).json({
        message: "Seguimiento de equipo no encontrado",
      });
    }

    const equipmentId = seguimiento.equipmentId;

    const equipmentAccessories = await AccesoriosEquipos.createQueryBuilder("accessory")
    .select(["accessory.id", "accessory.name"])
    .where("accessory.equipmentId = :equipmentId", { equipmentId })
    .getMany();

    // Obtener los resultados del checklist con los ítems relacionados
    const results = await MaintenanceChecklistResult.createQueryBuilder("result")
      .leftJoinAndSelect("result.checklistItemRelation", "item")
      .where("result.seguimientoEquipoId = :monitoringId", { monitoringId })
      .orderBy("item.displayOrder", "ASC")
      .getMany();

    return res.json({
      checklist: results,
      accessories: equipmentAccessories,
    });
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

  const queryRunner = MaintenanceChecklistResult.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const monitoringId = parseInt(String(req.params.id));
    const { checklist, accessories } = req.body;

    console.log(req.body)

    if (!Array.isArray(accessories)) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({
        message: "El campo 'accessories' debe ser un array",
      });
    }

    if (!Array.isArray(checklist)) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({
        message: "El campo 'checklist' debe ser un array",
      });
    }

    // Verificar que el seguimiento existe y es de tipo MANTENIMIENTO PREVENTIVO
    const seguimiento = await seguimientoEquipos.findOneBy({
      id: monitoringId,
    });

    if (!seguimiento) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({
        message: "Seguimiento de equipo no encontrado",
      });
    }

    if (seguimiento.eventType !== "MANTENIMIENTO PREVENTIVO") {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({
        message:
          "El checklist solo está disponible para seguimientos de tipo MANTENIMIENTO PREVENTIVO",
      });
    }

    const savedResults = [];

    // Procesar cada ítem
    for (const item of checklist) {
      const { checklistItemId, isChecked } = item;

      // Buscar si ya existe un resultado para este ítem
      let result = await MaintenanceChecklistResult.findOneBy({
        seguimientoEquipoId: monitoringId,
        checklistItemId: checklistItemId,
      });

      if (!result) {
        // Crear nuevo resultado
        result = new MaintenanceChecklistResult();
        result.seguimientoEquipoId = monitoringId;
        result.checklistItemId = checklistItemId;
      }

      // Actualizar el estado
      result.isChecked = isChecked;
      result.checkedAt = isChecked ? new Date() : null;

      const errors = await validate(result);
      if (errors.length > 0) {
        const message = errors.map((err) =>
          Object.values(err.constraints || {}).join(", ")
        );
        await queryRunner.rollbackTransaction();
        return res.status(400).json({ message });
      }

      await queryRunner.manager.save(result);
      savedResults.push(result);
    }

    for (const acc of accessories) {
      const { status, observation, id } = acc;

      const accObservation = new MaintenanceAccessoryObservation();

      accObservation.monitoringEquipmentId = monitoringId;
      accObservation.accessoryIdId = id;
      accObservation.statusMaintenance = status;
      accObservation.observation = observation;

      const errors = await validate(accObservation);
      if (errors.length > 0) {
        const message = errors.map(err => (
          Object.values(err.constraints || {}).join(", ")
        ))
        await queryRunner.rollbackTransaction();
        return res.status(400).json({ message });
      }

      await queryRunner.manager.save(accObservation);

    }

    await queryRunner.commitTransaction();

    return res.json({
      message: "Checklist guardado exitosamente",
      results: savedResults,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
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
