import { NextFunction, query, Request, Response } from "express";
import { Equipos } from "../entities/equipos";
import { validate } from "class-validator";
import { Soportes } from "../entities/soportes";
import path from "path";
import fs from "fs";

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

  const queryRunner= Equipos.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

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

    // procesar el archivo si existe
    if (req.file) {
      if (equipment.docId) {
        const oldDocument = await Soportes.findOneBy({ id: equipment.docId });
        if (oldDocument) {
          // Eliminar el archivo antiguo
          console.log("id doc antiguo" + oldDocument.id)
          if (fs.existsSync(oldDocument.url)) {
            fs.unlinkSync(oldDocument.url);
          }
          
          await queryRunner.manager.remove(oldDocument);
          console.log("se elimina el archivo viejo")
        }
      }
      const file = req.file;
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

      await queryRunner.manager.save(document);

      equipment.docId = document.id

      console.log("se asigna un nuevo id" + document.id)

    }

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
      // Revertir la transacción si hay errores de validación
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message });
    }

    await queryRunner.manager.save(equipment);
    await queryRunner.commitTransaction();

    return res.json(equipment);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    next(error);
  }finally{
    await queryRunner.release();
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
    .leftJoinAndSelect('equipos.soportRelacion', 'document')
    .leftJoinAndSelect("seguimientoEquipos.userRelation", "user")
    .where("equipos.sedeId = :sedeId", { sedeId: parseInt(id) })
    .getMany();

    if (!equipment) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    const equipmentFormatted = equipment.map(e => ({
      id: e.id || 'N/A',
      sedeId: e.sedeId || 'N/A',
      nameEquipment: e.name || 'N/A',
      area: e.ubicacion || 'N/A',
      typeEquipment: e.typeEquipment || 'N/A',
      brandEquipment: e.brand || 'N/A',
      modelEquipment: e.model || 'N/A',
      serialEquipment: e.serial || 'N/A',
      operationalSystem: e.operationalSystem || 'N/A',
      addressIp: e.addressIp || 'N/A',
      mac: e.mac || 'N/A',
      purchaseDate: e.purchaseDate || 'N/A',
      warrantyTime: e.warrantyTime || 'N/A',
      warranty: e.warranty || 'N/A',
      deliveryDate: e.deliveryDate || 'N/A',
      inventoryNumberEquipment: e.inventoryNumber || 'N/A',
      dhcp: e.dhcp || 'N/A',
      lock: e.lock === false ? false : true,
      lockKey: e.lockKey || 'N/A',
      createAt: e.createAt || 'N/A',
      updateAt: e.updateAt || 'N/A',
      idUser: e.userRelation?.id || 'N/A',
      nameUser: e.userRelation?.name || 'N/A',
      lastNameUser: e.userRelation?.lastName || 'N/A',
      processEquipment: e.seguimientoEquipos?.map(s => ({
        id: s.id || 'N/A',
        dateEvent: s.eventDate || 'N/A',
        eventType: s.eventType || 'N/A',
        description: s.description || 'N/A',
        responsableLastName: s.userRelation?.name || 'N/A',
        responsableName: s.userRelation?.lastName || 'N/A',
      })),
      accessories: e.accessoriesRelation?.map(a => ({
        id: a.id || 'N/A',
        name: a.name || 'N/A',
        brand: a.brand || 'N/A',
        model: a.model || 'N/A',
        serial: a.serial || 'N/A',
        description: a.otherData || 'N/A',
        status: a.status || 'N/A',
        inventoryNumber: a.inventoryNumber || 'N/A',
      })),
      components: e.componentRelation?.map(c => ({
        id: c.id || 'N/A',
        name: c.name || 'N/A',
        brand: c.brand || 'N/A',
        capacity: c.capacity || 'N/A',
        speed: c.speed || 'N/A',
        otherData: c.otherData || 'N/A',
        model: c.model || 'N/A',
        serial: c.serial || 'N/A',
      })),
      software: e.softwareRelation?.map(s => ({
        id: s.id || 'N/A',
        name: s.name || 'N/A',
        versions: s.versions || 'N/A',
        license: s.license || 'N/A',
        otherData: s.otherData || 'N/A',
        installDate: s.installDate || 'N/A',
        status: s.status || 'N/A',
      })),
      nameDocument: e.soportRelacion?.nameSaved || 'N/A',
    }))

    return res.json(equipmentFormatted);
  } catch (error) {
    next(error);
  }
}