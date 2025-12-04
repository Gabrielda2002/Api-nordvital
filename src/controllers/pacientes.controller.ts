import { NextFunction, Request, Response } from "express";
import { Pacientes } from "../entities/pacientes";
import { validate } from "class-validator";

export async function getAllPacientes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pacientes = await Pacientes.createQueryBuilder("pacientes")
    .leftJoinAndSelect("pacientes.convenioRelation", "convenioRelation")
    .leftJoinAndSelect("pacientes.ipsPrimariaRelation", "ipsPrimariaRelation")
    .leftJoinAndSelect("pacientes.documentRelation", "documentRelation")
    .getMany();
    return res.json(pacientes);
  } catch (error) {
    next(error);
  }
}

export async function getPaciente(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const paciente = await Pacientes.findOne({
       where:{id: parseInt(id)} ,
        relations: ["convenioRelation", "ipsPrimariaRelation","documentRelation"]
      });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente not found" });
    }

    return res.json(paciente);
  } catch (error) {
    next(error);
  }
}

export async function createPatient(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      documentType,
      documentNumber,
      phoneNumber2,
      name,
      phoneNumber,
      landline,
      email,
      address,
      agreement,
      ipsPrimaria
    } = req.body;

    const pacienteExist = await Pacientes.findOneBy({ documentNumber });

    if (pacienteExist) {
      return res.status(400).json({ message: "Paciente ya existe" });
    }

    const contactNumbers = [phoneNumber, phoneNumber2, landline].filter(num => num && num !== '');
    const uniqueNumbers = new Set(contactNumbers);
    
    if (contactNumbers.length > 0 && uniqueNumbers.size !== contactNumbers.length) {
      return res.status(400).json({ message: "Los números de contacto no pueden ser iguales." });
    }

    const paciente = new Pacientes();
    paciente.documentType = parseInt(documentType);
    paciente.documentNumber = parseInt(documentNumber);
    paciente.name = name.toUpperCase();
    paciente.phoneNumber = phoneNumber;
    paciente.phoneNumber2 = phoneNumber2 && phoneNumber2 !== '' ? phoneNumber2 : null;
    paciente.landline = landline;
    paciente.email = email;
    paciente.address = address;
    paciente.convenio = parseInt(agreement);
    paciente.ipsPrimaria = parseInt(ipsPrimaria);
    paciente.status = true;

    const errors = await validate(paciente);

    if (errors.length > 0) {
      const messages = errors.map(err => 
        Object.values(err.constraints || {}).join(", ")
      );

      return res
        .status(400)
        .json({ message: messages });
    }

    await paciente.save();

    return res.json(paciente);
  } catch (error) {
    next(error);
  }
}

export async function updatePaciente(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const {
      documentType,
      documentNumber,
      name,
      phoneNumber,
      phoneNumber2,
      landline,
      email,
      address,
      convenio,
      ipsPrimaria,
      status
    } = req.body;
    console.log(req.body);

    const paciente = await Pacientes.findOneBy({ id: parseInt(id) });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente not found" });
    }

    // paciente.documentType = documentType;
    // paciente.documentNumber = documentNumber;
    // paciente.name = name;
    paciente.phoneNumber = phoneNumber;
    paciente.landline = landline && landline !== '' ? landline : null;
    paciente.email = email;
    paciente.address = address;
    paciente.phoneNumber2 = phoneNumber2 && phoneNumber2 !== '' ? phoneNumber2 : null;
    // paciente.convenio = convenio;
    // paciente.ipsPrimaria = ipsPrimaria;
    // paciente.status = status;

    const errors = await validate(paciente);

    if (errors.length > 0) {
      const messages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      return res
        .status(400)
        .json({ message: "Error updating paciente", messages });
    }

    await paciente.save();

    return res.json(paciente);
  } catch (error) {
    next(error);
  }
}

export async function deletePaciente(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const paciente = await Pacientes.findOneBy({ id: parseInt(id) });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente not found" });
    }

    await paciente.remove();

    return res.json({ message: "Paciente deleted" });
  } catch (error) {
    next(error);
  }
}

export async function getPacientesByDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { documentNumber } = req.body;
    const paciente = await Pacientes.createQueryBuilder("pacientes")
    .where("pacientes.documentNumber = :documentNumber", { documentNumber })
    .leftJoinAndSelect("pacientes.convenioRelation", "convenioRelation")
    .leftJoinAndSelect("pacientes.ipsPrimariaRelation", "ipsPrimariaRelation")
    .leftJoinAndSelect("pacientes.documentRelation", "documentRelation")
    .getOne();

    if (!paciente) {
      return res.status(404).json({ message: "Paciente not found" });
    }

    return res.json(paciente); 
  } catch (error) {
    next(error);
  }
}

export async function updatePacienteTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const {
      documentType,
      documentNumber,
      name,
      phoneNumber,
      phoneNumber2,
      landline,
      email,
      address,
      agreement,
      ipsPrimaria
    } = req.body;

    const paciente = await Pacientes.findOneBy({ id: parseInt(id) });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente not found" });
    }

    const contactNumbers = [phoneNumber, phoneNumber2, landline].filter(num => num && num !== '');
    const uniqueNumbers = new Set(contactNumbers);
    
    if (contactNumbers.length > 0 && uniqueNumbers.size !== contactNumbers.length) {
      return res.status(400).json({ message: "Los números de contacto no pueden ser iguales." });
    }

    paciente.documentType = parseInt(documentType);
    paciente.documentNumber = parseInt(documentNumber);
    paciente.name = name.toUpperCase();
    paciente.phoneNumber = phoneNumber;
    paciente.phoneNumber2 = phoneNumber2 && phoneNumber2 !== '' ? phoneNumber2 : null;
    paciente.landline = landline.toString();
    paciente.email = email;
    paciente.address = address;
    paciente.convenio = parseInt(agreement);
    paciente.ipsPrimaria = parseInt(ipsPrimaria);

    const errors = await validate(paciente);

    if (errors.length > 0) {
      const messages = errors.map(err => (
        Object.values(err.constraints || {}).join(", ")
      ));

      return res
        .status(400)
        .json({ message: messages });
    }

    await paciente.save();

    return res.json(paciente);
  } catch (error) {
    next(error);
  }
}