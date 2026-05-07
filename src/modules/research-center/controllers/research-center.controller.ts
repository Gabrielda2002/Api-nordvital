import { NextFunction, Request, Response } from "express";
import { ContactCI } from "../entities/contact-ci";
import { VolunteerCI } from "../entities/volunteer-ci";
import { validate } from "class-validator";
import { parseISO } from "date-fns";

export async function createContact(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, lastname, phone, email, subject, description } = req.body;

        const contact = new ContactCI();
        contact.name = name.toUpperCase();
        contact.lastname = lastname.toUpperCase();
        contact.phone = phone;
        contact.email = email.toLowerCase();
        contact.subject = subject.toUpperCase();
        contact.description = description;

        const errors = await validate(contact);

        if (errors.length > 0) {
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({
                message: "Error al crear el contacto",
                errors: errorsMessage
            });
        }

        await contact.save();

        return res.status(201).json({
            message: "Contacto creado exitosamente",
            data: contact
        });

    } catch (error) {
        next(error);
    }
}

export async function createVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
        const {
            name,
            lastname,
            phone,
            email,
            identificationType,
            identificationNumber,
            department,
            municipality,
            eps,
            age,
            nationality,
            date
        } = req.body;

        const volunteer = new VolunteerCI();
        volunteer.name = name.toUpperCase();
        volunteer.lastname = lastname.toUpperCase();
        volunteer.phone = phone;
        volunteer.email = email.toLowerCase();
        volunteer.identificationType = identificationType.toUpperCase();
        volunteer.identificationNumber = identificationNumber;
        volunteer.department = department.toUpperCase();
        volunteer.municipality = municipality.toUpperCase();
        volunteer.eps = eps.toUpperCase();
        volunteer.age = age;
        volunteer.nationality = nationality.toUpperCase();
        volunteer.date = parseISO(date);

        const errors = await validate(volunteer);

        if (errors.length > 0) {
            const errorsMessage = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));

            return res.status(400).json({
                message: "Error al crear el voluntario",
                errors: errorsMessage
            });
        }

        await volunteer.save();

        return res.status(201).json({
            message: "Voluntario registrado exitosamente",
            data: volunteer
        });

    } catch (error) {
        next(error);
    }
}
