import { NextFunction, Request, Response } from "express";
import { RegistroEntrada } from "../entities/registro-entrada";
import { toZonedTime, format } from "date-fns-tz";


import { constants } from "fs";

export async function getRegisterEntriesByDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dateStart, dateEnd, documentNumber } = req.body;
    console.log("dateStart", dateStart);
    console.log("dateEnd", dateEnd);
    console.log("documentNumber", documentNumber);

    const query = await RegistroEntrada.createQueryBuilder("registro_entrada")
      .leftJoinAndSelect("registro_entrada.userRelation", "user")
      .leftJoinAndSelect("registro_entrada.sedeRelation", "sede")
      .where("user.dniNumber = :documentNumber", { documentNumber });

    if (dateStart && dateEnd) {
      query.andWhere("registro_entrada.registerDate >= :dateStart", {
        dateStart,
      });
      query.andWhere("registro_entrada.registerDate <= :dateEnd", { dateEnd });
    }

    query.orderBy("registro_entrada.registerDate", "DESC");
    const registerEntries = await query.getMany();

    if (!registerEntries || registerEntries.length === 0) {
      return res.status(404).json({ message: "Register not found" });
    }


    const timeZone = "America/Bogota";
    
    const registerFormat = registerEntries.map((r) => {
      const zonedDate = r.registerDate
        ? toZonedTime(r.registerDate, timeZone)
        : null;
      return {
        id: r.id,
        userName: r.userRelation?.name || "N/A",
        userLastName: r.userRelation?.lastName || "N/A",
        documentNumber: r.userRelation?.dniNumber || "N/A",
        headquarters: r.sedeRelation?.name || "N/A",
        registerDate: zonedDate ? format(zonedDate, "yyyy-MM-dd", { timeZone }) : "N/A",
        hourRegister: r.hourRegister,
      };
    });
    

    return res.json(registerFormat);
  } catch (error) {
    next(error);
  }
}
