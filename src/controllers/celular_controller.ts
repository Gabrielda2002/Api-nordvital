import { NextFunction, Request, Response } from "express";
import { Celular } from "../entities/celular";
import { Soportes } from "../entities/soportes";
import path from "path";
import { ifError } from "assert";
import { validate } from "class-validator";

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
      .where("celular.sedeId = :sedeId", { id })
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
      responsableRelation: {
        id: p.usuarioRelation?.id || null,
        name:
          `${p.usuarioRelation?.name} ${p.usuarioRelation?.lastName}` || null,
      },
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
      warrantyDate,
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

    const file = req.file;
    let actaId: number | null = null;

    if (file) {
        const docExists = await Soportes.findOneBy({nameSaved: path.basename(file.filename)})

        if (docExists) {
            return res.status(400).json({message: "El archivo ya existe"})
        }

        const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));

        const acta = Soportes.create({
            name: fileNameWithoutExt.normalize('NFC'),
            url: file.path,
            size: file.size,
            type: file.mimetype,
            nameSaved: path.basename(file.filename),
        });

        const errorsActa = await validate(acta);
        if (errorsActa.length > 0) {
            const errorMessages = errorsActa?.map((err) => ({
                property: err.property,
                constraints: err.constraints,
            }));
            return res.status(400).json({
                message: "Error al crear el acta",
                errors: errorMessages,
            });
        }

        await queryRunner.manager.save(acta);
        actaId = acta.id;

    }

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
    newPhone.warrantyTime = warrantyDate;
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

     await queryRunner.manager.save(newPhone);

     await queryRunner.commitTransaction();

    await newPhone.save();

    return res.status(201).json(newPhone);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    next(error);
  }finally {
    await queryRunner.release();
  }
}
