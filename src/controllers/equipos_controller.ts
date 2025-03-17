import { NextFunction, Request, Response } from "express";
import { Equipos } from "../entities/equipos";
import { validate } from "class-validator";
import { Soportes } from "../entities/soportes";
import path from "path";

export async function getAllEquipments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const equipments = await Equipos.find();
    return res.json(equipments);
  } catch (error) {
    next(error);
  }
}

export async function getEquipment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const equipment = await Equipos.findOneBy({ id: parseInt(id) });

    if (!equipment) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    return res.json(equipment);
  } catch (error) {
    next(error);
  }
}

export async function createEquipment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Iniciar una transacción para asegurar la atomicidad
  const queryRunner = Equipos.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const {
      sedeId,
      name,
      area,
      typeEquipment,
      brand,
      model,
      serial,
      operationalSystem,
      addressIp,
      mac,
      purchaseDate,
      warrantyTime,
      warranty,
      deliveryDate,
      inventoryNumber,
      dhcp,
      managerId,
      lock,
      codeLock
    } = req.body;

    const file = req.file;
    console.log(req.file)
    let documentId: number | null = null;

    // Procesar el documento si existe
    if (file) {
      const docExist = await Soportes.findOneBy({ nameSaved: path.basename(file.filename) });

      if (docExist) {
        return res.status(409).json({
          message: "El documento ya existe",
        });
      }

      const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));

      const document = Soportes.create({
        name: fileNameWithoutExt.normalize('NFC'),
        url: file.path,
        size: file.size,
        type: file.mimetype,
        nameSaved: path.basename(file.filename)
      });

      const errorsDoc = await validate(document);

      if (errorsDoc.length > 0) {
        const message = errorsDoc.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        }));
        return res.status(400).json({ message });
      }

      // Guardar el documento dentro de la transacción
      await queryRunner.manager.save(document);
      documentId = document.id;
    }

    // Crear y configurar el equipo
    const equipment = new Equipos();
    equipment.sedeId = parseInt(sedeId);
    equipment.name = name;
    equipment.ubicacion = "Sin ubicación";
    equipment.typeEquipment = typeEquipment;
    equipment.brand = brand;
    equipment.model = model;
    equipment.serial = serial;
    equipment.operationalSystem = operationalSystem;
    equipment.addressIp = addressIp || "DHCP";
    equipment.mac = mac;
    equipment.purchaseDate = purchaseDate;
    equipment.warrantyTime = warrantyTime || "Sin garantía";
    equipment.warranty = warranty === "true";
    equipment.deliveryDate = deliveryDate;
    equipment.inventoryNumber = inventoryNumber;
    equipment.dhcp = dhcp === "true";
    equipment.idUsuario = managerId || null;
    equipment.lock = lock === "true";
    equipment.lockKey = codeLock ? parseInt(codeLock) : null;
    
    // Asignar el ID del documento guardado, no el filename
    equipment.docId = documentId;

    const errors = await validate(equipment);

    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      // Revertir la transacción si hay errores de validación
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message });
    }

    // Guardar el equipo dentro de la transacción
    await queryRunner.manager.save(equipment);
    
    // Confirmar la transacción
    await queryRunner.commitTransaction();
    
    return res.json(equipment);
  } catch (error) {
    // Revertir la transacción en caso de error
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    // Liberar el queryRunner
    await queryRunner.release();
  }
}

export async function updateEquipment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const {
      name,
      typeEquipment,
      brand,
      model,
      serial,
      operationalSystem,
      addressIp,
      mac,
      purchaseDate,
      warrantyTime,
      warranty,
      deliveryDate,
      // inventoryNumber,
      dhcp,
      managerId,
      lock,
      codeLock
    } = req.body;

    const equipment = await Equipos.findOneBy({ id: parseInt(id) });

    if (!equipment) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    console.log(equipment)

    equipment.name = name;
    equipment.ubicacion = "Sin ubicación" ;
    equipment.typeEquipment = typeEquipment;
    equipment.brand = brand;
    equipment.model = model;
    equipment.serial = serial;
    equipment.operationalSystem = operationalSystem;
    equipment.addressIp = addressIp;
    equipment.mac = mac;
    equipment.purchaseDate = purchaseDate;
    equipment.warrantyTime = warrantyTime;
    equipment.warranty = warranty == "true";
    equipment.deliveryDate = deliveryDate;
    // equipment.inventoryNumber = inventoryNumber;
    equipment.dhcp = dhcp == "true";
    equipment.idUsuario = managerId || null;
    equipment.lock = lock == "true";
    equipment.lockKey = parseInt(codeLock) || null;

    const errors = await validate(equipment);

    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res.status(400).json({ message });
    }

    await equipment.save();
    return res.json(equipment);
  } catch (error) {
    next(error);
  }
}

export async function deleteEquipment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const equipment = await Equipos.findOneBy({ id: parseInt(id) });

    if (!equipment) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    await equipment.remove();
    return res.json({
      message: "Equipo eliminado",
    });
  } catch (error) {
    next(error);
  }
}

// buscar equipor por sede
export async function getEquipmentBySede(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const equipment = await Equipos.createQueryBuilder("equipos")
    .leftJoinAndSelect("equipos.seguimientoEquipos", "seguimientoEquipos")
    .leftJoinAndSelect("equipos.accessoriesRelation", "accesoriosEquipos")
    .leftJoinAndSelect("equipos.componentRelation", "componentRelation")
    .leftJoinAndSelect("equipos.softwareRelation", "softwareRelation")
    .leftJoinAndSelect("equipos.userRelation", "equipmentUser")
    .leftJoinAndSelect("seguimientoEquipos.userRelation", "user")
    .where("equipos.sedeId = :sedeId", { sedeId: parseInt(id) })
    .getMany();

    if (!equipment) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    return res.json(equipment);
  } catch (error) {
    next(error);
  }
}