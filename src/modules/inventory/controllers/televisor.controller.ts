import { NextFunction, Request, Response } from "express";
import { Televisor } from "../entities/televisor";
import { Between, LessThan, MoreThan } from "typeorm";
import { addMonths, differenceInDays, subYears } from "date-fns";
import { parseBooleanFlag } from "@core/utils/boolean-helper";
import { BadRequestError, NotFoundError } from "@core/utils/custom-errors";
import { validateEntity } from "@core/utils/validation-helper";

/**
 * Parses an optional numeric field.
 *
 * Keeps the current value when nothing usable was provided (`undefined`, `null`
 * or an empty string) and preserves a legitimate `0`, which the previous
 * `Number(value) || current` silently discarded.
 */
const optionalNumber = (incoming: unknown, current: number): number =>
  incoming === undefined || incoming === null || incoming === ""
    ? current
    : Number(incoming);

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

    if (televisor.length === 0) {
      throw new NotFoundError("No TVs found for this headquarters");
    }

    const televisorFormatted = televisor.map((t) => ({
      id: t.id || "N/A",
      sedeId: t.sedeId || "N/A",
      name: t.name || "N/A",
      location: t.location || "N/A",
      brand: t.brand || "N/A",
      model: t.model || "N/A",
      serial: t.serial || "N/A",
      pulgadas: t.pulgadas ?? "N/A",
      screenType: t.screenType || "N/A",
      smartTv: t.smartTv ?? "N/A",
      operativeSystem: t.operativeSystem || "N/A",
      addressIp: t.addressIp || "N/A",
      mac: t.mac || "N/A",
      resolution: t.resolution || "N/A",
      numPuertosHdmi: t.numPuertosHdmi ?? "N/A",
      numPuertosUsb: t.numPuertosUsb ?? "N/A",
      connectivity: t.connectivity || "N/A",
      purchaseDate: t.purchaseDate || "N/A",
      warrantyTime: t.warrantyTime || "N/A",
      warranty: t.warranty ?? "N/A",
      deliveryDate: t.deliveryDate || "N/A",
      inventoryNumber: t.inventoryNumber || "N/A",
      responsableId: t.responsableRelation?.id || "N/A",
      responsableName: t.responsableRelation?.name || "N/A",
      responsableLastName: t.responsableRelation?.lastName || "N/A",
      observations: t.observation || "N/A",
      status: t.status || "N/A",
      acquisitionValue: t.acquisitionValue ?? "N/A",
      controlRemote: t.controlRemote ?? "N/A",
      utility: t.utility,
      monitoring: t.seguimientoRelation?.map((s) => ({
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

    const televisor = new Televisor();
    televisor.sedeId = parseInt(String(sedeId));
    televisor.name = name.toLowerCase();
    televisor.location = location;
    televisor.brand = brand;
    televisor.model = model;
    televisor.serial = serial;
    televisor.pulgadas = Number(pulgadas);
    televisor.screenType = screenType;
    televisor.smartTv = parseBooleanFlag(smartTv);
    televisor.operativeSystem = operativeSystem;
    televisor.addressIp = addressIp;
    televisor.mac = mac;
    televisor.resolution = resolution;
    televisor.numPuertosHdmi = Number(numPuertosHdmi);
    televisor.numPuertosUsb = Number(numPuertosUsb);
    televisor.connectivity = connectivity;
    televisor.purchaseDate = purchaseDate;
    televisor.warrantyTime = warrantyTime || "Sin garantía";
    televisor.warranty = parseBooleanFlag(warranty);
    televisor.deliveryDate = deliveryDate;
    televisor.inventoryNumber = inventoryNumber || "Sin número de inventario";
    televisor.observation = observation;
    televisor.status = status;
    televisor.acquisitionValue = optionalNumber(acquisitionValue, 0);
    televisor.controlRemote = parseBooleanFlag(controlRemote);
    televisor.utility = utility;
    televisor.idResponsable = responsable;

    await validateEntity(televisor);

    await televisor.save();

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
      sedeId
    } = req.body;

    const televisor = await Televisor.findOneBy({ id: parseInt(String(id)) });

    if (!televisor) {
      throw new NotFoundError("TV not found");
    }

    televisor.name =
      name === undefined || name === null ? televisor.name : name.toLowerCase();
    televisor.location = location ?? televisor.location;
    televisor.brand = brand ?? televisor.brand;
    televisor.model = model ?? televisor.model;
    televisor.serial = serial ?? televisor.serial;
    televisor.pulgadas = optionalNumber(pulgadas, televisor.pulgadas);
    televisor.screenType = screenType ?? televisor.screenType;
    televisor.smartTv = smartTv ?? televisor.smartTv;
    televisor.operativeSystem = operativeSystem ?? televisor.operativeSystem;
    televisor.addressIp = addressIp ?? televisor.addressIp;
    televisor.mac = mac ?? televisor.mac;
    televisor.resolution = resolution ?? televisor.resolution;
    televisor.numPuertosHdmi = optionalNumber(
      numPuertosHdmi,
      televisor.numPuertosHdmi
    );
    televisor.numPuertosUsb = optionalNumber(
      numPuertosUsb,
      televisor.numPuertosUsb
    );
    televisor.connectivity = connectivity ?? televisor.connectivity;
    televisor.purchaseDate = purchaseDate ?? televisor.purchaseDate;
    televisor.warrantyTime = warrantyTime ?? televisor.warrantyTime;
    televisor.warranty =
      warranty === undefined || warranty === null
        ? televisor.warranty
        : parseBooleanFlag(warranty);
    televisor.deliveryDate = deliveryDate ?? televisor.deliveryDate;
    televisor.inventoryNumber = inventoryNumber ?? televisor.inventoryNumber;
    televisor.observation = observation ?? televisor.observation;
    televisor.status = status ?? televisor.status;
    televisor.acquisitionValue = optionalNumber(
      acquisitionValue,
      televisor.acquisitionValue
    );
    televisor.controlRemote = controlRemote ?? televisor.controlRemote;
    televisor.utility = utility ?? televisor.utility;
    televisor.idResponsable = optionalNumber(
      responsable,
      televisor.idResponsable
    );
    televisor.sedeId = optionalNumber(sedeId, televisor.sedeId);

    await validateEntity(televisor);

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
    const { id } = req.params;

    const tvDistribution = await Televisor.createQueryBuilder("televisor")
      .leftJoinAndSelect("televisor.sedeRelation", "sede")
      .select("sede.name", "sedeName")
      .addSelect("COUNT(televisor.id)", "count")
      .where("televisor.sedeId = :id", { id: parseInt(String(id)) })
      .groupBy("sede.name")
      .orderBy("count", "DESC")
      .getRawMany();

    if (tvDistribution.length === 0) {
      throw new NotFoundError("No TV data found");
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

    const { id } = req.params;

    const now = new Date();
    const oneYearAgo = subYears(now, 1);
    const twoYearsAgo = subYears(now, 2);
    const threeYearsAgo = subYears(now, 3);

    const totalTvs = await Televisor.count({ where: { sedeId: parseInt(String(id)) } });

    const lessThanOneYear = await Televisor.count({
      where: { purchaseDate: MoreThan(oneYearAgo), sedeId: parseInt(String(id)) },
    });
    const betweenOneAndTwoYears = await Televisor.count({
      where: { purchaseDate: Between(twoYearsAgo, oneYearAgo), sedeId: parseInt(String(id)) },
    });
    const betweenTwoAndThreeYears = await Televisor.count({
      where: { purchaseDate: Between(threeYearsAgo, twoYearsAgo), sedeId: parseInt(String(id)) },
    });
    const moreThanThreeYears = await Televisor.count({
      where: { purchaseDate: LessThan(threeYearsAgo), sedeId: parseInt(String(id)) },
    });

    const tv = await Televisor.find({ select: ["purchaseDate"], where: { sedeId: parseInt(String(id)) } });
    let totalAge = 0;

    tv.forEach((t) => {
      if (t.purchaseDate) {
        const age = differenceInDays(now, new Date(t.purchaseDate));
        totalAge += age;
      }
    });

    const averageAgeInDays = totalAge / tv.length || 0;
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
        days: averageAgeInDays,
        months: averageAgeInMonths,
        years: averageAgeInYears.toFixed(1),
      },
      total: totalTvs,
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

    const { id } = req.params;

    const tvs = await Televisor.count({
      where: { sedeId: parseInt(String(id)) },
    });

    const tvWithWarranty = await Televisor.find({
      where: { warranty: true, sedeId: parseInt(String(id)) },
      select: ["id", "purchaseDate", "warrantyTime"],
    });

    const expiringWarranties = tvWithWarranty.filter((tv) => {
      const warrantyMonths = parseInt(tv.warrantyTime?.match(/\d+/)?.[0] || "0");
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
      percentage: tvs > 0 ? ((tvWithWarranty.length / tvs) * 100).toFixed(2) : "0.00",
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
      throw new BadRequestError("Query must be at least 2 characters long");
    }

    const searchTerm = `%${query.trim().toLowerCase()}%`;

    const televisor = await Televisor.createQueryBuilder("televisor")
      .leftJoinAndSelect("televisor.sedeRelation", "sede")
      .leftJoinAndSelect("sede.municipioRelation", "municipio")
      .leftJoinAndSelect("municipio.departmentRelation", "department")
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

    if (televisor.length === 0) {
      throw new NotFoundError("No TVs found");
    }

    const televisorFormatted = televisor.map((t) => ({
      item: {
        id: t.id || "N/A",
        name: t.name || "N/A",
        location: t.location || "N/A",
        brand: t.brand || "N/A",
        model: t.model || "N/A",
        serial: t.serial || "N/A",
        pulgadas: t.pulgadas ?? "N/A",
        screenType: t.screenType || "N/A",
        smartTv: t.smartTv ?? "N/A",
        operativeSystem: t.operativeSystem || "N/A",
        addressIp: t.addressIp || "N/A",
        mac: t.mac || "N/A",
        resolution: t.resolution || "N/A",
        numPuertosHdmi: t.numPuertosHdmi ?? "N/A",
        numPuertosUsb: t.numPuertosUsb ?? "N/A",
        connectivity: t.connectivity || "N/A",
        purchaseDate: t.purchaseDate || "N/A",
        warrantyTime: t.warrantyTime || "N/A",
        warranty: t.warranty ?? "N/A",
        deliveryDate: t.deliveryDate || "N/A",
        inventoryNumber: t.inventoryNumber || "N/A",
        responsableId: t.responsableRelation?.id || "N/A",
        responsableName: t.responsableRelation?.name || "N/A",
        responsableLastName: t.responsableRelation?.lastName || "N/A",
        observations: t.observation || "N/A",
        status: t.status || "N/A",
        acquisitionValue: t.acquisitionValue ?? "N/A",
        controlRemote: t.controlRemote ?? "N/A",
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
      departmentId: t.sedeRelation?.municipioRelation?.departmentRelation?.id || 0,
      departmentRelationName: t.sedeRelation?.municipioRelation?.departmentRelation?.name || "N/A",
      sedeName: t.sedeRelation?.name || "N/A",
      sedeId: t.sedeRelation?.id || 0,
    }));

    return res.status(200).json(televisorFormatted);
  } catch (error) {
    next(error);
  }
}
