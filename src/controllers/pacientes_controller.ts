import { NextFunction, Request, Response } from "express";
import { Pacientes } from "../entities/pacientes";
import { validate } from "class-validator";

export async function getAllPacientes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pacientes = await Pacientes.find();
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

    const paciente = await Pacientes.findOneBy({ id: parseInt(id) });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente not found" });
    }

    return res.json(paciente);
  } catch (error) {
    next(error);
  }
}

export async function createPaciente(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      documentType,
      documentNumber,
      name,
      phoneNumber,
      landline,
      email,
      address,
      convenio,
      ipsPrimaria
    } = req.body;

    const pacienteExist = await Pacientes.findOneBy({ documentNumber });

    if (pacienteExist) {
      return res.status(400).json({ message: "Paciente already exists" });
    }

    const paciente = new Pacientes();
    paciente.documentType = documentType;
    paciente.documentNumber = documentNumber;
    paciente.name = name;
    paciente.phoneNumber = phoneNumber;
    paciente.landline = landline;
    paciente.email = email;
    paciente.address = address;
    paciente.convenio = convenio;
    paciente.ipsPrimaria = ipsPrimaria;
    paciente.status = true;

    const errors = await validate(paciente);

    if (errors.length > 0) {
      const messages = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      return res
        .status(400)
        .json({ message: "Error creating paciente", messages });
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
      landline,
      email,
      address,
      convenio,
      ipsPrimaria,
      status
    } = req.body;

    const paciente = await Pacientes.findOneBy({ id: parseInt(id) });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente not found" });
    }

    paciente.documentType = documentType;
    paciente.documentNumber = documentNumber;
    paciente.name = name;
    paciente.phoneNumber = phoneNumber;
    paciente.landline = landline;
    paciente.email = email;
    paciente.address = address;
    paciente.convenio = convenio;
    paciente.ipsPrimaria = ipsPrimaria;
    paciente.status = status;

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
