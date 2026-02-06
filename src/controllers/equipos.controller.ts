import { NextFunction, Request, Response } from "express";
import { Equipos } from "../entities/equipos";
import { validate } from "class-validator";
import { Soportes } from "../entities/soportes";
import path from "path";
import fs from "fs";
import { addMonths, differenceInDays, subYears } from "date-fns";
import { Between, LessThan, MoreThan } from "typeorm";
import { saveFileToDisk } from "../middlewares/multer-delivery.middleware";
import { updateFileAndRecord } from "../utils/file-manager";
import Logger from "../utils/logger-wrapper";

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
    const id = String(req.params.id);
    const equipment = await Equipos.findOneBy({ id: parseInt(String(id)) });

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
  const queryRunner =
    Equipos.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let filePath = null;
  let fileName = null;

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
      codeLock,
    } = req.body;

    const file = req.file;
    let documentId: number | null = null;

    const serialExist = await Equipos.findOneBy({
      serial: serial,
    });

    if (serialExist) {
      return res.status(409).json({
        message: "El número de serie ya existe",
      });
    }

    // Crear y configurar el equipo
    const equipment = new Equipos();
    equipment.sedeId = parseInt(String(sedeId));
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
    equipment.lockKey = codeLock || null;

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

    // Procesar el documento si existe
    if (file) {
      const savedFile = saveFileToDisk(file.buffer, file.originalname);
      filePath = savedFile.path;
      fileName = savedFile.filename;

      const fileNameWithoutExt = path.basename(
        file.originalname,
        path.extname(file.originalname)
      );

      const docExist = await Soportes.findOneBy({
        name: fileNameWithoutExt.normalize("NFC"),
      });

      if (docExist) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        await queryRunner.rollbackTransaction();
        return res.status(409).json({
          message: "El documento ya existe",
        });
      }

      const document = Soportes.create({
        name: fileNameWithoutExt.normalize("NFC"),
        url: savedFile.path,
        size: file.size,
        type: file.mimetype,
        nameSaved: savedFile.filename,
      });

      const errorsDoc = await validate(document);

      if (errorsDoc.length > 0) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        const message = errorsDoc.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        }));
        await queryRunner.rollbackTransaction();
        return res.status(400).json({ message });
      }

      // Guardar el documento dentro de la transacción
      await queryRunner.manager.save(document);
      documentId = document.id;
    }

    // Guardar el equipo dentro de la transacción
    equipment.docId = documentId;
    await queryRunner.manager.save(equipment);

    // Confirmar la transacción
    await queryRunner.commitTransaction();

    return res.json(equipment);
  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log("Archivo eliminado:", filePath);
      } catch (error) {
        console.log("Error al eliminar el archivo:", error);
      }
    }

    next(error);
  } finally {
    await queryRunner.release();
  }
}

export async function updateEquipment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryRunner =
    Equipos.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let filePath = null;
  let fileName = null;

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
      inventoryNumber,
      dhcp,
      managerId,
      lock,
      codeLock,
      sedeId
    } = req.body;
    console.log(req.body)

    const serialExist = await Equipos.findOneBy({
      serial: serial,
    });

    if (serialExist && serialExist.id !== parseInt(String(id))) {
      return res.status(409).json({
        message: "El número de serie ya existe",
      });
    }

    const equipment = await Equipos.findOneBy({ id: parseInt(String(id)) });

    if (!equipment) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    equipment.name = name;
    equipment.ubicacion = "Sin ubicación";
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
    equipment.dhcp = dhcp == "true";
    equipment.idUsuario = managerId || null;
    equipment.lock = lock == "true";
    equipment.lockKey = codeLock || null;
    equipment.inventoryNumber = inventoryNumber;
    equipment.sedeId = parseInt(String(sedeId));

    const errors = await validate(equipment);

    if (errors.length > 0) {
      const message = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message });
    }

    const file = req.file;
    let documentId: number | null = equipment.docId;

    // procesar el archivo si existe
    if (file) {
      try {
        const savedFile = saveFileToDisk(file.buffer, file.originalname);
        filePath = savedFile.path;
        fileName = savedFile.filename;

        const fileNameWithoutExt = path.basename(
          file.originalname,
          path.extname(file.originalname)
        );
  
         const docExistByName = await Soportes.findOneBy({ name: fileNameWithoutExt.normalize("NFC") });
        
        if (docExistByName) {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          await queryRunner.rollbackTransaction();
          return res.status(409).json({
            message: "El documento ya existe",
          });
        }
        // si ya existe un documento, se actualiza sus datos con el nuevo
        if (documentId) {
          const updatedDoc = await updateFileAndRecord(
            queryRunner,
            documentId,
            {
              originalName: fileNameWithoutExt.normalize("NFC"),
              size: file.size,
              mimetype: file.mimetype,
            },
            savedFile.path,
            savedFile.filename
          );

          if (!updatedDoc) {
            documentId = null;
          }
        }

        if (!documentId) {
          
          // validar si el documento existe

          const newDoc = Soportes.create({
            name: fileNameWithoutExt.normalize("NFC"),
            url: savedFile.path,
            size: file.size,
            type: file.mimetype,
            nameSaved: savedFile.filename,
          });

          const errorsDoc = await validate(newDoc);
  
          if (errorsDoc.length > 0) {

            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }

            const message = errorsDoc.map((err) => ({
              property: err.property,
              constraints: err.constraints,
            }));

            await queryRunner.rollbackTransaction();
            return res.status(400).json({ message });

          }
          
          await queryRunner.manager.save(newDoc);
    
          documentId = newDoc.id;
    
        }
  
        equipment.docId = documentId;      
        
      } catch (error) {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw error;
      }
    }

    await queryRunner.manager.save(equipment);
    await queryRunner.commitTransaction();

    return res.json(equipment);
  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('Archivo eliminado debido a errror: ', filePath);
      } catch (error) {
        console.log('Error al eliminar el archivo:', error);
      }
    }

    next(error);
  } finally {
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
    const equipment = await Equipos.findOneBy({ id: parseInt(String(id)) });

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
      .leftJoinAndSelect("equipos.soportRelacion", "document")
      .leftJoinAndSelect("seguimientoEquipos.userRelation", "user")
      .where("equipos.sedeId = :sedeId", { sedeId: parseInt(String(id)) })
      .getMany();

    if (!equipment) {
      return res.status(404).json({
        message: "Equipo no encontrado",
      });
    }

    const equipmentFormatted = equipment.map((e) => ({
      id: e.id || "N/A",
      sedeId: e.sedeId || "N/A",
      nameEquipment: e.name || "N/A",
      area: e.ubicacion || "N/A",
      typeEquipment: e.typeEquipment || "N/A",
      brandEquipment: e.brand || "N/A",
      modelEquipment: e.model || "N/A",
      serialEquipment: e.serial || "N/A",
      operationalSystem: e.operationalSystem || "N/A",
      addressIp: e.addressIp || "N/A",
      mac: e.mac || "N/A",
      purchaseDate: e.purchaseDate || "N/A",
      warrantyTime: e.warrantyTime || "N/A",
      warranty: e.warranty === true ? true : false,
      deliveryDate: e.deliveryDate || "N/A",
      inventoryNumberEquipment: e.inventoryNumber || "N/A",
      dhcp: e.dhcp === true ? true : false,
      lock: e.lock === false ? false : true,
      lockKey: e.lockKey || "N/A",
      createAt: e.createAt || "N/A",
      updateAt: e.updateAt || "N/A",
      idUser: e.userRelation?.id || "N/A",
      nameUser: e.userRelation?.name || "N/A",
      lastNameUser: e.userRelation?.lastName || "N/A",
      processEquipment: e.seguimientoEquipos?.map((s) => ({
        id: s.id || "N/A",
        eventDate: s.eventDate || "N/A",
        typeEvent: s.eventType || "N/A",
        description: s.description || "N/A",
        responsableLastName: s.userRelation?.name || "N/A",
        responsableName: s.userRelation?.lastName || "N/A",
      })),
      accessories: e.accessoriesRelation?.map((a) => ({
        id: a.id || "N/A",
        name: a.name || "N/A",
        brand: a.brand || "N/A",
        model: a.model || "N/A",
        serial: a.serial || "N/A",
        description: a.otherData || "N/A",
        status: a.status || "N/A",
        inventoryNumber: a.inventoryNumber || "N/A",
      })),
      components: e.componentRelation?.map((c) => ({
        id: c.id || "N/A",
        name: c.name || "N/A",
        brand: c.brand || "N/A",
        capacity: c.capacity || "N/A",
        speed: c.speed || "N/A",
        description: c.otherData || "N/A",
        model: c.model || "N/A",
        serial: c.serial || "N/A",
      })),
      software: e.softwareRelation?.map((s) => ({
        id: s.id || "N/A",
        name: s.name || "N/A",
        versions: s.versions || "N/A",
        license: s.license || "N/A",
        otherData: s.otherData || "N/A",
        installDate: s.installDate || "N/A",
        status: s.status || "N/A",
      })),
      nameDocument: e.soportRelacion?.nameSaved || "N/A",
      documentId: e.soportRelacion?.id || "N/A",
    }));

    return res.json(equipmentFormatted);
  } catch (error) {
    next(error);
  }
}

// distribucion equipos por tipo
export async function getEquipmentTypeDistribution(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const { id } = req.params;

    const equipment = await Equipos.createQueryBuilder("equipos")
      .select("equipos.typeEquipment", "typeEquipment")
      .addSelect("COUNT(equipos.id)", "count")
      .groupBy("equipos.typeEquipment")
      .orderBy("count", "DESC")
      .where("equipos.sedeId = :sedeId", { sedeId: parseInt(String(id)) })
      .getRawMany();

    if (!equipment) {
      return res.status(404).json({
        message: "No se encontraron equipos",
      });
    }

    return res.json(equipment);
  } catch (error) {
    next(error);
  }
}

// distribucion por sede
export async function getEquipmentHeadquartersDistribution(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const { id } = req.params;

    const equipment = await Equipos.createQueryBuilder("equipos")
      .leftJoinAndSelect("equipos.placeRelation", "sede")
      .select("sede.name", "sedeName")
      .addSelect("COUNT(equipos.id)", "count")
      .groupBy("sede.name")
      .orderBy("count", "DESC")
      .where("sede.id = :sedeId", { sedeId: parseInt(String(id)) })
      .getRawMany();

    if (!equipment) {
      return res.status(404).json({
        message: "No se encontraron equipos",
      });
    }

    return res.json(equipment);
  } catch (error) {
    next(error);
  }
}
// obtener edada de equipos por sede
export async function getEquipmentAgeBySede(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const { id } = req.params;

    const now = new Date();
    const oneYearAgo = subYears(now, 1);
    const twoYearsAgo = subYears(now, 2);
    const threeYearsAgo = subYears(now, 3);

    const totalEquipments = await Equipos.count({ where: { sedeId: parseInt(String(id)) } });

    const lessThanOneYear = await Equipos.count({
      where: { purchaseDate: MoreThan(oneYearAgo), sedeId: parseInt(String(id)) },
    });
    const betweenOneAndTwoYears = await Equipos.count({
      where: {
        purchaseDate: Between(twoYearsAgo, oneYearAgo),
        sedeId: parseInt(String(id)),
      },
    });
    const betweenTwoAndThreeYears = await Equipos.count({
      where: {
        purchaseDate: Between(threeYearsAgo, twoYearsAgo), sedeId: parseInt(String(id))
      },
    });
    const moreThanThreeYears = await Equipos.count({
      where: {
        purchaseDate: LessThan(threeYearsAgo), sedeId: parseInt(String(id))
      },
    });

    // Cálculo de la edad promedio en días
    const equipments = await Equipos.find({ select: ["purchaseDate"], where: { sedeId: parseInt(String(id)) } });
    let totalAge = 0;
    equipments.forEach((equipment) => {
      if (equipment.purchaseDate) {
        const age = differenceInDays(now, new Date(equipment.purchaseDate));
        totalAge += age;
      }
    });
    const averageAgeInDays = totalAge / equipments.length || 0;
    const averageAgeInMonths = averageAgeInDays / 30;
    const averageAgeInYears = averageAgeInMonths / 12;

    return res.json({
      distribution: [
        { label: "Menos de 1 año", value: lessThanOneYear },
        { label: "Entre 1 y 2 años", value: betweenOneAndTwoYears },
        { label: "Entre 2 y 3 años", value: betweenTwoAndThreeYears },
        { label: "Más de 3 años", value: moreThanThreeYears },
      ],
      averageAge: {
        days: Math.round(averageAgeInDays),
        months: Math.round(averageAgeInMonths),
        years: averageAgeInYears.toFixed(1),
      },
      total: totalEquipments
    });
  } catch (error) {
    next(error);
  }
}

// estadisticas sobre garantia
export async function getEquipmentWarrantyStatistics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const { id } = req.params;

    const totalEquipments = await Equipos.count({ where: { sedeId: parseInt(String(id)) } });
    const equipmentsInWarranty = await Equipos.count({
      where: { warranty: true, sedeId: parseInt(String(id)) },
    });

    // obtener equipos con garantia para calcular fecha de vencimiento
    const equipmentWithWarranty = await Equipos.find({
      where: { warranty: true, sedeId: parseInt(String(id)) },
      select: ["id", "purchaseDate", "warrantyTime"],
    });

    const expiringWarranties = equipmentWithWarranty.filter((e) => {
      const warrantyMonths = parseInt(e.warrantyTime.match(/\d+/)?.[0] || "0");
      if (warrantyMonths > 0) {
        const expirationDate = addMonths(
          new Date(e.purchaseDate),
          warrantyMonths
        );
        const expiresSoon =
          expirationDate > new Date() &&
          expirationDate < addMonths(new Date(), 3);
        return expiresSoon;
      }
      return false;
    });

    return res.json({
      total: totalEquipments,
      inWarranty: equipmentsInWarranty,
      percentage: ((equipmentsInWarranty / totalEquipments) * 100).toFixed(2),
      expiringSoon: {
        count: expiringWarranties.length,
        equiment: expiringWarranties,
      },
    });
  } catch (error) {
    next(error);
  }
}

// estadisticas sobre equipos con candado
export async function getEquipmentLockStatistics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const { id } = req.params;

    const totalEquipments = await Equipos.count({ where: { sedeId: parseInt(String(id)) } });
    const equipmentsWithLock = await Equipos.count({ where: { lock: true, sedeId: parseInt(String(id)) } });

    return res.json({
      total: totalEquipments,
      withLock: equipmentsWithLock,
      percentage: ((equipmentsWithLock / totalEquipments) * 100).toFixed(2),
    });
  } catch (error) {
    next(error);
  }
}


export async function searchEquipmentGlobal(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return res.json([]);
    }

    const searchTerm = `%${query.trim().toLowerCase()}%`;

    const equipment = await Equipos.createQueryBuilder("equipos")
      .leftJoinAndSelect("equipos.seguimientoEquipos", "seguimientoEquipos")
      .leftJoinAndSelect("equipos.accessoriesRelation", "accesoriosEquipos")
      .leftJoinAndSelect("equipos.componentRelation", "componentRelation")
      .leftJoinAndSelect("equipos.softwareRelation", "softwareRelation")
      .leftJoinAndSelect("equipos.userRelation", "equipmentUser")
      .leftJoinAndSelect("equipos.soportRelacion", "document")
      .leftJoinAndSelect("equipos.placeRelation", "sede_equipo")
      .leftJoinAndSelect("sede_equipo.municipioRelation", "municipio_sede")
      .leftJoinAndSelect("municipio_sede.departmentRelation", "departamento_sede")
      .leftJoinAndSelect("seguimientoEquipos.userRelation", "user")
      // Aquí está la clave: usamos CONCAT y LOWER para buscar en múltiples campos
      .where(
        `(
          LOWER(equipos.name) LIKE :searchTerm OR
          LOWER(equipos.serial) LIKE :searchTerm OR
          LOWER(equipos.inventoryNumber) LIKE :searchTerm OR
          LOWER(equipos.brand) LIKE :searchTerm OR
          LOWER(equipos.model) LIKE :searchTerm OR
          LOWER(CONCAT(equipmentUser.name, ' ', equipmentUser.lastName)) LIKE :searchTerm OR
          LOWER(equipmentUser.name) LIKE :searchTerm OR
          LOWER(equipmentUser.lastName) LIKE :searchTerm OR
          LOWER(accesoriosEquipos.serial) LIKE :searchTerm
        )`,
        { searchTerm }
      )
      .orderBy("equipos.name", "ASC")
      .limit(50)
      .getMany();

    // Formatear los resultados para incluir información de departamento y sede
    const searchResults = equipment.map((e) => ({
      item: {
        id: e.id || "N/A",
        sedeId: e.sedeId || "N/A",
        nameEquipment: e.name || "N/A",
        area: e.ubicacion || "N/A",
        typeEquipment: e.typeEquipment || "N/A",
        brandEquipment: e.brand || "N/A",
        modelEquipment: e.model || "N/A",
        serialEquipment: e.serial || "N/A",
        operationalSystem: e.operationalSystem || "N/A",
        addressIp: e.addressIp || "N/A",
        mac: e.mac || "N/A",
        purchaseDate: e.purchaseDate || "N/A",
        warrantyTime: e.warrantyTime || "N/A",
        warranty: e.warranty || "N/A",
        deliveryDate: e.deliveryDate || "N/A",
        inventoryNumberEquipment: e.inventoryNumber || "N/A",
        dhcp: e.dhcp || "N/A",
        lock: e.lock === false ? false : true,
        lockKey: e.lockKey || "N/A",
        createAt: e.createAt || "N/A",
        updateAt: e.updateAt || "N/A",
        idUser: e.userRelation?.id || "N/A",
        nameUser: e.userRelation?.name || "N/A",
        lastNameUser: e.userRelation?.lastName || "N/A",
        processEquipment: e.seguimientoEquipos?.map((s) => ({
          id: s.id || "N/A",
          eventDate: s.eventDate || "N/A",
          typeEvent: s.eventType || "N/A",
          description: s.description || "N/A",
          responsableLastName: s.userRelation?.name || "N/A",
          responsableName: s.userRelation?.lastName || "N/A",
        })),
        accessories: e.accessoriesRelation?.map((a) => ({
          id: a.id || "N/A",
          name: a.name || "N/A",
          brand: a.brand || "N/A",
          model: a.model || "N/A",
          serial: a.serial || "N/A",
          description: a.otherData || "N/A",
          status: a.status || "N/A",
          inventoryNumber: a.inventoryNumber || "N/A",
        })),
        components: e.componentRelation?.map((c) => ({
          id: c.id || "N/A",
          name: c.name || "N/A",
          brand: c.brand || "N/A",
          capacity: c.capacity || "N/A",
          speed: c.speed || "N/A",
          description: c.otherData || "N/A",
          model: c.model || "N/A",
          serial: c.serial || "N/A",
        })),
        software: e.softwareRelation?.map((s) => ({
          id: s.id || "N/A",
          name: s.name || "N/A",
          versions: s.versions || "N/A",
          license: s.license || "N/A",
          otherData: s.otherData || "N/A",
          installDate: s.installDate || "N/A",
          status: s.status || "N/A",
        })),
        nameDocument: e.soportRelacion?.nameSaved || "N/A",
      },
      departmentId: e.placeRelation?.municipioRelation?.departmentRelation?.id || 0,
      departmentRelationName: e.placeRelation?.municipioRelation?.departmentRelation?.name || "N/A",
      sedeId: e.placeRelation?.id || 0,
      sedeName: e.placeRelation?.name || "N/A"
    }));

    return res.json(searchResults);
  } catch (error) {
    console.error('Error in searchEquipmentGlobal:', error);
    next(error);
  }
}


export interface EquipmentData {
  sedeId?: number;
  name: string;
  ubicacion: string;
  typeEquipment: string;
  brand: string;
  model: string;
  serial: string;
  operationalSystem: string;
  addressIp?: string;
  mac: string;
  purchaseDate?: Date;
  warrantyTime?: string;
  warranty?: boolean;
  deliveryDate?: Date;
  inventoryNumber?: string;
  dhcp?: boolean;
  lock?: boolean;
  lockKey?: string | null;
}

export interface ComponentData {
  name: string;
  brand: string;
  capacity: string;
  speed: string;
  otherData: string;
  model: string;
  serial: string;
}

export interface SoftwareData {
  name: string;
  versions: string;
  license: string;
  otherData: string;
  installDate?: Date;
  status: string;
}

export interface AccessoryData {
  name: string;
  brand: string;
  model: string;
  serial?: string;
  otherData: string;
  status: string;
  inventoryNumber?: string;
}

export interface InventoryPayload {
  equipment: EquipmentData;
  components: ComponentData[];
  software: SoftwareData[];
  // accessories: AccessoryData[];
}


/**
 * Auto-inventory endpoint
 * Creates or updates equipment with components and software based on MAC/Serial
 */
export async function autoInventory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryRunner = Equipos.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { equipment, components, software }: InventoryPayload = req.body;

    // Validar datos requeridos
    if (!equipment || !equipment.mac || !equipment.serial) {
      return res.status(400).json({
        message: "MAC y Serial son requeridos para identificar el equipo"
      });
    }

    // Buscar equipo existente por MAC o Serial
    const existingEquipment = await queryRunner.manager.findOne(Equipos, {
      where: [
        // { mac: equipment.mac }, // ? comentar con los companeros para ver si se recomienda usar la mac como identificador unico
        { serial: equipment.serial }
      ],
      relations: ['componentRelation', 'softwareRelation']
    });

    let savedEquipment: Equipos;

    if (existingEquipment) {
      // ACTUALIZAR equipo existente
      Logger.info(`Actualizando equipo existente: ${existingEquipment.id}`);

      // Actualizar solo datos técnicos, NO administrativosvale
      existingEquipment.sedeId = equipment.sedeId || existingEquipment.sedeId;
      existingEquipment.name = equipment.name || existingEquipment.name;
      existingEquipment.typeEquipment = equipment.typeEquipment || existingEquipment.typeEquipment;
      existingEquipment.brand = equipment.brand || existingEquipment.brand;
      existingEquipment.model = equipment.model || existingEquipment.model;
      existingEquipment.serial = equipment.serial || existingEquipment.serial;
      existingEquipment.operationalSystem = equipment.operationalSystem || existingEquipment.operationalSystem;
      existingEquipment.addressIp = equipment.addressIp || existingEquipment.addressIp;
      existingEquipment.mac = equipment.mac || existingEquipment.mac;
      existingEquipment.dhcp = equipment.dhcp !== undefined ? equipment.dhcp : existingEquipment.dhcp;

      // Actualizar datos administrativos SOLO si vienen en el request
      if (equipment.ubicacion) existingEquipment.ubicacion = equipment.ubicacion;
      if (equipment.inventoryNumber) existingEquipment.inventoryNumber = equipment.inventoryNumber;
      if (equipment.purchaseDate) existingEquipment.purchaseDate = new Date(equipment.purchaseDate);
      if (equipment.warrantyTime) existingEquipment.warrantyTime = equipment.warrantyTime;
      if (equipment.warranty !== undefined) existingEquipment.warranty = equipment.warranty;
      if (equipment.deliveryDate) existingEquipment.deliveryDate = new Date(equipment.deliveryDate);
      if (equipment.lock !== undefined) existingEquipment.lock = equipment.lock;
      if (equipment.lockKey) existingEquipment.lockKey = equipment.lockKey;

      // Validar antes de guardar
      const errors = await validate(existingEquipment);
      if (errors.length > 0) {
        await queryRunner.rollbackTransaction();
        const errorMessage = errors.map(e => (
          Object.values(e.constraints || {}).join(', ')
        ))
        return res.status(400).json({
          message: errorMessage
        });
      }

      savedEquipment = await queryRunner.manager.save(existingEquipment);

      // Eliminar componentes antiguos
      if (existingEquipment.componentRelation && existingEquipment.componentRelation.length > 0) {
        await queryRunner.manager.remove(existingEquipment.componentRelation);
      }

      // Eliminar software antiguo
      if (existingEquipment.softwareRelation && existingEquipment.softwareRelation.length > 0) {
        await queryRunner.manager.remove(existingEquipment.softwareRelation);
      }

    } else {
      // CREAR nuevo equipo
      Logger.info('Creando nuevo equipo');

      // Validar que venga el sedeId
      if (!equipment.sedeId) {
        await queryRunner.rollbackTransaction();
        return res.status(400).json({
          message: "El sedeId es requerido para crear un nuevo equipo"
        });
      }

      const newEquipment = new Equipos();
      newEquipment.sedeId = equipment.sedeId;
      newEquipment.name = equipment.name;
      newEquipment.ubicacion = equipment.ubicacion || 'Por definir';
      newEquipment.typeEquipment = equipment.typeEquipment;
      newEquipment.brand = equipment.brand;
      newEquipment.model = equipment.model;
      newEquipment.serial = equipment.serial;
      newEquipment.operationalSystem = equipment.operationalSystem;
      newEquipment.addressIp = equipment.addressIp || 'DHCP';
      newEquipment.mac = equipment.mac;
      newEquipment.purchaseDate = equipment.purchaseDate ? new Date(equipment.purchaseDate) : new Date();
      newEquipment.warrantyTime = equipment.warrantyTime || 'Sin garantía';
      newEquipment.warranty = equipment.warranty || false;
      newEquipment.deliveryDate = equipment.deliveryDate ? new Date(equipment.deliveryDate) : new Date();
      newEquipment.inventoryNumber = equipment.inventoryNumber || 'Por asignar';
      newEquipment.dhcp = equipment.dhcp !== undefined ? equipment.dhcp : true;
      newEquipment.idUsuario = null;
      newEquipment.lock = equipment.lock || false;
      newEquipment.lockKey = equipment.lockKey || null;
      newEquipment.docId = null;

      // Validar antes de guardar
      const errors = await validate(newEquipment);
      if (errors.length > 0) {
        await queryRunner.rollbackTransaction();

        const errorMessage = errors.map(e => (
          Object.values(e.property || {}).join(', ')
        ));

        return res.status(400).json({
          message: errorMessage
        });
      }

      savedEquipment = await queryRunner.manager.save(newEquipment);
    }

    // Crear componentes nuevos
    const savedComponents = [];
    if (components && Array.isArray(components)) {
      for (const comp of components) {
        const { Componentes } = await import("../entities/componentes");
        const newComponent = new Componentes();
        newComponent.idEquipments = savedEquipment.id;
        newComponent.name = comp.name;
        newComponent.brand = comp.brand;
        newComponent.capacity = comp.capacity;
        newComponent.speed = comp.speed;
        newComponent.otherData = comp.otherData;
        newComponent.model = comp.model;
        newComponent.serial = comp.serial;

        const compErrors = await validate(newComponent);
        if (compErrors.length === 0) {
          const saved = await queryRunner.manager.save(newComponent);
          savedComponents.push(saved);
        }
      }
    }

    // Crear software nuevo
    const savedSoftware = [];
    if (software && Array.isArray(software)) {
      for (const soft of software) {
        const { Software } = await import("../entities/software");
        const newSoftware = new Software();
        newSoftware.equipmentId = savedEquipment.id;
        newSoftware.name = soft.name;
        newSoftware.versions = soft.versions;
        newSoftware.license = soft.license || 'Por verificar';
        newSoftware.otherData = soft.otherData || 'Detectado automáticamente';
        newSoftware.installDate = soft.installDate ? new Date(soft.installDate) : new Date();
        newSoftware.status = soft.status || 'Activo';

        const softErrors = await validate(newSoftware);
        if (softErrors.length === 0) {
          const saved = await queryRunner.manager.save(newSoftware);
          savedSoftware.push(saved);
        }
      }
    }

    await queryRunner.commitTransaction();

    return res.status(existingEquipment ? 200 : 201).json({
      message: existingEquipment 
        ? "Equipo actualizado exitosamente" 
        : "Equipo creado exitosamente",
      action: existingEquipment ? "updated" : "created",
      equipment: {
        id: savedEquipment.id,
        name: savedEquipment.name,
        serial: savedEquipment.serial,
        mac: savedEquipment.mac
      },
      componentsCount: savedComponents.length,
      softwareCount: savedSoftware.length
    });

  } catch (error) {
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    await queryRunner.release();
  }
}

export async function verifyEquipmentExist(req: Request, res: Response, next: NextFunction) {
  try {
    
    const { serial } = req.body;

    if (!serial) {
      return res.status(400).json({ message: "Serial is required" });
    }

    const equipment = await Equipos.findOne({
      where: [
        { serial: String(serial) },
      ]
    });


    if (equipment) {
      return res.json({
        exists: true,
        equipment: {
          id: equipment.id,
          name: equipment.name,
          serial: equipment.serial,
          mac: equipment.mac
        }
      });
    }

    return res.json({ exists: false });

  } catch (error) {
    next(error);
  }
}