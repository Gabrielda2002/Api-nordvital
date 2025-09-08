import { NextFunction, Request, Response } from "express";
import { Celular } from "../entities/celular";
import { Soportes } from "../entities/soportes";
import path from "path";
import { ifError } from "assert";
import { validate } from "class-validator";
import fs from "fs";
import { saveFileToDisk } from "../middlewares/upload-doc-delivery_middleware";
import { updateFileAndRecord } from "../utils/file-manager";
import { addMonths, differenceInDays, subYears } from "date-fns";
import { Between, MoreThan } from "typeorm";

export async function getPhoneBySedeId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const phones = await Celular.createQueryBuilder("celular")
      .leftJoinAndSelect("celular.usuarioRelation", "responsable")
      .leftJoinAndSelect("celular.actaRelation", "acta")
      .leftJoinAndSelect("celular.seguimientoRelation", "seguimiento")
      .leftJoinAndSelect(
        "seguimiento.usuarioRelation",
        "responsableSeguimiento"
      )
      .where("celular.sedeId = :id", { id })
      .getMany();

    if (phones.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron celulares para esta sede" });
    }

    const phonesWithDetails = phones.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      model: p.model,
      serial: p.serial,
      phoneNumber: p.phoneNumber,
      operador: p.operador,
      typePlan: p.typePlan,
      dueDatePlan: p.dueDatePlan,
      macWifi: p.macWifi,
      addressBluetooth: p.addressBluetooth,
      purchaseDate: p.purchaseDate,
      warrantyTime: p.warrantyTime,
      warranty: p.warranty,
      deliveryDate: p.deliveryDate,
      protectorCase: p.caseProtector,
      temperedGlass: p.temperedGlass,
      status: p.status,
      observation: p.observation,
      acquisitionValue: p.acquisitionValue,
      imei: p.imei,
      operativeSystem: p.operativeSystem,
      versionSO: p.versionSO,
      storage: p.storage,
      storageRam: p.storageRam,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      sedeId: p.sedeId,
      nameSaved: p.actaRelation?.nameSaved,
      documentId: p.actaRelation?.id || "N/A",
      inventoryNumber: p.inventoryNumber,
      seguimientoRelation: p.seguimientoRelation?.map((s) => ({
        id: s.id,
        description: s.description,
        responsableName: s.usuarioRelation?.name,
        responsableLastNames: s.usuarioRelation?.lastName || null,
        typeEvent: s.eventType,
        eventDate: s.eventDate,
        createdAt: s.createdAt,
      })),
      responsableId: p.usuarioRelation?.id || "N/A",
      responsableName: p.usuarioRelation?.name || "N/A",
      responsableLastName: p.usuarioRelation?.lastName || "N/A",
    }));

    return res.status(200).json(phonesWithDetails);
  } catch (error) {
    next(error);
  }
}

export async function createPhone(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryRunner =
    Celular.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let filePath = null;
  let fileName = null;

  try {
    const {
      name,
      brand,
      model,
      serial,
      imei,
      operativeSystem,
      versionSO,
      storage,
      storageRam,
      phoneNumber,
      operador,
      typePlan,
      dueDatePlan,
      macWifi,
      addressBluetooth,
      purchaseDate,
      warrantyTime,
      warranty,
      deliveryDate,
      inventoryNumber,
      responsable,
      caseProtector,
      tenperedGlass,
      observations,
      status,
      acquisitionValue,
      sedeId,
    } = req.body;

    console.log(req.body);

    const file = req.file;
    let actaId: number | null = null;

    // Validamos el objeto del teléfono primero antes de guardar cualquier archivo
    const newPhone = new Celular();
    newPhone.name = name.toUpperCase();
    newPhone.brand = brand.toUpperCase();
    newPhone.model = model;
    newPhone.serial = serial;
    newPhone.imei = imei;
    newPhone.operativeSystem = operativeSystem;
    newPhone.versionSO = versionSO;
    newPhone.storage = storage;
    newPhone.storageRam = storageRam;
    newPhone.phoneNumber = phoneNumber;
    newPhone.operador = operador;
    newPhone.typePlan = typePlan;
    newPhone.dueDatePlan = dueDatePlan;
    newPhone.macWifi = macWifi;
    newPhone.addressBluetooth = addressBluetooth;
    newPhone.purchaseDate = purchaseDate;
    newPhone.warrantyTime = warrantyTime || 'No Aplica';
    newPhone.warranty = warranty == "true" ? true : false;
    newPhone.deliveryDate = deliveryDate;
    newPhone.inventoryNumber = inventoryNumber;
    newPhone.responsable = parseInt(responsable);
    newPhone.caseProtector = caseProtector == "true" ? true : false;
    newPhone.temperedGlass = tenperedGlass == "true" ? true : false;
    newPhone.observation = observations;
    newPhone.status = status;
    newPhone.acquisitionValue = parseInt(acquisitionValue, 10);
    newPhone.sedeId = parseInt(sedeId);
    newPhone.brand = brand;

    const errorsPhone = await validate(newPhone);

    if (errorsPhone.length > 0) {
      const errorMessages = errorsPhone?.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      await queryRunner.rollbackTransaction();
      return res.status(400).json({
        message: "Error al crear el celular",
        errors: errorMessages,
      });
    }

    if (file) {
      const savedFile = saveFileToDisk(file.buffer, file.originalname);
      filePath = savedFile.path;
      fileName = savedFile.filename;

      const fileNameWithoutExt = path.basename(
        file.originalname,
        path.extname(file.originalname)
      );

      const docExists = await Soportes.findOneBy({
        name: fileNameWithoutExt.normalize("NFC"),
      });

      if (docExists) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await queryRunner.rollbackTransaction();
        return res.status(400).json({ message: "El archivo ya existe" });
      }

      
      const acta = Soportes.create({
        name: fileNameWithoutExt.normalize("NFC"),
        url: savedFile.path,
        size: file.size,
        type: file.mimetype,
        nameSaved: savedFile.filename,
      });

      const errorsActa = await validate(acta);
      if (errorsActa.length > 0) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        const errorMessages = errorsActa?.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        }));
        await queryRunner.rollbackTransaction();
        return res.status(400).json({
          message: "Error al crear el acta",
          errors: errorMessages,
        });
      }

      await queryRunner.manager.save(acta);
      newPhone.actaId = acta.id;
    }

    await queryRunner.manager.save(newPhone);
    await queryRunner.commitTransaction();

    return res.status(201).json(newPhone);

  } catch (error) {

    await queryRunner.rollbackTransaction();

    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado debido a error: ${filePath}`);
      } catch (err) {
        console.error(`Error al eliminar archivo: ${err}`);
      }
    }

    next(error);
  } finally {
    await queryRunner.release();
  }
}

// actualizar celular
export async function updatePhone(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryRunner =
    Celular.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let filePath = null;
  let fileName = null;

  try {
    const { id } = req.params;

    const phone = await Celular.findOneBy({ id: parseInt(id) });

    if (!phone) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: "Celular no encontrado" });
    }

    const {
      name,
      brand,
      model,
      serial,
      imei,
      operativeSystem,
      versionSO,
      storage,
      storageRam,
      phoneNumber,
      operador,
      typePlan,
      dueDatePlan,
      macWifi,
      addressBluetooth,
      purchaseDate,
      warrantyTime,
      warranty,
      deliveryDate,
      inventoryNumber,
      responsable,
      caseProtector,
      tenperedGlass,
      observations,
      status,
      acquisitionValue,
      sedeId,
    } = req.body;

    phone.name = name.toUpperCase();
    phone.brand = brand.toUpperCase();
    phone.model = model;
    phone.serial = serial;
    phone.imei = imei;
    phone.operativeSystem = operativeSystem;
    phone.versionSO = versionSO;
    phone.storage = storage;
    phone.storageRam = storageRam;
    phone.phoneNumber = phoneNumber;
    phone.operador = operador;
    phone.typePlan = typePlan;
    phone.dueDatePlan = dueDatePlan;
    phone.macWifi = macWifi;
    phone.addressBluetooth = addressBluetooth;
    phone.purchaseDate = purchaseDate;
    phone.warrantyTime = warrantyTime || 'No Aplica';
    phone.warranty = warranty === 'true' ? true : false;
    phone.deliveryDate = deliveryDate;
    phone.inventoryNumber = inventoryNumber;
    phone.responsable = parseInt(responsable);
    phone.caseProtector = caseProtector === 'true' ? true : false;
    phone.temperedGlass = tenperedGlass === 'true' ? true : false;
    phone.observation = observations;
    phone.status = status;
    phone.acquisitionValue = Number(acquisitionValue);
    phone.sedeId = parseInt(sedeId);

    const errorsPhone = await validate(phone);

    if (errorsPhone.length > 0) {
      const errorMessages = errorsPhone?.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      await queryRunner.rollbackTransaction();
      return res.status(400).json({
        message: "Error al actualizar el celular",
        errors: errorMessages,
      });
    }

    const file = req.file;
    let actaId: number | null = phone.actaId;

    if (file) {
      try {

        const savedFile = saveFileToDisk(file.buffer, file.originalname);
        filePath = savedFile.path;
        fileName = savedFile.filename;

        const fileNameWithoutExt = path.basename(
          file.originalname,
          path.extname(file.originalname)
        );

        const docExistsByName  = await Soportes.findOneBy({
          name: fileNameWithoutExt.normalize("NFC")})

          if (docExistsByName) {
            if (fs.existsSync(filePath )) {
              fs.unlinkSync(filePath);
            }
            await queryRunner.rollbackTransaction();
            return res.status(400).json({ message: "El archivo ya existe" });
          }

        // Si ya existe un acta vinculada al teléfono, actualizamos ese registro
        if (actaId) {
          const updatedActa = await updateFileAndRecord(
            queryRunner,
            actaId,
            {
              originalName: fileNameWithoutExt.normalize("NFC"),
              size: file.size,
              mimetype: file.mimetype,
            },
            savedFile.path,
            savedFile.filename
          );

          if (!updatedActa) {
            actaId = null;
          }
        }

        // Si no hay acta previa o no se pudo actualizar, creamos una nueva
        if (!actaId) {
          // Verificamos si ya existe un soporte con ese nombre guardado
          const docExists = await Soportes.findOneBy({
            name: fileNameWithoutExt.normalize("NFC"),
          });

          if (docExists) {
            // Si existe, eliminamos el archivo que acabamos de guardar
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
            await queryRunner.rollbackTransaction();
            return res.status(400).json({ message: "El archivo ya existe" });
          }

          const acta = Soportes.create({
            name: fileNameWithoutExt.normalize("NFC"),
            url: savedFile.path,
            size: file.size,
            type: file.mimetype,
            nameSaved: savedFile.filename,
          });

          const errorsActa = await validate(acta);

          if (errorsActa.length > 0) {
            // Si hay errores en la validación del acta, eliminamos el archivo
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
            const errorMessages = errorsActa?.map((err) => ({
              property: err.property,
              constraints: err.constraints,
            }));
            await queryRunner.rollbackTransaction();
            return res.status(400).json({
              message: "Error al crear el acta",
              errors: errorMessages,
            });
          }

          await queryRunner.manager.save(acta);
          actaId = acta.id;
        }

        phone.actaId = actaId;

      } catch (error) {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw error;
      }
    }

    await queryRunner.manager.save(phone);
    await queryRunner.commitTransaction();

    return res.status(200).json(phone);

  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado debido a error: ${filePath}`);
      } catch (err) {
        console.error(`Error al eliminar archivo: ${err}`);
      }
    }

    next(error);
  } finally {
    await queryRunner.release();
  }
}

// cantidad de celulares por sede
export async function getCountPhonesByHeadquartersId(req: Request, res: Response, next: NextFunction){
  try {
    
    const phoneCount = await Celular.createQueryBuilder("celular")
    .leftJoinAndSelect('celular.sedeRelation', 'sede')
    .select('sede.name', 'sedeName')
    .addSelect('COUNT(celular.id)', 'count')
    .groupBy('sede.name')
    .orderBy('count', 'DESC')
    .getRawMany();

    if (!phoneCount) {
      return res.status(404).json({ message: "No se encontraron celulares" });
    }

    return res.status(200).json(phoneCount);

  } catch (error) {
    next(error);
  }
}
// edad de sedes
export async function getPhoneAgeByHeadquartersId(req: Request, res: Response, next: NextFunction){
  try {
    
    const now = new Date();
    const oneYearAgo = subYears(now, 1);
    const twoYearsAgo = subYears(now, 2);
    const threeYearsAgo = subYears(now, 3);

    const lessThanOneYear = await Celular.count({
      where: { purchaseDate: MoreThan(oneYearAgo)}
    })

    const betweenOneAndTwoYears = await Celular.count({
      where: { purchaseDate: Between(twoYearsAgo, oneYearAgo)}
    })

    const betweenTwoAndThreeYears = await Celular.count({
      where: { purchaseDate: Between(threeYearsAgo, twoYearsAgo)}
    })

    const moreThanThreeYears = await Celular.count({
      where: { purchaseDate: MoreThan(threeYearsAgo)}
    })

    const phoneAge = await Celular.find({
      select: ['purchaseDate']
    });
    let totalAge = 0;
    
    phoneAge.forEach((p) =>{
      if (p.purchaseDate) {
        const age = differenceInDays(now, new Date(p.purchaseDate))
        totalAge += age;
      }
    });

    const averageAgeInDays = totalAge / phoneAge.length || 0;
    const averageAgeInMoths = averageAgeInDays / 30;
    const averageAgeInYears = averageAgeInDays / 12;

    return res.json({
      distribution: [
        {label: 'Menos de 1 año', value: lessThanOneYear},
        {label: 'Entre 1 y 2 años', value: betweenOneAndTwoYears},
        {label: 'Entre 2 y 3 años', value: betweenTwoAndThreeYears},
        {label: 'Mas de tres años', value: moreThanThreeYears}
      ],
      averageAge: {
        days: Math.round(averageAgeInDays),
        months: Math.round(averageAgeInMoths),
        years: averageAgeInYears.toFixed(1)
      },
    })


  } catch (error) {
    next(error);
  }
}

// estadisticas de expiracion de garantia
export async function getPhoneWarrantyStatistics(req: Request, res: Response, next: NextFunction){
  try {

      const totalPhones = await Celular.count()
      const phonesInWarranty = await Celular.count({
        where: { warranty:  true }
      })

    const phonesWithWarranty = await Celular.find({
      where: { warranty: true },
      select: ['id', 'purchaseDate', 'warrantyTime']
    });

    const expiringWarranties = phonesWithWarranty.filter( p => {
      const warrantyMonths = parseInt(p.warrantyTime.match(/\d+/)?.[0] || "0");

      if (warrantyMonths > 0) {
        const expirationDate = addMonths(
          new Date(p.purchaseDate),
          warrantyMonths
        );
        const expiresSoon = expirationDate > new Date() && expirationDate < addMonths(new Date(), 3);
        return expiresSoon;
      }
      return false
    });

    return res.json({
      total: totalPhones,
      inWarranty: phonesInWarranty,
      percentage: ((phonesInWarranty / totalPhones) * 100).toFixed(2),
      expiringSoon: {
        count: expiringWarranties.length,
        phones: expiringWarranties
      }
    })

  } catch (error) {
    next(error);
  }
}

export async function searchPhone(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return res.status(400).json({
        message: "La consulta debe ser una cadena de al menos 2 caracteres",
      });
    }

    const searchTerm = `%${query.trim().toLowerCase()}%`;

    const phones = await Celular.createQueryBuilder("celular")
      .leftJoinAndSelect("celular.usuarioRelation", "responsable")
      .leftJoinAndSelect("celular.actaRelation", "acta")
      .leftJoinAndSelect("celular.seguimientoRelation", "seguimiento")
      .leftJoinAndSelect(
        "seguimiento.usuarioRelation",
        "responsableSeguimiento"
      )
      .leftJoinAndSelect('celular.sedeRelation', 'sede')
      .leftJoinAndSelect('sede.departmentRelation', 'department')
      .where(
        `(
          LOWER(celular.name) LIKE :searchTerm OR
          LOWER(celular.serial) LIKE :searchTerm OR
          LOWER(responsable.name) LIKE :searchTerm
        )`, { searchTerm }
      )
      .orderBy("celular.name", "ASC")
      .limit(50)
      .getMany();

    if (phones.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron celulares para esta sede" });
    }

    const phonesWithDetails = phones.map((p) => ({
      item: {
        id: p.id,
        name: p.name,
        brand: p.brand,
        model: p.model,
        serial: p.serial,
        phoneNumber: p.phoneNumber,
        operador: p.operador,
        typePlan: p.typePlan,
        dueDatePlan: p.dueDatePlan,
        macWifi: p.macWifi,
        addressBluetooth: p.addressBluetooth,
        purchaseDate: p.purchaseDate,
        warrantyTime: p.warrantyTime,
        warranty: p.warranty,
        deliveryDate: p.deliveryDate,
        protectorCase: p.caseProtector,
        temperedGlass: p.temperedGlass,
        status: p.status,
        observation: p.observation,
        acquisitionValue: p.acquisitionValue,
        imei: p.imei,
        operativeSystem: p.operativeSystem,
        versionSO: p.versionSO,
        storage: p.storage,
        storageRam: p.storageRam,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        sedeId: p.sedeId,
        nameSaved: p.actaRelation?.nameSaved,
        seguimientoRelation: p.seguimientoRelation?.map((s) => ({
          id: s.id,
          description: s.description,
          responsableName: s.usuarioRelation?.name,
          responsableLastNames: s.usuarioRelation?.lastName || null,
          typeEvent: s.eventType,
          eventDate: s.eventDate,
          createdAt: s.createdAt,
        })),
        responsableId: p.usuarioRelation?.id || "N/A",
        responsableName: p.usuarioRelation?.name || "N/A",
        responsableLastName: p.usuarioRelation?.lastName || "N/A",
      }, 
      departmentId: p.sedeRelation?.municipioRelation?.departmentRelation?.id || 0,
      departmentRelationName: p.sedeRelation?.municipioRelation?.departmentRelation?.name || "N/A",
      sedeName: p.sedeRelation?.name || "N/A",
      sedeId: p.sedeRelation?.id || 0
    }));

    return res.status(200).json(phonesWithDetails);

  } catch (error) {
    next(error);
  }
}