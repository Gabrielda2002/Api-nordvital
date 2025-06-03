import { NextFunction, Request, Response } from "express";
import { Televisor } from "../entities/televisor";
import { validate } from "class-validator";
import { Between, LessThan, MoreThan } from "typeorm";
import { addMonths, differenceInDays, subYears } from "date-fns";

export async function getTelevisorBySedeId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const televisor = await Televisor.createQueryBuilder("televisor")
      .leftJoinAndSelect("televisor.sedeRelation", "sede")
      .leftJoinAndSelect("televisor.responsableRelation", "responsable")
      .leftJoinAndSelect("televisor.seguimientoRelation", "seguimiento")
      .leftJoinAndSelect(
        "seguimiento.usuarioRelation",
        "responsable_seguimiento"
      )
      .where("televisor.sede_id = :id", { id })
      .getMany();

    if (!televisor) {
      return res
        .status(404)
        .json({ message: "No se encontraron televisores para esta sede" });
    }

    const televisorFormatted = televisor.map((t) => ({
      id: t.id || "N/A",
      name: t.name || "N/A",
      location: t.location || "N/A",
      brand: t.brand || "N/A",
      model: t.model || "N/A",
      serial: t.serial || "N/A",
      pulgadas: t.pulgadas || "N/A",
      screenType: t.screenType || "N/A",
      smartTv: t.smartTv || "N/A",
      operativeSystem: t.operativeSystem || "N/A",
      addressIp: t.addressIp || "N/A",
      mac: t.mac || "N/A",
      resolution: t.resolution || "N/A",
      numPuertosHdmi: t.numPuertosHdmi || "N/A",
      numPuertosUsb: t.numPuertosUsb || "N/A",
      connectivity: t.connectivity || "N/A",
      purchaseDate: t.purchaseDate || "N/A",
      warrantyTime: t.warrantyTime || "N/A",
      warranty: t.warranty || "N/A",
      deliveryDate: t.deliveryDate || "N/A",
      inventoryNumber: t.inventoryNumber || "N/A",
      responsableId: t.responsableRelation?.id || "N/A",
      responsableName: t.responsableRelation?.name || "N/A",
      responsableLastName: t.responsableRelation?.lastName || "N/A",
      observations: t.observation || "N/A",
      status: t.status || "N/A",
      acquisitionValue: t.acquisitionValue || "N/A",
      controlRemote: t.controlRemote || "N/A",
      utility: t.utility,
      seguimiento: t.seguimientoRelation?.map((s) => ({
        id: s.id || "N/A",
        eventDate: s.eventDate || "N/A",
        typeEvent: s.eventType || "N/A",
        description: s.description || "N/A",
        responsableId: s.usuarioRelation?.id || "N/A",
        responsableName: s.usuarioRelation?.name || "N/A",
        responsableLastName: s.usuarioRelation?.lastName || "N/A",
      })),
    }));

    return res.status(200).json(televisorFormatted);
  } catch (error) {
    next(error);
  }
}

export async function createTelevisor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      sedeId,
      name,
      location,
      brand,
      model,
      serial,
      pulgadas,
      screenType,
      smartTv,
      operativeSystem,
      addressIp,
      mac,
      resolution,
      numPuertosHdmi,
      numPuertosUsb,
      connectivity,
      purchaseDate,
      warrantyTime,
      warranty,
      deliveryDate,
      inventoryNumber,
      observation,
      status,
      acquisitionValue,
      controlRemote,
      utility,
      responsable,
    } = req.body;

    console.log("tiempo garantia", req.body.warrantyTime);

    const televisor = new Televisor();
    televisor.sedeId = parseInt(sedeId);
    televisor.name = name.toLowerCase();
    televisor.location = location;
    televisor.brand = brand;
    televisor.model = model;
    televisor.serial = serial;
    televisor.pulgadas = Number(pulgadas);
    televisor.screenType = screenType;
    televisor.smartTv = smartTv;
    televisor.operativeSystem = operativeSystem;
    televisor.addressIp = addressIp;
    televisor.mac = mac;
    televisor.resolution = resolution;
    televisor.numPuertosHdmi = Number(numPuertosHdmi);
    televisor.numPuertosUsb = Number(numPuertosUsb);
    televisor.connectivity = connectivity;
    televisor.purchaseDate = purchaseDate;
    televisor.warrantyTime = warrantyTime || "Sin garantía";
    televisor.warranty = warranty;
    televisor.deliveryDate = deliveryDate;
    televisor.inventoryNumber = inventoryNumber || "Sin número de inventario";
    televisor.observation = observation;
    televisor.status = status;
    televisor.acquisitionValue = Number(acquisitionValue);
    televisor.controlRemote = controlRemote;
    televisor.utility = utility;
    televisor.idResponsable = responsable;

    const errors = await validate(televisor);
    if (errors.length > 0) {
      const errorMessages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res
        .status(400)
        .json({ message: "Error de validación", errors: errorMessages });
    }

    const newTelevisor = await televisor.save();

    return res.status(201).json({ televisor });
  } catch (error) {
    next(error);
  }
}

export async function updateTelevisor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      brand,
      model,
      serial,
      pulgadas,
      screenType,
      smartTv,
      operativeSystem,
      addressIp,
      mac,
      resolution,
      numPuertosHdmi,
      numPuertosUsb,
      connectivity,
      purchaseDate,
      warrantyTime,
      warranty,
      deliveryDate,
      inventoryNumber,
      observation,
      status,
      acquisitionValue,
      controlRemote,
      utility,
      responsable,
    } = req.body;

    const televisor = await Televisor.findOneBy({ id: parseInt(id) });

    if (!televisor) {
      return res.status(404).json({ message: "Televisor no encontrado" });
    }

    televisor.name = name.toLowerCase() || televisor.name;
    televisor.location = location || televisor.location;
    televisor.brand = brand || televisor.brand;
    televisor.model = model || televisor.model;
    televisor.serial = serial || televisor.serial;
    televisor.pulgadas = Number(pulgadas) || televisor.pulgadas;
    televisor.screenType = screenType || televisor.screenType;
    televisor.smartTv = smartTv || televisor.smartTv;
    televisor.operativeSystem = operativeSystem || televisor.operativeSystem;
    televisor.addressIp = addressIp || televisor.addressIp;
    televisor.mac = mac || televisor.mac;
    televisor.resolution = resolution || televisor.resolution;
    televisor.numPuertosHdmi =
      Number(numPuertosHdmi) || televisor.numPuertosHdmi;
    televisor.numPuertosUsb = Number(numPuertosUsb) || televisor.numPuertosUsb;
    televisor.connectivity = connectivity || televisor.connectivity;
    televisor.purchaseDate = purchaseDate || televisor.purchaseDate;
    televisor.warrantyTime = warrantyTime || televisor.warrantyTime;
    televisor.warranty = warranty || televisor.warranty;
    televisor.deliveryDate = deliveryDate || televisor.deliveryDate;
    televisor.inventoryNumber = inventoryNumber || televisor.inventoryNumber;
    televisor.observation = observation || televisor.observation;
    televisor.status = status || televisor.status;
    televisor.acquisitionValue =
      Number(acquisitionValue) || televisor.acquisitionValue;
    televisor.controlRemote = controlRemote || televisor.controlRemote;
    televisor.utility = utility || televisor.utility;
    televisor.idResponsable = Number(responsable) || televisor.idResponsable;

    const errors = await validate(televisor);
    if (errors.length > 0) {
      const errorMessages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      return res
        .status(400)
        .json({ message: "Error de validación", errors: errorMessages });
    }

    const updatedTelevisor = await televisor.save();

    return res.status(200).json({ televisor: updatedTelevisor });
  } catch (error) {
    next(error);
  }
}

export async function getTvHeadquartersDistribution(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { sedeId } = req.params;

    const tvDistribution = await Televisor.createQueryBuilder("televisor")
      .leftJoinAndSelect("televisor.sedeRelation", "sede")
      .select("sede.name", "sedeName")
      .addSelect("COUNT(televisor.id)", "count")
      .groupBy("sede.name")
      .orderBy("count", "DESC")
      .getRawMany();

    if (!tvDistribution) {
      return res
        .status(404)
        .json({ message: "No se encontraron televisores para esta sede" });
    }
    return res.status(200).json(tvDistribution);
  } catch (error) {
    next(error);
  }
}

// edad de tv
export async function getTvAgeByHeadquarter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const now = new Date();
    const oneYearAgo = subYears(now, 1);
    const twoYearsAgo = subYears(now, 2);
    const threeYearsAgo = subYears(now, 3);

    const lessThanOneYear = await Televisor.count({
      where: { purchaseDate: MoreThan(oneYearAgo) },
    });
    const betweenOneAndTwoYears = await Televisor.count({
      where: { purchaseDate: Between(twoYearsAgo, oneYearAgo) },
    });
    const betweenTwoAndThreeYears = await Televisor.count({
      where: { purchaseDate: Between(threeYearsAgo, twoYearsAgo) },
    });
    const moreThanThreeYears = await Televisor.count({
      where: { purchaseDate: LessThan(threeYearsAgo) },
    });

    const tv = await Televisor.find({ select: ["purchaseDate"] });
    let totalAge = 0;

    tv.forEach((t) => {
      if (t.purchaseDate) {
        const age = differenceInDays(now, new Date(t.purchaseDate));
        totalAge += age;
      }
    });

    const averageAgeInDays = totalAge / tv.length || 0;
    const averageAgeInMonths = averageAgeInDays / 30;
    const averageAgeInYears = averageAgeInDays / 12;

    return res.json({
      distribution: [
        { label: "Menos de 1 año", value: lessThanOneYear },
        { label: "Entre 1 y 2 años", value: betweenOneAndTwoYears },
        { label: "Entre 2 y 3 años", value: betweenTwoAndThreeYears },
        { label: "Más de 3 años", value: moreThanThreeYears },
      ],
      averageAge: {
        days: averageAgeInDays,
        months: averageAgeInMonths,
        years: averageAgeInYears.toFixed(1),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTvWarrantyStatistics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tvs = await Televisor.count({
      where: { warranty: true },
    });

    const tvWithWarranty = await Televisor.find({
      where: { warranty: true },
      select: ["id", "purchaseDate", "warrantyTime"],
    });

    const expiringWarranties = tvWithWarranty.filter((tv) => {
      const warrantyMonths = parseInt(tv.warrantyTime.match(/\d+/)?.[0] || "0");
      if (warrantyMonths > 0) {
        const expirationDate = addMonths(
          new Date(tv.purchaseDate),
          warrantyMonths
        );
        const expiresSoon =
          expirationDate > new Date() &&
          expirationDate < addMonths(new Date(), 3);

        return expiresSoon;
      }
      return false;
    });

    return res.status(200).json({
      total: tvs,
      inWarranty: tvWithWarranty.length,
      percentage: ((tvs / tvWithWarranty.length) * 100).toFixed(2),
      expiringSoon: {
        count: expiringWarranties.length,
        tvs: expiringWarranties,
      },
    });
  } catch (error) {
    next(error);
  }
}

// buscador global de televisores
export async function searchTv(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return res.status(400).json({
        message: "Consulta inválida. Debe tener al menos 2 caracteres.",
      });
    }

    const searchTerm = `%${query.trim().toLowerCase()}%`;

    const televisor = await Televisor.createQueryBuilder("televisor")
      .leftJoinAndSelect("televisor.sedeRelation", "sede")
      .leftJoinAndSelect("sede.departmentRelation", "department")
      .leftJoinAndSelect("televisor.responsableRelation", "responsable")
      .leftJoinAndSelect("televisor.seguimientoRelation", "seguimiento")
      .leftJoinAndSelect(
        "seguimiento.usuarioRelation",
        "responsable_seguimiento"
      )
      .where(
        `(
            LOWER(televisor.name) LIKE :searchTerm OR
            LOWER(televisor.serial) LIKE :searchTerm OR
            LOWER(responsable.name) LIKE :searchTerm
        )`,
        { searchTerm }
      )
      .orderBy("televisor.name", "ASC")
      .limit(50)
      .getMany();

    if (!televisor) {
      return res
        .status(404)
        .json({ message: "No se encontraron televisores para esta sede" });
    }

    const televisorFormatted = televisor.map((t) => ({
      item: {
        id: t.id || "N/A",
        name: t.name || "N/A",
        location: t.location || "N/A",
        brand: t.brand || "N/A",
        model: t.model || "N/A",
        serial: t.serial || "N/A",
        pulgadas: t.pulgadas || "N/A",
        screenType: t.screenType || "N/A",
        smartTv: t.smartTv || "N/A",
        operativeSystem: t.operativeSystem || "N/A",
        addressIp: t.addressIp || "N/A",
        mac: t.mac || "N/A",
        resolution: t.resolution || "N/A",
        numPuertosHdmi: t.numPuertosHdmi || "N/A",
        numPuertosUsb: t.numPuertosUsb || "N/A",
        connectivity: t.connectivity || "N/A",
        purchaseDate: t.purchaseDate || "N/A",
        warrantyTime: t.warrantyTime || "N/A",
        warranty: t.warranty || "N/A",
        deliveryDate: t.deliveryDate || "N/A",
        inventoryNumber: t.inventoryNumber || "N/A",
        responsableId: t.responsableRelation?.id || "N/A",
        responsableName: t.responsableRelation?.name || "N/A",
        responsableLastName: t.responsableRelation?.lastName || "N/A",
        observations: t.observation || "N/A",
        status: t.status || "N/A",
        acquisitionValue: t.acquisitionValue || "N/A",
        controlRemote: t.controlRemote || "N/A",
        utility: t.utility,
        seguimiento: t.seguimientoRelation?.map((s) => ({
          id: s.id || "N/A",
          eventDate: s.eventDate || "N/A",
          typeEvent: s.eventType || "N/A",
          description: s.description || "N/A",
          responsableId: s.usuarioRelation?.id || "N/A",
          responsableName: s.usuarioRelation?.name || "N/A",
          responsableLastName: s.usuarioRelation?.lastName || "N/A",
        })),
      },
      departmentId: t.sedeRelation?.departmentRelation?.id || 0,
      departmentRelationName: t.sedeRelation?.departmentRelation?.name || "N/A",
      sedeName: t.sedeRelation?.name || "N/A",
      sedeId: t.sedeRelation.id || 0,
    }));

    return res.status(200).json(televisorFormatted);
  } catch (error) {
    next(error);
  }
}
