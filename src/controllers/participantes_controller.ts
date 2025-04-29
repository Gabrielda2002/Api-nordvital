import { NextFunction, Request, Response } from "express";
import { Participantes } from "../entities/participantes";
import { validate } from "class-validator";

export async function getAllParticipants(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const participants = await Participantes.find();
    return res.status(200).json(participants);
  } catch (error) {
    next(error);
  }
}

export async function createParticipant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      name,
      lastName,
      country,
      city,
      profession,
      typeDocument,
      numberDocument,
      email,
      phone,
      typeParticipant,
    } = req.body;

    const partcipantExist = await Participantes.createQueryBuilder('participant')
    .where('participant.numero_documento = :numberDocument', { numberDocument })
    .orWhere('participant.correo = :email', { email })
    .getOne();

    if (partcipantExist) {
      return res.status(400).json({
        message: "El participante ya existe",
      });
    };

    const participant = new Participantes();
    participant.name = name.toUpperCase();
    participant.lastName = lastName.toUpperCase();
    participant.country = country.toUpperCase();
    participant.city = city.toUpperCase();
    participant.profession = profession.toUpperCase();
    participant.typeDocument = typeDocument.toUpperCase();
    participant.documentNumber = parseInt(numberDocument);
    participant.email = email.toLowerCase();
    participant.phone = parseInt(phone);
    participant.typeParticipant = typeParticipant.toUpperCase();

    const errors = await validate(participant);

    if (errors.length > 0) {
        const errorMessages = errors.map( e => ({
            property: e.property,
            constraints: e.constraints,
        }));
        return res.status(400).json({
            message: "Error de validacion",
            errors: errorMessages,
        });
    }

    await participant.save();

    return res.status(201).json({
      message: "Participante creado",
      participant,
    });

  } catch (error) {
    next(error);
  }
}
