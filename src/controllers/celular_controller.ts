import { NextFunction, Request, Response } from "express";
import { Celular } from "../entities/celular";
import { Soportes } from "../entities/soportes";
import path from "path";
import { ifError } from "assert";
import { validate } from "class-validator";
import fs from "fs";

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
      imei: p.imei,
      operativeSystem: p.operativeSystem,
      versionSO: p.versionSO,
      storage: p.storage,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      sedeId: p.sedeId,
      actaRelation: {
        id: p.actaRelation?.id || null,
        name: p.actaRelation?.name || null,
      },
      seguimientoRelation: p.seguimientoRelation?.map((s) => ({
        id: s.id,
        description: s.description,
        responsableName: s.usuarioRelation?.name,
        responsableLastNames: s.usuarioRelation?.lastName || null,
        typeEvent: s.eventType,
        eventDate: s.eventDate,
        createdAt: s.createdAt,
      })),
      responsableId: p.usuarioRelation?.id || 'N/A',
      responsableName: p.usuarioRelation?.name || 'N/A',
      responsableLastNames: p.usuarioRelation?.lastName || 'N/A',
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
  const queryRunner = Celular.getRepository().manager.connection.createQueryRunner();
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
      inventoryNumber = "no aplica",
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
    newPhone.name = name.toLowerCase();
    newPhone.brand = brand.toLowerCase();
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
    newPhone.warrantyTime = warrantyTime;
    newPhone.warranty = warranty === 1 ? true : false;
    newPhone.deliveryDate = deliveryDate;
    newPhone.inventoryNumber = inventoryNumber;
    newPhone.responsable = parseInt(responsable);
    newPhone.caseProtector = caseProtector === 1 ? true : false;
    newPhone.temperedGlass = tenperedGlass === 1 ? true : false;
    newPhone.observation = observations;
    newPhone.status = status;
    newPhone.acquisitionValue = Number(acquisitionValue);
    newPhone.sedeId = parseInt(sedeId);
    newPhone.brand = brand;
    
    const errorsPhone = await validate(newPhone);

    if (errorsPhone.length > 0) {
        const errorMessages = errorsPhone?.map(err => ({
            property: err.property,
            constraints: err.constraints,
        }));
        await queryRunner.rollbackTransaction();
        return res.status(400).json({
            message: "Error al crear el celular",
            errors: errorMessages,
        });
    }

    // Solo procesamos el archivo si las validaciones del teléfono son correctas
    if (file) {
        // Importamos la función saveFileToDisk desde el middleware
        const { saveFileToDisk } = await import("../middlewares/upload-doc-delivery_middleware");
        
        // Verificamos si ya existe un archivo con el mismo nombre
        const savedFile = saveFileToDisk(file.buffer, file.originalname);
        filePath = savedFile.path;
        fileName = savedFile.filename;

        // Verificamos si ya existe un soporte con ese nombre guardado
        const docExists = await Soportes.findOneBy({nameSaved: savedFile.filename});

        if (docExists) {
            // Si existe, eliminamos el archivo que acabamos de guardar
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            await queryRunner.rollbackTransaction();
            return res.status(400).json({message: "El archivo ya existe"});
        }

        const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));

        const acta = Soportes.create({
            name: fileNameWithoutExt.normalize('NFC'),
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
        newPhone.actaId = actaId;
    }

    await queryRunner.manager.save(newPhone);
    await queryRunner.commitTransaction();

    return res.status(201).json(newPhone);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    
    // Si ocurrió un error y se guardó un archivo, lo eliminamos
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
  const queryRunner = Celular.getRepository().manager.connection.createQueryRunner();
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
      inventoryNumber = "no aplica",
      responsable,
      caseProtector,
      tenperedGlass,
      observations,
      status,
      acquisitionValue,
    } = req.body;

    // Primero validamos las actualizaciones al teléfono antes de procesar cualquier archivo
    phone.name = name.toLowerCase();
    phone.brand = brand.toLowerCase();
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
    phone.warrantyTime = warrantyTime;
    phone.warranty = warranty === 1 ? true : false;
    phone.deliveryDate = deliveryDate;
    phone.inventoryNumber = inventoryNumber;
    phone.responsable = parseInt(responsable);
    phone.caseProtector = caseProtector === 1 ? true : false;
    phone.temperedGlass = tenperedGlass === 1 ? true : false;
    phone.observation = observations;
    phone.status = status;
    phone.acquisitionValue = Number(acquisitionValue);

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

    // Solo procesamos el archivo si las validaciones del teléfono son correctas
    const file = req.file;
    let actaId: number | null = null;

    if (file) {
      // Importamos la función saveFileToDisk desde el middleware
      const { saveFileToDisk } = await import("../middlewares/upload-doc-delivery_middleware");
        
      // Guardamos el archivo usando nuestra función helper
      const savedFile = saveFileToDisk(file.buffer, file.originalname);
      filePath = savedFile.path;
      fileName = savedFile.filename;

      // Verificamos si ya existe un soporte con ese nombre guardado
      const docExists = await Soportes.findOneBy({nameSaved: savedFile.filename});

      if (docExists) {
        // Si existe, eliminamos el archivo que acabamos de guardar
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await queryRunner.rollbackTransaction();
        return res.status(400).json({message: "El archivo ya existe"});
      }

      const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));

      const acta = Soportes.create({
        name: fileNameWithoutExt.normalize('NFC'),
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
      phone.actaId = actaId;
    }

    await queryRunner.manager.save(phone);
    await queryRunner.commitTransaction();
    
    return res.status(200).json(phone);
  }
  catch (error) {
    await queryRunner.rollbackTransaction();
    
    // Si ocurrió un error y se guardó un archivo, lo eliminamos
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