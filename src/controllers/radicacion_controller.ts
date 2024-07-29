import { NextFunction, Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";

export async function getAllRadicacion(req: Request, res: Response, next: NextFunction) {
  try {
    const radicacion = await Radicacion.find();
    return res.json(radicacion);
  } catch (error) {
    next(error);
  }
}

export async function getRadicacionById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const radicacion = await Radicacion.findOneBy({ id: parseInt(id) });
    return res.json(radicacion);
  } catch (error) {
    next(error);
  }
}

export async function createRadicado(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      orderDate,
      place,
      ipsRemitente,
      profetional,
      specialty,
      diagnosticCode,
      descriptionDiagnostic,
      groupServices,
      radicador,
      auditora,
      auditDate,
      typeServices,
      justify,
      idPatient
    } = req.body;

    const radicacado = new Radicacion();

    radicacado.orderDate = orderDate;
    radicacado.place = place;
    radicacado.ipsRemitente = ipsRemitente;
    radicacado.profetional = profetional;
    radicacado.specialty = specialty;
    radicacado.diagnosticCode = diagnosticCode;
    radicacado.diagnosticDescription = descriptionDiagnostic;
    radicacado.groupServices = groupServices;
    radicacado.typeServices = typeServices;
    radicacado.radicador = radicador;
    radicacado.auditora = auditora;
    radicacado.auditDate = auditDate;
    radicacado.justify = justify;
    radicacado.idPatient = idPatient;

    await radicacado.save();

    return res.json(radicacado);
  } catch (error) {
    next(error);
  }
}
