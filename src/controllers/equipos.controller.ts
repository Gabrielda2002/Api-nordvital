import { NextFunction, query, Request, Response } from "express";
import { Equipos } from "../entities/equipos";
import { validate } from "class-validator";
import { Soportes } from "../entities/soportes";
import path from "path";
import fs from "fs";
import { addMonths, differenceInDays, subYears } from "date-fns";
import { Between, LessThan, MoreThan } from "typeorm";
import { saveFileToDisk } from "../middlewares/upload-doc-delivery_middleware";
import { updateFileAndRecord } from "../utils/file-manager";

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

    if (serialExist && serialExist.id !== parseInt(id)) {
      return res.status(409).json({
        message: "El número de serie ya existe",
      });
    }

    const equipment = await Equipos.findOneBy({ id: parseInt(id) });

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
    equipment.sedeId = parseInt(sedeId);

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
      .leftJoinAndSelect("equipos.soportRelacion", "document")
      .leftJoinAndSelect("seguimientoEquipos.userRelation", "user")
      .where("equipos.sedeId = :sedeId", { sedeId: parseInt(id) })
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
    const equipment = await Equipos.createQueryBuilder("equipos")
      .select("equipos.typeEquipment", "typeEquipment")
      .addSelect("COUNT(equipos.id)", "count")
      .groupBy("equipos.typeEquipment")
      .orderBy("count", "DESC")
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
    const equipment = await Equipos.createQueryBuilder("equipos")
      .leftJoinAndSelect("equipos.placeRelation", "sede")
      .select("sede.name", "sedeName")
      .addSelect("COUNT(equipos.id)", "count")
      .groupBy("sede.name")
      .orderBy("count", "DESC")
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
    const now = new Date();
    const oneYearAgo = subYears(now, 1);
    const twoYearsAgo = subYears(now, 2);
    const threeYearsAgo = subYears(now, 3);

    const lessThanOneYear = await Equipos.count({
      where: { purchaseDate: MoreThan(oneYearAgo) },
    });
    const betweenOneAndTwoYears = await Equipos.count({
      where: {
        purchaseDate: Between(twoYearsAgo, oneYearAgo),
      },
    });
    const betweenTwoAndThreeYears = await Equipos.count({
      where: {
        purchaseDate: Between(threeYearsAgo, twoYearsAgo),
      },
    });
    const moreThanThreeYears = await Equipos.count({
      where: {
        purchaseDate: LessThan(threeYearsAgo),
      },
    });

    // Cálculo de la edad promedio en días
    const equipments = await Equipos.find({ select: ["purchaseDate"] });
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
    const totalEquipments = await Equipos.count();
    const equipmentsInWarranty = await Equipos.count({
      where: { warranty: true },
    });

    // obtener equipos con garantia para calcular fecha de vencimiento
    const equipmentWithWarranty = await Equipos.find({
      where: { warranty: true },
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
    const totalEquipments = await Equipos.count();
    const equipmentsWithLock = await Equipos.count({ where: { lock: true } });

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
      .leftJoinAndSelect("sede_equipo.departmentRelation", "departamento_sede")
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
      departmentId: e.placeRelation?.departmentRelation?.id || 0,
      departmentRelationName: e.placeRelation?.departmentRelation?.name || "N/A",
      sedeId: e.placeRelation?.id || 0,
      sedeName: e.placeRelation?.name || "N/A"
    }));

    return res.json(searchResults);
  } catch (error) {
    console.error('Error in searchEquipmentGlobal:', error);
    next(error);
  }
}