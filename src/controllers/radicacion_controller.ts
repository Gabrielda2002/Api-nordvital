import { NextFunction, Request, Response } from "express";
import { Radicacion } from "../entities/radicacion";
import { validate } from "class-validator";

export async function getAllRadicacion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const radicacion = await Radicacion.find({
      relations: [
        "specialtyRelation",
        "placeRelation",
        "ipsRemiteRelation",
        "servicesGroupRelation",
        "servicesRelation",
        "radicadorRelation",
        "patientRelation",
      ],
    });
    return res.json(radicacion);
  } catch (error) {
    next(error);
  }
}

export async function getRadicacionById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const radicacion = await Radicacion.createQueryBuilder("radicacion")
      .where("radicacion.id = :id", { id: parseInt(id) })
      .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
      .leftJoinAndSelect("radicacion.placeRelation", "place")
      .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
      .leftJoinAndSelect("radicacion.servicesGroupRelation", "servicesGroup")
      .leftJoinAndSelect("radicacion.servicesRelation", "services")
      .leftJoinAndSelect("radicacion.radicadorRelation", "radicador")
      .leftJoinAndSelect("radicacion.patientRelation", "patient")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .getOne();

    if (!radicacion) {
      return res.status(404).json({ message: "Radicacion not found" });
    }

    const radicacionFormated = {
      id: radicacion.id,
      name: radicacion.patientRelation?.name,
      document: radicacion.patientRelation?.documentNumber,
      convenio: radicacion.patientRelation?.convenioRelation?.name,
      specialty: radicacion.specialtyRelation?.name,
      place: radicacion.placeRelation?.name,
      ipsRemite: radicacion.ipsRemiteRelation?.name,
      servicesGroup: radicacion.servicesGroupRelation?.name,
      services: radicacion.servicesRelation?.name,
      radicador: radicacion.radicadorRelation?.name,
      auditDate: radicacion.auditDate,
      createdAt: radicacion.createdAt,
      orderDate: radicacion.orderDate,
      profetional: radicacion.profetional,
      groupServices: radicacion.groupServices,
      typeServices: radicacion.typeServices,
      justify: radicacion.justify,
      auditConcept: radicacion.auditConcept,
      cupsRadicados: radicacion.cupsRadicadosRelation?.map((c) => ({
        id: c.id,
        code: c.code,
        DescriptionCode: c.DescriptionCode,
        status: c.status,
        observation: c.observation,
        functionalUnit: c.functionalUnit,
        idRadicacion: c.idRadicacion,
        updatedAt: c.updatedAt,
        createdAt: c.createdAt,
      })),
    };

    return res.json(radicacionFormated);
  } catch (error) {
    next(error);
  }
}

export async function createRadicado(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      orderDate,
      place,
      ipsRemitente,
      profetional,
      specialty,
      groupServices,
      radicador,
      typeServices,
      idPatient,
      idSoporte,
      idDiagnostico
    } = req.body;

    console.log(req.body);

    const radicacado = new Radicacion();

    radicacado.orderDate = orderDate;
    radicacado.place = parseInt(place);
    radicacado.ipsRemitente = parseInt(ipsRemitente);
    radicacado.profetional = profetional;
    radicacado.specialty = parseInt(specialty);
    radicacado.groupServices = parseInt(groupServices);
    radicacado.typeServices = parseInt(typeServices);
    radicacado.radicador = parseInt(radicador);
    radicacado.auditora = "Pendiente";
    radicacado.justify = "Pendiente";
    radicacado.auditConcept = 6;
    radicacado.idPatient = parseInt(idPatient);
    radicacado.idSoporte = parseInt(idSoporte);
    radicacado.idDiagnostico = parseInt(idDiagnostico);

    const errors = await validate(radicacado);

    if (errors.length > 0) {
      const messages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      return res
        .status(400)
        .json({ message: "Error creating radicacion", messages });
    }

    await radicacado.save();

    return res.json(radicacado);
  } catch (error) {
    next(error);
  }
}

export async function updateRadicado(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
      auditConcept,
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

      return res
        .status(400)
        .json({ message: "Error updating radicacion", messages });
    }

    await radicacado.save();

    return res.json(radicacado);
  } catch (error) {
    next(error);
  }
}

export async function deleteRadicado(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
export async function mostrarTabla(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const radicaciones = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
      .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
      .leftJoinAndSelect("pacientes.documentRelation", "document")
      .leftJoinAndSelect(
        "radicacion.seguimientoAuxiliarRelation",
        "seguimientoAuxiliar"
      )
      .orderBy("radicacion.id", "DESC")
      .getMany();

    const formatedRadicaciones = radicaciones.map((r) => {
      const latestSeguimiento = r.seguimientoAuxiliarRelation?.sort(
        (a, b) => b.id - a.id
      )[0];

      return {
        createdAt: r.createdAt,
        typeDocument: r.patientRelation?.documentRelation?.name || "N/A",
        id: r.id,
        convenio: r.patientRelation?.convenioRelation?.name || "N/A",
        document: r.patientRelation?.documentNumber || "N/A",
        patientName: r.patientRelation?.name || "N/A",
        auditDate: r.auditDate,
        management: latestSeguimiento ? latestSeguimiento.observation : "N/A",
      };
    });

    return res.json(formatedRadicaciones);
  } catch (error) {
    next(error);
  }
}

export async function tablaPorAuditar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const radicaciones = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
      .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
      .leftJoinAndSelect("pacientes.documentRelation", "document")
      .leftJoinAndSelect("radicacion.placeRelation", "place")
      .leftJoinAndSelect("radicacion.ipsRemiteRelation", "ipsRemite")
      .leftJoinAndSelect("radicacion.specialtyRelation", "specialty")
      .leftJoinAndSelect("radicacion.servicesRelation", "services")
      .leftJoinAndSelect("radicacion.radicadorRelation", "radicador")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .where("cupsRadicados.status = 6")
      .orderBy("radicacion.id", "DESC")
      .getMany();

    const formatedRadicaciones = await radicaciones.map((r) => ({
      radicadoDate: r.createdAt,
      documentType: r.patientRelation?.documentRelation.name || "N/A",
      documentNumber: r.patientRelation?.documentNumber || "N/A",
      namePatient: r.patientRelation?.name || "N/A",
      convenio: r.patientRelation?.convenioRelation?.name || "N/A",
      ipsPrimary: r.patientRelation.ipsPrimaria || "N/A",
      orderDate: r.orderDate || "N/A",
      place: r.placeRelation?.name || "N/A",
      ipsRemitente: r.ipsRemiteRelation?.name || "N/A",
      profetional: r.profetional || "N/A",
      speciality: r.specialtyRelation?.name || "N/A",
      typeServices: r.servicesRelation?.name || "N/A",
      radicador: r.radicadorRelation?.name || "N/A",
      statusCups:  r.cupsRadicadosRelation?.map((c) => ({
        code: c.code,
        description: c.DescriptionCode,
        observation: c.observation
      })) || "N/A",
    }));

    return res.json(formatedRadicaciones);
  } catch (error) {
    next(error);
  }
}

export async function auditorRadicados(req: Request, res:Response, next: NextFunction){
  try {
    
    const radicaciones = await Radicacion.createQueryBuilder("radicacion")
      .leftJoinAndSelect("radicacion.patientRelation", "pacientes")
      .leftJoinAndSelect("pacientes.convenioRelation", "convenio")
      .leftJoinAndSelect("pacientes.documentRelation", "document")
      .leftJoinAndSelect("radicacion.cupsRadicadosRelation", "cupsRadicados")
      .orderBy("radicacion.id", "DESC")
      .getMany();

    const formatedRadicaciones = radicaciones.map((r) => ({
      id: r.id,
      document: r.patientRelation?.documentNumber || "N/A",
      patientName: r.patientRelation?.name || "N/A",
      codeCup: r.cupsRadicadosRelation?.map((c) => c.code) || "N/A",
      descriptionCup: r.cupsRadicadosRelation?.map((c) => c.DescriptionCode) || "N/A",
    }));

    return res.json(formatedRadicaciones);

  } catch (error) {
    next(error)
  }
}