import { NextFunction, Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";
import { validate } from "class-validator";

export async function getAllRadicacion(req: Request, res: Response, next: NextFunction) {
  try {
    const radicacion = await Radicacion.find({
      relations: ['specialtyRelation', 'placeRelation', 'ipsRemiteRelation', 'servicesGroupRelation', 'servicesRelation', 'radicadorRelation', 'patientRelation']
    });
    return res.json(radicacion);
  } catch (error) {
    next(error);
  }
}

export async function getRadicacionById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const radicacion = await Radicacion.findOne({
       where: {id: parseInt(id)},
      relations: ['specialtyRelation', 'placeRelation', 'ipsRemiteRelation', 'servicesGroupRelation', 'servicesRelation', 'radicadorRelation', 'patientRelation'] 
      });

    if (!radicacion) {
      return res.status(404).json({ message: "Radicacion not found" });
      
    }

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
      diagnosticDescription,
      groupServices,
      radicador,
      auditora,
      auditDate,
      typeServices,
      justify,
      idPatient,
      auditConcept
    } = req.body;



    const radicacado = new Radicacion();

    radicacado.orderDate = orderDate;
    radicacado.place = place;
    radicacado.ipsRemitente = ipsRemitente;
    radicacado.profetional = profetional;
    radicacado.specialty = specialty;
    radicacado.diagnosticCode = diagnosticCode;
    radicacado.diagnosticDescription = diagnosticDescription;
    radicacado.groupServices = groupServices;
    radicacado.typeServices = typeServices;
    radicacado.radicador = radicador;
    radicacado.auditora = auditora;
    radicacado.auditDate = auditDate;
    radicacado.justify = justify;
    radicacado.idPatient = idPatient;
    radicacado.auditConcept = auditConcept;

    const errors = await validate(radicacado);

    if (errors.length > 0) {
      const messages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      return res.status(400).json({ message: "Error creating radicacion", messages });
      
    }

    await radicacado.save();

    return res.json(radicacado);
  } catch (error) {
    next(error);
  }
}

export async function updateRadicado(req: Request, res: Response, next: NextFunction) {
  try {
    
    const { id } = req.params;

    const {
      orderDate,
      place,
      ipsRemitente,
      profetional,
      specialty,
      diagnosticCode,
      diagnosticDescription,
      groupServices,
      radicador,
      auditora,
      auditDate,
      typeServices,
      justify,
      idPatient,
      auditConcept
    } = req.body;

    const radicacado = await Radicacion.findOneBy({ id: parseInt(id) });

    if (!radicacado) {
      return res.status(404).json({ message: "Radicacion not found" });
      
    }

    radicacado.orderDate = orderDate;
    radicacado.place = place;
    radicacado.ipsRemitente = ipsRemitente;
    radicacado.profetional = profetional;
    radicacado.specialty = specialty;
    radicacado.diagnosticCode = diagnosticCode;
    radicacado.diagnosticDescription = diagnosticDescription;
    radicacado.groupServices = groupServices;
    radicacado.typeServices = typeServices;
    radicacado.radicador = radicador;
    radicacado.auditora = auditora;
    radicacado.auditDate = auditDate;
    radicacado.justify = justify;
    radicacado.idPatient = idPatient;
    radicacado.auditConcept = auditConcept;

    const errors = await validate(radicacado);

    if (errors.length > 0) {
      const messages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      return res.status(400).json({ message: "Error updating radicacion", messages });
      
    }

    await radicacado.save();

    return res.json(radicacado);

  } catch (error) {
    next(error);
  }
}

export async function deleteRadicado(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const radicacado = await Radicacion.findOneBy({ id: parseInt(id) });

    if (!radicacado) {
      return res.status(404).json({ message: "Radicacion not found" });
    }

    await radicacado.remove();

    return res.json({ message: "Radicacion deleted" });
  } catch (error) {
    next(error);
  }
}
